import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, getRateLimitKey } from "@/lib/rate-limit";
import { logApiRequest, logSecurityEvent, logger } from "@/lib/logger";

const PUBLIC_ROUTES = ["/", "/about", "/services", "/projects", "/team", "/contact"];
const ADMIN_ROUTES = ["/admin"];
const API_ROUTES = ["/api"];

const RATE_LIMIT_CONFIG: Record<string, { limit: number; windowMs: number; prefix: string }> = {
  "/api/v1/auth/login": { limit: 5, windowMs: 15 * 60 * 1000, prefix: "auth" },
  "/api/v1/leads": { limit: 10, windowMs: 60 * 60 * 1000, prefix: "leads" },
  "/api/v1/admin/media": { limit: 20, windowMs: 60 * 60 * 1000, prefix: "media" },
  "/api/v1/admin/inbox/sync": { limit: 30, windowMs: 60 * 60 * 1000, prefix: "sync" },
  "/api/v1/admin/inbox/ingress": { limit: 100, windowMs: 60 * 60 * 1000, prefix: "ingress" },
  "/api/": { limit: 100, windowMs: 60 * 1000, prefix: "api" },
};

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

function getRateLimitConfig(pathname: string): { limit: number; windowMs: number; prefix: string } | null {
  for (const [pattern, config] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (pathname.startsWith(pattern)) return config;
  }
  return null;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
    || request.headers.get("x-real-ip") 
    || "unknown";
}

export async function proxy(request: NextRequest) {
  const startTime = Date.now();
  const { pathname } = request.nextUrl;
  const clientIp = getClientIp(request);
  const response = NextResponse.next();

  // Add request ID for tracing
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  response.headers.set("x-request-id", requestId);

  // Security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  // CSP — must stay compatible with Next.js, which requires inline scripts
  // for hydration/flight data ('unsafe-inline'). Without it the browser
  // refuses Next's own <script> tags, React never hydrates, and every
  // client section stays stuck on its server-rendered skeleton forever.
  // Dev HMR additionally needs 'unsafe-eval' + ws:/wss:.
  const isDev = process.env.NODE_ENV !== "production";
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'" +
      (isDev ? " 'unsafe-eval'" : "") +
      " https://*.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https:" + (isDev ? " ws: wss:" : ""),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  response.headers.set("Content-Security-Policy", csp);

  // HSTS (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const config = getRateLimitConfig(pathname);
    if (config) {
      const key = getRateLimitKey(request, config.prefix);
      const { allowed, remaining, resetAt } = await checkRateLimit(key, config.limit, config.windowMs);
      
      response.headers.set("X-RateLimit-Limit", config.limit.toString());
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set("X-RateLimit-Reset", Math.ceil(resetAt / 1000).toString());
      
      if (!allowed) {
        logSecurityEvent("rate_limit_exceeded", "medium", {
          path: pathname,
          ip: clientIp,
          limit: config.limit,
          windowMs: config.windowMs,
        });
        
        return new NextResponse(
          JSON.stringify({ 
            success: false, 
            message: "Too many requests. Please try again later.",
            code: "RATE_LIMITED"
          }), {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
              "X-RateLimit-Limit": config.limit.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": Math.ceil(resetAt / 1000).toString(),
            },
          }
        );
      }
    }
  }

  // Admin route protection
  if (isAdminRoute(pathname)) {
    const token = request.cookies.get("meghdut_admin_access")?.value;
    if (!token && !pathname.startsWith("/admin/login")) {
      logSecurityEvent("unauthorized_admin_access", "high", {
        path: pathname,
        ip: clientIp,
      });
      
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Cache static assets
  if (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/_next/image/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/uploads/") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".avif")
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  // Log API request
  const durationMs = Date.now() - startTime;
  if (pathname.startsWith("/api/")) {
    logApiRequest(request.method, pathname, response.status, durationMs);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};