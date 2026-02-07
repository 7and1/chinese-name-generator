/**
 * Full-Text Search (FTS) Module
 *
 * Performance-optimized search using:
 * - Inverted index for O(1) lookups
 * - Cached search results
 * - Performance monitoring
 * - Database query optimization
 */

import { getPerformanceMonitor } from "../performance/monitor";
import type { SearchKind, SearchResult, SearchResponseData } from "./index";

// ============================================================================
// Types
// ============================================================================

export type SearchQuery = {
  text: string;
  kind: SearchKind;
  limit: number;
};

export type SearchIndexEntry = {
  text: string;
  pinyin?: string;
  meaning?: string;
  data: SearchResult;
};

// ============================================================================
// Configuration
// ============================================================================

const SEARCH_CONFIG = {
  // Minimum query length for full-text search
  minQueryLength: 1,
  // Maximum results per category
  maxResultsPerCategory: 20,
  // Cache TTL in milliseconds (5 minutes)
  cacheTTL: 5 * 60 * 1000,
  // Maximum cache entries
  maxCacheEntries: 100,
};

// ============================================================================
// Inverted Index Implementation
// ============================================================================

interface InvertedIndex {
  // Map from n-gram token to document IDs
  tokenToIds: Map<string, Set<number>>;
  // Map from ID to document
  idToDoc: Map<number, SearchResult>;
  // Counter for generating IDs
  nextId: number;
}

class SearchIndex {
  private index: InvertedIndex;
  private monitor = getPerformanceMonitor();

  constructor() {
    this.index = {
      tokenToIds: new Map(),
      idToDoc: new Map(),
      nextId: 0,
    };
  }

  /**
   * Tokenize text for indexing
   * Supports both Chinese characters and pinyin
   */
  private tokenize(text: string): string[] {
    const tokens: string[] = [];

    // Individual characters (for Chinese)
    for (const char of text) {
      if (/[\u4e00-\u9fa5]/.test(char)) {
        tokens.push(char);
      }
    }

    // N-grams for pinyin/phrases (2-character sequences)
    const normalized = text.toLowerCase();
    for (let i = 0; i < normalized.length - 1; i++) {
      tokens.push(normalized.slice(i, i + 2));
    }

    // Full word
    if (normalized.length > 0) {
      tokens.push(normalized);
    }

    return tokens;
  }

  /**
   * Add a document to the index
   */
  add(entry: SearchIndexEntry): void {
    const id = this.index.nextId++;

    // Store document
    this.index.idToDoc.set(id, entry.data);

    // Index searchable fields
    const searchableText = [
      entry.text,
      entry.pinyin || "",
      entry.meaning || "",
    ].join(" ");

    const tokens = this.tokenize(searchableText);
    const uniqueTokens = new Set(tokens);

    for (const token of uniqueTokens) {
      if (!this.index.tokenToIds.has(token)) {
        this.index.tokenToIds.set(token, new Set());
      }
      this.index.tokenToIds.get(token)!.add(id);
    }
  }

  /**
   * Search the index
   * Returns documents matching any of the query tokens
   */
  search(query: string, limit: number): SearchResult[] {
    const end = this.monitor.start("search.index");

    try {
      const tokens = this.tokenize(query.trim());
      if (tokens.length === 0) {
        end();
        return [];
      }

      // Find matching document IDs
      const matchingIds = new Set<number>();

      for (const token of tokens) {
        const ids = this.index.tokenToIds.get(token);
        if (ids) {
          for (const id of ids) {
            matchingIds.add(id);
          }
        }
      }

      // Convert IDs to documents and score by relevance
      const results: Array<{ doc: SearchResult; score: number }> = [];

      for (const id of matchingIds) {
        const doc = this.index.idToDoc.get(id);
        if (!doc) continue;

        // Simple relevance scoring
        let score = 0;
        const queryLower = query.toLowerCase();

        // Exact match bonus
        if (doc.type === "character" && doc.char === query) score += 100;
        if (doc.type === "idiom" && doc.idiom === query) score += 100;

        // Contains match
        const textFields =
          doc.type === "character"
            ? [doc.char, doc.pinyin, doc.meaning]
            : doc.type === "poetry"
              ? [doc.title, doc.verse]
              : [doc.idiom, doc.pinyin, doc.meaning];

        for (const field of textFields) {
          if (field?.toLowerCase().includes(queryLower)) {
            score += 10;
          }
        }

        results.push({ doc, score });
      }

      // Sort by score and return top results
      results.sort((a, b) => b.score - a.score);
      return results.slice(0, limit).map((r) => r.doc);
    } finally {
      end();
    }
  }

