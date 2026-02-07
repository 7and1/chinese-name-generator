/**
 * Sentry Server-Side Configuration
 *
 * This configures Sentry for server-side error tracking and performance monitoring.
 * Sentry is only enabled in production when SENTRY_DSN is configured.
 *
 * Environment Variables:
 * - SENTRY_DSN: Your Sentry project DSN (required for Sentry to work)
 * - SENTRY_ENVIRONMENT: Environment name (default: production)
 */

import * as Sentry from "@sentry/nextjs";

// ============================================================================
// Configuration
// ============================================================================

const SENTRY_DSN = process.env.SENTRY_DSN;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Determine if Sentry should be enabled
 */
const shouldEnableSentry =
  IS_PRODUCTION || process.env.SENTRY_ENABLED === "true";

// ============================================================================
// Sentry Initialization
// ============================================================================

Sentry.init({
  dsn: shouldEnableSentry ? SENTRY_DSN : undefined,

  // Environment
  environment:
    process.env.SENTRY_ENVIRONMENT ??
    (IS_PRODUCTION ? "production" : "development"),

  // Performance monitoring
  tracesSampleRate: shouldEnableSentry ? (IS_PRODUCTION ? 0.1 : 1.0) : 0,

  // Filter errors
  beforeSend(event) {
    // Filter out client abort errors
    const error = event.exception?.values?.[0];
    if (error?.value) {
      const message = error.value as string;
      if (message.includes("Client closed")) {
        return null;
      }
    }
    return event;
  },

  // Filter transactions
  beforeSendTransaction(event) {
    if (event.transaction?.includes("/api/health")) {
      return null;
    }
    return event;
  },

  // Debug mode
  debug: process.env.SENTRY_DEBUG === "true",

  // Other options
  maxBreadcrumbs: 50,
  attachStacktrace: true,
  sendDefaultPii: false,
  normalizeDepth: 10,

  // Ignore specific errors
  ignoreErrors: [
    "Non-Error promise rejection captured",
    "ResizeObserver loop limit exceeded",
    "Client closed",
  ],
});

export { Sentry };
