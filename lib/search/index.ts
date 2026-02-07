/**
 * Search Module - Optimized with FTS (Full-Text Search)
 *
 * Performance improvements:
 * - O(1) lookups using inverted index instead of O(n) linear scan
 * - Cached search results with TTL
 * - Lazy index initialization
 * - Performance monitoring
 *
 * @module search
 */

import { getPerformanceMonitor } from "../performance/monitor";
import { getCharacterCount, SAMPLE_CHARACTERS } from "../data/characters";
import { POETRY_DATABASE } from "../data/poetry";
import { IDIOM_DATABASE } from "../data/idioms";

// Re-export types
export type SearchKind = "all" | "character" | "poetry" | "idiom";

export type SearchResult =
  | {
      type: "character";
      char: string;
      pinyin: string;
      meaning: string;
      fiveElement: string;
    }
  | {
      type: "poetry";
      id: string;
      title: string;
      source: string;
      verse: string;
    }
  | {
      type: "idiom";
      idiom: string;
      pinyin: string;
      meaning: string;
      category: string;
    };

export type SearchResponseData = {
  query: string;
  kind: SearchKind;
  results: SearchResult[];
  totals?: {
    characters: number;
    poems: number;
    idioms: number;
  };
  performance?: {
    duration: number;
    cached: boolean;
  };
};

// ============================================================================
// Search Implementation Strategy
// ============================================================================

// Flag to enable/disable FTS (can be toggled via environment)
const USE_FTS = process.env.SEARCH_USE_FTS !== "false";

// Synchronous fallback for when data is already loaded
let ftsModule: typeof import("./fts-index") | null = null;

/**
 * Load FTS module dynamically
 */
async function loadFTSModule() {
  if (!ftsModule) {
    ftsModule = await import("./fts-index");
  }
  return ftsModule;
}

/**
 * Main search function (synchronous, backward compatible)
 *
 * This is the default export for backward compatibility.
 * Uses optimized in-memory search with O(n) complexity.
 * For async FTS with better performance, use searchContentAsync().
 */
export function searchContent(params: {
  query: string;
  kind: SearchKind;
  limit: number;
}): SearchResponseData {
  return searchContentSync(params);
}

/**
 * Async search function with FTS support
 *
 * Uses FTS for optimal performance, falls back to synchronous search
 * if FTS is not yet initialized.
 *
 * @returns Promise<SearchResponseData>
 */
export async function searchContentAsync(params: {
  query: string;
  kind: SearchKind;
  limit: number;
}): Promise<SearchResponseData> {
  const monitor = getPerformanceMonitor();
  const startTimer = monitor.start("search.total");

  try {
    if (USE_FTS) {
      const fts = await loadFTSModule();
      const result = await fts.searchFTS(params);

      // Stop the timer and get duration
      startTimer();
      const stats = monitor.getStats("search.total");
      const duration = stats?.avgDuration ?? 0;

      (result as SearchResponseData).performance = {
        duration: Math.round(duration * 100) / 100,
        cached: false,
      };

      return result;
    }

    // Fallback to synchronous search
    startTimer(); // Stop the timer
    return searchContentSync(params);
  } catch (error) {
    startTimer(); // Stop the timer
    // Fallback to synchronous search on error
    console.error("Search error, falling back to sync:", error);
    return searchContentSync(params);
  }
}

/**
 * Synchronous search (legacy fallback)
 *
 * This is the original O(n) linear scan implementation.
 * Kept for backward compatibility and as a fallback.
 */
export function searchContentSync(params: {
  query: string;
  kind: SearchKind;
  limit: number;
}): SearchResponseData {
  const q = params.query.trim();
  const kind = params.kind;
  const limit = Math.max(1, params.limit);

  if (!q) {
    return {
      query: q,
      kind,
      results: [],
      totals: {
        characters: getCharacterCount(),
        poems: POETRY_DATABASE.length,
        idioms: IDIOM_DATABASE.length,
      },
    };
  }

  const contains = (text: string) => text.includes(q);

  const wantAll = kind === "all";
  const wantCharacters = wantAll || kind === "character";
  const wantPoetry = wantAll || kind === "poetry";
  const wantIdioms = wantAll || kind === "idiom";

  const results: SearchResult[] = [];

  if (wantCharacters) {
    for (const c of SAMPLE_CHARACTERS) {
      if (contains(c.char) || contains(c.pinyin) || contains(c.meaning)) {
        results.push({
          type: "character",
          char: c.char,
          pinyin: c.pinyin,
          meaning: c.meaning,
          fiveElement: c.fiveElement,
        });
        if (results.length >= limit) break;
      }
    }
  }

  if (results.length < limit && wantPoetry) {
    for (const p of POETRY_DATABASE) {
      if (contains(p.title) || contains(p.verse) || p.keywords.some(contains)) {
        results.push({
          type: "poetry",
          id: p.id,
          title: p.title,
          source: p.source,
          verse: p.verse,
        });
        if (results.length >= limit) break;
      }
    }
  }

  if (results.length < limit && wantIdioms) {
    for (const i of IDIOM_DATABASE) {
      if (contains(i.idiom) || contains(i.pinyin) || contains(i.meaning)) {
        results.push({
          type: "idiom",
          idiom: i.idiom,
          pinyin: i.pinyin,
          meaning: i.meaning,
          category: i.category,
        });
        if (results.length >= limit) break;
      }
    }
  }

  return { query: q, kind, results };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Preload search indexes for optimal performance
 * Call this during app initialization
 */
export async function preloadSearch(): Promise<void> {
  if (!USE_FTS) return;

  const fts = await loadFTSModule();
  await fts.preloadSearchIndexes();
}

/**
 * Get search statistics for monitoring
 */
export async function getSearchStats() {
  if (!USE_FTS) {
    return {
      method: "sync",
      initialized: false,
    };
  }

  const fts = await loadFTSModule();
  return fts.getSearchStats();
}

/**
 * Clear search cache
 */
export function clearSearchCache(): void {
  if (ftsModule) {
    ftsModule.clearSearchCache();
  }
}
