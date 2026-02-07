/**
 * Memory Cache Implementation with LRU Eviction
 *
 * Features:
 * - TTL (Time To Live) support
 * - LRU (Least Recently Used) eviction
 * - Maximum size limit
 * - Cache statistics
 * - Memory monitoring
 *
 * MEMORY MANAGEMENT:
 * - Cache instances have configurable maxSize to prevent unbounded growth
 * - LRU eviction automatically removes least recently used entries when full
 * - Automatic cleanup of expired entries runs periodically
 * - Call getStats() to monitor cache health in production
 *
 * PRODUCTION MONITORING:
 * - Track hitRate: should be > 0.7 for effective caching
 * - Monitor evictions: high values indicate undersized cache
 * - Monitor size vs maxSize: approaching 100% increases evictions
 */

// ============================================================================
// Cache Entry Types
// ============================================================================

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  lastAccessed: number;
  accessCount: number;
}

export interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  evictions: number;
  expirations: number;
}

export interface CacheOptions {
  maxSize?: number;
  defaultTTL?: number;
  cleanupInterval?: number;
}

// ============================================================================
// Memory Cache Implementation
// ============================================================================

export class MemoryCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number;
  private defaultTTL: number;
  private cleanupInterval: number;
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    expirations: 0,
  };

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize ?? 1000;
    this.defaultTTL = options.defaultTTL ?? 60 * 60 * 1000; // 1 hour
    this.cleanupInterval = options.cleanupInterval ?? 5 * 60 * 1000; // 5 minutes

    // Start automatic cleanup
    this.startCleanup();
  }

  /**
   * Get a value from cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.expirations++;
      this.stats.misses++;
      return undefined;
    }

    // Update access info for LRU
    entry.lastAccessed = Date.now();
    entry.accessCount++;
    this.stats.hits++;

    return entry.value;
  }

  /**
   * Set a value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    // Check if we need to evict
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLRU();
    }

    const now = Date.now();
    const entryTTL = ttl ?? this.defaultTTL;

    this.cache.set(key, {
      value,
      expiresAt: now + entryTTL,
      lastAccessed: now,
      accessCount: 0,
    });
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.expirations++;
      return false;
    }
    return true;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      expirations: 0,
    };
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      evictions: this.stats.evictions,
      expirations: this.stats.expirations,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      expirations: 0,
    };
  }

  /**
   * Get or set pattern - returns cached value or computes and caches it
   */
  async getOrSet(
    key: string,
    compute: () => T | Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cached = this.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await compute();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let oldestTime = Infinity;
    let lowestAccessCount = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      // First compare by last accessed time
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        lowestAccessCount = entry.accessCount;
        lruKey = key;
      } else if (
        entry.lastAccessed === oldestTime &&
        entry.accessCount < lowestAccessCount
      ) {
        // If times are equal, use access count as tiebreaker
        lowestAccessCount = entry.accessCount;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.evictions++;
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    // Use Array.from to avoid iterator issues
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key);
      this.stats.expirations++;
    }
  }

  /**
   * Start automatic cleanup interval
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Stop automatic cleanup
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Destroy cache and cleanup timer
   */
  destroy(): void {
    this.stopCleanup();
    this.clear();
  }

  /**
   * Get all keys (for debugging)
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all entries (for debugging)
   */
  entries(): Array<[string, CacheEntry<T>]> {
    return Array.from(this.cache.entries());
  }

  /**
   * Get memory health status
   * Returns information about cache utilization and recommendations
   */
  getMemoryHealth(): {
    utilization: number; // 0-1, ratio of current size to max size
    status: "healthy" | "warning" | "critical";
    recommendation: string;
  } {
    const utilization = this.cache.size / this.maxSize;

    let status: "healthy" | "warning" | "critical";
    let recommendation: string;

    if (utilization < 0.7) {
      status = "healthy";
      recommendation = "Cache size is adequate.";
    } else if (utilization < 0.9) {
      status = "warning";
      recommendation = "Consider increasing maxSize to reduce evictions.";
    } else {
      status = "critical";
      recommendation = "Cache is nearly full. Increase maxSize immediately.";
    }

    return { utilization, status, recommendation };
  }
}

