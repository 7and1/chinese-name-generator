/**
 * Database adapter for character queries
 *
 * Replaces inline character data with database queries
 * Provides cached access methods for optimal performance
 */

import { getDb, schema } from "../db/index";
import { eq, and, gte, lte, or, like, inArray } from "drizzle-orm";
import type { ChineseCharacter, FiveElement } from "../types";

// ============================================================================
// Type Definitions
// ============================================================================

interface CharacterQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: "frequency" | "strokeCount" | "pinyin";
  orderDirection?: "asc" | "desc";
}

interface CharacterFilterOptions
  extends CharacterQueryOptions, Record<string, unknown> {
  elements?: FiveElement[];
  minStroke?: number;
  maxStroke?: number;
  minFrequency?: number;
  hskLevels?: number[];
}

// ============================================================================
// Cache Layer
// ============================================================================

class CharacterCache {
  private cache: Map<string, { data: unknown; timestamp: number }>;
  private ttl: number; // Time to live in milliseconds

  constructor(ttl: number = 5 * 60 * 1000) {
    // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key from parameters
  static generateKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((k) => `${k}=${JSON.stringify(params[k])}`)
      .join("&");
    return `${prefix}:${sortedParams}`;
  }
}

// Global cache instance
const charCache = new CharacterCache();

// ============================================================================
// Database Query Functions
// ============================================================================

/**
 * Get characters by five element
 */
export async function getCharactersByElement(
  element: FiveElement,
  options?: CharacterQueryOptions,
): Promise<ChineseCharacter[]> {
  const cacheKey = CharacterCache.generateKey("element", {
    element,
    ...options,
  });
  const cached = charCache.get(cacheKey);
  if (cached) return cached as ChineseCharacter[];

  const db = getDb();
  const {
    limit = 100,
    offset = 0,
    orderBy = "frequency",
    orderDirection = "desc",
  } = options || {};

  const orderByColumn =
    orderBy === "frequency"
      ? schema.characters.frequency
      : orderBy === "strokeCount"
        ? schema.characters.strokeCount
        : schema.characters.pinyin;

  const results = await db
    .select()
    .from(schema.characters)
    .where(eq(schema.characters.fiveElement, element))
    .orderBy(orderDirection === "desc" ? orderByColumn : orderByColumn)
    .limit(limit)
    .offset(offset);

  const characters = results.map(mapToChineseCharacter);
  charCache.set(cacheKey, characters);
  return characters;
}

/**
 * Get characters by stroke count range
 */
export async function getCharactersByStrokeRange(
  minStroke: number,
  maxStroke: number,
  options?: CharacterQueryOptions,
): Promise<ChineseCharacter[]> {
  const cacheKey = CharacterCache.generateKey("strokeRange", {
    minStroke,
    maxStroke,
    ...options,
  });
  const cached = charCache.get(cacheKey);
  if (cached) return cached as ChineseCharacter[];

  const db = getDb();
  const { limit = 100, offset = 0 } = options || {};

  const results = await db
    .select()
    .from(schema.characters)
    .where(
      and(
        gte(schema.characters.strokeCount, minStroke),
        lte(schema.characters.strokeCount, maxStroke),
      ),
    )
    .limit(limit)
    .offset(offset);

  const characters = results.map(mapToChineseCharacter);
  charCache.set(cacheKey, characters);
  return characters;
}

/**
 * Search characters by query
 */
export async function searchCharacters(
  query: string,
  options?: CharacterQueryOptions,
): Promise<ChineseCharacter[]> {
  const cacheKey = CharacterCache.generateKey("search", { query, ...options });
  const cached = charCache.get(cacheKey);
  if (cached) return cached as ChineseCharacter[];

  const db = getDb();
  const { limit = 50 } = options || {};

  // Search by character, pinyin, or meaning
  const results = await db
    .select()
    .from(schema.characters)
    .where(
      or(
        like(schema.characters.char, `%${query}%`),
        like(schema.characters.pinyin, `%${query}%`),
        like(schema.characters.meaning, `%${query}%`),
      ),
    )
    .limit(limit);

  const characters = results.map(mapToChineseCharacter);
  charCache.set(cacheKey, characters);
  return characters;
}

