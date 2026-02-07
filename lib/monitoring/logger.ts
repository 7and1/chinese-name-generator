/**
 * Structured Logger Module
 *
 * Provides a unified logging interface with:
 * - Structured JSON output for production
 * - Colored console output for development
 * - Request ID tracing for distributed tracking
 * - Log levels (debug, info, warn, error)
 * - Context metadata attachment
 *
 * Usage:
 * ```ts
 * import { logger } from '@/lib/monitoring/logger';
 *
 * // Basic logging
 * logger.info('User logged in', { userId: '123' });
 *
 * // Error logging
 * logger.error('Database connection failed', { error: err });
 *
 * // With request context
 * const reqLogger = logger.withRequest(request);
 * reqLogger.info('Processing request');
 * ```
 */

// ============================================================================
// Types
// ============================================================================

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
  environment: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
}

export interface LoggerOptions {
  level?: LogLevel;
  requestId?: string;
  userId?: string;
  context?: LogContext;
}

// ============================================================================
// Constants
// ============================================================================

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: "\x1b[36m", // Cyan
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
};

const RESET_COLOR = "\x1b[0m";

/**
 * Get minimum log level from environment
 */
const getMinLogLevel = (): number => {
  const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel | undefined;
  return LOG_LEVELS[envLevel ?? "info"];
};

/**
 * Check if we're in development mode
 */
const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

/**
 * Check if structured logging is enabled
 */
const isStructuredLoggingEnabled = (): boolean => {
  return process.env.STRUCTURED_LOGGING === "true" || !isDevelopment();
};

// ============================================================================
// Formatter Functions
// ============================================================================

/**
 * Format error object for logging
 */
function formatError(error: unknown): LogEntry["error"] {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: isDevelopment() ? error.stack : undefined,
      code: (error as { code?: string }).code,
    };
  }
  if (typeof error === "string") {
    return {
      name: "Error",
      message: error,
    };
  }
  if (error && typeof error === "object") {
    return {
      name: (error as { name?: string }).name ?? "Error",
      message: (error as { message?: string }).message ?? String(error),
    };
  }
  return {
    name: "Error",
    message: String(error),
  };
}

/**
 * Format timestamp
 */
function formatTimestamp(): string {
  const now = new Date();
  return now.toISOString();
}

/**
 * Format log entry for console (development)
 */
function formatConsoleMessage(entry: LogEntry): string {
  const { level, message, requestId, context, error } = entry;
  const color = LEVEL_COLORS[level];

  const parts = [`${color}[${level.toUpperCase()}]${RESET_COLOR}`, message];

  if (requestId) {
    parts.push(`(\x1b[90m${requestId.slice(0, 8)}\x1b[0m)`);
  }

  if (error) {
    parts.push(
      `\n  ${color}Error: ${error.name}: ${error.message}${RESET_COLOR}`,
    );
    if (error.stack && isDevelopment()) {
      parts.push(
        `\n  ${color}Stack: ${error.stack.split("\n").join("\n    ")}${RESET_COLOR}`,
      );
    }
  }

  if (context && Object.keys(context).length > 0) {
    parts.push(
      `\n  ${JSON.stringify(context, null, 2).split("\n").join("\n    ")}`,
    );
  }

  return parts.join(" ");
}

/**
 * Format log entry as JSON (production)
 */
function formatJsonMessage(entry: LogEntry): string {
  return JSON.stringify(entry);
}

// ============================================================================
// Logger Class
// ============================================================================

export class Logger {
  private minLevel: number;
  private requestId?: string;
  private userId?: string;
  private baseContext: LogContext;

  constructor(options: LoggerOptions = {}) {
    this.minLevel = getMinLogLevel();
    this.requestId = options.requestId;
    this.userId = options.userId;
    this.baseContext = options.context ?? {};
  }

  /**
   * Create a new logger with additional context
   */
  withContext(context: LogContext): Logger {
    return new Logger({
      level: this.getLevelName(),
      requestId: this.requestId,
      userId: this.userId,
      context: { ...this.baseContext, ...context },
    });
  }

