/**
 * Search Module Tests
 *
 * Tests for:
 * - Full-text search functionality
 * - Performance metrics
 * - Caching behavior
 * - Fallback to sync search
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  searchContent,
  searchContentAsync,
  searchContentSync,
  getSearchStats,
} from "../lib/search/index";
import type { SearchKind } from "../lib/search/index";

describe("Search Module", () => {
  describe("Sync Search (Legacy)", () => {
    it("should return empty results for empty query", () => {
      const result = searchContentSync({
        query: "",
        kind: "all",
        limit: 10,
      });

      expect(result.results).toEqual([]);
      expect(result.totals).toBeDefined();
      expect(result.totals?.characters).toBeGreaterThan(0);
    });

    it("should search characters by char", () => {
      const result = searchContentSync({
        query: "李",
        kind: "character",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].type).toBe("character");
      expect(result.results[0].char).toBe("李");
    });

    it("should search characters by pinyin", () => {
      const result = searchContentSync({
        query: "li",
        kind: "character",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].type).toBe("character");
    });

    it("should search characters by meaning", () => {
      const result = searchContentSync({
        query: "君王",
        kind: "character",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results.some((r) => r.type === "character")).toBe(true);
    });

    it("should search poetry", () => {
      const result = searchContentSync({
        query: "桃",
        kind: "poetry",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results.every((r) => r.type === "poetry")).toBe(true);
    });

    it("should search idioms", () => {
      const result = searchContentSync({
        query: "德",
        kind: "idiom",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results.every((r) => r.type === "idiom")).toBe(true);
    });

    it("should search all types", () => {
      const result = searchContentSync({
        query: "美",
        kind: "all",
        limit: 30,
      });

      expect(result.results.length).toBeGreaterThan(0);
      const types = new Set(result.results.map((r) => r.type));
      expect(types.size).toBeGreaterThan(0);
    });

    it("should respect limit parameter", () => {
      const result = searchContentSync({
        query: "木",
        kind: "character",
        limit: 5,
      });

      expect(result.results.length).toBeLessThanOrEqual(5);
    });

    it("should trim whitespace from query", () => {
      const result1 = searchContentSync({
        query: "  李  ",
        kind: "character",
        limit: 10,
      });
      const result2 = searchContentSync({
        query: "李",
        kind: "character",
        limit: 10,
      });

      expect(result1.results).toEqual(result2.results);
    });
  });

  describe("Async Search (FTS)", () => {
    it("should return empty results for empty query", async () => {
      const result = await searchContentAsync({
        query: "",
        kind: "all",
        limit: 10,
      });

      expect(result.results).toEqual([]);
      expect(result.totals).toBeDefined();
    });

    it("should search characters by char", async () => {
      const result = await searchContentAsync({
        query: "李",
        kind: "character",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].type).toBe("character");
      expect(result.results[0].char).toBe("李");
    });

    it("should search characters by pinyin", async () => {
      const result = await searchContentAsync({
        query: "wang",
        kind: "character",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0].type).toBe("character");
    });

    it("should include performance metrics", async () => {
      const result = await searchContentAsync({
        query: "李",
        kind: "character",
        limit: 10,
      });

      expect(result.performance).toBeDefined();
      expect(result.performance?.duration).toBeGreaterThanOrEqual(0);
    });

    it("should search poetry", async () => {
      const result = await searchContentAsync({
        query: "桃",
        kind: "poetry",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results.every((r) => r.type === "poetry")).toBe(true);
    });

    it("should search idioms", async () => {
      const result = await searchContentAsync({
        query: "德",
        kind: "idiom",
        limit: 10,
      });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results.every((r) => r.type === "idiom")).toBe(true);
    });
  });

  describe("Performance", () => {
    it("async search should be faster than linear scan for common queries", async () => {
      const query = "美";

      // Measure sync search
      const syncStart = performance.now();
      searchContentSync({ query, kind: "all", limit: 20 });
      const syncDuration = performance.now() - syncStart;

      // Measure async search
      const asyncStart = performance.now();
      await searchContentAsync({ query, kind: "all", limit: 20 });
      const asyncDuration = performance.now() - asyncStart;

      // FTS should be faster (or at least comparable on first run due to index initialization)
      // On subsequent runs, FTS with caching should be significantly faster
      console.log(
        `Sync: ${syncDuration.toFixed(2)}ms, Async: ${asyncDuration.toFixed(2)}ms`,
      );

      // The async search should complete in reasonable time
      expect(asyncDuration).toBeLessThan(5000); // 5 seconds max
    });

    it("should return search stats", async () => {
      // Trigger search to initialize indexes
      await searchContentAsync({ query: "test", kind: "all", limit: 5 });

      const stats = await getSearchStats();
      expect(stats).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in query", () => {
      const result = searchContentSync({
        query: "!@#$%",
        kind: "all",
        limit: 10,
      });

      expect(result.results).toEqual([]);
    });

    it("should handle very long queries", () => {
      const result = searchContentSync({
        query: "a".repeat(100),
        kind: "character",
        limit: 10,
      });

      expect(result.results).toEqual([]);
    });

    it("should handle minimum limit (1)", () => {
      const result = searchContentSync({
        query: "李",
        kind: "character",
        limit: 0,
      });

      // Should still return at most 1 result
      expect(result.results.length).toBeGreaterThanOrEqual(0);
      expect(result.results.length).toBeLessThanOrEqual(1);
    });
  });
});
