/**
 * Sentry Integration Helper
 *
 * Provides convenience functions for error tracking and performance monitoring
 * with Sentry. Only active when SENTRY_DSN is configured.
 *
 * Usage:
 * ```ts
 * import * as Sentry from '@/lib/monitoring/sentry';
 *
 * // Capture error
 * Sentry.captureException(error);
 *
 * // Capture message
 * Sentry.captureMessage('Something happened', 'info');
 *
 * // Set user context
 * Sentry.setUser({ id: '123', email: 'user@example.com' });
 *
 * // Performance tracking
 * const transaction = Sentry.startTransaction({ name: 'operation' });
 * // ... do work
 * transaction.finish();
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export interface SentryUser {
  id?: string;
  email?: string;
  username?: string;
  ip_address?: string;
}

export interface SentryContext {
  [key: string]: unknown;
}

export interface SentryTransactionOptions {
  name: string;
  op?: string;
  data?: Record<string, unknown>;
}

export interface SentrySpanOptions {
  op?: string;
  description?: string;
  data?: Record<string, unknown>;
}

// ============================================================================
// Sentry Integration (Lazy Load)
// ============================================================================

/**
 * Check if Sentry is available
 * Returns true if @sentry/nextjs is installed and configured
 */
export function isSentryAvailable(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@sentry/nextjs");
    return !!process.env.SENTRY_DSN;
  } catch {
    return false;
  }
}

/**
 * Get Sentry API (with fallback for when Sentry is not available)
 */
