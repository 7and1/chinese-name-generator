/**
 * Sentry Client-Side Configuration
 *
 * This configures Sentry for browser-side error tracking and performance monitoring.
 * Sentry is only enabled in production when SENTRY_DSN is configured.
 *
 * Environment Variables:
 * - SENTRY_DSN: Your Sentry project DSN (required for Sentry to work)
 * - NEXT_PUBLIC_SENTRY_DSN: Public DSN (overrides SENTRY_DSN for client)
 * - SENTRY_ENVIRONMENT: Environment name (default: production)
 */

import * as Sentry from "@sentry/nextjs";

// ============================================================================
// Configuration
// ============================================================================

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Determine if Sentry should be enabled
 */
const shouldEnableSentry =
  IS_PRODUCTION || (process.env.SENTRY_ENABLED === "true" && !!SENTRY_DSN);

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

  // Session Replay
  replaysSessionSampleRate: shouldEnableSentry
    ? IS_PRODUCTION
      ? 0.01
      : 0.1
    : 0,
  replaysOnErrorSampleRate: shouldEnableSentry
    ? IS_PRODUCTION
      ? 0.1
      : 1.0
    : 0,

  // Integrations
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Filter errors
  beforeSend(event) {
    // Filter out client abort errors
    const error = event.exception?.values?.[0];
    if (error?.value) {
      const message = error.value as string;
      if (
        message.includes("Client closed") ||
        message.includes("Network request failed") ||
        message.includes("Extension context invalidated")
      ) {
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
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "fb_xd_fragment",
    "Non-Error promise rejection captured",
    "ResizeObserver loop limit exceeded",
  ],

  // Ignore browser extension URLs
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^resource:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-web-extension:\/\//i,
  ],

  // Initial scope
  initialScope: {
    tags: {
      runtime: "browser",
    },
  },
});

export { Sentry };
