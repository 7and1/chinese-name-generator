/**
 * Character Data Split by Element
 *
 * This file provides lazy-loaded character data split by five elements.
 * Each element is loaded as a separate chunk for better code splitting.
 *
 * Usage:
 * ```ts
 * import { getCharactersByElementAsync } from './characters-split';
 * const metalChars = await getCharactersByElementAsync('金');
 * ```
 */

import type { ChineseCharacter, FiveElement } from "../types";

// ============================================================================
// Lazy-loaded character chunks
// ============================================================================

let allCharactersCache: Map<FiveElement, ChineseCharacter[]> | null = null;
let combinedCache: ChineseCharacter[] | null = null;

/**
 * Lazy load characters for a specific element
 */
async function loadElementChunk(
  element: FiveElement,
): Promise<ChineseCharacter[]> {
  // For now, load from the main characters file
  // In production, this would be split into separate JSON/chunk files
  const { SAMPLE_CHARACTERS } = await import("./characters");
  return SAMPLE_CHARACTERS.filter((c) => c.fiveElement === element);
}

/**
 * Get characters by element (async, with lazy loading)
 */
export async function getCharactersByElementAsync(
  element: FiveElement,
): Promise<ChineseCharacter[]> {
  // Initialize cache if needed
  if (!allCharactersCache) {
    allCharactersCache = new Map();
    const elements: FiveElement[] = ["金", "木", "水", "火", "土"];
    for (const el of elements) {
      allCharactersCache.set(el, []);
    }
  }

  // Check cache
  const cached = allCharactersCache.get(element);
  if (cached && cached.length > 0) {
    return cached;
  }

  // Load and cache
  const chars = await loadElementChunk(element);
  allCharactersCache.set(element, chars);
  return chars;
}

/**
 * Get all characters (async, with caching)
 */
export async function getAllCharactersAsync(): Promise<ChineseCharacter[]> {
  if (combinedCache) {
    return combinedCache;
  }

  const elements: FiveElement[] = ["金", "木", "水", "火", "土"];
  const allChars: ChineseCharacter[] = [];

  for (const element of elements) {
    const chars = await getCharactersByElementAsync(element);
    allChars.push(...chars);
  }

  combinedCache = allChars;
  return allChars;
}

/**
 * Get character count without loading all data
 */
export async function getCharacterCountAsync(): Promise<number> {
  // This would ideally query a database or read metadata
  if (combinedCache) {
    return combinedCache.length;
  }

  const { getCharacterCount } = await import("./characters");
  return getCharacterCount();
}

/**
 * Get a single character by string (async)
 */
export async function getCharacterAsync(
  char: string,
): Promise<ChineseCharacter | undefined> {
  const allChars = await getAllCharactersAsync();
  return allChars.find((c) => c.char === char);
}

/**
 * Clear character cache (for memory management)
 */
export function clearCharacterCache(): void {
  allCharactersCache = null;
  combinedCache = null;
}

// ============================================================================
// Synchronous wrappers (for backward compatibility)
// ============================================================================

// Load at module level for sync access (requires allow-in-modules)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { SAMPLE_CHARACTERS } = require("./characters");

/**
 * Synchronous getCharactersByElement (falls back to main module)
 */
export function getCharactersByElementSync(
  element: FiveElement,
): ChineseCharacter[] {
  return SAMPLE_CHARACTERS.filter(
    (c: ChineseCharacter) => c.fiveElement === element,
  );
}

/**
 * Synchronous getAllCharacters (falls back to main module)
 */
export function getAllCharactersSync(): ChineseCharacter[] {
  return SAMPLE_CHARACTERS;
}