/**
 * Get detailed information about a single character
 */
export async function getCharacterInfo(
  char: string,
): Promise<ChineseCharacter | null> {
  const cacheKey = CharacterCache.generateKey("charInfo", { char });
  const cached = charCache.get(cacheKey);
  if (cached) return cached as ChineseCharacter | null;

  const db = getDb();

  const result = await db
    .select()
    .from(schema.characters)
    .where(eq(schema.characters.char, char))
    .limit(1);

  if (result.length === 0) return null;

  const character = mapToChineseCharacter(result[0]);
  charCache.set(cacheKey, character);
  return character;
}

/**
 * Get multiple characters by their character values
 */
export async function getCharactersBatch(
  chars: string[],
): Promise<ChineseCharacter[]> {
  if (chars.length === 0) return [];

  const cacheKey = CharacterCache.generateKey("batch", { chars: chars.sort() });
  const cached = charCache.get(cacheKey);
  if (cached) return cached as ChineseCharacter[];

  const db = getDb();

  const results = await db
    .select()
    .from(schema.characters)
    .where(inArray(schema.characters.char, chars));

  const characters = results.map(mapToChineseCharacter);
  charCache.set(cacheKey, characters);
  return characters;
}

/**
 * Get characters by multiple filters
 */
export async function getCharactersByFilters(
  filters: CharacterFilterOptions,
): Promise<ChineseCharacter[]> {
  const cacheKey = CharacterCache.generateKey(
    "filters",
    filters as Record<string, unknown>,
  );
  const cached = charCache.get(cacheKey);
  if (cached) return cached as ChineseCharacter[];

  const db = getDb();
  const conditions = [];

  if (filters.elements && filters.elements.length > 0) {
    conditions.push(inArray(schema.characters.fiveElement, filters.elements));
  }

  if (filters.minStroke !== undefined) {
    conditions.push(gte(schema.characters.strokeCount, filters.minStroke));
  }

  if (filters.maxStroke !== undefined) {
    conditions.push(lte(schema.characters.strokeCount, filters.maxStroke));
  }

  if (filters.minFrequency !== undefined) {
    conditions.push(gte(schema.characters.frequency, filters.minFrequency));
  }

  if (filters.hskLevels && filters.hskLevels.length > 0) {
    conditions.push(inArray(schema.characters.hskLevel, filters.hskLevels));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select()
    .from(schema.characters)
    .where(whereClause)
    .limit(filters.limit || 100)
    .offset(filters.offset || 0);

  const characters = results.map(mapToChineseCharacter);
  charCache.set(cacheKey, characters);
  return characters;
}

/**
 * Get random characters matching criteria
 */
export async function getRandomCharacters(
  count: number,
  filters?: Omit<CharacterFilterOptions, "limit" | "offset">,
): Promise<ChineseCharacter[]> {
  // Get more than needed to randomize
  const fetchCount = count * 5;
  const characters = await getCharactersByFilters({
    ...filters,
    limit: fetchCount,
  });

  // Shuffle and pick count
  const shuffled = characters.sort(() => Math.random() - 0.5);
  const result = shuffled.slice(0, count);

  // Don't cache random results
  return result;
}

/**
 * Get characters by pinyin pattern
 */
export async function getCharactersByPinyin(
  pinyin: string,
  tone?: number,
  options?: CharacterQueryOptions,
): Promise<ChineseCharacter[]> {
  const cacheKey = CharacterCache.generateKey("pinyin", {
    pinyin,
    tone,
    ...options,
  });
  const cached = charCache.get(cacheKey);
  if (cached) return cached as ChineseCharacter[];

  const db = getDb();
  const { limit = 50 } = options || {};

  const conditions = [like(schema.characters.pinyin, `${pinyin}%`)];

  if (tone !== undefined) {
    conditions.push(eq(schema.characters.tone, tone));
  }

  const results = await db
    .select()
    .from(schema.characters)
    .where(and(...conditions))
    .limit(limit);

  const characters = results.map(mapToChineseCharacter);
  charCache.set(cacheKey, characters);
  return characters;
}

/**
 * Get top characters by frequency
 */
export async function getTopCharacters(
  limit: number = 100,
  element?: FiveElement,
): Promise<ChineseCharacter[]> {
  const cacheKey = CharacterCache.generateKey("top", { limit, element });
  const cached = charCache.get(cacheKey);
  if (cached) return cached as ChineseCharacter[];

  const db = getDb();

  const whereClause = element
    ? eq(schema.characters.fiveElement, element)
    : undefined;

  const results = await db
    .select()
    .from(schema.characters)
    .where(whereClause)
    .orderBy(schema.characters.frequency)
    .limit(limit);

  const characters = results.map(mapToChineseCharacter);
  charCache.set(cacheKey, characters);
  return characters;
}

/**
 * Get character statistics
 */
export async function getCharacterStats(): Promise<{
  totalCharacters: number;
  countByElement: Record<FiveElement, number>;
  countByStroke: Record<number, number>;
}> {
  const cacheKey = "stats";
  const cached = charCache.get(cacheKey);
  if (cached)
    return cached as {
      totalCharacters: number;
      countByElement: Record<FiveElement, number>;
      countByStroke: Record<number, number>;
    };

  const db = getDb();

  // Get total count
  const totalResult = await db
    .select({ count: schema.characters.id })
    .from(schema.characters);

  // Get counts by element
  const elementCounts = await db
    .select({
      element: schema.characters.fiveElement,
      count: schema.characters.id,
    })
    .from(schema.characters)
    .groupBy(schema.characters.fiveElement);

  // Get stroke count distribution
  const strokeCounts = await db
    .select({
      stroke: schema.characters.strokeCount,
      count: schema.characters.id,
    })
    .from(schema.characters)
    .groupBy(schema.characters.strokeCount);

  const countByElement: Record<FiveElement, number> = {
    金: 0,
    木: 0,
    水: 0,
    火: 0,
    土: 0,
  };

  for (const row of elementCounts) {
    countByElement[row.element as FiveElement] = Number(row.count);
  }

  const countByStroke: Record<number, number> = {};
  for (const row of strokeCounts) {
    countByStroke[row.stroke] = Number(row.count);
  }

  const stats = {
    totalCharacters: totalResult.length,
    countByElement,
    countByStroke,
  };

  // Cache for longer (stats don't change often)
  charCache.set(cacheKey, stats);
  return stats;
}

/**
 * Clear the character cache
 */
export function clearCharacterCache(): void {
  charCache.clear();
}

/**
 * Warm up the cache with common queries
 */
export async function warmCharacterCache(): Promise<void> {
  const elements: FiveElement[] = ["金", "木", "水", "火", "土"];

  for (const element of elements) {
    await getCharactersByElement(element, { limit: 50 });
  }

  await getTopCharacters(100);
  await getCharacterStats();
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Map database row to ChineseCharacter type
 */
function mapToChineseCharacter(row: Record<string, unknown>): ChineseCharacter {
  return {
    char: row.char as string,
    pinyin: row.pinyin as string,
    tone: row.tone as number,
    strokeCount: row.strokeCount as number,
    kangxiStrokeCount: row.kangxiStrokeCount as number,
    radical: row.radical as string,
    fiveElement: row.fiveElement as FiveElement,
    meaning: row.meaning as string,
    traditionalForm: (row.traditionalForm as string) || undefined,
    simplifiedForm: (row.simplifiedForm as string) || undefined,
    frequency: row.frequency as number,
    hskLevel: (row.hskLevel as number) || undefined,
  };
}

/**
 * Check if database has character data
 */
export async function hasCharacterData(): Promise<boolean> {
  const db = getDb();

  const result = await db
    .select({ count: schema.characters.id })
    .from(schema.characters)
    .limit(1);

  return result.length > 0;
}

/**
 * Get approximate character count (cached)
 */
export async function getCharacterCount(): Promise<number> {
  const stats = await getCharacterStats();
  return stats.totalCharacters;
}
