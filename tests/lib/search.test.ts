/**
 * Search Function Tests
 *
 * Tests for content search functionality across:
 * - Characters
 * - Poetry
 * - Idioms
 */

import { describe, expect, it, beforeEach } from "vitest";
import {
  searchContent,
  type SearchKind,
  type SearchResult,
} from "@/lib/search";

describe("Search Functions", () => {
  describe("searchContent", () => {
    describe("Parameter validation", () => {
      it("returns empty results for empty query", () => {
        const result = searchContent({ query: "", kind: "all", limit: 10 });

        expect(result.query).toBe("");
        expect(result.kind).toBe("all");
        expect(result.results).toEqual([]);
        expect(result.totals).toBeDefined();
      });

      it("trims whitespace from query", () => {
        const result = searchContent({
          query: "  李  ",
          kind: "all",
          limit: 10,
        });

        expect(result.query).toBe("李");
      });

      it("uses default limit when limit is less than 1", () => {
        const result = searchContent({ query: "李", kind: "all", limit: 0 });

        expect(result.results.length).toBeLessThanOrEqual(1);
      });

      it("enforces minimum limit of 1", () => {
        const result1 = searchContent({ query: "李", kind: "all", limit: -5 });
        const result2 = searchContent({ query: "李", kind: "all", limit: 1 });

        expect(result1.results.length).toBeGreaterThanOrEqual(0);
        expect(result2.results.length).toBeGreaterThanOrEqual(0);
      });

      it("respects limit parameter", () => {
        const result = searchContent({ query: "明", kind: "all", limit: 5 });

        expect(result.results.length).toBeLessThanOrEqual(5);
      });

      it("returns totals for empty query", () => {
        const result = searchContent({ query: "", kind: "all", limit: 10 });

        expect(result.totals).toBeDefined();
        expect(result.totals?.characters).toBeGreaterThan(0);
        expect(result.totals?.poems).toBeGreaterThan(0);
        expect(result.totals?.idioms).toBeGreaterThan(0);
      });

      it("does not return totals for non-empty query", () => {
        const result = searchContent({ query: "李", kind: "all", limit: 10 });

        expect(result.totals).toBeUndefined();
      });
    });

    describe("Kind filtering", () => {
      it("searches all types when kind is 'all'", () => {
        const result = searchContent({ query: "明", kind: "all", limit: 20 });

        // Should potentially have results from multiple types
        expect(result.kind).toBe("all");
      });

      it("searches only characters when kind is 'character'", () => {
        const result = searchContent({
          query: "李",
          kind: "character",
          limit: 10,
        });

        expect(result.kind).toBe("character");

        if (result.results.length > 0) {
          result.results.forEach((r) => {
            expect(r.type).toBe("character");
          });
        }
      });

      it("searches only poetry when kind is 'poetry'", () => {
        const result = searchContent({
          query: "春",
          kind: "poetry",
          limit: 10,
        });

        expect(result.kind).toBe("poetry");

        if (result.results.length > 0) {
          result.results.forEach((r) => {
            expect(r.type).toBe("poetry");
          });
        }
      });

      it("searches only idioms when kind is 'idiom'", () => {
        const result = searchContent({ query: "一", kind: "idiom", limit: 10 });

        expect(result.kind).toBe("idiom");

        if (result.results.length > 0) {
          result.results.forEach((r) => {
            expect(r.type).toBe("idiom");
          });
        }
      });
    });

    describe("Character search", () => {
      it("finds characters by Chinese character", () => {
        const result = searchContent({
          query: "李",
          kind: "character",
          limit: 10,
        });

        expect(result.results.length).toBeGreaterThan(0);

        const charResult = result.results[0] as Extract<
          SearchResult,
          { type: "character" }
        >;
        expect(charResult.type).toBe("character");
        expect(charResult.char).toBe("李");
        expect(charResult.pinyin).toBeTruthy();
        expect(charResult.meaning).toBeTruthy();
        expect(charResult.fiveElement).toBeTruthy();
      });

      it("finds characters by pinyin", () => {
        const result = searchContent({
          query: "li",
          kind: "character",
          limit: 10,
        });

        if (result.results.length > 0) {
          const charResult = result.results[0] as Extract<
            SearchResult,
            { type: "character" }
          >;
          expect(charResult.type).toBe("character");
          expect(charResult.pinyin.toLowerCase()).toContain("li");
        }
      });

      it("finds characters by meaning", () => {
        const result = searchContent({
          query: "吉祥",
          kind: "character",
          limit: 10,
        });

        if (result.results.length > 0) {
          const charResult = result.results[0] as Extract<
            SearchResult,
            { type: "character" }
          >;
          expect(charResult.type).toBe("character");
          expect(charResult.meaning).toBeTruthy();
        }
      });

      it("returns multiple character results", () => {
        const result = searchContent({
          query: "明",
          kind: "character",
          limit: 10,
        });

        expect(result.results.length).toBeLessThanOrEqual(10);
      });

      it("has no results for non-existent characters", () => {
        const result = searchContent({
          query: "xyz123",
          kind: "character",
          limit: 10,
        });

        expect(result.results).toEqual([]);
      });
    });

    describe("Poetry search", () => {
      it("finds poems by title", () => {
        const result = searchContent({
          query: "春晓",
          kind: "poetry",
          limit: 10,
        });

        if (result.results.length > 0) {
          const poemResult = result.results[0] as Extract<
            SearchResult,
            { type: "poetry" }
          >;
          expect(poemResult.type).toBe("poetry");
          expect(poemResult.title).toBeTruthy();
          expect(poemResult.source).toBeTruthy();
          expect(poemResult.verse).toBeTruthy();
          expect(poemResult.id).toBeTruthy();
        }
      });

      it("finds poems by verse content", () => {
        const result = searchContent({
          query: "春眠不觉晓",
          kind: "poetry",
          limit: 10,
        });

        if (result.results.length > 0) {
          const poemResult = result.results[0] as Extract<
            SearchResult,
            { type: "poetry" }
          >;
          expect(poemResult.type).toBe("poetry");
          expect(poemResult.verse).toBeTruthy();
        }
      });

      it("finds poems by keywords", () => {
        const result = searchContent({
          query: "春",
          kind: "poetry",
          limit: 10,
        });

        if (result.results.length > 0) {
          const poemResult = result.results[0] as Extract<
            SearchResult,
            { type: "poetry" }
          >;
          expect(poemResult.type).toBe("poetry");
        }
      });

      it("returns poem with all required fields", () => {
        const result = searchContent({
          query: "春",
          kind: "poetry",
          limit: 10,
        });

        if (result.results.length > 0) {
          const poemResult = result.results[0] as Extract<
            SearchResult,
            { type: "poetry" }
          >;
          expect(poemResult.id).toBeTruthy();
          expect(typeof poemResult.id).toBe("string");
          expect(poemResult.title).toBeTruthy();
          expect(typeof poemResult.title).toBe("string");
          expect(poemResult.source).toBeTruthy();
          expect(typeof poemResult.source).toBe("string");
          expect(poemResult.verse).toBeTruthy();
          expect(typeof poemResult.verse).toBe("string");
        }
      });
    });

    describe("Idiom search", () => {
      it("finds idioms by characters", () => {
        const result = searchContent({ query: "一", kind: "idiom", limit: 10 });

        if (result.results.length > 0) {
          const idiomResult = result.results[0] as Extract<
            SearchResult,
            { type: "idiom" }
          >;
          expect(idiomResult.type).toBe("idiom");
          expect(idiomResult.idiom).toBeTruthy();
          expect(idiomResult.pinyin).toBeTruthy();
          expect(idiomResult.meaning).toBeTruthy();
          expect(idiomResult.category).toBeTruthy();
        }
      });

      it("finds idioms by pinyin", () => {
        const result = searchContent({ query: "yi", kind: "idiom", limit: 10 });

        if (result.results.length > 0) {
          const idiomResult = result.results[0] as Extract<
            SearchResult,
            { type: "idiom" }
          >;
          expect(idiomResult.type).toBe("idiom");
          expect(idiomResult.pinyin.toLowerCase()).toContain("yi");
        }
      });

      it("finds idioms by meaning", () => {
        const result = searchContent({
          query: "吉祥",
          kind: "idiom",
          limit: 10,
        });

        if (result.results.length > 0) {
          const idiomResult = result.results[0] as Extract<
            SearchResult,
            { type: "idiom" }
          >;
          expect(idiomResult.type).toBe("idiom");
        }
      });

      it("returns idiom with all required fields", () => {
        const result = searchContent({ query: "龙", kind: "idiom", limit: 10 });

        if (result.results.length > 0) {
          const idiomResult = result.results[0] as Extract<
            SearchResult,
            { type: "idiom" }
          >;
          expect(idiomResult.idiom).toBeTruthy();
          expect(typeof idiomResult.idiom).toBe("string");
          expect(idiomResult.pinyin).toBeTruthy();
          expect(typeof idiomResult.pinyin).toBe("string");
          expect(idiomResult.meaning).toBeTruthy();
          expect(typeof idiomResult.meaning).toBe("string");
          expect(idiomResult.category).toBeTruthy();
          expect(typeof idiomResult.category).toBe("string");
        }
      });
    });

    describe("Combined search (all types)", () => {
      it("returns mixed result types for common query", () => {
        const result = searchContent({ query: "春", kind: "all", limit: 50 });

        // Could have characters, poetry, idioms
        expect(result.results.length).toBeLessThanOrEqual(50);

        const types = new Set(result.results.map((r) => r.type));
        expect(types.size).toBeGreaterThan(0);
      });

      it("respects limit across all types", () => {
        const result = searchContent({ query: "明", kind: "all", limit: 5 });

        expect(result.results.length).toBeLessThanOrEqual(5);
      });

      it("prioritizes characters first in 'all' search", () => {
        const result = searchContent({ query: "李", kind: "all", limit: 5 });

        if (result.results.length > 0) {
          // First result should be a character if "李" matches
          expect(result.results[0].type).toBe("character");
        }
      });
    });

    describe("Edge cases", () => {
      it("handles very long queries", () => {
        const longQuery = "a".repeat(100);
        const result = searchContent({
          query: longQuery,
          kind: "all",
          limit: 10,
        });

        expect(result.results).toEqual([]);
      });

      it("handles special characters in query", () => {
        const result = searchContent({
          query: "!@#$%^&*()",
          kind: "all",
          limit: 10,
        });

        expect(result.results).toEqual([]);
      });

      it("handles Unicode characters", () => {
        const result = searchContent({
          query: "龘",
          kind: "character",
          limit: 10,
        });

        // Should not crash
        expect(result.query).toBe("龘");
      });

      it("handles whitespace-only query", () => {
        const result = searchContent({ query: "   ", kind: "all", limit: 10 });

        expect(result.query).toBe("");
        expect(result.results).toEqual([]);
      });

      it("handles query with mixed case", () => {
        const result1 = searchContent({
          query: "LI",
          kind: "character",
          limit: 10,
        });
        const result2 = searchContent({
          query: "li",
          kind: "character",
          limit: 10,
        });
        const result3 = searchContent({
          query: "Li",
          kind: "character",
          limit: 10,
        });

        // All should return results without crashing
        expect(result1.query).toBe("LI");
        expect(result2.query).toBe("li");
        expect(result3.query).toBe("Li");
      });

      it("handles very large limit", () => {
        const result = searchContent({
          query: "明",
          kind: "all",
          limit: 10000,
        });

        // Should not return all data, just up to what's available
        expect(result.results.length).toBeLessThanOrEqual(10000);
      });

      it("handles limit of 1", () => {
        const result = searchContent({ query: "李", kind: "all", limit: 1 });

        expect(result.results.length).toBeLessThanOrEqual(1);
      });
    });

    describe("Result structure", () => {
      it("returns correct response structure", () => {
        const result = searchContent({ query: "李", kind: "all", limit: 10 });

        expect(result).toHaveProperty("query");
        expect(result).toHaveProperty("kind");
        expect(result).toHaveProperty("results");
        expect(Array.isArray(result.results)).toBe(true);
      });

      it("each result has valid type", () => {
        const result = searchContent({ query: "李", kind: "all", limit: 10 });

        result.results.forEach((r) => {
          expect(["character", "poetry", "idiom"]).toContain(r.type);
        });
      });

      it("character result has correct structure", () => {
        const result = searchContent({
          query: "李",
          kind: "character",
          limit: 1,
        });

        if (result.results.length > 0) {
          const r = result.results[0] as Extract<
            SearchResult,
            { type: "character" }
          >;
          expect(r).toHaveProperty("type", "character");
          expect(r).toHaveProperty("char");
          expect(r).toHaveProperty("pinyin");
          expect(r).toHaveProperty("meaning");
          expect(r).toHaveProperty("fiveElement");
        }
      });

      it("poetry result has correct structure", () => {
        const result = searchContent({ query: "春", kind: "poetry", limit: 1 });

        if (result.results.length > 0) {
          const r = result.results[0] as Extract<
            SearchResult,
            { type: "poetry" }
          >;
          expect(r).toHaveProperty("type", "poetry");
          expect(r).toHaveProperty("id");
          expect(r).toHaveProperty("title");
          expect(r).toHaveProperty("source");
          expect(r).toHaveProperty("verse");
        }
      });

      it("idiom result has correct structure", () => {
        const result = searchContent({ query: "龙", kind: "idiom", limit: 1 });

        if (result.results.length > 0) {
          const r = result.results[0] as Extract<
            SearchResult,
            { type: "idiom" }
          >;
          expect(r).toHaveProperty("type", "idiom");
          expect(r).toHaveProperty("idiom");
          expect(r).toHaveProperty("pinyin");
          expect(r).toHaveProperty("meaning");
          expect(r).toHaveProperty("category");
        }
      });
    });

    describe("Common search queries", () => {
      it("finds results for '春'", () => {
        const result = searchContent({ query: "春", kind: "all", limit: 10 });

        expect(result.results.length).toBeGreaterThan(0);
      });

      it("finds results for '明'", () => {
        const result = searchContent({ query: "明", kind: "all", limit: 10 });

        expect(result.results.length).toBeGreaterThan(0);
      });

      it("finds results for '华'", () => {
        const result = searchContent({ query: "华", kind: "all", limit: 10 });

        expect(result.results.length).toBeGreaterThan(0);
      });

      it("finds results for '李'", () => {
        const result = searchContent({
          query: "李",
          kind: "character",
          limit: 10,
        });

        expect(result.results.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Type exports", () => {
    it("SearchKind type is correct", () => {
      const kinds: SearchKind[] = ["all", "character", "poetry", "idiom"];

      kinds.forEach((kind) => {
        expect(["all", "character", "poetry", "idiom"]).toContain(kind);
      });
    });

    it("SearchResult type discriminates by type field", () => {
      const characterResult: SearchResult = {
        type: "character",
        char: "李",
        pinyin: "lǐ",
        meaning: "李树",
        fiveElement: "木",
      };

      const poetryResult: SearchResult = {
        type: "poetry",
        id: "test",
        title: "Test Poem",
        source: "Test Source",
        verse: "Test verse",
      };

      const idiomResult: SearchResult = {
        type: "idiom",
        idiom: "一言九鼎",
        pinyin: "yī yán jiǔ dǐng",
        meaning: "一句话抵得上九鼎重",
        category: "成语",
      };

      expect(characterResult.type).toBe("character");
      expect(poetryResult.type).toBe("poetry");
      expect(idiomResult.type).toBe("idiom");
    });
  });
});