  /**
   * Create a new logger with request ID
   */
  withRequestId(requestId: string): Logger {
    return new Logger({
      level: this.getLevelName(),
      requestId,
      userId: this.userId,
      context: this.baseContext,
    });
  }

  /**
   * Create a new logger with user ID
   */
  withUserId(userId: string): Logger {
    return new Logger({
      level: this.getLevelName(),
      requestId: this.requestId,
      userId,
      context: this.baseContext,
    });
  }

  /**
   * Create a new logger from a Next.js request
   */
  withRequest(request: {
    headers: { get: (name: string) => string | null };
  }): Logger {
    const requestId =
      request.headers.get("x-request-id") ?? crypto.randomUUID();
    return this.withRequestId(requestId);
  }

  /**
   * Get current level name
   */
  private getLevelName(): LogLevel {
    for (const [level, value] of Object.entries(LOG_LEVELS)) {
      if (value === this.minLevel) return level as LogLevel;
    }
    return "info";
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    error?: unknown,
    context?: LogContext,
  ): void {
    // Check if level is enabled
    if (LOG_LEVELS[level] < this.minLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: formatTimestamp(),
      requestId: this.requestId,
      userId: this.userId,
      environment: process.env.NODE_ENV ?? "development",
      context: { ...this.baseContext, ...context },
    };

    if (error) {
      entry.error = formatError(error);
    }

    // Output based on environment
    if (isStructuredLoggingEnabled()) {
      // Structured JSON logging for production
      const jsonMessage = formatJsonMessage(entry);
      switch (level) {
        case "error":
          console.error(jsonMessage);
          break;
        case "warn":
          console.warn(jsonMessage);
          break;
        default:
          console.log(jsonMessage);
      }
    } else {
      // Pretty console output for development
      const consoleMessage = formatConsoleMessage(entry);
      switch (level) {
        case "error":
          console.error(consoleMessage);
          break;
        case "warn":
          console.warn(consoleMessage);
          break;
        default:
          console.log(consoleMessage);
      }
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: LogContext): void {
    this.log("debug", message, undefined, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    this.log("info", message, undefined, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log("warn", message, undefined, context);
  }

  /**
   * Log error
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    this.log("error", message, error, context);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, path: string, context?: LogContext): void {
    this.info(`${method} ${path}`, {
      ...context,
      type: "api_request",
      method,
      path,
    });
  }

  /**
   * Log API response
   */
  apiResponse(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext,
  ): void {
    const logLevel =
      statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    this.log(
      logLevel,
      `${method} ${path} ${statusCode} (${duration}ms)`,
      undefined,
      {
        ...context,
        type: "api_response",
        method,
        path,
        statusCode,
        duration,
      },
    );
  }

  /**
   * Log database query
   */
  dbQuery(query: string, duration?: number, context?: LogContext): void {
    const message = duration ? `DB Query (${duration}ms)` : "DB Query";
    this.debug(message, {
      ...context,
      type: "db_query",
      query: query.slice(0, 100), // Truncate long queries
    });
  }

  /**
   * Log cache operation
   */
  cache(
    operation: "hit" | "miss" | "set" | "delete",
    key: string,
    context?: LogContext,
  ): void {
    this.debug(`Cache ${operation}: ${key}`, {
      ...context,
      type: "cache",
      operation,
      key,
    });
  }

  /**
   * Log external service call
   */
  externalService(
    service: string,
    operation: string,
    duration?: number,
    context?: LogContext,
  ): void {
    this.info(`External service: ${service} - ${operation}`, {
      ...context,
      type: "external_service",
      service,
      operation,
      duration,
    });
  }
}

// ============================================================================
// Default Logger Instance
// ============================================================================

export const logger = new Logger();

// ============================================================================
// Request Context Helpers
// ============================================================================

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Get request ID from headers or generate a new one
 */
export function getOrCreateRequestId(headers: {
  get: (name: string) => string | null;
}): string {
  const existing = headers.get("x-request-id");
  if (existing) return existing;
  return generateRequestId();
}

// ============================================================================
// Re-exports
// ============================================================================

export default logger;
