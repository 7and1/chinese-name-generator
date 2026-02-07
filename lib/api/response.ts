import { NextResponse } from "next/server";

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

/**
 * Cache configuration for different response types
 */
export const CachePolicy = {
  // No caching - for dynamic/user-specific data
  noStore: "no-store, no-cache, must-revalidate, private",
  // Short cache - for frequently changing data
  short: "public, max-age=60, s-maxage=60, stale-while-revalidate=30",
  // Medium cache - for relatively static data
  medium: "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
  // Long cache - for rarely changing data
  long: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=300",
  // Immutable - for versioned static assets
  immutable: "public, max-age=31536000, immutable",
} as const;

export type CachePolicyType = keyof typeof CachePolicy;

/**
 * Standard response headers for API responses
 */
const STANDARD_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

/**
 * Create a successful API response with configurable caching
 */
export function ok<T>(
  data: T,
  init?: ResponseInit & { cache?: CachePolicyType },
) {
  const cachePolicy = init?.cache
    ? CachePolicy[init.cache]
    : CachePolicy.noStore;

  // Remove cache from init before spreading (reserved for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cache, ...restInit } = init ?? {};

  return NextResponse.json(
    { success: true, data },
    {
      ...restInit,
      headers: {
        "Cache-Control": cachePolicy,
        ...STANDARD_HEADERS,
        ...(restInit?.headers ?? {}),
      },
    },
  );
}

/**
 * Create an error response
 */
export function fail(
  status: number,
  code: string,
  message: string,
  details?: unknown,
  init?: ResponseInit,
) {
  const body: ApiErrorBody = {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  };

  return NextResponse.json(body, {
    status,
    ...init,
    headers: {
      "Cache-Control": CachePolicy.noStore,
      ...STANDARD_HEADERS,
      ...(init?.headers ?? {}),
    },
  });
}

/**
 * Create a response with ETag support for conditional requests
 */
export function withETag<T>(
  data: T,
  init?: ResponseInit & { cache?: CachePolicyType },
): NextResponse {
  // Generate simple ETag from JSON string
  const etag = `"${hashCode(JSON.stringify(data))}"`;

  const cachePolicy = init?.cache
    ? CachePolicy[init.cache]
    : CachePolicy.noStore;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cache, ...restInit } = init ?? {};

  return NextResponse.json(
    { success: true, data },
    {
      ...restInit,
      headers: {
        "Cache-Control": cachePolicy,
        ETag: etag,
        ...STANDARD_HEADERS,
        ...(restInit?.headers ?? {}),
      },
    },
  );
}

/**
 * Create a compressed response for large payloads
 * Note: Next.js/Vercel handles compression automatically, but this
 * ensures proper headers are set for other platforms
 */
export function compressed<T>(
  data: T,
  init?: ResponseInit & { cache?: CachePolicyType },
): NextResponse {
  const cachePolicy = init?.cache ? CachePolicy[init.cache] : CachePolicy.short;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cache, ...restInit } = init ?? {};

  return NextResponse.json(
    { success: true, data },
    {
      ...restInit,
      headers: {
        "Cache-Control": cachePolicy,
        "Content-Encoding": "gzip",
        Vary: "Accept-Encoding",
        ...STANDARD_HEADERS,
        ...(restInit?.headers ?? {}),
      },
    },
  );
}

/**
 * Simple hash function for ETag generation
 */
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Check if response should include caching based on request method
 */
export function getCachePolicyForMethod(method: string): CachePolicyType {
  if (method === "GET") {
    return "short"; // GET requests can be cached briefly
  }
  return "noStore"; // POST/PUT/DELETE should not be cached
}
