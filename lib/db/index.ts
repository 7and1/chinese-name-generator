import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../drizzle/schema";

/**
 * Database connection utility using Drizzle ORM + PostgreSQL (Supabase)
 *
 * Performance optimizations:
 * - Connection pooling with postgres-js
 * - Prepared statements cache
 * - Health check functionality
 */

// Supabase PostgreSQL connection URL
// Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.SUPABASE_DATABASE_URL;

// Connection pool configuration
const DB_CONFIG = {
  // Max concurrent connections (Supabase free tier: 60 connections)
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || "10", 10),
  // Idle timeout before closing a connection (seconds)
  idle_timeout: parseInt(process.env.DB_IDLE_TIMEOUT || "20", 10),
  // Connection timeout (seconds)
  connect_timeout: parseInt(process.env.DB_TIMEOUT || "10", 10),
};

// Singleton postgres client instance
let clientInstance: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;
let connectionCount = 0;
let lastConnectTime = 0;

/**
 * Get or create postgres client (singleton pattern for connection reuse)
 */
export function getClient(): postgres.Sql {
  if (!clientInstance) {
    if (!databaseUrl) {
      throw new Error(
        "DATABASE_URL or SUPABASE_DATABASE_URL environment variable is required",
      );
    }

    clientInstance = postgres(databaseUrl, {
      max: DB_CONFIG.maxConnections,
      idle_timeout: DB_CONFIG.idle_timeout,
      connect_timeout: DB_CONFIG.connect_timeout,
      // Enable prepared statements for better performance
      prepare: true,
      // Connection type (for Supabase)
      connection: {
        application_name: "chinese-name-generator",
      },
    });

    connectionCount++;
    lastConnectTime = Date.now();

    console.log(
      `✓ Database connection established (pool size: ${DB_CONFIG.maxConnections})`,
    );
  }
  return clientInstance;
}

/**
 * Export client getter for direct queries (if needed)
 * Use getClient() instead of client to avoid initialization at import time
 */
export { getClient as client };

/**
 * Get or create Drizzle ORM instance (singleton pattern)
 */
export function getDb() {
  if (!dbInstance) {
    dbInstance = drizzle(getClient(), { schema });
  }
  return dbInstance;
}

/**
 * Export db getter for backward compatibility
 * Use getDb() to avoid initialization at import time
 */
export { getDb as db };

/**
 * Close database connection and reset singleton
 */
export async function closeDatabase(): Promise<void> {
  if (clientInstance) {
    await clientInstance.end();
    clientInstance = null;
    dbInstance = null;
    console.log("✓ Database connection closed");
  }
}

/**
 * Test database connection with performance metrics
 */
export async function testConnection(): Promise<{
  success: boolean;
  latency?: number;
  error?: string;
}> {
  const startTime = performance.now();
  try {
    const result = await getClient().unsafe("SELECT 1 as test");
    const latency = performance.now() - startTime;
    console.log(`✓ Database connection successful (${latency.toFixed(2)}ms)`);
    return { success: true, latency };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("✗ Database connection failed:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Get database connection statistics
 */
export function getConnectionStats(): {
  connectionCount: number;
  lastConnectTime: number;
  uptime: number;
  url: string;
  poolSize: number;
} {
  // Extract host from URL for display
  const urlObj = databaseUrl ? new URL(databaseUrl) : null;
  const displayUrl = urlObj
    ? `${urlObj.protocol}//${urlObj.hostname}:****@${urlObj.hostname}`
    : "not connected";

  return {
    connectionCount,
    lastConnectTime,
    uptime: lastConnectTime > 0 ? Date.now() - lastConnectTime : 0,
    url: displayUrl,
    poolSize: DB_CONFIG.maxConnections,
  };
}

/**
 * Execute a raw SQL query with error handling
 *
 * @template T - Expected row type
 * @param sql - SQL query string
 * @param params - Query parameters
 * @returns Query result rows
 *
 * @throws {Error} When query execution fails
 */
export async function executeRaw<T = unknown>(
  query: string,
  params?: unknown[],
): Promise<T[]> {
  try {
    const client = getClient();
    const result = await client.unsafe(query, params as never[]);
    return result as unknown as T[];
  } catch (error) {
    console.error("Raw query execution failed:", error);
    throw error;
  }
}

/**
 * Health check for database with detailed status
 */
export async function healthCheck(): Promise<{
  status: "healthy" | "unhealthy" | "degraded";
  latency?: number;
  error?: string;
  stats: ReturnType<typeof getConnectionStats>;
}> {
  const result = await testConnection();
  return {
    status: result.success ? "healthy" : "unhealthy",
    latency: result.latency,
    error: result.error,
    stats: getConnectionStats(),
  };
}

// Export schema for use in queries
export { schema };
