/**
 * Centralized error handling for API routes
 * Provides unified error response format and logging
 */

import { z } from "zod";
import { NextResponse } from "next/server";

// ============================================================================
// Error Types
// ============================================================================

/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    Error.captureStackTrace?.(this, ApiError);
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, "VALIDATION_ERROR", message, details);
    this.name = "ValidationError";
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} not found: ${identifier}`
      : `${resource} not found`;
    super(404, "NOT_FOUND", message, { resource, identifier });
    this.name = "NotFoundError";
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends ApiError {
  constructor(retryAfter: number) {
    super(
      429,
      "RATE_LIMIT_EXCEEDED",
      `Too many requests. Please try again in ${retryAfter} seconds.`,
      { retryAfter },
    );
    this.name = "RateLimitError";
  }
}

/**
 * Internal server error (500)
 */
export class InternalError extends ApiError {
  constructor(message: string = "Internal server error", details?: unknown) {
    super(500, "INTERNAL_ERROR", message, details);
    this.name = "InternalError";
  }
}

/**
 * Service unavailable error (503)
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = "Service temporarily unavailable") {
    super(503, "SERVICE_UNAVAILABLE", message);
    this.name = "ServiceUnavailableError";
  }
}

// ============================================================================
// Error Response Builder
// ============================================================================

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
  requestId?: string,
): NextResponse<ErrorResponse> {
  const body: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
      timestamp: new Date().toISOString(),
      ...(requestId && { requestId }),
    },
  };

  return NextResponse.json(body, {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

/**
 * Convert an ApiError to a NextResponse
 */
export function apiErrorToResponse(
  error: ApiError,
  requestId?: string,
): NextResponse<ErrorResponse> {
  return createErrorResponse(
    error.statusCode,
    error.code,
    error.message,
    error.details,
    requestId,
  );
}

// ============================================================================
// Error Handler Wrapper
// ============================================================================

/**
 * Wrap an API handler with error handling
 * Catches and logs errors, returns standardized error responses
 */
export function withErrorHandler<
  T extends (...args: unknown[]) => Promise<Response>,
>(
  handler: T,
  options?: {
    requestId?: string;
    logErrors?: boolean;
  },
): T {
  return (async (...args: unknown[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      // Log the error
      if (options?.logErrors !== false) {
        logError(error, options?.requestId);
      }

      // Handle known API errors
      if (error instanceof ApiError) {
        return apiErrorToResponse(error, options?.requestId);
      }

      // Handle Zod errors
      if (error instanceof z.ZodError) {
        return createErrorResponse(
          400,
          "VALIDATION_ERROR",
          "Request validation failed",
          { issues: error.issues },
          options?.requestId,
        );
      }

      // Handle unknown errors
      return createErrorResponse(
        500,
        "INTERNAL_ERROR",
        "An unexpected error occurred",
        process.env.NODE_ENV === "development"
          ? { message: String(error) }
          : undefined,
        options?.requestId,
      );
    }
  }) as T;
}

// ============================================================================
// Error Logging
// ============================================================================

interface ErrorLogEntry {
  timestamp: string;
  level: "error" | "warn";
  code?: string;
  message: string;
  stack?: string;
  details?: unknown;
  requestId?: string;
}

/**
 * Log an error with structured format
 */
export function logError(error: unknown, requestId?: string): void {
  const entry: ErrorLogEntry = {
    timestamp: new Date().toISOString(),
    level: "error",
    message: String(error),
    ...(requestId && { requestId }),
  };

  if (error instanceof ApiError) {
    entry.code = error.code;
    entry.message = error.message;
    entry.details = error.details;
  } else if (error instanceof Error) {
    entry.message = error.message;
    entry.stack = error.stack;
  }

  // Console error for development
  console.error("[API Error]", JSON.stringify(entry, null, 2));

  // In production, you would send this to a logging service
  // Example: Sentry, DataDog, CloudWatch, etc.
}

/**
 * Log a warning
 */
export function logWarning(message: string, details?: unknown): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level: "warn" as const,
    message,
    ...(details !== undefined && { details }),
  };

  console.warn("[API Warning]", JSON.stringify(entry, null, 2));
}

// ============================================================================
// Zod Error Helper
// ============================================================================

/**
 * Format Zod error for API response
 */
export function formatZodError(zodError: z.ZodError): {
  field: string;
  message: string;
  code: string;
}[] {
  return zodError.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

/**
 * Get the first error message from a Zod error
 */
export function getFirstZodError(zodError: z.ZodError): string {
  return zodError.issues[0]?.message || "Validation failed";
}

// ============================================================================
// Request ID Generation
// ============================================================================

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Extract or generate request ID from headers
 */
export function getRequestId(request: Request): string {
  const existingId = request.headers.get("x-request-id");
  if (existingId) {
    return existingId;
  }
  return generateRequestId();
}
