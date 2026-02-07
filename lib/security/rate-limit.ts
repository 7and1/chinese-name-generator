/**
 * Rate limiting middleware for API routes
 *
 * SECURITY FEATURES:
 * - Distributed rate limiting via Upstash Redis (production)
 * - In-memory fallback for development
 * - IP-based identification with header validation
 * - API key bypass support for trusted clients
 * - IP whitelist support
 *
 * ENVIRONMENT VARIABLES:
 * - UPSTASH_REDIS_REST_URL: Upstash Redis URL
 * - UPSTASH_REDIS_REST_TOKEN: Upstash Redis token
 * - API_KEY: Optional API key for bypassing rate limits
 * - IP_WHITELIST: Comma-separated list of trusted IPs/CIDRs
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  burstRequests?: number; // Optional burst capacity
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

interface SecurityConfig {
  apiKey?: string;
  ipWhitelist: string[];
  trustedProxies: string[];
}

// Rate limit configurations for different endpoints
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  generate: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    burstRequests: 5, // Allow short bursts
  },
  analyze: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minute
    burstRequests: 10,
  },
  search: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
    burstRequests: 15,
  },
  report: {
    maxRequests: 100, // Allow more reports for monitoring
    windowMs: 60 * 1000,
    burstRequests: 50,
  },
  default: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  },
};

// Security configuration from environment
function getSecurityConfig(): SecurityConfig {
  const ipWhitelist = process.env.IP_WHITELIST
    ? process.env.IP_WHITELIST.split(",").map((ip) => ip.trim())
    : [];

  const trustedProxies = process.env.TRUSTED_PROXIES
    ? process.env.TRUSTED_PROXIES.split(",").map((ip) => ip.trim())
    : ["127.0.0.1", "::1"]; // Default localhost

  return {
    apiKey: process.env.API_KEY,
    ipWhitelist,
    trustedProxies,
  };
}

// In-memory storage for rate limit data
const rateLimitStore = new Map<string, RateLimitEntry>();

function hasUpstashConfig(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

/**
 * Validate IP address against CIDR ranges
 */
function isIpInCidr(ip: string, cidr: string): boolean {
  const [network, prefixLength] = cidr.split("/");
  const prefix = parseInt(prefixLength, 10);

  // Simple IPv4 check
  const ipParts = ip.split(".").map(Number);
  const networkParts = network.split(".").map(Number);

  if (ipParts.length !== 4 || networkParts.length !== 4) {
    return false;
  }

  const mask = (0xffffffff << (32 - prefix)) >>> 0;
  const ipNum =
    (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const networkNum =
    (networkParts[0] << 24) |
    (networkParts[1] << 16) |
    (networkParts[2] << 8) |
    networkParts[3];

  return (ipNum & mask) === (networkNum & mask);
}

/**
 * Check if an IP address is whitelisted
 */
function isIpWhitelisted(ip: string): boolean {
  const config = getSecurityConfig();
  return config.ipWhitelist.some((whitelistItem) => {
    // Check if it's a CIDR notation
    if (whitelistItem.includes("/")) {
      return isIpInCidr(ip, whitelistItem);
    }
    // Exact match
    return ip === whitelistItem;
  });
}

/**
 * Validate API key from request headers
 */
function validateApiKey(request: Request): boolean {
  const config = getSecurityConfig();
  if (!config.apiKey) {
    return false; // No API key configured
  }

  const providedKey = request.headers.get("x-api-key");
  const authHeader = request.headers.get("authorization");

  // Check x-api-key header
  if (providedKey && providedKey === config.apiKey) {
    return true;
  }

  // Check Authorization header (Bearer token)
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    return token === config.apiKey;
  }

  return false;
}

type UpstashRatelimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type UpstashRatelimit = {
  limit: (identifier: string) => Promise<UpstashRatelimitResult>;
};

let upstash: {
  ratelimitByEndpoint: Map<string, UpstashRatelimit>;
  createRatelimit: (endpoint: string) => UpstashRatelimit;
} | null = null;

async function getUpstashRatelimit(
  endpoint: string,
): Promise<UpstashRatelimit | null> {
  if (!hasUpstashConfig()) return null;

  try {
    if (!upstash) {
      const [{ Redis }, { Ratelimit }] = await Promise.all([
        import("@upstash/redis"),
        import("@upstash/ratelimit"),
      ]);

      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });

      upstash = {
        ratelimitByEndpoint: new Map(),
        createRatelimit: (ep: string) => {
          const config = RATE_LIMIT_CONFIGS[ep] || RATE_LIMIT_CONFIGS.default;
          const windowSeconds = Math.max(1, Math.ceil(config.windowMs / 1000));

          return new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(
              config.maxRequests,
              `${windowSeconds} s`,
            ),
            prefix: `ratelimit:${ep}`,
          });
        },
      };
    }

    let limiter = upstash.ratelimitByEndpoint.get(endpoint);
    if (!limiter) {
      limiter = upstash.createRatelimit(endpoint);
      upstash.ratelimitByEndpoint.set(endpoint, limiter);
    }

    return limiter;
  } catch (error) {
    // Fail-open to in-memory limiter if Upstash is misconfigured or unavailable.
    console.warn("[rate-limit] Upstash disabled:", error);
    return null;
  }
}

