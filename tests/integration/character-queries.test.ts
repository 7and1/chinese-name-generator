/**
 * Database Character Queries Integration Tests
 *
 * Tests for character database queries including:
 * - Search functionality
 * - Filtering by element
 * - Filtering by stroke count
 * - Performance benchmarks
 */

import { describe, expect, it } from "vitest";
import { getCharacter, getCharactersByElements } from "@/lib/data/characters";
import {
  getCharactersByElementsOptimized,
  getCharactersByPinyin,
} from "@/lib/data/lazy-characters";

describe("Character Database Queries", () => {
  describe("Basic Character Lookup", () => {
    it("returns character by hanzi", () => {
      const char = getCharacter("李");

      expect(char).toBeDefined();
      expect(char?.char).toBe("李");
      expect(char?.pinyin).toBeDefined();
      expect(char?.fiveElement).toBeDefined();
      expect(char?.strokeCount).toBeDefined();
      expect(char?.meaning).toBeDefined();
    });

    it("returns undefined for non-existent character", () => {
      const char = getCharacter("㐱");

      expect(char).toBeUndefined();
    });

    it("returns common surnames", () => {
      const surnames = ["李", "王", "张", "刘", "陈"];

      surnames.forEach((surname) => {
        const char = getCharacter(surname);
        expect(char).toBeDefined();
        expect(char?.char).toBe(surname);
      });
    });
  });

  describe("Five Elements Filtering", () => {
    it("filters characters by metal element", () => {
      const chars = getCharactersByElements(["金"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("金");
      });
    });

    it("filters characters by wood element", () => {
      const chars = getCharactersByElements(["木"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("木");
      });
    });

    it("filters characters by water element", () => {
      const chars = getCharactersByElements(["水"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("水");
      });
    });

    it("filters characters by fire element", () => {
      const chars = getCharactersByElements(["火"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("火");
      });
    });

    it("filters characters by earth element", () => {
      const chars = getCharactersByElements(["土"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("土");
      });
    });

    it("filters characters by multiple elements", () => {
      const chars = getCharactersByElements(["金", "水"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(["金", "水"]).toContain(char.fiveElement);
      });
    });

    it("filters characters by all five elements", () => {
      const chars = getCharactersByElements(["金", "木", "水", "火", "土"]);
      expect(chars.length).toBeGreaterThan(0);

      const elements = new Set(chars.map((c) => c.fiveElement));
      expect(elements.size).toBe(5);
    });

    it("returns empty array for empty element list", () => {
      const chars = getCharactersByElements([]);
      expect(chars).toEqual([]);
    });
  });

  describe("Optimized Element Filtering", () => {
    it("optimizes metal element queries", () => {
      const chars = getCharactersByElementsOptimized(["金"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("金");
      });
    });

    it("optimizes wood element queries", () => {
      const chars = getCharactersByElementsOptimized(["木"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("木");
      });
    });

    it("optimizes water element queries", () => {
      const chars = getCharactersByElementsOptimized(["水"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("水");
      });
    });

    it("optimizes fire element queries", () => {
      const chars = getCharactersByElementsOptimized(["火"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("火");
      });
    });

    it("optimizes earth element queries", () => {
      const chars = getCharactersByElementsOptimized(["土"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.fiveElement).toBe("土");
      });
    });

    it("handles multiple elements with optimized query", () => {
      const chars = getCharactersByElementsOptimized(["金", "水"]);
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(["金", "水"]).toContain(char.fiveElement);
      });
    });
  });

  describe("Pinyin Search", () => {
    it("finds characters by pinyin", () => {
      const chars = getCharactersByPinyin("lǐ");
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.pinyin.toLowerCase()).toBe("lǐ");
      });
    });

    it("finds characters by pinyin with tone", () => {
      const chars = getCharactersByPinyin("lǐ");
      expect(chars.length).toBeGreaterThan(0);

      chars.forEach((char) => {
        expect(char.pinyin).toBe("lǐ");
      });
    });

    it("finds common pinyin sounds", () => {
      const commonPinyins = ["wěi", "míng", "huá", "jūn", "jié"];

      commonPinyins.forEach((pinyin) => {
        const chars = getCharactersByPinyin(pinyin);
        expect(chars.length).toBeGreaterThan(0);
      });
    });

    it("returns empty array for non-existent pinyin", () => {
      const chars = getCharactersByPinyin("xyz");
      expect(chars).toEqual([]);
    });
  });

  describe("Combined Filters", () => {
    it("filters by element and pinyin", () => {
      const byElement = getCharactersByElements(["木"]);
      const byPinyin = byElement.filter((c) => c.pinyin === "mù");

      expect(byPinyin.length).toBeGreaterThan(0);

      byPinyin.forEach((char) => {
        expect(char.fiveElement).toBe("木");
        expect(char.pinyin).toBe("mù");
      });
    });

    it("filters by element and stroke count", () => {
      const byElement = getCharactersByElements(["水"]);
      const byStroke = byElement.filter((c) => c.strokeCount >= 8 && c.strokeCount <= 12);

      expect(byStroke.length).toBeGreaterThan(0);

      byStroke.forEach((char) => {
        expect(char.fiveElement).toBe("水");
        expect(char.strokeCount).toBeGreaterThanOrEqual(8);
        expect(char.strokeCount).toBeLessThanOrEqual(12);
      });
    });
  });

  describe("Character Data Quality", () => {
    it("returns characters with complete data", () => {
      const char = getCharacter("李");

      expect(char?.char).toBeDefined();
      expect(char?.pinyin).toBeDefined();
      expect(char?.tone).toBeDefined();
      expect(char?.strokeCount).toBeDefined();
      expect(char?.kangxiStrokeCount).toBeDefined();
      expect(char?.radical).toBeDefined();
      expect(char?.fiveElement).toBeDefined();
      expect(char?.meaning).toBeDefined();
    });

    it("has valid tone values (1-4)", () => {
      const chars = getCharactersByElements(["金"]);

      chars.forEach((char) => {
        expect(char.tone).toBeGreaterThanOrEqual(1);
        expect(char.tone).toBeLessThanOrEqual(4);
      });
    });

    it("has positive stroke counts", () => {
      const chars = getCharactersByElements(["木"]);

      chars.forEach((char) => {
        expect(char.strokeCount).toBeGreaterThan(0);
        expect(char.kangxiStrokeCount).toBeGreaterThan(0);
      });
    });

    it("has valid five elements", () => {
      const validElements = ["金", "木", "水", "火", "土"];
      const chars = getCharactersByElements(validElements);

      chars.forEach((char) => {
        expect(validElements).toContain(char.fiveElement);
      });
    });

    it("has non-empty meaning", () => {
      const chars = getCharactersByElements(["水"]);

      chars.forEach((char) => {
        expect(char.meaning).toBeDefined();
        expect(char.meaning.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Database Coverage", () => {
    it("has substantial character database", () => {
      const allChars = getCharactersByElements(["金", "木", "水", "火", "土"]);
      expect(allChars.length).toBeGreaterThan(1000);
    });

    it("has representation for all elements", () => {
      const elements: Array<"金" | "木" | "水" | "火" | "土"> = [
        "金",
        "木",
        "水",
        "火",
        "土",
      ];

      elements.forEach((element) => {
        const chars = getCharactersByElements([element]);
        expect(chars.length).toBeGreaterThan(100);
      });
    });

    it("has characters across stroke count ranges", () => {
      const allChars = getCharactersByElements(["金", "木", "水", "火", "土"]);

      // Check we have characters with various stroke counts
      const strokeCounts = new Set(allChars.map((c) => c.strokeCount));
      expect(strokeCounts.size).toBeGreaterThan(20); // Should have variety
    });
  });

  describe("Performance", () => {
    it("performs single character lookup quickly", () => {
      const start = Date.now();
      const char = getCharacter("李");
      const duration = Date.now() - start;

      expect(char).toBeDefined();
      expect(duration).toBeLessThan(10);
    });

    it("performs element filtering quickly", () => {
      const start = Date.now();
      const chars = getCharactersByElements(["水"]);
      const duration = Date.now() - start;

      expect(chars.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(50);
    });

    it("performs pinyin search quickly", () => {
      const start = Date.now();
      const chars = getCharactersByPinyin("wěi");
      const duration = Date.now() - start;

      expect(chars.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(50);
    });

    it("handles multiple sequential lookups efficiently", () => {
      const start = Date.now();

      for (let i = 0; i < 100; i++) {
        getCharacter("李");
        getCharacter("王");
        getCharacter("张");
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Edge Cases", () => {
    it("handles very long pinyin queries", () => {
      const chars = getCharactersByPinyin("aaaaaaaaaaaaaaaaaaaa");
      expect(chars).toEqual([]);
    });

    it("handles special characters in pinyin", () => {
      const chars = getCharactersByPinyin("li-wei");
      expect(Array.isArray(chars)).toBe(true);
    });
  });
});
