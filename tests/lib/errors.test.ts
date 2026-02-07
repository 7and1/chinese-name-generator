/**
 * API Errors Tests
 *
 * Tests for error handling utilities and error response builders
 */

import { describe, expect, it, beforeEach } from "vitest";
import {
  ApiError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  InternalError,
  ServiceUnavailableError,
  createErrorResponse,
  apiErrorToResponse,
  withErrorHandler,
} from "@/lib/api/errors";
import { ZodError } from "zod";

describe("ApiError", () => {
  it("creates base API error with correct properties", () => {
    const error = new ApiError(500, "TEST_ERROR", "Test error message");

    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("TEST_ERROR");
    expect(error.message).toBe("Test error message");
    expect(error.name).toBe("ApiError");
    expect(error.details).toBeUndefined();
  });

  it("creates API error with details", () => {
    const details = { field: "value" };
    const error = new ApiError(
      400,
      "VALIDATION_ERROR",
      "Invalid input",
      details,
    );

    expect(error.details).toEqual(details);
  });
});

describe("ValidationError", () => {
  it("creates validation error with status 400", () => {
    const error = new ValidationError("Invalid surname");

    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.message).toBe("Invalid surname");
    expect(error.name).toBe("ValidationError");
  });

  it("creates validation error with details", () => {
    const details = { field: "surname", issue: "too long" };
    const error = new ValidationError("Invalid data", details);

    expect(error.details).toEqual(details);
  });
});

describe("NotFoundError", () => {
  it("creates not found error with resource only", () => {
    const error = new NotFoundError("Character");

    expect(error.statusCode).toBe(404);
    expect(error.code).toBe("NOT_FOUND");
    expect(error.message).toBe("Character not found");
    expect(error.name).toBe("NotFoundError");
    expect(error.details).toEqual({
      resource: "Character",
      identifier: undefined,
    });
  });

  it("creates not found error with resource and identifier", () => {
    const error = new NotFoundError("Name", "李明华");

    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Name not found: 李明华");
    expect(error.details).toEqual({ resource: "Name", identifier: "李明华" });
  });
});

describe("RateLimitError", () => {
  it("creates rate limit error with retry after", () => {
    const error = new RateLimitError(60);

    expect(error.statusCode).toBe(429);
    expect(error.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(error.message).toBe(
      "Too many requests. Please try again in 60 seconds.",
    );
    expect(error.name).toBe("RateLimitError");
    expect(error.details).toEqual({ retryAfter: 60 });
  });
});

describe("InternalError", () => {
  it("creates internal error with default message", () => {
    const error = new InternalError();

    expect(error.statusCode).toBe(500);
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.message).toBe("Internal server error");
    expect(error.name).toBe("InternalError");
  });

  it("creates internal error with custom message", () => {
    const error = new InternalError("Database connection failed");

    expect(error.message).toBe("Database connection failed");
  });

  it("creates internal error with details", () => {
    const details = { originalError: "Connection timeout" };
    const error = new InternalError("Failed", details);

    expect(error.details).toEqual(details);
  });
});

describe("ServiceUnavailableError", () => {
  it("creates service unavailable error with default message", () => {
    const error = new ServiceUnavailableError();

    expect(error.statusCode).toBe(503);
    expect(error.code).toBe("SERVICE_UNAVAILABLE");
    expect(error.message).toBe("Service temporarily unavailable");
    expect(error.name).toBe("ServiceUnavailableError");
  });

  it("creates service unavailable error with custom message", () => {
    const error = new ServiceUnavailableError("Maintenance mode");

    expect(error.message).toBe("Maintenance mode");
  });
});

describe("createErrorResponse", () => {
  it("creates error response with basic properties", async () => {
    const response = createErrorResponse(400, "TEST_CODE", "Test message");
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("TEST_CODE");
    expect(json.error.message).toBe("Test message");
    expect(json.error.details).toBeUndefined();
    expect(json.error.timestamp).toBeDefined();
  });

  it("creates error response with details", async () => {
    const details = { field: "surname" };
    const response = createErrorResponse(
      400,
      "VALIDATION_ERROR",
      "Invalid",
      details,
    );
    const json = await response.json();

    expect(json.error.details).toEqual(details);
  });

  it("creates error response with request ID", async () => {
    const response = createErrorResponse(
      500,
      "ERROR",
      "Message",
      undefined,
      "req-123",
    );
    const json = await response.json();

    expect(json.error.requestId).toBe("req-123");
  });
});

describe("apiErrorToResponse", () => {
  it("converts ApiError to NextResponse", async () => {
    const error = new ValidationError("Invalid input");
    const response = apiErrorToResponse(error);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
    expect(json.error.message).toBe("Invalid input");
  });

  it("includes request ID in response", async () => {
    const error = new NotFoundError("Resource", "123");
    const response = apiErrorToResponse(error, "req-456");
    const json = await response.json();

    expect(json.error.requestId).toBe("req-456");
  });
});

describe("withErrorHandler", () => {
  it("wraps handler and returns successful response", async () => {
    const handler = async () => {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };
    const wrapped = withErrorHandler(handler);

    const response = await wrapped();
    expect(response.status).toBe(200);
  });

  it("catches ApiError and returns error response", async () => {
    const handler = async () => {
      throw new ValidationError("Test error");
    };
    const wrapped = withErrorHandler(handler, { logErrors: false });

    const response = await wrapped();
    expect(response.status).toBe(400);
  });

  it("catches ZodError and returns validation error response", async () => {
    const handler = async () => {
      throw new ZodError([
        {
          code: "invalid_type",
          path: ["field"],
          message: "Required",
          expected: "string",
          received: "undefined",
        },
      ]);
    };
    const wrapped = withErrorHandler(handler, { logErrors: false });

    const response = await wrapped();
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.code).toBe("VALIDATION_ERROR");
    expect(json.error.details).toBeDefined();
    expect(json.error.details.issues).toBeInstanceOf(Array);
  });

  it("catches generic Error and returns internal error response", async () => {
    const handler = async () => {
      throw new Error("Unexpected error");
    };
    const wrapped = withErrorHandler(handler, { logErrors: false });

    const response = await wrapped();
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error.code).toBe("INTERNAL_ERROR");
  });

  it("passes arguments to wrapped handler", async () => {
    const handler = async (a: number, b: string) => {
      return new Response(JSON.stringify({ a, b }), { status: 200 });
    };
    const wrapped = withErrorHandler(handler);

    const response = await wrapped(42, "test");
    const json = await response.json();

    expect(json.a).toBe(42);
    expect(json.b).toBe("test");
  });

  it("includes request ID in error response", async () => {
    const handler = async () => {
      throw new NotFoundError("Resource");
    };
    const wrapped = withErrorHandler(handler, {
      requestId: "req-789",
      logErrors: false,
    });

    const response = await wrapped();
    const json = await response.json();

    expect(json.error.requestId).toBe("req-789");
  });
});
