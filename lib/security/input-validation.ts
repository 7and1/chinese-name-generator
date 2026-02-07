/**
 * Input validation and sanitization utilities
 *
 * SECURITY FEATURES:
 * - XSS prevention through output encoding
 * - SQL injection prevention (though we use ORM)
 * - Path traversal prevention
 * - Input length limits
 */

/**
 * Sanitize user input for safe HTML output
 * This is a defense-in-depth measure; React's JSX already escapes by default
 */
export function sanitizeHtml(input: string): string {
  const div =
    typeof document !== "undefined" ? document.createElement("div") : null;

  if (!div) {
    // Server-side fallback
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitize input for use in URL parameters
 */
export function sanitizeUrlParam(input: string): string {
  return input
    .replace(/[^\w\s-]/gi, "") // Remove special characters
    .trim()
    .slice(0, 100); // Limit length
}

/**
 * Validate and sanitize file path to prevent directory traversal
 */
export function sanitizePath(input: string): string {
  // Remove any directory traversal attempts
  return input
    .replace(/\.\./g, "")
    .replace(/\//g, "")
    .replace(/\\/g, "")
    .slice(0, 255);
}

/**
 * Truncate string to maximum length with ellipsis
 */
export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength - 3) + "...";
}

/**
 * Validate Chinese characters only (for name inputs)
 */
export function validateChineseChars(input: string): boolean {
  return /^[\u4e00-\u9fa5\u00b7\u2022]*$/.test(input);
}

/**
 * Sanitize and validate search query
 */
export function sanitizeSearchQuery(query: string): {
  sanitized: string;
  valid: boolean;
} {
  const trimmed = query.trim();

  if (trimmed.length === 0 || trimmed.length > 100) {
    return { sanitized: "", valid: false };
  }

  // Allow Chinese, ASCII letters, numbers, and basic punctuation
  const isValid = /^[\u4e00-\u9fa5a-zA-Z0-9\s\-._]+$/.test(trimmed);

  // Remove any potentially harmful characters
  const sanitized = trimmed.replace(/[<>\"'`]/g, "");

  return { sanitized, valid: isValid && sanitized.length > 0 };
}

/**
 * Generate a safe hash for display purposes (not for cryptography)
 */
export function safeHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Validate birth date format and range
 */
export function validateBirthDate(date: string): {
  valid: boolean;
  error?: string;
} {
  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    return { valid: false, error: "Invalid date format" };
  }

  const year = parsed.getFullYear();
  const currentYear = new Date().getFullYear();

  if (year < 1900) {
    return { valid: false, error: "Date must be after 1900" };
  }

  if (year > currentYear) {
    return { valid: false, error: "Date cannot be in the future" };
  }

  return { valid: true };
}

/**
 * Content Security Policy nonce generator for inline scripts
 */
export function generateNonce(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  // Fallback for older environments
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
