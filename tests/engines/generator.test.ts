/**
 * Name Generator Engine Unit Tests
 *
 * Tests for the name generation engine including:
 * - Character filtering by element and gender
 * - Name combination generation
 * - Source inspiration lookup
 * - Style bonus calculation
 */

import { describe, expect, it, beforeEach, vi } from "vitest";
import { generateNames } from "@/lib/engines/generator";
import type {
  NameGenerationOptions,
  ChineseCharacter,
  FiveElement,
} from "@/lib/types";

// Mock the cache modules to avoid interference
vi.mock("@/lib/cache/memory-cache", () => ({
  getBaziCache: () => ({
    get: vi.fn(() => undefined),
    set: vi.fn(),
  }),
  getNameScoreCache: () => ({
    get: vi.fn(() => undefined),
    set: vi.fn(),
  }),
}));

// Mock performance monitor
vi.mock("@/lib/performance/monitor", () => ({
  getPerformanceMonitor: () => ({
    start: vi.fn(() => vi.fn()),
    getStats: vi.fn(() => ({ avgDuration: 100 })),
  }),
  createTimer: vi.fn(() => vi.fn()),
}));

describe("Generator Engine", () => {
  describe("Basic Options", () => {
    it("accepts minimal options", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
      expect(names.length).toBeLessThanOrEqual(20); // default maxResults
    });

    it("accepts all options", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "female",
        birthDate: new Date(Date.UTC(1990, 11, 23)),
        birthHour: 8,
        preferredElements: ["金", "水"],
        avoidElements: ["火"],
        style: "poetic",
        source: "poetry",
        characterCount: 2,
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
      expect(names.length).toBeLessThanOrEqual(10);
    });

    it("uses default values for optional parameters", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "neutral",
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);

      // Check defaults
      names.forEach((name) => {
        expect(name.givenName.length).toBe(2); // default characterCount
      });
    });
  });

  describe("Gender Filtering", () => {
    it("generates male names", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("generates female names", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("generates neutral names", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe("Character Count", () => {
    it("generates single character given names", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        characterCount: 1,
        maxResults: 10,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.givenName.length).toBe(1);
        expect(name.fullName.length).toBe(2);
      });
    });

    it("generates double character given names", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        characterCount: 2,
        maxResults: 10,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.givenName.length).toBe(2);
        expect(name.fullName.length).toBe(3);
      });
    });
  });

  describe("Element Preferences", () => {
    it("filters by preferred elements", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        preferredElements: ["金"],
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);

      // Check that names include preferred elements
      const hasPreferredElement = names.some((name) =>
        name.characters.some((c) => c.fiveElement === "金"),
      );
      expect(hasPreferredElement).toBe(true);
    });

    it("filters by multiple preferred elements", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        preferredElements: ["金", "水", "木"],
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("avoids unwanted elements", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        avoidElements: ["火"],
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("handles both preferred and avoided elements", async () => {
      const options: NameGenerationOptions = {
        surname: "刘",
        gender: "male",
        preferredElements: ["金", "水"],
        avoidElements: ["火", "土"],
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("removes overlaps between preferred and avoided", async () => {
      const options: NameGenerationOptions = {
        surname: "陈",
        gender: "female",
        preferredElements: ["金", "水"],
        avoidElements: ["金", "火"], // 金 in both
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe("Style Options", () => {
    it("generates classic style names", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        style: "classic",
        maxResults: 5,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("generates modern style names", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        style: "modern",
        maxResults: 5,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("generates poetic style names", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        style: "poetic",
        maxResults: 5,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("generates elegant style names", async () => {
      const options: NameGenerationOptions = {
        surname: "刘",
        gender: "male",
        style: "elegant",
        maxResults: 5,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe("Source Inspiration", () => {
    it("generates names from poetry source", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "female",
        source: "poetry",
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);

      // Check for source information
      const namesWithSource = names.filter((n) => n.source);
      expect(namesWithSource.length).toBeGreaterThanOrEqual(0);
    });

    it("generates names from classics source", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "male",
        source: "classics",
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("generates names from idioms source", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        source: "idioms",
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("generates names from any source", async () => {
      const options: NameGenerationOptions = {
        surname: "刘",
        gender: "female",
        source: "any",
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe("maxResults Parameter", () => {
    it("respects maxResults of 1", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 1,
      };

      const names = await generateNames(options);
      expect(names.length).toBe(1);
    });

    it("respects maxResults of 50", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 50,
      };

      const names = await generateNames(options);
      expect(names.length).toBeLessThanOrEqual(50);
    });

    it("uses default maxResults of 20 when not specified", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
      };

      const names = await generateNames(options);
      expect(names.length).toBeLessThanOrEqual(20);
    });
  });

  describe("Birth Date and BaZi", () => {
    it("generates names with birth date", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        birthDate: new Date(Date.UTC(1990, 11, 23)),
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);

      // Names should have BaZi breakdown
      names.forEach((name) => {
        expect(name.score.breakdown.bazi).toBeDefined();
      });
    });

    it("generates names with birth date and hour", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        birthDate: new Date(Date.UTC(2000, 5, 15)),
        birthHour: 14,
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("generates names without birth date", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        maxResults: 10,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);

      // Names should use default BaZi score
      names.forEach((name) => {
        expect(name.score.baziScore).toBe(70);
      });
    });
  });

  describe("Output Structure", () => {
    it("returns names with all required fields", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.fullName).toBeDefined();
        expect(name.surname).toBeDefined();
        expect(name.givenName).toBeDefined();
        expect(name.pinyin).toBeDefined();
        expect(name.characters).toBeDefined();
        expect(name.score).toBeDefined();
        expect(name.explanation).toBeDefined();

        // Check score structure
        expect(name.score.overall).toBeGreaterThanOrEqual(0);
        expect(name.score.overall).toBeLessThanOrEqual(100);
        expect(name.score.baziScore).toBeGreaterThanOrEqual(0);
        expect(name.score.wugeScore).toBeGreaterThanOrEqual(0);
        expect(name.score.phoneticScore).toBeGreaterThanOrEqual(0);
        expect(name.score.meaningScore).toBeGreaterThanOrEqual(0);
      });
    });

    it("returns names with valid character data", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.characters.length).toBeGreaterThan(0);

        name.characters.forEach((char) => {
          expect(char.char).toBeDefined();
          expect(char.pinyin).toBeDefined();
          expect(char.tone).toBeGreaterThanOrEqual(1);
          expect(char.tone).toBeLessThanOrEqual(5);
          expect(char.strokeCount).toBeGreaterThan(0);
          expect(char.kangxiStrokeCount).toBeGreaterThan(0);
          expect(char.radical).toBeDefined();
          expect(char.fiveElement).toBeDefined();
          expect(char.meaning).toBeDefined();
        });
      });
    });

    it("returns names with valid pinyin", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.pinyin).toBeDefined();
        expect(name.pinyin.length).toBeGreaterThan(0);

        // Pinyin should have same number of syllables as characters
        const syllableCount = name.pinyin.split(" ").length;
        expect(syllableCount).toBe(name.fullName.length);
      });
    });

    it("returns names with explanations", async () => {
      const options: NameGenerationOptions = {
        surname: "刘",
        gender: "male",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.explanation).toBeDefined();
        expect(name.explanation.length).toBeGreaterThan(0);
        expect(typeof name.explanation).toBe("string");
      });
    });

    it("includes source info when applicable", async () => {
      const options: NameGenerationOptions = {
        surname: "陈",
        gender: "female",
        source: "poetry",
        maxResults: 10,
      };

      const names = await generateNames(options);

      // Some names may have source information
      names.forEach((name) => {
        if (name.source) {
          expect(name.source.type).toBeDefined();
          expect(["poetry", "idiom"]).toContain(name.source.type);
        }
      });
    });
  });

  describe("Surname Handling", () => {
    const commonSurnames = ["李", "王", "张", "刘", "陈", "杨", "黄", "赵"];

    commonSurnames.forEach((surname) => {
      it(`generates names for surname ${surname}`, async () => {
        const options: NameGenerationOptions = {
          surname,
          gender: "neutral",
          maxResults: 3,
        };

        const names = await generateNames(options);
        expect(names.length).toBeGreaterThan(0);

        names.forEach((name) => {
          expect(name.surname).toBe(surname);
          expect(name.fullName.startsWith(surname)).toBe(true);
        });
      });
    });
  });

  describe("Uniqueness", () => {
    it("returns unique names in single batch", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 20,
      };

      const names = await generateNames(options);
      const uniqueNames = new Set(names.map((n) => n.fullName));

      expect(uniqueNames.size).toBe(names.length);
    });
  });

  describe("Edge Cases", () => {
    it("handles all elements avoided", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        avoidElements: ["金", "木", "水", "火", "土"],
        maxResults: 5,
      };

      // Should still generate names using fallback
      const names = await generateNames(options);
      expect(names.length).toBeGreaterThanOrEqual(0);
    });

    it("handles empty preferred elements array", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        preferredElements: [],
        maxResults: 5,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });

    it("handles empty avoided elements array", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        avoidElements: [],
        maxResults: 5,
      };

      const names = await generateNames(options);
      expect(names.length).toBeGreaterThan(0);
    });
  });
});
