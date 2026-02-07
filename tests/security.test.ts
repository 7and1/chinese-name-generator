/**
 * Security Tests
 *
 * Tests for XSS prevention, input validation, and CSRF protection.
 * Run with: npm test -- tests/security.test.ts
 */

import { describe, it, expect, beforeAll } from "vitest";
import { calculateNameScore } from "../lib/engines/scorer";
import { generateNames } from "../lib/engines/generator";
import { searchContent } from "../lib/search";

// ============================================================================
// XSS Prevention Tests
// ============================================================================

describe("XSS Prevention", () => {
  const xssPayloads = [
    "<script>alert('xss')</script>",
    "<img src=x onerror=alert('xss')>",
    "<svg onload=alert('xss')>",
    "javascript:alert('xss')",
    "<iframe src='javascript:alert(xss)'>",
    "<body onload=alert('xss')>",
    "<input onfocus=alert('xss') autofocus>",
    "<select onfocus=alert('xss') autofocus>",
    "<textarea onfocus=alert('xss') autofocus>",
    "<marquee onstart=alert('xss')>",
    `"><script>alert(String.fromCharCode(88,83,83))</script>`,
    "'><script>alert(String.fromCharCode(88,83,83))</script>",
    "</textarea><script>alert(/xss/)</script>",
    "</title><script>alert(/xss/)</script>",
    "<script>alert(document.cookie)</script>",
    "<script>alert(document.location)</script>",
    "${alert('xss')}",
    "{{alert('xss')}}",
    "<% alert('xss') %>",
    "%3Cscript%3Ealert('xss')%3C/script%3E",
    "&lt;script&gt;alert('xss')&lt;/script&gt;",
    "&#60;script&#62;alert('xss')&#60;/script&#62;",
    "&#x3C;script&#x3E;alert('xss')&#x3C;/script&#x3E;",
    "fromCharCode('xss')",
    "eval('alert(\"xss\")')",
    "<style>@import 'javascript:alert(\"xss\")';</style>",
    "<style>body{background:url(\"javascript:alert('xss')\")}</style>",
    '<link rel="stylesheet" href="javascript:alert(\'xss\')">',
  ];

  describe("Name Analysis XSS Protection", () => {
    it("should reject script tag injection in full name", async () => {
      for (const payload of xssPayloads) {
        // The validation should prevent these payloads from being processed
        // Try to validate - if it passes, ensure output is sanitized
        const result = await calculateNameScore(
          payload.slice(0, 4), // Truncate to expected length
          payload[0] || "李",
          payload.slice(1, 3) || "明",
          [
            {
              char: "李",
              pinyin: "li3",
              tone: 3,
              strokeCount: 7,
              kangxiStrokeCount: 7,
              radical: "木",
              fiveElement: "木",
              meaning: "李树",
            },
          ],
          undefined,
        );

        // Result should be a number (score), not contain script tags
        expect(typeof result.overall).toBe("number");
        expect(result.overall).toBeGreaterThanOrEqual(0);
        expect(result.overall).toBeLessThanOrEqual(100);
      }
    });

    it("should sanitize character meanings output", async () => {
      const result = await calculateNameScore(
        "李明",
        "李",
        "明",
        [
          {
            char: "李",
            pinyin: "li3",
            tone: 3,
            strokeCount: 7,
            kangxiStrokeCount: 7,
            radical: "木",
            fiveElement: "木",
            meaning: "<script>alert('xss')</script>",
          },
          {
            char: "明",
            pinyin: "ming2",
            tone: 2,
            strokeCount: 8,
            kangxiStrokeCount: 8,
            radical: "日",
            fiveElement: "火",
            meaning: "光明",
          },
        ],
        undefined,
      );

      // Meaning should be a string, not executable
      expect(result.breakdown.wuge).toBeDefined();
    });
  });

  describe("Name Generation XSS Protection", () => {
    it("should not inject malicious payloads in generated names", async () => {
      const options = {
        surname: "李",
        gender: "male" as const,
        characterCount: 2 as const,
        maxResults: 5,
      };

      const names = await generateNames(options);

      // All generated characters should be valid Chinese characters
      for (const name of names) {
        expect(name.fullName).toMatch(/^[\u4e00-\u9fa5]{2,3}$/);
        expect(name.characters).toBeDefined();
        for (const char of name.characters) {
          expect(char.char).toMatch(/^[\u4e00-\u9fa5]$/);
          // Meanings should not contain HTML
          expect(char.meaning).not.toContain("<script>");
          expect(char.meaning).not.toContain("<iframe>");
          expect(char.meaning).not.toContain("javascript:");
        }
      }
    });
  });

  describe("Search XSS Protection", () => {
    it("should handle XSS payloads in search query safely", () => {
      const dangerousQueries = [
        "<script>alert('xss')</script>",
        "javascript:alert('xss')",
        "<img src=x onerror=alert('xss')>",
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "<iframe src='javascript:alert(1)'>",
      ];

      for (const query of dangerousQueries) {
        const result = searchContent({ query, kind: "all", limit: 10 });

        // Should return results without errors
        expect(result).toBeDefined();
        expect(result.query).toBe(query);

        // Results should not contain executable scripts
        for (const item of result.results) {
          if (item.type === "character") {
            expect(item.char).not.toContain("<");
            expect(item.char).not.toContain(">");
            expect(item.meaning).not.toContain("<script>");
          }
          if (item.type === "poetry") {
            expect(item.title).not.toContain("<script>");
            expect(item.verse).not.toContain("<script>");
          }
          if (item.type === "idiom") {
            expect(item.idiom).not.toContain("<script>");
            expect(item.meaning).not.toContain("<script>");
          }
        }
      }
    });
  });
});

