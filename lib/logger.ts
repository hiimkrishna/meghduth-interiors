import pino from "pino";
import pretty from "pino-pretty";

const isDev = process.env.NODE_ENV !== "production";

const logger = pino(
  isDev
    ? {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        },
      }
    : {
        level: "info",
        formatters: {
          level: (label) => ({ level: label }),
        },
        timestamp: pino.stdTimeFunctions.isoTime,
      },
);

export { logger };

export function createChildLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}

export function logApiRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  userId?: string,
) {
  logger.info(
    {
      method,
      path,
      statusCode,
      durationMs,
      userId,
      type: "api_request",
    },
    `${method} ${path} ${statusCode} ${durationMs}ms`,
  );
}

export function logError(
  error: Error,
  context: Record<string, unknown> = {},
) {
  logger.error(
    {
      err: error,
      ...context,
      type: "error",
    },
    error.message,
  );
}

export function logBusinessEvent(
  event: string,
  data: Record<string, unknown> = {},
) {
  logger.info(
    {
      event,
      ...data,
      type: "business_event",
    },
    event,
  );
}

export function logDbQuery(
  query: string,
  durationMs: number,
  table?: string,
) {
  if (durationMs > 100) {
    logger.warn(
      {
        query,
        durationMs,
        table,
        type: "slow_query",
      },
      `Slow query: ${durationMs}ms`,
    );
  } else {
    logger.debug(
      {
        query,
        durationMs,
        table,
        type: "db_query",
      },
      `DB query: ${durationMs}ms`,
    );
  }
}

export function logAuthEvent(
  event: "login" | "logout" | "refresh" | "failed",
  userId: string,
  success: boolean,
  ip?: string,
) {
  logger.info(
    {
      event: `auth_${event}`,
      userId,
      success,
      ip,
      type: "auth_event",
    },
    `Auth ${event}: ${success ? "success" : "failed"} for user ${userId}`,
  );
}

export function logSecurityEvent(
  event: string,
  severity: "low" | "medium" | "high" | "critical",
  data: Record<string, unknown> = {},
) {
  logger.warn(
    {
      event,
      severity,
      ...data,
      type: "security_event",
    },
    `Security event [${severity}]: ${event}`,
  );
}