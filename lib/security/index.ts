/**
 * Security module exports
 *
 * This module centralizes all security-related functionality.
 */

export {
  withRateLimit,
  checkRateLimit,
  getClientIp,
  resetRateLimit,
  getRateLimitStatus,
  RATE_LIMIT_CONFIGS,
} from "./rate-limit";

export {
  sanitizeHtml,
  sanitizeUrlParam,
  sanitizePath,
  truncate,
  validateChineseChars,
  sanitizeSearchQuery,
  safeHash,
  validateBirthDate,
  generateNonce,
} from "./input-validation";

export { withSecurityMiddleware, withApiSecurity } from "./api-middleware";

// Re-export types for convenience
export type { RateLimitConfig, RateLimitResult } from "./rate-limit";
export type { SecurityMiddlewareConfig } from "./api-middleware";