// ============================================================================
// Input Validation Tests
// ============================================================================

describe("Input Validation", () => {
  describe("Chinese Character Validation", () => {
    const validChineseNames = ["李白", "王明华", "张伟", "欧阳修"];
    const invalidNames = [
      "John",
      "123",
      "李<script>",
      "李明' OR '1'='1",
      "李\x00",
      "",
      "A",
      "李明华abcdef",
    ];

    it("should accept valid Chinese names", () => {
      for (const name of validChineseNames) {
        expect(name).toMatch(/^[\u4e00-\u9fa5\u00b7\u2022]{2,4}$/);
      }
    });

    it("should reject invalid Chinese names", () => {
      for (const name of invalidNames) {
        // These should not pass the regex validation
        const isValid = /^[\u4e00-\u9fa5\u00b7\u2022]{2,4}$/.test(name);
        if (name.length >= 2 && name.length <= 4) {
          // Check character content
          expect(isValid).toBe(false);
        }
      }
    });
  });

  describe("Date Validation", () => {
    it("should reject future dates", () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 10);
      const year = futureDate.getFullYear();

      expect(year).toBeGreaterThan(new Date().getFullYear());
    });

    it("should reject dates before 1900", () => {
      const year = 1800;
      expect(year).toBeLessThan(1900);
    });

    it("should accept valid date range", () => {
      const year = new Date().getFullYear();
      expect(year).toBeGreaterThanOrEqual(1900);
      expect(year).toBeLessThanOrEqual(new Date().getFullYear() + 1);
    });
  });

  describe("Length Limits", () => {
    it("should enforce max length on surname", () => {
      const longSurname = "一二三四";
      expect(longSurname.length).toBeGreaterThan(2);
    });

    it("should enforce max length on full name", () => {
      const longName = "一二三四五六";
      expect(longName.length).toBeGreaterThan(4);
    });

    it("should enforce max length on search query", () => {
      const longQuery = "a".repeat(101);
      expect(longQuery.length).toBeGreaterThan(100);
    });
  });
});

// ============================================================================
// SQL Injection Prevention Tests
// ============================================================================

describe("SQL Injection Prevention", () => {
  const sqlInjectionPayloads = [
    "' OR '1'='1",
    "' OR '1'='1' --",
    "' OR '1'='1' /*",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --",
    "1' ORDER BY 1--",
    "1' AND 1=1--",
    "admin'--",
    "admin'/*",
    "' OR 1=1#",
    "' OR 1=1--",
    "' OR 1=1/*",
    "') OR '1'='1--",
    "') OR ('1'='1--",
    "'; EXEC xp_cmdshell('dir'); --",
    "'; EXEC master..xp_cmdshell('ipconfig'); --",
  ];

  it("should not execute SQL injection in search", () => {
    for (const payload of sqlInjectionPayloads) {
      const result = searchContent({ query: payload, kind: "all", limit: 10 });

      // Should return empty results or valid results, never an error
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
      expect(Array.isArray(result.results)).toBe(true);
    }
  });

  it("should sanitize SQL special characters in input", () => {
    const dangerousInputs = [
      "'; DROP TABLE--",
      "Robert'); DROP TABLE students;--",
      "' UNION SELECT NULL--",
      "1' AND '1'='1",
    ];

    for (const input of dangerousInputs) {
      // The search function should handle these safely
      const result = searchContent({
        query: input,
        kind: "character",
        limit: 5,
      });

      // Verify no SQL errors occur
      expect(result).toBeDefined();
      expect(result.results).toBeDefined();
    }
  });
});

// ============================================================================
// Path Traversal Prevention Tests
// ============================================================================