// ============================================================================
// Singleton Cache Instances
// ============================================================================

let baziCacheInstance: MemoryCache | null = null;
let nameScoreCacheInstance: MemoryCache | null = null;
let wugeCacheInstance: MemoryCache | null = null;
let phoneticsCacheInstance: MemoryCache | null = null;
let characterCacheInstance: MemoryCache | null = null;

/**
 * Get or create BaZi cache instance
 */
export function getBaziCache(): MemoryCache {
  if (!baziCacheInstance) {
    baziCacheInstance = new MemoryCache({
      maxSize: 10000,
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  return baziCacheInstance;
}

/**
 * Get or create name score cache instance
 */
export function getNameScoreCache(): MemoryCache {
  if (!nameScoreCacheInstance) {
    nameScoreCacheInstance = new MemoryCache({
      maxSize: 5000,
      defaultTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
  return nameScoreCacheInstance;
}

/**
 * Get or create Wuge cache instance
 */
export function getWugeCache(): MemoryCache {
  if (!wugeCacheInstance) {
    wugeCacheInstance = new MemoryCache({
      maxSize: 2000,
      defaultTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
  return wugeCacheInstance;
}

/**
 * Get or create phonetics cache instance
 */
export function getPhoneticsCache(): MemoryCache {
  if (!phoneticsCacheInstance) {
    phoneticsCacheInstance = new MemoryCache({
      maxSize: 1000,
      defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
    });
  }
  return phoneticsCacheInstance;
}

/**
 * Get or create character cache instance
 */
export function getCharacterCache(): MemoryCache {
  if (!characterCacheInstance) {
    characterCacheInstance = new MemoryCache({
      maxSize: 20000,
      defaultTTL: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
  return characterCacheInstance;
}

/**
 * Clear all cache instances
 */
export function clearAllCaches(): void {
  getBaziCache().clear();
  getNameScoreCache().clear();
  getWugeCache().clear();
  getPhoneticsCache().clear();
  getCharacterCache().clear();
}

/**
 * Get statistics for all cache instances
 */
export function getAllCacheStats(): Record<string, CacheStats> {
  return {
    bazi: getBaziCache().getStats(),
    nameScore: getNameScoreCache().getStats(),
    wuge: getWugeCache().getStats(),
    phonetics: getPhoneticsCache().getStats(),
    character: getCharacterCache().getStats(),
  };
}

/**
 * Get memory health status for all cache instances
 */
export function getAllMemoryHealth(): Record<
  string,
  ReturnType<MemoryCache<unknown>["getMemoryHealth"]>
> {
  return {
    bazi: getBaziCache().getMemoryHealth(),
    nameScore: getNameScoreCache().getMemoryHealth(),
    wuge: getWugeCache().getMemoryHealth(),
    phonetics: getPhoneticsCache().getMemoryHealth(),
    character: getCharacterCache().getMemoryHealth(),
  };
}

/**
 * Get overall system memory statistics for caches
 */
export function getSystemMemoryStats(): {
  heapUsed: number;
  heapTotal: number;
  rss: number;
  external: number;
  totalCacheSize: number;
  cacheMemoryRatio: number;
} {
  const mem = process.memoryUsage();
  const cacheStats = getAllCacheStats();
  const totalCacheSize = Object.values(cacheStats).reduce(
    (sum, stat) => sum + stat.size,
    0,
  );

  return {
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    rss: mem.rss,
    external: mem.external,
    totalCacheSize,
    cacheMemoryRatio: mem.heapUsed > 0 ? totalCacheSize / mem.heapUsed : 0,
  };
}
