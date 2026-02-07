/**
 * Monitoring module exports
 *
 * This module provides centralized monitoring and logging capabilities.
 *
 * Usage:
 * ```ts
 * import { logger, trackPerformance, trackError } from '@/lib/monitoring';
 *
 * // Logging
 * logger.info('User action', { userId: '123' });
 *
 * // Performance tracking
 * await trackPerformance('expensive-operation', async () => {
 *   // ... code to measure
 * });
 *
 * // Error tracking
 * try {
 *   // ... code
 * } catch (error) {
 *   trackError(error, { context: 'additional context' });
 * }
 * ```
 */

export * from "./logger";
export * from "./sentry";
export * from "./health-check";