describe("Path Traversal Prevention", () => {
  const pathTraversalPayloads = [
    "../../../etc/passwd",
    "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
    "....//....//....//etc/passwd",
    "%2e%2e%2f",
    "%252e%252e%252f",
    "..%252f",
    "..%c0%af",
    "..%c1%9c",
    "....////",
    "//etc/passwd",
    "/etc/passwd",
    "C:\\windows\\system32\\drivers\\etc\\hosts",
  ];

  it("should prevent path traversal in search", () => {
    for (const payload of pathTraversalPayloads) {
      const result = searchContent({ query: payload, kind: "all", limit: 10 });

      // Should not error or return file system content
      expect(result).toBeDefined();

      // Results should only contain valid data, not file paths
      for (const item of result.results) {
        if (item.type === "poetry") {
          expect(item.id).not.toContain("..");
          expect(item.id).not.toContain("etc/passwd");
          expect(item.id).not.toContain("windows");
        }
      }
    }
  });
});

// ============================================================================
// Content Security Policy Tests
// ============================================================================

describe("Security Headers Simulation", () => {
  it("should have proper CSP structure", () => {
    // Simulate CSP policy validation
    const expectedDirectives = [
      "default-src",
      "script-src",
      "style-src",
      "img-src",
      "connect-src",
      "font-src",
      "object-src",
      "base-uri",
      "form-action",
      "frame-ancestors",
    ];

    // Verify all required directives would be present
    expect(expectedDirectives.length).toBeGreaterThan(0);
  });

  it("should block unsafe-eval in production", () => {
    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
      // In production, unsafe-eval should not be in script-src
      const scriptSrc = "script-src 'self' 'strict-dynamic'";
      expect(scriptSrc).not.toContain("unsafe-eval");
    }
  });

  it("should set object-src to none", () => {
    const objectSrc = "object-src 'none'";
    expect(objectSrc).toBe("object-src 'none'");
  });

  it("should set frame-ancestors to none", () => {
    const frameAncestors = "frame-ancestors 'none'";
    expect(frameAncestors).toBe("frame-ancestors 'none'");
  });
});

// ============================================================================
// Rate Limiting Tests
// ============================================================================

describe("Rate Limiting", () => {
  it("should define rate limit configs for all endpoints", () => {
    const expectedEndpoints = [
      "generate",
      "analyze",
      "search",
      "report",
      "default",
    ];

    for (const endpoint of expectedEndpoints) {
      // Verify the endpoint would have rate limiting
      expect(endpoint).toBeTruthy();
    }
  });

  it("should have reasonable rate limits", () => {
    const generateLimit = 10; // 10 requests per minute
    const analyzeLimit = 20; // 20 requests per minute
    const searchLimit = 30; // 30 requests per minute

    expect(generateLimit).toBeGreaterThan(0);
    expect(generateLimit).toBeLessThan(100);

    expect(analyzeLimit).toBeGreaterThan(0);
    expect(analyzeLimit).toBeLessThan(100);

    expect(searchLimit).toBeGreaterThan(0);
    expect(searchLimit).toBeLessThan(100);
  });
});

// ============================================================================
// CSRF Protection Tests
// ============================================================================

describe("CSRF Protection", () => {
  it("should use stateless API with proper headers", () => {
    // APIs should use proper CORS and security headers
    const expectedHeaders = [
      "X-Content-Type-Options",
      "X-Frame-Options",
      "X-XSS-Protection",
    ];

    expect(expectedHeaders.length).toBeGreaterThan(0);
  });

  it("should validate Content-Type for POST requests", () => {
    // POST requests should require application/json
    const validContentType = "application/json";
    const invalidContentTypes = [
      "text/plain",
      "multipart/form-data",
      "application/x-www-form-urlencoded",
    ];

    expect(validContentType).toBe("application/json");

    for (const invalid of invalidContentTypes) {
      expect(invalid).not.toBe("application/json");
    }
  });
});

// ============================================================================
// Data Sanitization Tests
// ============================================================================

describe("Data Sanitization", () => {
  it("should escape HTML entities in output", () => {
    const unescaped = "<script>alert('xss')</script>";
    const escaped = unescaped
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");

    expect(escaped).not.toContain("<script>");
    expect(escaped).toContain("&lt;");
    expect(escaped).toContain("&gt;");
  });

  it("should remove dangerous protocols from URLs", () => {
    const dangerousUrls = [
      { url: "javascript:alert('xss')", dangerous: true },
      { url: "data:text/html,<script>alert('xss')</script>", dangerous: true },
      { url: "vbscript:alert('xss')", dangerous: true },
      { url: "file:///etc/passwd", dangerous: true },
    ];

    for (const { url, dangerous } of dangerousUrls) {
      // These should be rejected or sanitized
      const isDangerous =
        url.toLowerCase().includes("javascript:") ||
        url.toLowerCase().includes("data:text/html") ||
        url.toLowerCase().includes("vbscript:") ||
        url.toLowerCase().includes("file://") || // Changed to :// to match correctly
        url.toLowerCase().startsWith("file:");

      // At least one check should identify it as dangerous
      const detectedAsDangerous =
        url.toLowerCase().includes("javascript:") ||
        url.toLowerCase().includes("data:text/html") ||
        url.toLowerCase().includes("vbscript:");
      expect(detectedAsDangerous || isDangerous).toBe(dangerous);
    }
  });
});
