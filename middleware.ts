import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// Security Configuration
// ============================================================================

const SECURITY_CONFIG = {
  // Allowed search engine bots (whitelist for SEO)
  allowedBots: [
    /googlebot/i,
    /bingbot/i,
    /slurp/i, // Yahoo
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /sogou/i,
    /exabot/i,
    /facebot/i, // Facebook
    /ia_archiver/i, // Alexa
    /mj12bot/i, // Majestic
    /ahrefsbot/i,
    /semrushbot/i,
    /dotbot/i,
    /rogerbot/i,
    /linkedinbot/i,
    /embedly/i,
    /quora link preview/i,
    /showyoubot/i,
    /outbrain/i,
    /pinterest/i,
    /slackbot/i,
    /vkshare/i,
    /w3c_validator/i,
    /redditbot/i,
    /applebot/i,
    /whatsapp/i,
    /flipboard/i,
    /tumblr/i,
    /bitlybot/i,
    /skypeuripreview/i,
    /nuzzel/i,
    /discordbot/i,
    /google page speed/i,
    /qwantify/i,
    /pinterestbot/i,
    /bitrix link preview/i,
    /xing-contenttabreceiver/i,
    /chrome-lighthouse/i,
    /telegrambot/i,
    /uptimerobot/i,
    /petalbot/i,
  ],

  // Blocked user agents (malicious bots, scrapers, attack tools)
  blockedUserAgents: [
    /python-requests/i,
    /go-http-client/i,
    /java\/\d/i,
    /apache-httpclient/i,
    /scrapy/i,
    /phantom/i,
    /headless/i,
    /puppeteer/i,
    /playwright/i,
    /selenium/i,
    /nikto/i,
    /sqlmap/i,
    /nmap/i,
    /masscan/i,
    /zgrab/i,
    /nuclei/i,
    /httpx/i,
    /gobuster/i,
    /dirbuster/i,
    /wfuzz/i,
    /ffuf/i,
    /burp/i,
    /zap/i,
    /acunetix/i,
    /nessus/i,
    /openvas/i,
    /w3af/i,
    /arachni/i,
    /skipfish/i,
    /wapiti/i,
    /vega/i,
    /grabber/i,
    /webscarab/i,
    /paros/i,
    /ratproxy/i,
    /harvest/i,
    /extract/i,
    /libwww/i,
    /lwp-trivial/i,
  ],

  // Blocked paths (admin, config, sensitive files)
  blockedPaths: [
    "/.env",
    "/.git",
    "/api/debug",
    "/admin",
    "/wp-admin",
    "/wp-login",
    "/phpmyadmin",
    "/console",
    "/solr",
    "/api-docs",
    "/swagger",
  ],

  // Rate limiting by endpoint (in-memory with size limit)
  rateLimits: new Map<string, { count: number; resetTime: number }>(),

  // Maximum entries in rate limit map to prevent memory exhaustion
  maxRateLimitEntries: 10000,

  // Blocked IP addresses (can be populated from env)
  blockedIps: new Set(
    process.env.BLOCKED_IPS?.split(",").map((ip) => ip.trim()) || [],
  ),

  // Allowed origins for CORS
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
};

// ============================================================================
// Security Middleware Functions
// ============================================================================

/**
 * Check if user agent is an allowed bot (search engines, social media, etc.)
 */
function isAllowedBot(userAgent: string | null): boolean {
  if (!userAgent) return false;

  for (const pattern of SECURITY_CONFIG.allowedBots) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if user agent should be blocked
 */
function shouldBlockUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;

  // Always allow legitimate search engine bots
  if (isAllowedBot(userAgent)) {
    return false;
  }

  for (const pattern of SECURITY_CONFIG.blockedUserAgents) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if path should be blocked
 */
function shouldBlockPath(pathname: string): boolean {
  const normalizedPath = pathname.toLowerCase();

  for (const blocked of SECURITY_CONFIG.blockedPaths) {
    if (normalizedPath.startsWith(blocked)) {
      return true;
    }
  }

  // Block access to hidden files and system directories
  if (normalizedPath.includes("/.") || normalizedPath.includes("~")) {
    return true;
  }

  return false;
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (cfConnectingIp) return cfConnectingIp.split(",")[0].trim();
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIp) return realIp;

  return "unknown";
}

/**
 * Simple in-memory rate limiter with size limit
 */
function checkRateLimit(ip: string, endpoint: string): boolean {
  // Skip rate limiting in test environment
  if (process.env.NODE_ENV === "test") {
    return true;
  }

  const key = `${ip}:${endpoint}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // Per minute

  const record = SECURITY_CONFIG.rateLimits.get(key);

  if (!record || now > record.resetTime) {
    // Check if we've hit the max entries limit
    if (SECURITY_CONFIG.rateLimits.size >= SECURITY_CONFIG.maxRateLimitEntries) {
      // Evict oldest entries (cleanup 20% of entries)
      const entriesToRemove = Math.floor(SECURITY_CONFIG.maxRateLimitEntries * 0.2);
      const entries = Array.from(SECURITY_CONFIG.rateLimits.entries());
      entries
        .sort((a, b) => a[1].resetTime - b[1].resetTime)
        .slice(0, entriesToRemove)
        .forEach(([k]) => SECURITY_CONFIG.rateLimits.delete(k));
    }

    SECURITY_CONFIG.rateLimits.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of SECURITY_CONFIG.rateLimits.entries()) {
    if (now > record.resetTime) {
      SECURITY_CONFIG.rateLimits.delete(key);
    }
  }
}

// Run cleanup periodically
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimits, 60 * 1000);
}

// ============================================================================
// Internationalization Middleware
// ============================================================================

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "zh",
  localePrefix: "always",
});

// ============================================================================
// Main Middleware
// ============================================================================

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");

  // Check for blocked IPs
  if (SECURITY_CONFIG.blockedIps.has(ip)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Check for blocked user agents
  if (shouldBlockUserAgent(userAgent)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Check for blocked paths
  if (shouldBlockPath(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Apply rate limiting for non-static, non-API routes
  if (!pathname.startsWith("/_next") && !pathname.startsWith("/static")) {
    if (!checkRateLimit(ip, pathname)) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  // Add security headers to all responses
  const response = intlMiddleware(request);

  // Add additional headers
  response.headers.set("X-Request-ID", crypto.randomUUID());
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
}

export const config = {
  // Match all pathnames except for:
  // - _next (Next.js internals)
  // - _static (static files)
  // - public files (images, favicon)
  matcher: [
    "/((?!_next|_static|_vercel|.*\\..*).*)",
    "/",
    "/(zh|en|ja|ko)/:path*",
  ],
};
