import { z } from "zod";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if a string contains only Chinese (Han) characters
 */
function isChinese(str: string): boolean {
  return /^[\u4e00-\u9fa5]+$/.test(str);
}

/**
 * Check if a string is a valid Chinese surname (1-2 characters)
 * SECURITY: Additional validation to prevent injection attempts
 */
function isValidSurname(str: string): boolean {
  // Check length first
  if (str.length < 1 || str.length > 2) {
    return false;
  }
  // Check for XSS patterns
  const dangerousPatterns = [
    /</i,
    />/i,
    /"/i,
    /'/i,
    /&/i,
    /\$/i,
    /;/i,
    /\|/i,
    /`/i,
    /\\/i,
  ];
  for (const pattern of dangerousPatterns) {
    if (pattern.test(str)) {
      return false;
    }
  }
  return /^[\u4e00-\u9fa5]{1,2}$/.test(str);
}

/**
 * Check if a string is a valid Chinese name (2-4 characters)
 * SECURITY: Additional validation to prevent injection attempts
 */
function isValidChineseName(str: string): boolean {
  // Check length first
  if (str.length < 2 || str.length > 4) {
    return false;
  }
  // Check for XSS patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /on\w+\s*=/i,
  ];
  for (const pattern of dangerousPatterns) {
    if (pattern.test(str)) {
      return false;
    }
  }
  return /^[\u4e00-\u9fa5\u00b7\u2022]{2,4}$/.test(str);
}

/**
 * Check if a string is a valid search query (Chinese, Latin, numbers, spaces, hyphens, underscores)
 * SECURITY: Blocks XSS attempts via script tags, event handlers, and javascript: protocols
 */
function isValidSearchQuery(str: string): boolean {
  // Check for known XSS patterns first
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /fromCharCode/i,
    /&#/,
    /&lt;/,
    /&gt;/,
    /eval\s*\(/i,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(str)) {
      return false;
    }
  }

  // Allow Chinese characters, ASCII letters, numbers, spaces, hyphens, underscores
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const isChinese = code >= 0x4e00 && code <= 0x9fa5;
    const isLatin = (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    const isNumber = code >= 48 && code <= 57;
    const isSpace = code === 32;
    const isHyphen = code === 45;
    const isUnderscore = code === 95;

    if (
      !isChinese &&
      !isLatin &&
      !isNumber &&
      !isSpace &&
      !isHyphen &&
      !isUnderscore
    ) {
      return false;
    }
  }
  return true;
}

// ============================================================================
// Base Enums
// ============================================================================

export const fiveElementEnum = z.enum(["金", "木", "水", "火", "土"]);
export const genderEnum = z.enum(["male", "female", "neutral"]);
export const styleEnum = z.enum(["classic", "modern", "poetic", "elegant"]);
export const sourceEnum = z.enum(["poetry", "classics", "idioms", "any"]);

// ============================================================================
// Date Validation
// ============================================================================

const currentYear = new Date().getFullYear();
const minYear = 1900;

export const ymdDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")
  .refine((date) => {
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    return year >= minYear && year <= currentYear;
  }, `Date must be between ${minYear} and ${currentYear}`)
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, "Invalid date");

export const isoDateTime = z
  .string()
  .datetime()
  .refine(
    (date) => {
      const parsed = new Date(date);
      const year = parsed.getFullYear();
      return year >= minYear && year <= currentYear + 1;
    },
    `Date must be between ${minYear} and ${currentYear + 1}`,
  );

// ============================================================================
// Chinese Character Validation
// ============================================================================

/**
 * Validates Chinese (Han) characters
 * Allows 1-2 characters for surnames (including compound surnames)
 */
export const chineseSurname = z
  .string()
  .trim()
  .min(1, "Surname is required")
  .max(2, "Surname must be 1-2 characters")
  .refine((v) => isValidSurname(v), {
    message: "Surname must be 1-2 Chinese characters",
  });

/**
 * Validates Chinese names (2-4 characters total)
 * Includes surname + given name combinations
 */
export const chineseName = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(4, "Name must be at most 4 characters")
  .refine((v) => isValidChineseName(v), {
    message: "Name must be 2-4 Chinese characters",
  });

/**
 * Validates individual Chinese characters (1 character)
 */
export const chineseChar = z
  .string()
  .length(1, "Must be a single character")
  .refine((v) => isChinese(v), {
    message: "Must be a Chinese character",
  });

// ============================================================================
// Five Elements Validation
// ============================================================================

/**
 * Array of five elements with max 5 unique elements
 */
export const fiveElementsArray = z
  .array(fiveElementEnum)
  .min(1, "At least one element must be selected")
  .max(5, "Maximum 5 elements can be selected")
  .refine((elements) => {
    const unique = new Set(elements);
    return unique.size === elements.length;
  }, "Elements must be unique")
  .optional();

/**
 * Preferred elements (subset of five elements)
 */
export const preferredElementsSchema = fiveElementsArray;

/**
 * Avoid elements (subset of five elements)
 */
export const avoidElementsSchema = fiveElementsArray;

// ============================================================================
// Numeric Validation
// ============================================================================

/**
 * Birth hour (0-23 for 24-hour format)
 */
export const birthHourSchema = z
  .number()
  .int("Birth hour must be an integer")
  .min(0, "Birth hour must be between 0 and 23")
  .max(23, "Birth hour must be between 0 and 23")
  .optional();

/**
 * Character count for generated names (1 or 2)
 */
export const characterCountSchema = z
  .union([z.literal(1), z.literal(2)])
  .optional();

/**
 * Max results for name generation (1-50)
 */
export const maxResultsSchema = z
  .number()
  .int("Max results must be an integer")
  .min(1, "Must generate at least 1 name")
  .max(50, "Cannot generate more than 50 names at once")
  .optional();

/**
 * Quantity for batch operations (1-100)
 */
export const quantitySchema = z
  .number()
  .int("Quantity must be an integer")
  .min(1, "Quantity must be at least 1")
  .max(100, "Quantity cannot exceed 100")
  .optional();

// ============================================================================
// Search Validation
// ============================================================================

/**
 * Search query validation
 */
export const searchQuerySchema = z
  .string()
  .trim()
  .min(1, "Search query cannot be empty")
  .max(50, "Search query is too long (max 50 characters)")
  .refine((v) => isValidSearchQuery(v), {
    message: "Search query contains invalid characters",
  });

/**
 * Search kind/type validation
 */
export const searchKindSchema = z.enum(["all", "character", "poetry", "idiom"]);

/**
 * Search limit validation
 */
export const searchLimitSchema = z
  .number()
  .int("Limit must be an integer")
  .min(1, "Limit must be at least 1")
  .max(100, "Limit cannot exceed 100");

// ============================================================================
// Request Schemas
// ============================================================================

/**
 * Generate name request schema with enhanced validation
 */
export const generateNameRequestSchema = z.object({
  surname: chineseSurname,
  gender: genderEnum,
  birthDate: z.union([ymdDate, isoDateTime]).optional(),
  birthHour: birthHourSchema,
  preferredElements: preferredElementsSchema,
  avoidElements: avoidElementsSchema,
  style: styleEnum.optional(),
  source: sourceEnum.optional(),
  characterCount: characterCountSchema,
  maxResults: maxResultsSchema,
});

/**
 * Analyze name request schema with enhanced validation
 */
export const analyzeNameRequestSchema = z.object({
  fullName: chineseName,
  birthDate: z.union([ymdDate, isoDateTime]).optional(),
  birthHour: birthHourSchema,
});

/**
 * Search request schema (for query parameters)
 */
export const searchRequestSchema = z.object({
  q: searchQuerySchema.optional(),
  kind: searchKindSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type GenerateNameRequest = z.infer<typeof generateNameRequestSchema>;
export type AnalyzeNameRequest = z.infer<typeof analyzeNameRequestSchema>;
export type SearchRequest = z.infer<typeof searchRequestSchema>;
export type FiveElement = z.infer<typeof fiveElementEnum>;
export type Gender = z.infer<typeof genderEnum>;
export type NameStyle = z.infer<typeof styleEnum>;
export type NameSource = z.infer<typeof sourceEnum>;
export type SearchKind = z.infer<typeof searchKindSchema>;