  /**
   * Get index statistics
   */
  getStats(): { documents: number; tokens: number } {
    return {
      documents: this.index.idToDoc.size,
      tokens: this.index.tokenToIds.size,
    };
  }

  /**
   * Clear the index
   */
  clear(): void {
    this.index = {
      tokenToIds: new Map(),
      idToDoc: new Map(),
      nextId: 0,
    };
  }
}

// ============================================================================
// Cached Search Implementation
// ============================================================================

interface CacheEntry {
  results: SearchResult[];
  timestamp: number;
}

class SearchCache {
  private cache = new Map<string, CacheEntry>();
  private readonly maxEntries: number;
  private readonly ttl: number;

  constructor(maxEntries: number, ttl: number) {
    this.maxEntries = maxEntries;
    this.ttl = ttl;
  }

  /**
   * Generate cache key from query
   */
  private getKey(query: string, kind: SearchKind, limit: number): string {
    return `${kind}:${limit}:${query}`;
  }

  /**
   * Get cached results
   */
  get(query: string, kind: SearchKind, limit: number): SearchResult[] | null {
    const key = this.getKey(query, kind, limit);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.results;
  }

  /**
   * Set cache entry
   */
  set(
    query: string,
    kind: SearchKind,
    limit: number,
    results: SearchResult[],
  ): void {
    const key = this.getKey(query, kind, limit);

    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      results,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxEntries,
    };
  }
}

// ============================================================================
// Global Search Index
// ============================================================================

let characterIndex: SearchIndex | null = null;
let poetryIndex: SearchIndex | null = null;
let idiomIndex: SearchIndex | null = null;
let searchCache: SearchCache | null = null;
let indexInitialized = false;

/**
 * Initialize search indexes (lazy, once)
 */
async function initializeIndexes(): Promise<void> {
  if (indexInitialized) return;

  const end = getPerformanceMonitor().start("search.initIndexes");

  try {
    characterIndex = new SearchIndex();
    poetryIndex = new SearchIndex();
    idiomIndex = new SearchIndex();
    searchCache = new SearchCache(
      SEARCH_CONFIG.maxCacheEntries,
      SEARCH_CONFIG.cacheTTL,
    );

    // Load and index data
    const [{ SAMPLE_CHARACTERS }, { POETRY_DATABASE }, { IDIOM_DATABASE }] =
      await Promise.all([
        import("../data/characters"),
        import("../data/poetry"),
        import("../data/idioms"),
      ]);

    // Index characters
    for (const char of SAMPLE_CHARACTERS) {
      characterIndex!.add({
        text: char.char,
        pinyin: char.pinyin,
        meaning: char.meaning,
        data: {
          type: "character",
          char: char.char,
          pinyin: char.pinyin,
          meaning: char.meaning,
          fiveElement: char.fiveElement,
        },
      });
    }

    // Index poetry
    for (const poem of POETRY_DATABASE) {
      poetryIndex!.add({
        text: poem.title,
        meaning: poem.verse,
        data: {
          type: "poetry",
          id: poem.id,
          title: poem.title,
          source: poem.source,
          verse: poem.verse,
        },
      });
    }

    // Index idioms
    for (const idiom of IDIOM_DATABASE) {
      idiomIndex!.add({
        text: idiom.idiom,
        pinyin: idiom.pinyin,
        meaning: idiom.meaning,
        data: {
          type: "idiom",
          idiom: idiom.idiom,
          pinyin: idiom.pinyin,
          meaning: idiom.meaning,
          category: idiom.category,
        },
      });
    }

    indexInitialized = true;
  } finally {
    end();
  }
}

