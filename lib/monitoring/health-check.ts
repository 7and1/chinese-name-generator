/**
 * Health Check Module
 *
 * Provides utilities for checking the health of various system components:
 * - Database connectivity
 * - Cache status
 * - External service availability
 * - Memory and disk usage
 *
 * Usage:
 * ```ts
 * import { healthCheckRegistry } from '@/lib/monitoring/health-check';
 *
 * // Register a custom health check
 * healthCheckRegistry.register('my-service', async () => {
 *   // Check service health
 *   return { status: 'healthy', latency: 50 };
 * });
 *
 * // Run all health checks
 * const results = await healthCheckRegistry.checkAll();
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export interface HealthCheckResult {
  status: HealthStatus;
  latency?: number;
  error?: string;
  [key: string]: unknown;
}

export interface HealthCheckMetadata {
  name: string;
  description?: string;
  timeout?: number;
  critical?: boolean;
}

export type HealthCheckFunction = () => Promise<HealthCheckResult>;

export interface HealthCheckWithMetadata {
  fn: HealthCheckFunction;
  metadata: HealthCheckMetadata;
}

export interface SystemHealthSummary {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
  checks: Record<string, HealthCheckResult>;
  criticalFailures: string[];
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_TIMEOUT = 5000; // 5 seconds
const CRITICAL_CHECK_TIMEOUT = 10000; // 10 seconds for critical checks

// ============================================================================
// Health Check Registry
// ============================================================================

class HealthCheckRegistry {
  private checks = new Map<string, HealthCheckWithMetadata>();

  /**
   * Register a new health check
   *
   * @param key - Unique identifier for this health check
   * @param fn - Async function that performs the health check
   * @param metadata - Additional metadata about the check
   */
  register(
    key: string,
    fn: HealthCheckFunction,
    metadata?: Partial<HealthCheckMetadata>,
  ): void {
    this.checks.set(key, {
      fn,
      metadata: {
        name: metadata?.name ?? key,
        description: metadata?.description,
        timeout: metadata?.timeout ?? DEFAULT_TIMEOUT,
        critical: metadata?.critical ?? false,
      },
    });
  }

  /**
   * Unregister a health check
   */
  unregister(key: string): void {
    this.checks.delete(key);
  }

  /**
   * Get a registered health check
   */
  get(key: string): HealthCheckWithMetadata | undefined {
    return this.checks.get(key);
  }

  /**
   * Check if a health check is registered
   */
  has(key: string): boolean {
    return this.checks.has(key);
  }

  /**
   * Get all registered health check keys
   */
  keys(): string[] {
    return Array.from(this.checks.keys());
  }

  /**
   * Run a single health check with timeout
   *
   * @param key - Health check identifier
   * @returns Health check result
   */
  async check(key: string): Promise<HealthCheckResult> {
    const check = this.checks.get(key);
    if (!check) {
      return {
        status: "unhealthy",
        error: `Health check '${key}' not found`,
      };
    }

    const timeout = check.metadata.timeout ?? DEFAULT_TIMEOUT;

    try {
      const result = await Promise.race([
        check.fn(),
        new Promise<HealthCheckResult>((_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(`Health check '${key}' timed out after ${timeout}ms`),
              ),
            timeout,
          ),
        ),
      ]);
      return result;
    } catch (error) {
      return {
        status: "unhealthy",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Run all registered health checks in parallel
   *
   * @returns Object containing all health check results
   */
  async checkAll(): Promise<Record<string, HealthCheckResult>> {
    const keys = this.keys();
    const results: Record<string, HealthCheckResult> = {};

    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.check(key);
      }),
    );

    return results;
  }

  /**
   * Get overall system health summary
   *
   * @returns Health summary with overall status
   */
  async getSummary(uptime: number = 0): Promise<SystemHealthSummary> {
    const checks = await this.checkAll();

    // Determine overall status
    let overallStatus: HealthStatus = "healthy";
    const criticalFailures: string[] = [];

    for (const [key, result] of Object.entries(checks)) {
      const metadata = this.checks.get(key)?.metadata;

      if (result.status === "unhealthy") {
        if (metadata?.critical) {
          overallStatus = "unhealthy";
          criticalFailures.push(key);
        } else if (overallStatus !== "unhealthy") {
          overallStatus = "degraded";
        }
      } else if (result.status === "degraded" && overallStatus === "healthy") {
        overallStatus = "degraded";
      }
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime,
      checks,
      criticalFailures,
    };
  }
}

