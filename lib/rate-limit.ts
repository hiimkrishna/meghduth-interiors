import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory fallback for development (when Redis not configured)
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function getMemoryRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = memoryStore.get(key);
  
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs;
    memoryStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

// Lazy-initialized Redis rate limiter (production)
let redisRatelimit: Ratelimit | null = null;

function getRedisRatelimit(): Ratelimit | null {
  if (redisRatelimit !== null) return redisRatelimit;
  
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    return null; // Fall back to in-memory
  }
  
  try {
    const redis = new Redis({ url, token });
    redisRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "60 s"), // Default, overridden per-call
      analytics: true,
      prefix: "ratelimit",
    });
    return redisRatelimit;
  } catch {
    return null;
  }
}

export function getRateLimitKey(req: NextRequest, prefix: string): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
    || req.headers.get("x-real-ip") 
    || "unknown";
  return `${prefix}:${ip}`;
}

export async function checkRateLimit(key: string, limit: number, windowMs: number): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const ratelimit = getRedisRatelimit();
  
  if (ratelimit) {
    // Use Redis rate limiter with sliding window
    const { success, limit: lim, remaining, reset } = await ratelimit.limit(key, { 
      rate: limit, 
    });
    return {
      allowed: success,
      remaining,
      resetAt: reset,
    };
  }
  
  // Fallback to in-memory
  return getMemoryRateLimit(key, limit, windowMs);
}

// Pre-configured rate limiters
export const rateLimiters = {
  auth: { limit: 5, windowMs: 15 * 60 * 1000, prefix: "auth" },      // 5 per 15 min
  leads: { limit: 10, windowMs: 60 * 60 * 1000, prefix: "leads" },    // 10 per hour
  media: { limit: 20, windowMs: 60 * 60 * 1000, prefix: "media" },    // 20 per hour
  sync: { limit: 30, windowMs: 60 * 60 * 1000, prefix: "sync" },      // 30 per hour
  ingress: { limit: 100, windowMs: 60 * 60 * 1000, prefix: "ingress" }, // 100 per hour
  default: { limit: 100, windowMs: 60 * 1000, prefix: "api" },        // 100 per minute
};

export function getRateLimiter(type: keyof typeof rateLimiters) {
  return rateLimiters[type] || rateLimiters.default;
}

// Cleanup memory store periodically (development only)
if (process.env.NODE_ENV !== "production") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (now > record.resetAt) memoryStore.delete(key);
    }
  }, 60 * 1000); // Clean every minute
}