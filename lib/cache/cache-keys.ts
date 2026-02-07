/**
 * Cache key definitions for the Chinese Name Generator
 *
 * Provides consistent cache key generation functions
 */

import type { FiveElement } from "../types";

// ============================================================================
// Cache Key Types
// ============================================================================

export interface CacheKeyConfig {
  prefix: string;
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum entries for this cache type
}

// ============================================================================
// Cache Configurations
// ============================================================================

export const CACHE_CONFIG = {
  // BaZi calculations - 24 hours TTL
  bazi: {
    prefix: "bazi",
    ttl: 24 * 60 * 60 * 1000,
  },
  // Name scores - 7 days TTL
  nameScore: {
    prefix: "name_score",
    ttl: 7 * 24 * 60 * 60 * 1000,
  },
  // Wuge analysis - 7 days TTL
  wuge: {
    prefix: "wuge",
    ttl: 7 * 24 * 60 * 60 * 1000,
  },
  // Phonetic analysis - 24 hours TTL
  phonetics: {
    prefix: "phonetics",
    ttl: 24 * 60 * 60 * 1000,
  },
  // Character data by element - 30 days TTL (static data)
  charactersByElement: {
    prefix: "chars_element",
    ttl: 30 * 24 * 60 * 60 * 1000,
  },
} as const;

// ============================================================================
// Cache Key Generators
// ============================================================================

/**
 * Generate cache key for BaZi calculation
 * Format: bazi:YYYY-MM-DD:HH
 */
export function baziCacheKey(
  year: number,
  month: number,
  day: number,
  hour?: number,
): string {
  const hourPart = hour !== undefined ? `:${hour}` : ":0";
  return `${CACHE_CONFIG.bazi.prefix}:${year}-${month}-${day}${hourPart}`;
}

/**
 * Generate cache key for BaZi from Date object
 */
export function baziCacheKeyFromDate(date: Date, hour?: number): string {
  return baziCacheKey(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    hour,
  );
}

/**
 * Generate cache key for name score calculation
 * Format: name_score:surname:givenName[:hasBazi]
 *
 * The hasBazi flag differentiates between names scored with and without
 * BaZi analysis, since the scoring algorithm differs.
 */
export function nameScoreCacheKey(
  surname: string,
  givenName: string,
  hasBazi?: boolean,
): string {
  const baziPart = hasBazi ? ":with_bazi" : "";
  return `${CACHE_CONFIG.nameScore.prefix}:${surname}:${givenName}${baziPart}`;
}

/**
 * Generate cache key for Wuge analysis
 * Format: wuge:surnameStrokes:givenNameStrokes
 */
export function wugeCacheKey(
  surnameStrokes: number[],
  givenNameStrokes: number[],
): string {
  return `${CACHE_CONFIG.wuge.prefix}:${surnameStrokes.join("-")}:${givenNameStrokes.join("-")}`;
}

/**
 * Generate cache key for phonetic analysis
 * Format: phonetics:fullName
 */
export function phoneticsCacheKey(fullName: string): string {
  return `${CACHE_CONFIG.phonetics.prefix}:${fullName}`;
}

/**
 * Generate cache key for characters by element
 * Format: chars_element:element
 */
export function charactersByElementCacheKey(element: FiveElement): string {
  return `${CACHE_CONFIG.charactersByElement.prefix}:${element}`;
}

/**
 * Generate cache key for characters by multiple elements
 * Format: chars_element:el1:el2:el3
 */
export function charactersByElementsCacheKey(elements: FiveElement[]): string {
  const sortedElements = [...elements].sort();
  return `${CACHE_CONFIG.charactersByElement.prefix}:${sortedElements.join(":")}`;
}

// ============================================================================
// Cache Key Validators
// ============================================================================

/**
 * Validate if a cache key is valid
 */
export function isValidCacheKey(key: string): boolean {
  return typeof key === "string" && key.length > 0 && key.length < 200;
}

/**
 * Extract cache type from cache key
 */
export function getCacheType(key: string): string | null {
  const parts = key.split(":");
  if (parts.length < 2) return null;

  const prefix = parts[0];
  for (const [type, config] of Object.entries(CACHE_CONFIG)) {
    if (config.prefix === prefix) {
      return type;
    }
  }
  return null;
}
