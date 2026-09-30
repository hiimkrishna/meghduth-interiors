import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isProd = process.env.NODE_ENV === "production";

Sentry.init({
  dsn,
  // Only send when a DSN is configured. Prevents "No DSN provided" /
  // "Transport disabled" noise in local dev.
  enabled: Boolean(dsn),
  environment: process.env.NODE_ENV,
  // No tracing without a DSN, otherwise every request logs sampled spans.
  tracesSampleRate: !dsn ? 0 : isProd ? 0.1 : 1.0,
  // Never verbose by default. Opt-in with SENTRY_DEBUG=true.
  debug: process.env.SENTRY_DEBUG === "true",
  replaysOnErrorSampleRate: dsn ? 1.0 : 0,
  replaysSessionSampleRate: dsn && isProd ? 0.1 : 0.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});