// ============================================================================
// Built-in Health Checks
// ============================================================================

/**
 * Memory health check
 * Returns degraded if heap usage > 80%, unhealthy if > 90%
 */
async function checkMemory(): Promise<HealthCheckResult> {
  const startTime = performance.now();
  const mem = process.memoryUsage();
  const heapUsedRatio = mem.heapUsed / mem.heapTotal;

  let status: HealthStatus = "healthy";
  if (heapUsedRatio > 0.9) {
    status = "unhealthy";
  } else if (heapUsedRatio > 0.8) {
    status = "degraded";
  }

  return {
    status,
    latency: performance.now() - startTime,
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    heapUsedRatio,
    rss: mem.rss,
    external: mem.external,
  };
}

/**
 * Disk space health check (if available)
 */
async function checkDiskSpace(): Promise<HealthCheckResult> {
  const startTime = performance.now();

  try {
    // Check if we can write to the data directory
    const fs = await import("node:fs");
    const path = await import("node:path");

    const dataDir = path.join(process.cwd(), "data");

    // Try to create a test file
    const testFile = path.join(dataDir, `.health-check-${Date.now()}`);
    await fs.promises.writeFile(testFile, "test");
    await fs.promises.unlink(testFile);

    return {
      status: "healthy",
      latency: performance.now() - startTime,
    };
  } catch (error) {
    return {
      status: "degraded",
      latency: performance.now() - startTime,
      error: error instanceof Error ? error.message : "Disk write check failed",
    };
  }
}

/**
 * CPU health check (load average)
 */
async function checkCpu(): Promise<HealthCheckResult> {
  const startTime = performance.now();

  const loadAvg =
    process.platform !== "win32" ? process.cpuUsage() : { user: 0, system: 0 };

  return {
    status: "healthy",
    latency: performance.now() - startTime,
    platform: process.platform,
    cpuUsage: loadAvg,
  };
}

/**
 * Event loop lag check
 */
async function checkEventLoop(): Promise<HealthCheckResult> {
  const startTime = performance.now();
  const start = Date.now();

  // Wait for next tick
  await new Promise((resolve) => setImmediate(resolve));

  const lag = Date.now() - start;
  let status: HealthStatus = "healthy";
  if (lag > 100) {
    status = "unhealthy";
  } else if (lag > 50) {
    status = "degraded";
  }

  return {
    status,
    latency: performance.now() - startTime,
    eventLoopLag: lag,
  };
}

// ============================================================================
// Initialize Registry with Built-in Checks
// ============================================================================

export const healthCheckRegistry = new HealthCheckRegistry();

// Register built-in health checks
healthCheckRegistry.register("memory", checkMemory, {
  name: "Memory",
  description: "Checks heap memory usage",
  critical: true,
});

healthCheckRegistry.register("disk", checkDiskSpace, {
  name: "Disk Space",
  description: "Checks disk write availability",
  critical: false,
});

healthCheckRegistry.register("cpu", checkCpu, {
  name: "CPU",
  description: "Checks CPU usage",
  critical: false,
});

healthCheckRegistry.register("event-loop", checkEventLoop, {
  name: "Event Loop",
  description: "Checks event loop lag",
  critical: true,
});

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Run all health checks and return a summary
 */
export async function getHealthSummary(
  uptime: number = 0,
): Promise<SystemHealthSummary> {
  return healthCheckRegistry.getSummary(uptime);
}

/**
 * Check if the system is healthy
 */
export async function isHealthy(): Promise<boolean> {
  const summary = await getHealthSummary();
  return summary.status === "healthy";
}

/**
 * Get health status for a specific check
 */
export async function getHealthStatus(key: string): Promise<HealthCheckResult> {
  return healthCheckRegistry.check(key);
}

// ============================================================================
// Re-exports
// ============================================================================

export {
  healthCheckRegistry as registry,
  HealthCheckRegistry,
  checkMemory,
  checkDiskSpace,
  checkCpu,
  checkEventLoop,
};
