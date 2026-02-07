/**
 * Sentry Edge Runtime Configuration
 *
 * This configures Sentry for Edge Runtime functions (middleware, edge API routes).
 * Sentry is only enabled in production when SENTRY_DSN is configured.
 *
 * Features:
 * - Edge runtime error tracking
 * - Performance monitoring for middleware
 * - Request data tracking (sanitized)
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

/**
 * Get environment name for Sentry
 */
const getEnvironment = (): string => {
  if (process.env.SENTRY_ENVIRONMENT) {
    return process.env.SENTRY_ENVIRONMENT;
  }
  return IS_PRODUCTION ? "production" : "development";
};

/**
 * Get release version
 */
const getRelease = (): string | undefined => {
  if (process.env.SENTRY_RELEASE) {
    return process.env.SENTRY_RELEASE;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pkg = require("./package.json");
    return `chinese-name@${pkg.version}`;
  } catch {
    return undefined;
  }
};

/**
 * Sample rate for edge transactions
 */
const getTracesSampleRate = (): number => {
  if (process.env.SENTRY_TRACES_SAMPLE_RATE) {
    return parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE);
  }
  return IS_PRODUCTION ? 0.1 : 1.0;
};

// ============================================================================
// Sentry Initialization
// ============================================================================

Sentry.init({
  dsn: shouldEnableSentry ? SENTRY_DSN : undefined,

  // Environment and release
  environment: getEnvironment(),
  release: getRelease(),

  // Performance monitoring
  tracesSampleRate: shouldEnableSentry ? getTracesSampleRate() : 0,

  // Initial scope
  initialScope: {
    tags: {
      runtime: "edge",
    },
  },
});

export { Sentry };
