/**
 * POST /api/generate/name Integration Tests
 *
 * Tests for the name generation API endpoint including:
 * - Request validation
 * - Various input combinations
 * - Response format validation
 * - Error handling
 * - Rate limiting
 */

import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { POST as generateName } from "@/app/api/generate/name/route";
import { resetAllRateLimits } from "@/lib/security/rate-limit";

describe("POST /api/generate/name", () => {
  beforeEach(() => {
    // Reset all rate limits before each test
    resetAllRateLimits();
  });

  afterEach(() => {
    // Cleanup after tests
    resetAllRateLimits();
  });

  describe("Basic Request Handling", () => {
    it("generates names with minimal required fields", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data).toBeInstanceOf(Array);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data.length).toBeLessThanOrEqual(20); // default maxResults
    });

    it("generates names with all parameters", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "王",
          gender: "female",
          birthDate: "2000-06-15",
          birthHour: 10,
          preferredElements: ["木", "水"],
          avoidElements: ["金"],
          style: "poetic",
          source: "poetry",
          characterCount: 2,
          maxResults: 10,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.length).toBeLessThanOrEqual(10);
    });
  });

  describe("Surname Variations", () => {
    it("handles single character surnames", async () => {
      const surnames = ["李", "王", "张", "刘", "陈"];

      for (const surname of surnames) {
        const req = new Request("http://localhost/api/generate/name", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            surname,
            gender: "neutral",
          }),
        });

        const res = await generateName(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json.success).toBe(true);
        expect(json.data.length).toBeGreaterThan(0);

        // All names should start with the surname
        json.data.forEach((name: { fullName: string }) => {
          expect(name.fullName.startsWith(surname)).toBe(true);
        });
      }
    });

    it("handles compound surnames", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "欧阳",
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("rejects invalid surnames", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "Smith", // Not Chinese
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("INVALID_REQUEST");
    });

    it("rejects empty surname", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "",
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("rejects surname that's too long", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "欧阳复", // 3 characters, max is 2
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });
  });

  describe("Gender Handling", () => {
    it("generates names for male gender", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("generates names for female gender", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "female",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("generates names for neutral gender", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "neutral",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("rejects invalid gender", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "unknown",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });
  });

  describe("Birth Date Handling", () => {
    it("accepts valid birth date in YYYY-MM-DD format", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          birthDate: "1990-12-23",
          birthHour: 8,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("accepts ISO datetime format", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "female",
          birthDate: "2000-06-15T10:30:00Z",
          birthHour: 10,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("rejects invalid date format", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          birthDate: "23/12/1990", // Wrong format
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("rejects birth date before 1900", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          birthDate: "1850-01-01",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("rejects birth date in the future", async () => {
      const futureYear = new Date().getFullYear() + 10;
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          birthDate: `${futureYear}-01-01`,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("generates different names for different birth dates", async () => {
      const req1 = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          birthDate: "1990-12-23",
          maxResults: 10,
        }),
      });

      const req2 = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          birthDate: "2000-06-15",
          maxResults: 10,
        }),
      });

      const res1 = await generateName(req1);
      const res2 = await generateName(req2);
      const json1 = await res1.json();
      const json2 = await res2.json();

      expect(json1.data.length).toBeGreaterThan(0);
      expect(json2.data.length).toBeGreaterThan(0);

      // Names should be different due to different BaZi
      const names1 = new Set(
        json1.data.map((n: { fullName: string }) => n.fullName),
      );
      const names2 = new Set(
        json2.data.map((n: { fullName: string }) => n.fullName),
      );
      const intersection = [...names1].filter((x) => names2.has(x));
      expect(intersection.length).toBeLessThan(names1.size);
    });
  });

  describe("Five Elements Filtering", () => {
    it("generates names with preferred elements", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          preferredElements: ["金", "水"],
          maxResults: 10,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);

      // Check that some names use preferred elements
      const hasPreferredElement = json.data.some(
        (name: { characters: Array<{ fiveElement: string }> }) =>
          name.characters.some((c) => ["金", "水"].includes(c.fiveElement)),
      );
      expect(hasPreferredElement).toBe(true);
    });

    it("avoids unwanted elements", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "female",
          avoidElements: ["火"],
          maxResults: 10,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("handles both preferred and avoided elements", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "王",
          gender: "neutral",
          preferredElements: ["木", "水"],
          avoidElements: ["金"],
          maxResults: 10,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("removes preferred elements from avoid list", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "张",
          gender: "male",
          preferredElements: ["水"],
          avoidElements: ["水", "火"], // Water in both should not cause issues
          maxResults: 10,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });

  describe("Style and Source Options", () => {
    it("generates classic style names", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          style: "classic",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("generates poetic style names", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "female",
          style: "poetic",
          source: "poetry",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("generates names from poetry source", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "王",
          gender: "female",
          source: "poetry",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });

    it("generates names from classics source", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "张",
          gender: "male",
          source: "classics",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });

  describe("Character Count and Max Results", () => {
    it("generates single character given names", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          characterCount: 1,
          maxResults: 5,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);

      json.data.forEach((name: { givenName: string; fullName: string }) => {
        expect(name.givenName.length).toBe(1);
        expect(name.fullName.length).toBe(2); // surname + 1 char
      });
    });

    it("generates double character given names by default", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          maxResults: 5,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);

      json.data.forEach((name: { givenName: string; fullName: string }) => {
        expect(name.givenName.length).toBe(2);
        expect(name.fullName.length).toBe(3); // surname + 2 chars
      });
    });

    it("respects maxResults parameter", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          maxResults: 15,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.length).toBeLessThanOrEqual(15);
    });

    it("handles maxResults of 1", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          maxResults: 1,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.length).toBe(1);
    });

    it("handles maxResults of 50 (maximum)", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          maxResults: 50,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.data.length).toBeLessThanOrEqual(50);
    });
  });

  describe("Response Format", () => {
    it("returns names with complete structure", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          maxResults: 3,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);

      json.data.forEach(
        (name: {
          fullName: string;
          surname: string;
          givenName: string;
          pinyin: string;
          characters: unknown[];
          score: { overall: number };
        }) => {
          expect(name.fullName).toBeDefined();
          expect(name.surname).toBeDefined();
          expect(name.givenName).toBeDefined();
          expect(name.pinyin).toBeDefined();
          expect(name.characters).toBeInstanceOf(Array);
          expect(name.characters.length).toBeGreaterThan(0);
          expect(name.score.overall).toBeGreaterThanOrEqual(0);
          expect(name.score.overall).toBeLessThanOrEqual(100);
        },
      );
    });

    it("returns names sorted by score", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          maxResults: 10,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      const scores = json.data.map(
        (n: { score: { overall: number } }) => n.score.overall,
      );
      for (let i = 0; i < scores.length - 1; i++) {
        expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
      }
    });

    it("includes X-Response-Time header", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
        }),
      });

      const res = await generateName(req);

      expect(res.headers.get("X-Response-Time")).toBeTruthy();
      expect(res.headers.get("X-Request-Id")).toBeTruthy();
    });

    it("includes rate limit headers", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
        }),
      });

      const res = await generateName(req);

      expect(res.headers.get("X-RateLimit-Limit")).toBeTruthy();
      expect(res.headers.get("X-RateLimit-Remaining")).toBeTruthy();
      expect(res.headers.get("X-RateLimit-Reset")).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("rejects malformed JSON", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{invalid json}",
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("rejects missing surname", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("INVALID_REQUEST");
    });

    it("rejects missing gender", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("INVALID_REQUEST");
    });

    it("handles generation errors gracefully", async () => {
      // Test with impossible constraints
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          preferredElements: ["金"],
          avoidElements: ["金", "木", "水", "火", "土"], // Avoid everything
          maxResults: 5,
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      // Should return results using fallback mechanism
      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });

  describe("Performance", () => {
    it("generates names within reasonable time", async () => {
      const start = Date.now();

      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
          maxResults: 20,
        }),
      });

      const res = await generateName(req);
      const duration = Date.now() - start;

      expect(res.status).toBe(200);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  describe("Security", () => {
    it("rejects XSS attempt in surname", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "<script>alert('xss')</script>",
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("rejects SQL injection patterns", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李'; DROP TABLE--",
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });

    it("rejects header injection attempts", async () => {
      const req = new Request("http://localhost/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李\r\nX-Injected-Header: malicious",
          gender: "male",
        }),
      });

      const res = await generateName(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
    });
  });
});
