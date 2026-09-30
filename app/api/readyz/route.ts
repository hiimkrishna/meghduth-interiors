import { isDbReady, getDb } from "@/server/db/client";
import { AppError, fail, ok } from "@/server/lib/response";
import { isSmtpConfigured } from "@/server/lib/smtp";

export const dynamic = "force-dynamic";

interface HealthCheckResult {
  service: string;
  status: "healthy" | "degraded" | "down";
  latencyMs?: number;
  error?: string;
}

async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    const ready = await isDbReady();
    return {
      service: "database",
      status: ready ? "healthy" : "down",
      latencyMs: Date.now() - start,
      error: ready ? undefined : "Database connection failed",
    };
  } catch (e) {
    return {
      service: "database",
      status: "down",
      latencyMs: Date.now() - start,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

async function checkSMTP(): Promise<HealthCheckResult> {
  const start = Date.now();
  if (!isSmtpConfigured()) {
    return {
      service: "smtp",
      status: "degraded",
      latencyMs: Date.now() - start,
      error: "SMTP not configured",
    };
  }
  try {
    // Just verify config is valid
    return {
      service: "smtp",
      status: "healthy",
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    return {
      service: "smtp",
      status: "down",
      latencyMs: Date.now() - start,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

async function checkIMAP(): Promise<HealthCheckResult> {
  const start = Date.now();
  const host = (process.env.IMAP_HOST ?? "").trim();
  const user = (process.env.IMAP_USER ?? "").trim();
  const pass = process.env.IMAP_PASS ?? "";
  
  if (!host || !user || !pass) {
    return {
      service: "imap",
      status: "degraded",
      latencyMs: Date.now() - start,
      error: "IMAP not configured",
    };
  }
  
  try {
    // We don't actually connect (too slow for health check)
    // Just verify config exists
    return {
      service: "imap",
      status: "healthy",
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    return {
      service: "imap",
      status: "down",
      latencyMs: Date.now() - start,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

async function checkRedis(): Promise<HealthCheckResult> {
  const start = Date.now();
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  
  if (!url || !token) {
    return {
      service: "redis",
      status: "degraded",
      latencyMs: Date.now() - start,
      error: "Redis not configured (using in-memory fallback)",
    };
  }
  
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({ url, token });
    await redis.ping();
    return {
      service: "redis",
      status: "healthy",
      latencyMs: Date.now() - start,
    };
  } catch (e) {
    return {
      service: "redis",
      status: "down",
      latencyMs: Date.now() - start,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

export async function GET(): Promise<Response> {
  const checks = await Promise.all([
    checkDatabase(),
    checkSMTP(),
    checkIMAP(),
    checkRedis(),
  ]);

  const allHealthy = checks.every(c => c.status === "healthy");
  const anyDown = checks.some(c => c.status === "down");
  
  const status = allHealthy ? "healthy" : anyDown ? "unhealthy" : "degraded";
  const httpStatus = allHealthy ? 200 : anyDown ? 503 : 200;

  return ok(
    { 
      status,
      checks,
      timestamp: new Date().toISOString(),
    },
    undefined,
    undefined,
    httpStatus
  );
}