/**
 * Get or create search indexes
 */
async function getIndexes(): Promise<{
  characters: SearchIndex;
  poetry: SearchIndex;
  idioms: SearchIndex;
  cache: SearchCache;
}> {
  if (!indexInitialized) {
    await initializeIndexes();
  }

  return {
    characters: characterIndex!,
    poetry: poetryIndex!,
    idioms: idiomIndex!,
    cache: searchCache!,
  };
}

// ============================================================================
// Optimized Search Implementation
// ============================================================================

/**
 * Perform full-text search with caching
 */
export async function searchFTS(params: {
  query: string;
  kind: SearchKind;
  limit: number;
}): Promise<SearchResponseData> {
  const q = params.query.trim();
  const kind = params.kind;
  const limit = Math.max(1, params.limit);

  const { characters, poetry, idioms, cache } = await getIndexes();

  // Return empty result for empty query with totals
  if (!q) {
    return {
      query: q,
      kind,
      results: [],
      totals: {
        characters: characters.getStats().documents,
        poems: poetry.getStats().documents,
        idioms: idioms.getStats().documents,
      },
    };
  }

  // Check cache first
  const cached = cache.get(q, kind, limit);
  if (cached) {
    return { query: q, kind, results: cached };
  }

  const end = getPerformanceMonitor().start("search.execute");
  const results: SearchResult[] = [];

  try {
    const wantAll = kind === "all";
    const wantCharacters = wantAll || kind === "character";
    const wantPoetry = wantAll || kind === "poetry";
    const wantIdioms = wantAll || kind === "idiom";

    // Calculate limit per category
    const limitPerCategory = wantAll ? Math.ceil(limit / 3) : limit;

    // Search characters
    if (wantCharacters) {
      const charResults = characters.search(q, limitPerCategory);
      results.push(...charResults);
    }

    // Search poetry
    if (wantPoetry && results.length < limit) {
      const poetryResults = poetry.search(q, limitPerCategory);
      results.push(...poetryResults);
    }

    // Search idioms
    if (wantIdioms && results.length < limit) {
      const idiomResults = idioms.search(q, limitPerCategory);
      results.push(...idiomResults);
    }

    // Trim to limit
    const finalResults = results.slice(0, limit);

    // Cache results
    cache.set(q, kind, limit, finalResults);

    return { query: q, kind, results: finalResults };
  } finally {
    end();
  }
}

/**
 * Get search statistics
 */
export async function getSearchStats(): Promise<{
  indexes: {
    characters: { documents: number; tokens: number };
    poetry: { documents: number; tokens: number };
    idioms: { documents: number; tokens: number };
  };
  cache: { size: number; maxSize: number };
  initialized: boolean;
}> {
  if (!indexInitialized) {
    return {
      indexes: {
        characters: { documents: 0, tokens: 0 },
        poetry: { documents: 0, tokens: 0 },
        idioms: { documents: 0, tokens: 0 },
      },
      cache: { size: 0, maxSize: SEARCH_CONFIG.maxCacheEntries },
      initialized: false,
    };
  }

  const { characters, poetry, idioms, cache } = await getIndexes();

  return {
    indexes: {
      characters: characters.getStats(),
      poetry: poetry.getStats(),
      idioms: idioms.getStats(),
    },
    cache: cache.getStats(),
    initialized: true,
  };
}

/**
 * Clear search cache
 */
export function clearSearchCache(): void {
  if (searchCache) {
    searchCache.clear();
  }
}

/**
 * Reinitialize search indexes
 */
export async function reinitializeSearchIndexes(): Promise<void> {
  indexInitialized = false;
  characterIndex = null;
  poetryIndex = null;
  idiomIndex = null;
  searchCache = null;
  await initializeIndexes();
}

/**
 * Preload search indexes (call during app initialization)
 */
export async function preloadSearchIndexes(): Promise<void> {
  await initializeIndexes();
}
