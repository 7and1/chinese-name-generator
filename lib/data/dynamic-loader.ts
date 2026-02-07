/**
 * Dynamic Data Loader Module
 *
 * Provides lazy-loading capabilities for large data files to enable
 * code splitting and reduce initial bundle size.
 *
 * Usage:
 * - Characters data (364KB+) is loaded on-demand
 * - Poetry data is loaded on-demand
 * - Idioms data is loaded on-demand
 */

import type { ChineseCharacter, FiveElement } from "../types";
import type { PoetryVerse } from "./poetry";

// ============================================================================
// Dynamic Import Types
// ============================================================================

type CharacterDataModule = {
  SAMPLE_CHARACTERS: ChineseCharacter[];
};

type PoetryDataModule = {
  POETRY_DATABASE: PoetryVerse[];
};

type IdiomDataModule = {
  IDIOM_DATABASE: Array<{
    idiom: string;
    pinyin: string;
    meaning: string;
    category?: string;
    suitableChars: string[];
  }>;
};

// ============================================================================
// Promise Cache for Dynamic Imports
// ============================================================================

const importCache = new Map<string, Promise<unknown>>();

// ============================================================================
// Character Data Loader
// ============================================================================

let charactersCache: ChineseCharacter[] | null = null;
let charactersByElementCache: Map<FiveElement, ChineseCharacter[]> | null =
  null;

/**
 * Load character data on-demand (code-split)
 */
export async function loadCharacterData(): Promise<ChineseCharacter[]> {
  if (charactersCache) {
    return charactersCache;
  }

  const cacheKey = "characters";
  let importPromise = importCache.get(cacheKey) as Promise<CharacterDataModule>;

  if (!importPromise) {
    importPromise = import("./characters").catch((error) => {
      console.error("Failed to load character data:", error);
      // Return minimal fallback data
      return { SAMPLE_CHARACTERS: [] };
    });
    importCache.set(cacheKey, importPromise);
  }

  const loadedModule = await importPromise;
  charactersCache = loadedModule.SAMPLE_CHARACTERS;

  // Build element index after loading
  if (!charactersByElementCache) {
    buildCharacterIndex();
  }

  return charactersCache;
}

/**
 * Get characters by five element (lazy loads data if needed)
 */
export async function getCharactersByElement(
  element: FiveElement,
): Promise<ChineseCharacter[]> {
  await loadCharacterData();

  if (!charactersByElementCache) {
    buildCharacterIndex();
  }

  return charactersByElementCache?.get(element) ?? [];
}

/**
 * Get characters by multiple elements (lazy loads data if needed)
 */
export async function getCharactersByElements(
  elements: FiveElement[],
): Promise<ChineseCharacter[]> {
  await loadCharacterData();

  if (!charactersByElementCache) {
    buildCharacterIndex();
  }

  const result: ChineseCharacter[] = [];
  for (const element of elements) {
    const chars = charactersByElementCache?.get(element);
    if (chars) {
      result.push(...chars);
    }
  }

  return result;
}

/**
 * Build character index for fast lookups
 */
function buildCharacterIndex(): void {
  if (!charactersCache) {
    return;
  }

  const index = new Map<FiveElement, ChineseCharacter[]>();
  const elements: FiveElement[] = ["金", "木", "水", "火", "土"];

  for (const element of elements) {
    index.set(element, []);
  }

  for (const char of charactersCache) {
    const elementChars = index.get(char.fiveElement);
    if (elementChars) {
      elementChars.push(char);
    }
  }

  charactersByElementCache = index;
}

/**
 * Get a single character by its string (lazy loads data if needed)
 */
export async function getCharacterByString(
  char: string,
): Promise<ChineseCharacter | undefined> {
  const chars = await loadCharacterData();
  return chars.find((c) => c.char === char);
}

/**
 * Preload character data (call during idle time)
 */
export async function preloadCharacterData(): Promise<void> {
  await loadCharacterData();
}

// ============================================================================
// Poetry Data Loader
// ============================================================================

let poetryCache: PoetryVerse[] | null = null;

/**
 * Load poetry data on-demand (code-split)
 */
export async function loadPoetryData(): Promise<PoetryVerse[]> {
  if (poetryCache) {
    return poetryCache;
  }

  const cacheKey = "poetry";
  let importPromise = importCache.get(cacheKey) as Promise<PoetryDataModule>;

  if (!importPromise) {
    importPromise = import("./poetry")
      .then((mod) => mod as unknown as PoetryDataModule)
      .catch((error) => {
        console.error("Failed to load poetry data:", error);
        return { POETRY_DATABASE: [] };
      });
    importCache.set(cacheKey, importPromise);
  }

  const loadedModule = await importPromise;
  poetryCache = loadedModule.POETRY_DATABASE;

  return poetryCache;
}

/**
 * Get poetry database (lazy loads if needed)
 */
export async function getPoetryDatabase(): Promise<PoetryVerse[]> {
  return loadPoetryData();
}

/**
 * Preload poetry data (call during idle time)
 */
export async function preloadPoetryData(): Promise<void> {
  await loadPoetryData();
}

// ============================================================================
// Idiom Data Loader
// ============================================================================

let idiomCache: IdiomDataModule["IDIOM_DATABASE"] | null = null;

/**
 * Load idiom data on-demand (code-split)
 */
export async function loadIdiomData(): Promise<
  IdiomDataModule["IDIOM_DATABASE"]
> {
  if (idiomCache) {
    return idiomCache;
  }

  const cacheKey = "idioms";
  let importPromise = importCache.get(cacheKey) as Promise<IdiomDataModule>;

  if (!importPromise) {
    importPromise = import("./idioms")
      .then((mod) => mod as unknown as IdiomDataModule)
      .catch((error) => {
        console.error("Failed to load idiom data:", error);
        return { IDIOM_DATABASE: [] };
      });
    importCache.set(cacheKey, importPromise);
  }

  const loadedModule = await importPromise;
  idiomCache = loadedModule.IDIOM_DATABASE;

  return idiomCache;
}

/**
 * Get idiom database (lazy loads if needed)
 */
export async function getIdiomDatabase(): Promise<
  IdiomDataModule["IDIOM_DATABASE"]
> {
  return loadIdiomData();
}

/**
 * Preload idiom data (call during idle time)
 */
export async function preloadIdiomData(): Promise<void> {
  await loadIdiomData();
}

// ============================================================================
// Preload All Data
// ============================================================================

/**
 * Preload all large data files during idle time
 * Call this when the app has spare time (e.g., after initial render)
 */
export async function preloadAllData(): Promise<void> {
  // Use requestIdleCallback if available, otherwise load immediately
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => {
      preloadCharacterData();
      preloadPoetryData();
      preloadIdiomData();
    });
  } else {
    // Fallback: load with setTimeout to defer
    setTimeout(() => {
      preloadCharacterData();
      preloadPoetryData();
      preloadIdiomData();
    }, 100);
  }
}

/**
 * Get loading status for all data modules
 */
export function getDataLoadingStatus(): {
  characters: boolean;
  poetry: boolean;
  idioms: boolean;
} {
  return {
    characters: charactersCache !== null,
    poetry: poetryCache !== null,
    idioms: idiomCache !== null,
  };
}

/**
 * Clear all data caches (useful for memory management)
 */
export function clearDataCaches(): void {
  charactersCache = null;
  charactersByElementCache = null;
  poetryCache = null;
  idiomCache = null;
}
