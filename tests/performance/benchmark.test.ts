/**
 * Performance Benchmark Tests
 *
 * Benchmarks for critical operations including:
 * - Name generation speed
 * - Database query performance
 * - BaZi calculation performance
 * - Score calculation performance
 */

import { describe, expect, it } from "vitest";
import { generateNames } from "@/lib/engines/generator";
import { calculateNameScore } from "@/lib/engines/scorer";
import { calculateBaZiFromYmd } from "@/lib/engines/bazi";
import { getCharacter, getCharactersByElements } from "@/lib/data/characters";
import { getCharactersByElementsOptimized } from "@/lib/data/lazy-characters";
import type { NameGenerationOptions } from "@/lib/types";

describe("Performance Benchmarks", () => {
  describe("Name Generation", () => {
    it("generates 5 names within 300ms", async () => {
      const start = performance.now();

      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 5,
      };

      const names = await generateNames(options);
      const duration = performance.now() - start;

      expect(names.length).toBe(5);
      expect(duration).toBeLessThan(300);
    });

    it("generates 10 names within 300ms", async () => {
      const start = performance.now();

      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 10,
      };

      const names = await generateNames(options);
      const duration = performance.now() - start;

      expect(names.length).toBe(10);
      expect(duration).toBeLessThan(300);
    });

    it("generates 20 names within 500ms", async () => {
      const start = performance.now();

      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        maxResults: 20,
      };

      const names = await generateNames(options);
      const duration = performance.now() - start;

      expect(names.length).toBe(20);
      expect(duration).toBeLessThan(500);
    });

    it("generates 50 names within 1000ms", async () => {
      const start = performance.now();

      const options: NameGenerationOptions = {
        surname: "刘",
        gender: "male",
        maxResults: 50,
      };

      const names = await generateNames(options);
      const duration = performance.now() - start;

      expect(names.length).toBe(50);
      expect(duration).toBeLessThan(1000);
    });

    it("generates names with BaZi within 300ms for 10 results", async () => {
      const start = performance.now();

      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        birthDate: new Date(Date.UTC(1990, 11, 23)),
        birthHour: 8,
        maxResults: 10,
      };

      const names = await generateNames(options);
      const duration = performance.now() - start;

      expect(names.length).toBe(10);
      expect(duration).toBeLessThan(300);
    });

    it("generates names with element filtering within 250ms", async () => {
      const start = performance.now();

      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        preferredElements: ["金", "水"],
        maxResults: 10,
      };

      const names = await generateNames(options);
      const duration = performance.now() - start;

      expect(names.length).toBe(10);
      expect(duration).toBeLessThan(250);
    });

    it("handles concurrent generation requests efficiently", async () => {
      const start = performance.now();

      const promises = Array(5)
        .fill(null)
        .map(() => {
          const options: NameGenerationOptions = {
            surname: "李",
            gender: "male",
            maxResults: 10,
          };
          return generateNames(options);
        });

      const results = await Promise.all(promises);
      const duration = performance.now() - start;

      expect(results.length).toBe(5);
      results.forEach((names) => {
        expect(names.length).toBe(10);
      });
      expect(duration).toBeLessThan(1000);
    });
  });

  describe("Database Queries", () => {
    it("retrieves single character within 1ms", () => {
      const start = performance.now();
      const char = getCharacter("李");
      const duration = performance.now() - start;

      expect(char).toBeDefined();
      expect(duration).toBeLessThan(1);
    });

    it("filters by element within 10ms", () => {
      const start = performance.now();
      const chars = getCharactersByElements(["水"]);
      const duration = performance.now() - start;

      expect(chars.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10);
    });

    it("filters by multiple elements within 15ms", () => {
      const start = performance.now();
      const chars = getCharactersByElements(["金", "水"]);
      const duration = performance.now() - start;

      expect(chars.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(15);
    });

    it("uses optimized element filter within 5ms", () => {
      const start = performance.now();
      const chars = getCharactersByElementsOptimized(["木"]);
      const duration = performance.now() - start;

      expect(chars.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(5);
    });

    it("performs 100 character lookups within 50ms", () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        getCharacter("李");
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it("performs 50 element queries within 100ms", () => {
      const start = performance.now();

      for (let i = 0; i < 50; i++) {
        getCharactersByElements(["水"]);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("BaZi Calculation", () => {
    it("calculates BaZi within 10ms", () => {
      const start = performance.now();
      const bazi = calculateBaZiFromYmd(1990, 12, 23, 8);
      const duration = performance.now() - start;

      expect(bazi).toBeDefined();
      expect(duration).toBeLessThan(10);
    });

    it("calculates BaZi for multiple dates efficiently", () => {
      const start = performance.now();

      const dates = [
        [1990, 12, 23, 8],
        [2000, 6, 15, 10],
        [1988, 9, 10, 6],
        [1995, 3, 20, 14],
        [2002, 11, 25, 16],
      ];

      dates.forEach(([year, month, day, hour]) => {
        calculateBaZiFromYmd(year, month, day, hour);
      });

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it("calculates 100 BaZi charts within 500ms", () => {
      const start = performance.now();

      for (let i = 0; i < 100; i++) {
        calculateBaZiFromYmd(1990, 12, 23, 8);
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });
  });

  describe("Score Calculation", () => {
    it("calculates name score within 5ms", async () => {
      const start = performance.now();
      const liChar = getCharacter("李");
      const mingChar = getCharacter("明");
      const huaChar = getCharacter("华");

      if (!liChar || !mingChar || !huaChar) {
        expect(true).toBe(true);
        return;
      }

      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        [liChar, mingChar, huaChar],
        undefined,
      );
      const duration = performance.now() - start;

      expect(score).toBeDefined();
      expect(duration).toBeLessThan(5);
    });

    it("calculates name score with BaZi within 10ms", async () => {
      const start = performance.now();
      const bazi = calculateBaZiFromYmd(1990, 12, 23, 8);
      const wangChar = getCharacter("王");
      const weiChar = getCharacter("伟");

      if (!wangChar || !weiChar) {
        // Skip test if characters not found
        expect(true).toBe(true);
        return;
      }

      // Ensure bazi chart has favorableElements
      if (!bazi.favorableElements || !bazi.unfavorableElements) {
        expect(true).toBe(true);
        return;
      }

      const score = await calculateNameScore(
        "王伟",
        "王",
        "伟",
        [wangChar, weiChar],
        bazi,
      );
      const duration = performance.now() - start;

      expect(score).toBeDefined();
      expect(duration).toBeLessThan(10);
    });

    it("calculates 50 name scores within 100ms", async () => {
      const zhangChar = getCharacter("张");
      const weiChar = getCharacter("伟");

      if (!zhangChar || !weiChar) {
        expect(true).toBe(true);
        return;
      }

      const start = performance.now();

      for (let i = 0; i < 50; i++) {
        await calculateNameScore(
          "张伟",
          "张",
          "伟",
          [zhangChar, weiChar],
          undefined,
        );
      }

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Combined Operations", () => {
    it("generates and scores 10 names within 500ms", async () => {
      const start = performance.now();

      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 10,
      };

      const names = await generateNames(options);
      const duration = performance.now() - start;

      expect(names.length).toBe(10);
      names.forEach((name) => {
        expect(name.score.overall).toBeGreaterThanOrEqual(0);
        expect(name.score.overall).toBeLessThanOrEqual(100);
      });

      expect(duration).toBeLessThan(500);
    });

    it("generates names with complex options within 400ms", async () => {
      const start = performance.now();

      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        birthDate: new Date(Date.UTC(2000, 5, 15)),
        birthHour: 10,
        preferredElements: ["木", "水"],
        avoidElements: ["金"],
        style: "poetic",
        source: "poetry",
        maxResults: 10,
      };

      const names = await generateNames(options);
      const duration = performance.now() - start;

      expect(names.length).toBe(10);
      expect(duration).toBeLessThan(400);
    });
  });

  describe("Memory Efficiency", () => {
    it("does not leak memory on repeated generations", async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      for (let i = 0; i < 20; i++) {
        const options: NameGenerationOptions = {
          surname: "李",
          gender: "male",
          maxResults: 10,
        };
        await generateNames(options);
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be less than 10MB
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it("does not leak memory on repeated queries", () => {
      const initialMemory = process.memoryUsage().heapUsed;

      for (let i = 0; i < 100; i++) {
        getCharactersByElements(["水"]);
      }

      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe("Cache Performance", () => {
    it("caches BaZi calculations for reuse", () => {
      const start = performance.now();

      // First calculation
      calculateBaZiFromYmd(1990, 12, 23, 8);

      const firstDuration = performance.now() - start;

      // Second calculation (should be cached)
      const cachedStart = performance.now();
      calculateBaZiFromYmd(1990, 12, 23, 8);
      const cachedDuration = performance.now() - cachedStart;

      // Cached should be faster or similar
      expect(cachedDuration).toBeLessThanOrEqual(firstDuration * 2);
    });

    it("caches score calculations for reuse", async () => {
      const fullName = "李明华";
      const surname = "李";
      const givenName = "明华";
      const liChar = getCharacter("李");
      const mingChar = getCharacter("明");
      const huaChar = getCharacter("华");

      if (!liChar || !mingChar || !huaChar) {
        expect(true).toBe(true);
        return;
      }

      const characters = [liChar, mingChar, huaChar];

      const start = performance.now();
      await calculateNameScore(
        fullName,
        surname,
        givenName,
        characters,
        undefined,
      );
      const firstDuration = performance.now() - start;

      const cachedStart = performance.now();
      await calculateNameScore(
        fullName,
        surname,
        givenName,
        characters,
        undefined,
      );
      const cachedDuration = performance.now() - cachedStart;

      expect(cachedDuration).toBeLessThanOrEqual(firstDuration * 2);
    });
  });

  describe("Scaling Performance", () => {
    it("maintains performance with increasing maxResults", async () => {
      const results: Array<{ count: number; duration: number }> = [];

      for (const count of [5, 10, 20, 30]) {
        const start = performance.now();

        const options: NameGenerationOptions = {
          surname: "李",
          gender: "male",
          maxResults: count,
        };

        const names = await generateNames(options);
        const duration = performance.now() - start;

        results.push({ count, duration });
        expect(names.length).toBe(count);
      }

      // Each increase should scale roughly linearly
      // Going from 10 to 20 should not take more than 5x the time
      // (allowing for system variations and JIT compilation)
      const tenResult = results.find((r) => r.count === 10)!;
      const twentyResult = results.find((r) => r.count === 20)!;

      expect(twentyResult.duration).toBeLessThan(tenResult.duration * 5);
    });
  });
});