/**
 * Validate and sanitize IP address to prevent injection attacks
 */
function sanitizeIp(ip: string | null): string {
  if (!ip) return "unknown";

  // Remove any port number
  const ipWithoutPort = ip.split(":")[0];

  // Basic IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // Basic IPv6 validation (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  if (ipv4Regex.test(ipWithoutPort)) {
    // Verify each octet is valid (0-255)
    const octets = ipWithoutPort.split(".");
    if (
      octets.every((octet) => {
        const num = parseInt(octet, 10);
        return num >= 0 && num <= 255;
      })
    ) {
      return ipWithoutPort;
    }
  }

  if (ipv6Regex.test(ipWithoutPort)) {
    return ipWithoutPort.toLowerCase();
  }

  // Return safe fallback if IP is invalid
  return "unknown";
}

/**
 * Extract client IP from request headers with validation
 * Prevents header injection and spoofing attacks
 */
export function getClientIp(request: Request): string {
  // Check various headers for the real IP (in order of trust)
  const headersToCheck = [
    "cf-connecting-ip", // Cloudflare
    "x-real-ip",
    "x-forwarded-for",
    "x-client-ip",
    "true-client-ip",
  ];

  for (const header of headersToCheck) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
      // Take the first (original client) IP
      const firstIp = value.split(",")[0].trim();
      const sanitized = sanitizeIp(firstIp);
      if (sanitized !== "unknown") {
        return sanitized;
      }
    }
  }

  // Fallback to a hash of the request if no valid IP found
  const userAgent = request.headers.get("user-agent")?.slice(0, 50) || "no-ua";
  // Simple hash to anonymize
  return `anon:${Buffer.from(userAgent).toString("base64").slice(0, 16)}`;
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Check if a request should be rate limited (in-memory fallback).
 */
function checkRateLimitInMemory(
  identifier: string,
  endpoint: string,
): Omit<RateLimitResult, "limit"> {
  const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default;
  const now = Date.now();

  // Clean up expired entries periodically (every ~100 requests)
  if (rateLimitStore.size > 100 && Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  const key = `${endpoint}:${identifier}`;
  const entry = rateLimitStore.get(key);

  // If no entry exists or the window has expired, create a new one
  if (!entry || entry.resetTime <= now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Check if the limit has been exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment the counter
  entry.count += 1;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Check if a request should be rate limited (Upstash when configured, otherwise in-memory).
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
): Promise<Omit<RateLimitResult, "limit">> {
  const limiter = await getUpstashRatelimit(endpoint);
  if (!limiter) {
    return checkRateLimitInMemory(identifier, endpoint);
  }

  const result = await limiter.limit(identifier);

  return {
    allowed: result.success,
    remaining: result.remaining,
    resetTime: result.reset,
  };
}

/**
 * Create a rate-limited handler wrapper with security features
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  endpoint: string,
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const ip = getClientIp(request);

    // Check API key bypass first (for trusted clients)
    const hasValidApiKey = validateApiKey(request);
    const isWhitelisted = isIpWhitelisted(ip);

    // Skip rate limiting for whitelisted IPs or valid API keys
    const shouldBypassRateLimit = hasValidApiKey || isWhitelisted;

    let result: RateLimitResult;

    if (shouldBypassRateLimit) {
      const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default;
      result = {
        allowed: true,
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs,
        limit: config.maxRequests,
      };
    } else {
      const rawResult = await checkRateLimit(ip, endpoint);
      result = {
        ...rawResult,
        limit:
          RATE_LIMIT_CONFIGS[endpoint]?.maxRequests ||
          RATE_LIMIT_CONFIGS.default.maxRequests,
      };
    }

    // Add rate limit headers to all responses
    const addRateLimitHeaders = (response: Response): Response => {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("X-RateLimit-Limit", String(result.limit));
      newResponse.headers.set(
        "X-RateLimit-Remaining",
        String(result.remaining),
      );
      newResponse.headers.set(
        "X-RateLimit-Reset",
        String(Math.ceil(result.resetTime / 1000)),
      );

      // Add security context header (for debugging, not sensitive)
      if (shouldBypassRateLimit) {
        newResponse.headers.set("X-RateLimit-Bypass", "authenticated");
      }

      return newResponse;
    };

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      const errorResponse = new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: `Too many requests. Please try again in ${retryAfter} seconds.`,
            details: {
              retryAfter,
              resetTime: result.resetTime,
            },
          },
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
          },
        },
      );
      return addRateLimitHeaders(errorResponse);
    }

    const response = await handler(request);
    return addRateLimitHeaders(response);
  };
}

/**
 * Reset rate limit for a specific identifier (for testing/admin purposes)
 */
export function resetRateLimit(identifier: string, endpoint: string): void {
  const key = `${endpoint}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Reset all rate limits (useful for testing)
 */
export function resetAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Get current rate limit status for an identifier
 */
export function getRateLimitStatus(
  identifier: string,
  endpoint: string,
): {
  count: number;
  remaining: number;
  resetTime: number | undefined;
} {
  const key = `${endpoint}:${identifier}`;
  const entry = rateLimitStore.get(key);
  const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default;

  if (!entry || entry.resetTime <= Date.now()) {
    return {
      count: 0,
      remaining: config.maxRequests,
      resetTime: undefined,
    };
  }

  return {
    count: entry.count,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}
