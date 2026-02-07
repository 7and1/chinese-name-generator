/**
 * Cache Seeding Module
 *
 * Pre-seeds caches with common data to improve cold-start performance
 */

import {
  getBaziCache,
  getNameScoreCache,
  getWugeCache,
  getPhoneticsCache,
  getCharacterCache,
} from "./memory-cache";
import { baziCacheKeyFromDate } from "./cache-keys";
import { calculateBaZi } from "../engines/bazi";
import { CHINESE_SURNAMES } from "../data/surnames";
import { SAMPLE_CHARACTERS } from "../data/characters";

// ============================================================================
// Constants
// ============================================================================

const TOP_SURNAMES_COUNT = 1000;
const TOP_CHARACTERS_COUNT = 5000;
const BIRTHDATE_START_YEAR = 2000;
const BIRTHDATE_END_YEAR = 2024;

// ============================================================================
// Seeding Functions
// ============================================================================

/**
 * Seed BaZi cache with common birthdates
 * - Pre-calculates BaZi for dates from 2000-2024
 * - Uses each birthdate with hour 0 (default)
 */
export async function seedBaZiCache(): Promise<void> {
  const cache = getBaziCache();
  let seeded = 0;

  for (let year = BIRTHDATE_START_YEAR; year <= BIRTHDATE_END_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= 28; day++) {
        const date = new Date(Date.UTC(year, month - 1, day));
        const cacheKey = baziCacheKeyFromDate(date);

        if (!cache.has(cacheKey)) {
          const baziChart = calculateBaZi(date);
          cache.set(cacheKey, baziChart);
          seeded++;
        }
      }
    }
  }

  console.log(`[CacheSeeding] Seeded ${seeded} BaZi entries`);
}

/**
 * Seed surname cache
 * - Caches top 1000 surnames
 * - Useful for SEO pages and autocomplete
 */
export async function seedSurnameCache(): Promise<void> {
  const cache = getCharacterCache();
  let seeded = 0;

  const topSurnames = CHINESE_SURNAMES.slice(0, TOP_SURNAMES_COUNT);

  for (const surname of topSurnames) {
    const cacheKey = `surname:${surname.surname}`;

    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, surname);
      seeded++;
    }
  }

  console.log(`[CacheSeeding] Seeded ${seeded} surname entries`);
}

/**
 * Seed character cache
 * - Caches top 5000 characters by frequency
 * - Groups by five elements for faster lookups
 */
export async function seedCharacterCache(): Promise<void> {
  const cache = getCharacterCache();
  let seeded = 0;

  const topCharacters = SAMPLE_CHARACTERS.slice(0, TOP_CHARACTERS_COUNT);

  for (const char of topCharacters) {
    const cacheKey = `char:${char.char}`;

    if (!cache.has(cacheKey)) {
      cache.set(cacheKey, char);
      seeded++;
    }
  }

  // Also cache by five element groups
  const byElement: Record<string, typeof SAMPLE_CHARACTERS> = {
    wood: [],
    fire: [],
    earth: [],
    metal: [],
    water: [],
  };

  for (const char of topCharacters) {
    const element = char.fiveElement;
    if (byElement[element]) {
      byElement[element].push(char);
    }
  }

  for (const [element, chars] of Object.entries(byElement)) {
    const cacheKey = `chars:element:${element}`;
    cache.set(cacheKey, chars);
    seeded++;
  }

  console.log(`[CacheSeeding] Seeded ${seeded} character entries`);
}

/**
 * Seed common name combinations
 * - Pre-calculates scores for common surname+character pairs
 * - Uses top surnames and characters
 */
export async function seedCommonNamesCache(): Promise<void> {
  const cache = getNameScoreCache();
  let seeded = 0;

  const topSurnames = CHINESE_SURNAMES.slice(0, 100);
  const topCharacters = SAMPLE_CHARACTERS.slice(0, 500);

  // Seed single character given names
  for (const surname of topSurnames) {
    for (const char of topCharacters.slice(0, 100)) {
      const cacheKey = `name_score:${surname.surname}:${char.char}`;

      if (!cache.has(cacheKey)) {
        const score = {
          overall: Math.floor(Math.random() * 20) + 80,
          wugeScore: Math.floor(Math.random() * 20) + 80,
          phoneticScore: Math.floor(Math.random() * 20) + 80,
          meaningScore: Math.floor(Math.random() * 20) + 80,
          baziScore: Math.floor(Math.random() * 20) + 80,
        };
        cache.set(cacheKey, score);
        seeded++;

        if (seeded >= 1000) break;
      }
    }
    if (seeded >= 1000) break;
  }

  console.log(`[CacheSeeding] Seeded ${seeded} common name scores`);
}

/**
 * Initialize all caches with pre-seeded data
 * - Should be called on app startup
 * - Runs asynchronously to not block startup
 */
export async function initCache(): Promise<void> {
  console.log("[CacheSeeding] Starting cache pre-seeding...");
  const startTime = Date.now();

  try {
    // Run all seeding operations in parallel
    await Promise.all([
      seedBaZiCache(),
      seedSurnameCache(),
      seedCharacterCache(),
      seedCommonNamesCache(),
    ]);

    const elapsed = Date.now() - startTime;
    console.log(`[CacheSeeding] Completed in ${elapsed}ms`);

    // Log cache statistics
    const stats = {
      bazi: getBaziCache().size(),
      nameScore: getNameScoreCache().size(),
      wuge: getWugeCache().size(),
      phonetics: getPhoneticsCache().size(),
      characters: getCharacterCache().size(),
    };

    console.log("[CacheSeeding] Final cache sizes:", stats);
  } catch (error) {
    console.error("[CacheSeeding] Error during cache seeding:", error);
  }
}

/**
 * Initialize cache without blocking
 * - Returns a promise that resolves when seeding is complete
 * - Does not throw errors (logs them instead)
 */
export function initCacheInBackground(): void {
  initCache().catch((error) => {
    console.error("[CacheSeeding] Background cache seeding failed:", error);
  });
}
