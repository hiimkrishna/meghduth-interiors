import type { NextResponse } from "next/server";

// httpOnly কুকি-অথ — localStorage-এ টোকেন রাখা নিষেধ।
export const ACCESS_COOKIE = "meghdut_admin_access";
export const REFRESH_COOKIE = "meghdut_admin_refresh";

export const ACCESS_MAX_AGE = 15 * 60;
export const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}

// Cookie হেডার থেকে একটা নাম পড়ো (route-handler Request-এ কাজ করে)।
export function getCookieValue(req: Request, name: string): string | null {
  const raw: string | null = req.headers.get("cookie");
  if (raw === null || raw === "") return null;
  const parts: string[] = raw.split(";");
  for (const part of parts) {
    const idx: number = part.indexOf("=");
    if (idx < 0) continue;
    const k: string | undefined = part.slice(0, idx).trim();
    if (k === name) {
      const v: string = part.slice(idx + 1).trim();
      try {
        return decodeURIComponent(v);
      } catch {
        return v;
      }
    }
  }
  return null;
}

export function getBearerToken(req: Request): string | null {
  const header: string | null = req.headers.get("authorization");
  if (header === null || !header.startsWith("Bearer ")) return null;
  const token: string = header.slice("Bearer ".length).trim();
  return token === "" ? null : token;
}

// লগইন/নবায়ন — tokens httpOnly কুকিতে বসাও।
export function setAuthCookies(res: NextResponse, accessToken: string, refreshToken: string): void {
  const secure: boolean = isProd();
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: REFRESH_MAX_AGE,
  });
}

// প্রস্থান — দুটো কুকি মুছে দাও।
export function clearAuthCookies(res: NextResponse): void {
  const secure: boolean = isProd();
  res.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