function getSentry() {
  if (!isSentryAvailable()) {
    return {
      captureException: () => ({}) as string | undefined,
      captureMessage: () => ({}) as string | undefined,
      setUser: () => undefined,
      setTag: () => undefined,
      setContext: () => undefined,
      addBreadcrumb: () => undefined,
      startTransaction: () => ({
        finish: () => undefined,
        startChild: () => ({ finish: () => undefined }),
      }),
      withScope: () => undefined,
      lastEventId: () => undefined,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require("@sentry/nextjs");
  return Sentry;
}

// ============================================================================
// Error Tracking Functions
// ============================================================================

/**
 * Capture an exception in Sentry
 *
 * @param error - The error to capture
 * @param context - Additional context to attach
 * @param level - Error level (fatal, error, warning, info, debug)
 * @returns Event ID if captured, undefined otherwise
 *
 * @example
 * ```ts
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   captureException(error, { operation: 'riskyOperation' });
 * }
 * ```
 */
export function captureException(
  error: unknown,
  context?: SentryContext,
  level?: "fatal" | "error" | "warning" | "info" | "debug",
): string | undefined {
  const Sentry = getSentry();
  return Sentry.captureException(error, {
    level: level ?? "error",
    tags: context,
    extra: context,
  });
}

/**
 * Capture a message in Sentry
 *
 * @param message - The message to capture
 * @param level - Message level (fatal, error, warning, info, debug)
 * @param context - Additional context to attach
 * @returns Event ID if captured, undefined otherwise
 */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  context?: SentryContext,
): string | undefined {
  const Sentry = getSentry();
  return Sentry.captureMessage(message, {
    level,
    tags: context,
    extra: context,
  });
}

/**
 * Set user context in Sentry
 * All subsequent events will be associated with this user
 *
 * @param user - User information
 *
 * @example
 * ```ts
 * setUser({ id: '123', email: 'user@example.com' });
 * ```
 */
export function setUser(user: SentryUser | null): void {
  const Sentry = getSentry();
  Sentry.setUser(user);
}

/**
 * Set a tag in Sentry
 * Tags are indexed and searchable in Sentry
 *
 * @param key - Tag key
 * @param value - Tag value
 */
export function setTag(key: string, value: string | number | boolean): void {
  const Sentry = getSentry();
  Sentry.setTag(key, value);
}

/**
 * Set context in Sentry
 * Context is structured data that's attached to the event
 *
 * @param key - Context key
 * @param context - Context data
 */
export function setContext(key: string, context: SentryContext): void {
  const Sentry = getSentry();
  Sentry.setContext(key, context);
}

/**
 * Add a breadcrumb in Sentry
 * Breadcrumbs are a trail of events that led to an error
 *
 * @param message - Breadcrumb message
 * @param category - Breadcrumb category
 * @param level - Breadcrumb level
 * @param data - Additional data
 */
export function addBreadcrumb(
  message: string,
  category: string = "custom",
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  data?: Record<string, unknown>,
): void {
  const Sentry = getSentry();
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

// ============================================================================
// Performance Monitoring Functions
// ============================================================================

/**
 * Start a performance transaction
 *
 * @param options - Transaction options
 * @returns Transaction object with finish() method
 *
 * @example
 * ```ts
 * const transaction = startTransaction({ name: 'user-signup', op: 'process' });
 * // ... do work
 * transaction.finish();
 * ```
 */
export function startTransaction(options: SentryTransactionOptions) {
  const Sentry = getSentry();
  return Sentry.startTransaction({
    name: options.name,
    op: options.op,
    data: options.data,
  });
}

/**
 * Track the performance of an async operation
 *
 * @param name - Operation name
 * @param fn - Async function to track
 * @param context - Additional context
 * @returns Result of the function
 *
 * @example
 * ```ts
 * const result = await trackPerformance('expensive-operation', async () => {
 *   return await fetchData();
 * });
 * ```
 */
export async function trackPerformance<T>(
  name: string,
  fn: () => Promise<T>,
  context?: SentryContext,
): Promise<T> {
  if (!isSentryAvailable()) {
    return fn();
  }

  const transaction = startTransaction({
    name,
    op: "function",
    data: context,
  });

  try {
    const result = await fn();
    transaction.finish();
    return result;
  } catch (error) {
    transaction.setStatus("internal_error");
    transaction.finish();
    captureException(error, { ...context, operation: name });
    throw error;
  }
}

/**
 * Wrap a function with Sentry error tracking
 *
 * @param fn - Function to wrap
 * @param context - Additional context
 * @returns Wrapped function
 *
 * @example
 * ```ts
 * const safeFetch = withErrorTracking(fetch, { operation: 'fetch' });
 * ```
 */
export function withErrorTracking<
  T extends (...args: unknown[]) => ReturnType<T>,
>(fn: T, context?: SentryContext): T {
  return ((...args: unknown[]) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          captureException(error, context);
          throw error;
        });
      }
      return result;
    } catch (error) {
      captureException(error, context);
      throw error;
    }
  }) as T;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get the last Sentry event ID
 * Useful for showing user feedback dialogs
 */
export function lastEventId(): string | undefined {
  const Sentry = getSentry();
  return Sentry.lastEventId();
}

/**
 * Execute a function with a custom Sentry scope
 *
 * @param fn - Function to execute within the scope
 */
export function withScope(fn: () => void): void {
  const Sentry = getSentry();
  Sentry.withScope(fn);
}

/**
 * Configure Sentry with additional options
 *
 * @param options - Configuration options
 */
export function configureSentry(options: {
  environment?: string;
  release?: string;
  dist?: string;
  maxValueLength?: number;
  maxBreadcrumbs?: number;
}): void {
  if (!isSentryAvailable()) return;

  const Sentry = getSentry();
  if (options.environment) {
    Sentry.getCurrentScope().setEnvironment(options.environment);
  }
  if (options.release) {
    Sentry.getCurrentScope().setRelease(options.release);
  }
  if (options.dist) {
    Sentry.getCurrentScope().setDist(options.dist);
  }
}

// ============================================================================
// Re-exports
// ============================================================================

export { isSentryAvailable as isEnabled };
export default {
  captureException,
  captureMessage,
  setUser,
  setTag,
  setContext,
  addBreadcrumb,
  startTransaction,
  trackPerformance,
  withErrorTracking,
  lastEventId,
  withScope,
  configureSentry,
  isEnabled: isSentryAvailable,
};
