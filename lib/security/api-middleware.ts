/**
 * API security middleware
 *
 * Provides additional security layers for API routes:
 * - Request size limits
 * - Content-Type validation
 * - Origin validation
 * - Request logging for suspicious activity
 */

export interface SecurityMiddlewareConfig {
  maxBodySize?: number;
  allowedOrigins?: string[];
  requireContentType?: boolean;
  logSuspicious?: boolean;
}

interface SecurityCheckResult {
  allowed: boolean;
  statusCode?: number;
  code?: string;
  message?: string;
}

const DEFAULT_CONFIG: SecurityMiddlewareConfig = {
  maxBodySize: 1024 * 1024, // 1MB
  allowedOrigins: undefined, // Allow all if not specified
  requireContentType: true,
  logSuspicious: true,
};

/**
 * Check if request origin is allowed
 */
function validateOrigin(
  request: Request,
  allowedOrigins?: string[],
): SecurityCheckResult {
  if (!allowedOrigins || allowedOrigins.length === 0) {
    return { allowed: true };
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    // No origin header - could be same-origin or non-browser
    return { allowed: true };
  }

  const isAllowed = allowedOrigins.some((allowed) => {
    if (allowed === "*") return true;
    // Support wildcard subdomains
    if (allowed.startsWith("*.")) {
      const domain = allowed.slice(2);
      return origin.endsWith(domain);
    }
    return origin === allowed;
  });

  if (!isAllowed) {
    return {
      allowed: false,
      statusCode: 403,
      code: "FORBIDDEN_ORIGIN",
      message: "Origin not allowed",
    };
  }

  return { allowed: true };
}

/**
 * Validate Content-Type for POST/PUT/PATCH requests
 */
function validateContentType(request: Request): SecurityCheckResult {
  const method = request.method.toUpperCase();

  if (!["POST", "PUT", "PATCH"].includes(method)) {
    return { allowed: true };
  }

  const contentType = request.headers.get("content-type");

  // For POST requests, we generally expect JSON
  if (!contentType) {
    return {
      allowed: false,
      statusCode: 415,
      code: "MISSING_CONTENT_TYPE",
      message: "Content-Type header is required",
    };
  }

  // Only allow JSON content type
  if (!contentType.includes("application/json")) {
    return {
      allowed: false,
      statusCode: 415,
      code: "UNSUPPORTED_CONTENT_TYPE",
      message: "Only application/json is supported",
    };
  }

  return { allowed: true };
}

/**
 * Check request body size
 */
async function validateBodySize(
  request: Request,
  maxSize: number,
): Promise<SecurityCheckResult> {
  const contentLength = request.headers.get("content-length");

  if (contentLength) {
    const size = parseInt(contentLength, 10);
    if (size > maxSize) {
      return {
        allowed: false,
        statusCode: 413,
        code: "PAYLOAD_TOO_LARGE",
        message: `Request body exceeds maximum size of ${maxSize} bytes`,
      };
    }
  }

  // Also check actual body size by cloning and reading
  try {
    const clone = request.clone();
    const text = await clone.text();
    if (text.length > maxSize) {
      return {
        allowed: false,
        statusCode: 413,
        code: "PAYLOAD_TOO_LARGE",
        message: `Request body exceeds maximum size of ${maxSize} bytes`,
      };
    }
  } catch {
    // If we can't read the body, let it pass through to the handler
  }

  return { allowed: true };
}

/**
 * Log suspicious activity
 */
function logSuspiciousActivity(
  request: Request,
  reason: string,
  details?: Record<string, unknown>,
): void {
  const timestamp = new Date().toISOString();
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const url = request.url;

  console.warn("[SECURITY] Suspicious activity detected", {
    timestamp,
    ip,
    userAgent,
    url,
    reason,
    details,
  });
}

/**
 * Apply security middleware to an API handler
 */
export function withSecurityMiddleware<T extends Request>(
  handler: (request: T) => Promise<Response>,
  config: SecurityMiddlewareConfig = {},
): (request: T) => Promise<Response> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return async (request: T): Promise<Response> => {
    // Validate origin
    const originCheck = validateOrigin(request, finalConfig.allowedOrigins);
    if (!originCheck.allowed) {
      if (finalConfig.logSuspicious) {
        logSuspiciousActivity(request, "Forbidden origin", {
          origin: request.headers.get("origin"),
        });
      }
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: originCheck.code,
            message: originCheck.message,
          },
        }),
        {
          status: originCheck.statusCode || 403,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Validate Content-Type
    if (finalConfig.requireContentType) {
      const contentTypeCheck = validateContentType(request);
      if (!contentTypeCheck.allowed) {
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: contentTypeCheck.code,
              message: contentTypeCheck.message,
            },
          }),
          {
            status: contentTypeCheck.statusCode || 415,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // Validate body size
    if (finalConfig.maxBodySize) {
      const sizeCheck = await validateBodySize(
        request,
        finalConfig.maxBodySize,
      );
      if (!sizeCheck.allowed) {
        if (finalConfig.logSuspicious) {
          logSuspiciousActivity(request, "Payload too large", {
            contentLength: request.headers.get("content-length"),
            maxSize: finalConfig.maxBodySize,
          });
        }
        return new Response(
          JSON.stringify({
            success: false,
            error: {
              code: sizeCheck.code,
              message: sizeCheck.message,
            },
          }),
          {
            status: sizeCheck.statusCode || 413,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    }

    // All checks passed, proceed to handler
    return handler(request);
  };
}

/**
 * Combines rate limiting with security middleware
 */
export function withApiSecurity<T extends Request>(
  handler: (request: T) => Promise<Response>,
  endpoint: string,
  securityConfig?: SecurityMiddlewareConfig,
): (request: T) => Promise<Response> {
  // First apply security middleware, then rate limiting
  const withMiddleware = withSecurityMiddleware(handler, securityConfig);

  return async (request: T) => {
    // Import rate limit function dynamically to avoid circular dependency
    const { withRateLimit } = await import("./rate-limit");
    // Cast to Request to satisfy the rate limit function type
    const rateLimited = withRateLimit(
      withMiddleware as (request: Request) => Promise<Response>,
      endpoint,
    );
    return rateLimited(request as Request);
  };
}
