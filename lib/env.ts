/**
 * Environment Variables Configuration
 *
 * Centralized environment variable access with validation and type safety.
 * All environment variables should be accessed through this module.
 *
 * Usage:
 * ```ts
 * import { env, isProduction } from '@/lib/env';
 *
 * if (isProduction()) {
 *   console.log('Site URL:', env.siteUrl.href);
 * }
 * ```
 */

// ============================================================================
// Type Definitions
// ============================================================================

interface EnvironmentConfig {
  // App
  siteUrl: URL;
  nodeEnv: string;

  // Monitoring
  sentryDsn: string | undefined;
  sentryEnvironment: string | undefined;
  sentryEnabled: boolean;
  sentryDebug: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  structuredLogging: boolean;

  // SEO
  googleSiteVerification: string | undefined;
  yandexVerification: string | undefined;
  yahooVerification: string | undefined;
}

// ============================================================================
// Utility Functions
// ============================================================================

function safeUrl(value: string | undefined): URL | undefined {
  if (!value) return;
  try {
    return new URL(value);
  } catch {
    return;
  }
}

function getSiteUrl(): URL {
  return (
    safeUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    safeUrl(process.env.NEXT_PUBLIC_APP_URL) ??
    new URL("http://localhost:3000")
  );
}

// ============================================================================
// Environment Validation
// ============================================================================

/**
 * Validate and get log level
 */
function getLogLevel(): "debug" | "info" | "warn" | "error" {
  const level = process.env.LOG_LEVEL?.toLowerCase();
  const validLevels = ["debug", "info", "warn", "error"];

  if (level && validLevels.includes(level)) {
    return level as "debug" | "info" | "warn" | "error";
  }

  // Default to info in production, debug in development
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

/**
 * Validate environment configuration
 * Throws an error if required variables are missing or invalid
 */
export function validateEnv(): void {
  const errors: string[] = [];

  // Validate site URL
  try {
    getSiteUrl();
  } catch {
    errors.push("NEXT_PUBLIC_SITE_URL must be a valid URL");
  }

  // Validate Sentry DSN if provided
  const sentryDsn = process.env.SENTRY_DSN;
  if (sentryDsn && !sentryDsn.startsWith("https://")) {
    errors.push("SENTRY_DSN must be a valid Sentry DSN (starts with https://)");
  }

  // Validate log level
  const logLevel = process.env.LOG_LEVEL?.toLowerCase();
  const validLevels = ["debug", "info", "warn", "error"];
  if (logLevel && !validLevels.includes(logLevel)) {
    errors.push(`LOG_LEVEL must be one of: ${validLevels.join(", ")}`);
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join("\n")}`);
  }
}

/**
 * Get environment validation result without throwing
 */
export function getEnvValidation(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate site URL
  try {
    getSiteUrl();
  } catch {
    errors.push("NEXT_PUBLIC_SITE_URL must be a valid URL");
  }

  // Validate Sentry DSN if provided
  const sentryDsn = process.env.SENTRY_DSN;
  if (sentryDsn && !sentryDsn.startsWith("https://")) {
    errors.push("SENTRY_DSN must be a valid Sentry DSN (starts with https://)");
  }

  // Warnings for production
  if (process.env.NODE_ENV === "production") {
    if (!sentryDsn) {
      warnings.push(
        "SENTRY_DSN is not configured. Error tracking will be disabled.",
      );
    }
    if (!process.env.LOG_LEVEL) {
      warnings.push("LOG_LEVEL is not configured. Defaulting to 'info'.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// Environment Configuration
// ============================================================================

export const env: EnvironmentConfig = {
  // App
  siteUrl: getSiteUrl(),
  nodeEnv: process.env.NODE_ENV ?? "development",

  // Monitoring
  sentryDsn: process.env.SENTRY_DSN,
  sentryEnvironment: process.env.SENTRY_ENVIRONMENT,
  sentryEnabled: process.env.SENTRY_ENABLED === "true",
  sentryDebug: process.env.SENTRY_DEBUG === "true",
  logLevel: getLogLevel(),
  structuredLogging:
    process.env.STRUCTURED_LOGGING === "true" ||
    process.env.NODE_ENV === "production",

  // SEO
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION,
  yandexVerification: process.env.YANDEX_VERIFICATION,
  yahooVerification: process.env.YAHOO_VERIFICATION,
} as const;

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return env.nodeEnv === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return env.nodeEnv === "development";
}

/**
 * Check if running in test
 */
export function isTest(): boolean {
  return env.nodeEnv === "test";
}

/**
 * Check if Sentry is enabled
 */
export function isSentryEnabled(): boolean {
  return isProduction() || env.sentryEnabled;
}

/**
 * Get Sentry configuration
 */
export function getSentryConfig(): {
  dsn: string | undefined;
  environment: string;
  enabled: boolean;
  tracesSampleRate: number;
  debug: boolean;
} {
  const tracesSampleRate = process.env.SENTRY_TRACES_SAMPLE_RATE
    ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE)
    : isProduction()
      ? 0.1
      : 1.0;

  return {
    dsn: env.sentryDsn,
    environment:
      env.sentryEnvironment ?? (isProduction() ? "production" : "development"),
    enabled: isSentryEnabled() && !!env.sentryDsn,
    tracesSampleRate: Math.min(1, Math.max(0, tracesSampleRate)),
    debug: env.sentryDebug,
  };
}

/**
 * Get logging configuration
 */
export function getLoggingConfig(): {
  level: "debug" | "info" | "warn" | "error";
  structured: boolean;
} {
  return {
    level: env.logLevel,
    structured: env.structuredLogging,
  };
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for checking if a value is a valid log level
 */
export function isLogLevel(
  value: string,
): value is "debug" | "info" | "warn" | "error" {
  return ["debug", "info", "warn", "error"].includes(value);
}
