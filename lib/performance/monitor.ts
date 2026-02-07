/**
 * Performance Monitoring Module
 *
 * Features:
 * - Operation timing
 * - Slow query logging
 * - Performance statistics
 * - Metric aggregation
 */

// ============================================================================
// Types
// ============================================================================

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface OperationStats {
  count: number;
  totalDuration: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface SlowQueryThreshold {
  [operation: string]: number; // Duration in milliseconds
}

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_SLOW_THRESHOLDS: SlowQueryThreshold = {
  generateNames: 1000, // 1 second
  calculateBaZi: 50, // 50ms
  calculateNameScore: 100, // 100ms
  analyzeWuge: 50, // 50ms
  analyzePhonetics: 50, // 50ms
  getCharacters: 10, // 10ms
};

// ============================================================================
// Performance Monitor Implementation
// ============================================================================

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private slowQueries: PerformanceMetric[] = [];
  private thresholds: SlowQueryThreshold;
  private maxMetricsPerOperation = 1000;
  private maxSlowQueries = 100;

  constructor(thresholds: SlowQueryThreshold = {}) {
    this.thresholds = { ...DEFAULT_SLOW_THRESHOLDS, ...thresholds };
  }

  /**
   * Start timing an operation
   * Returns a function that when called, records the duration
   */
  start(operationName: string): () => void {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.record(operationName, duration);
    };
  }

  /**
   * Record a performance metric
   */
  record(
    operationName: string,
    duration: number,
    metadata?: Record<string, unknown>,
  ): void {
    const metric: PerformanceMetric = {
      name: operationName,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    // Store metric
    if (!this.metrics.has(operationName)) {
      this.metrics.set(operationName, []);
    }

    const metrics = this.metrics.get(operationName)!;
    metrics.push(metric);

    // Keep only recent metrics
    if (metrics.length > this.maxMetricsPerOperation) {
      metrics.shift();
    }

    // Check if this is a slow query
    const threshold = this.thresholds[operationName] || 1000;
    if (duration > threshold) {
      this.slowQueries.push(metric);

      // Keep only recent slow queries
      if (this.slowQueries.length > this.maxSlowQueries) {
        this.slowQueries.shift();
      }

      // Log to console in development
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[Performance] Slow ${operationName}: ${duration.toFixed(2)}ms`,
        );
      }
    }
  }

  /**
   * Time an async operation
   */
  async time<T>(
    operationName: string,
    fn: () => Promise<T>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    metadata?: Record<string, unknown>,
  ): Promise<T> {
    const end = this.start(operationName);
    try {
      const result = await fn();
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  }

  /**
   * Time a sync operation
   */
  timeSync<T>(
    operationName: string,
    fn: () => T,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    metadata?: Record<string, unknown>,
  ): T {
    const end = this.start(operationName);
    try {
      const result = fn();
      end();
      return result;
    } catch (error) {
      end();
      throw error;
    }
  }

  /**
   * Get statistics for an operation
   */
  getStats(operationName: string): OperationStats | null {
    const metrics = this.metrics.get(operationName);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const durations = metrics.map((m) => m.duration).sort((a, b) => a - b);
    const count = durations.length;
    const total = durations.reduce((sum, d) => sum + d, 0);

    return {
      count,
      totalDuration: total,
      avgDuration: total / count,
      minDuration: durations[0],
      maxDuration: durations[count - 1],
      p50: this.percentile(durations, 50),
      p95: this.percentile(durations, 95),
      p99: this.percentile(durations, 99),
    };
  }

  /**
   * Get all statistics
   */
  getAllStats(): Record<string, OperationStats> {
    const result: Record<string, OperationStats> = {};

    for (const [operationName] of this.metrics) {
      const stats = this.getStats(operationName);
      if (stats) {
        result[operationName] = stats;
      }
    }

    return result;
  }

  /**
   * Get slow queries
   */
  getSlowQueries(): PerformanceMetric[] {
    return [...this.slowQueries];
  }

  /**
   * Get slow queries for a specific operation
   */
  getSlowQueriesFor(operationName: string): PerformanceMetric[] {
    return this.slowQueries.filter((m) => m.name === operationName);
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.slowQueries = [];
  }

  /**
   * Clear metrics for a specific operation
   */
  clearOperation(operationName: string): void {
    this.metrics.delete(operationName);
  }

  /**
   * Calculate percentile
   */
  private percentile(sortedArray: number[], p: number): number {
    const index = Math.ceil((p / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
  }

  /**
   * Get a summary of all performance data
   */
  getSummary(): {
    operations: Record<string, OperationStats>;
    slowQueries: PerformanceMetric[];
    totalOperations: number;
    totalSlowQueries: number;
  } {
    return {
      operations: this.getAllStats(),
      slowQueries: this.getSlowQueries(),
      totalOperations: Array.from(this.metrics.values()).reduce(
        (sum, metrics) => sum + metrics.length,
        0,
      ),
      totalSlowQueries: this.slowQueries.length,
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let monitorInstance: PerformanceMonitor | null = null;

/**
 * Get the global performance monitor instance
 */
export function getPerformanceMonitor(): PerformanceMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceMonitor();
  }
  return monitorInstance;
}

/**
 * Create a new performance monitor with custom thresholds
 */
export function createPerformanceMonitor(
  thresholds?: SlowQueryThreshold,
): PerformanceMonitor {
  return new PerformanceMonitor(thresholds);
}

// ============================================================================
// Decorator Helper (for TypeScript)
// ============================================================================

/**
 * Decorator to time method execution
 *
 * @param operationName - Optional name for the operation. Defaults to `className.methodName`
 * @returns A method decorator that tracks execution time
 *
 * @example
 * ```ts
 * class MyService {
 *   @timed('processData')
 *   async process(items: Item[]) { ... }
 * }
 * ```
 */
export function timed(operationName?: string): MethodDecorator {
  return function (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const key = String(propertyKey);
    const className = extractClassName(target);
    const name = operationName || `${className}.${key}`;

    descriptor.value = async function (...args: unknown[]) {
      const monitor = getPerformanceMonitor();
      return monitor.time(name, () => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}

/**
 * Extract class name from a target object
 *
 * @param target - The target object (usually `this` in a decorator)
 * @returns The class name or "Unknown" if not determinable
 */
function extractClassName(target: unknown): string {
  if (target && typeof target === "object") {
    const constructor = (target as Record<string, unknown>).constructor;
    if (constructor && typeof constructor === "function" && constructor.name) {
      return constructor.name;
    }
  }
  return "Unknown";
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Measure an async operation
 */
export async function measure<T>(
  operationName: string,
  fn: () => Promise<T>,
): Promise<T> {
  const monitor = getPerformanceMonitor();
  return monitor.time(operationName, fn);
}

/**
 * Measure a sync operation
 */
export function measureSync<T>(operationName: string, fn: () => T): T {
  const monitor = getPerformanceMonitor();
  return monitor.timeSync(operationName, fn);
}

/**
 * Create a performance timer
 */
export function createTimer(operationName: string): () => number {
  const startTime = performance.now();

  return () => {
    const duration = performance.now() - startTime;
    const monitor = getPerformanceMonitor();
    monitor.record(operationName, duration);
    return duration;
  };
}

/**
 * Get formatted performance report
 */
export function getPerformanceReport(): string {
  const monitor = getPerformanceMonitor();
  const summary = monitor.getSummary();

  let report = "=== Performance Report ===\n\n";

  // Operations
  report += "Operations:\n";
  for (const [name, stats] of Object.entries(summary.operations)) {
    report += `  ${name}:\n`;
    report += `    Count: ${stats.count}\n`;
    report += `    Avg: ${stats.avgDuration.toFixed(2)}ms\n`;
    report += `    Min: ${stats.minDuration.toFixed(2)}ms\n`;
    report += `    Max: ${stats.maxDuration.toFixed(2)}ms\n`;
    report += `    P95: ${stats.p95.toFixed(2)}ms\n`;
    report += `    P99: ${stats.p99.toFixed(2)}ms\n`;
  }

  // Slow queries
  if (summary.slowQueries.length > 0) {
    report += "\nSlow Queries:\n";
    for (const query of summary.slowQueries) {
      report += `  ${query.name}: ${query.duration.toFixed(2)}ms\n`;
      if (query.metadata) {
        report += `    Metadata: ${JSON.stringify(query.metadata)}\n`;
      }
    }
  }

  report += `\nTotal Operations: ${summary.totalOperations}\n`;
  report += `Total Slow Queries: ${summary.totalSlowQueries}\n`;

  return report;
}
