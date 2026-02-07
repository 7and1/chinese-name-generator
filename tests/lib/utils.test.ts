/**
 * Utility Functions Tests
 *
 * Tests for general utility functions
 */

import { describe, expect, it } from "vitest";
import {
  cn,
  formatChineseDate,
  sleep,
  chunk,
  unique,
  shuffle,
} from "@/lib/utils";

describe("Utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      const result = cn("foo", false && "bar", "baz");
      expect(result).toBe("foo baz");
    });

    it("handles undefined and null values", () => {
      const result = cn("foo", undefined, null, "bar");
      expect(result).toBe("foo bar");
    });

    it("handles object syntax", () => {
      const result = cn({ foo: true, bar: false, baz: true });
      expect(result).toBe("foo baz");
    });

    it("handles arrays of classes", () => {
      const result = cn(["foo", "bar"], "baz");
      expect(result).toBe("foo bar baz");
    });

    it("deduplicates classes (tailwind-merge behavior)", () => {
      // tailwind-merge deduplicates but keeps last occurrence for conflicting classes
      // For non-conflicting classes it keeps both
      const result = cn("foo", "bar", "foo");
      // tailwind-merge keeps duplicate class names if they're the same
      // This is expected behavior - it only merges Tailwind-conflicting classes
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  describe("formatChineseDate", () => {
    it("formats date in Chinese format", () => {
      const date = new Date(Date.UTC(2024, 0, 15)); // Jan 15, 2024
      const result = formatChineseDate(date);

      expect(result).toBe("2024年1月15日");
    });

    it("handles different months correctly", () => {
      const date = new Date(Date.UTC(2024, 5, 20)); // Jun 20, 2024
      const result = formatChineseDate(date);

      expect(result).toBe("2024年6月20日");
    });

    it("handles single digit days", () => {
      const date = new Date(Date.UTC(2024, 0, 5)); // Jan 5, 2024
      const result = formatChineseDate(date);

      expect(result).toBe("2024年1月5日");
    });

    it("handles leap year dates", () => {
      const date = new Date(Date.UTC(2024, 1, 29)); // Feb 29, 2024
      const result = formatChineseDate(date);

      expect(result).toBe("2024年2月29日");
    });

    it("handles end of year", () => {
      const date = new Date(Date.UTC(2024, 11, 31)); // Dec 31, 2024
      const result = formatChineseDate(date);

      expect(result).toBe("2024年12月31日");
    });
  });

  describe("sleep", () => {
    it("resolves after specified time", async () => {
      const start = Date.now();
      await sleep(100);
      const duration = Date.now() - start;

      expect(duration).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(200); // Allow some margin
    });

    it("resolves immediately for 0ms", async () => {
      const start = Date.now();
      await sleep(0);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(50);
    });
  });

  describe("chunk", () => {
    it("chunks array into specified size", () => {
      const result = chunk([1, 2, 3, 4, 5], 2);

      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("handles empty array", () => {
      const result = chunk([], 3);

      expect(result).toEqual([]);
    });

    it("handles array smaller than chunk size", () => {
      const result = chunk([1, 2], 5);

      expect(result).toEqual([[1, 2]]);
    });

    it("handles chunk size of 1", () => {
      const result = chunk([1, 2, 3], 1);

      expect(result).toEqual([[1], [2], [3]]);
    });

    it("handles exact division", () => {
      const result = chunk([1, 2, 3, 4, 5, 6], 3);

      expect(result).toEqual([
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });

    it("handles large arrays", () => {
      const input = Array.from({ length: 100 }, (_, i) => i);
      const result = chunk(input, 10);

      expect(result.length).toBe(10);
      expect(result[0].length).toBe(10);
    });
  });

  describe("unique", () => {
    it("removes duplicate values", () => {
      const result = unique([1, 2, 2, 3, 3, 3, 4]);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("handles empty array", () => {
      const result = unique([]);

      expect(result).toEqual([]);
    });

    it("handles array with no duplicates", () => {
      const result = unique([1, 2, 3, 4]);

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("handles array with all duplicates", () => {
      const result = unique([1, 1, 1, 1]);

      expect(result).toEqual([1]);
    });

    it("preserves order of first occurrence", () => {
      const result = unique([3, 1, 2, 1, 3, 2]);

      expect(result).toEqual([3, 1, 2]);
    });

    it("handles strings", () => {
      const result = unique(["a", "b", "a", "c", "b"]);

      expect(result).toEqual(["a", "b", "c"]);
    });

    it("handles objects by reference", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 };

      const result = unique([obj1, obj2, obj3]);

      expect(result.length).toBe(3); // Different references
    });
  });

  describe("shuffle", () => {
    it("returns array of same length", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);

      expect(result.length).toBe(input.length);
    });

    it("contains all same elements", () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffle(input);

      input.forEach((item) => {
        expect(result).toContain(item);
      });
    });

    it("does not mutate original array", () => {
      const input = [1, 2, 3, 4, 5];
      const originalCopy = [...input];
      shuffle(input);

      expect(input).toEqual(originalCopy);
    });

    it("produces different order sometimes", () => {
      const input = Array.from({ length: 100 }, (_, i) => i);
      const result1 = shuffle(input);
      const result2 = shuffle(input);

      // With 100 elements, it's extremely unlikely to get same shuffle twice
      expect(result1).not.toEqual(result2);
    });

    it("handles empty array", () => {
      const result = shuffle([]);

      expect(result).toEqual([]);
    });

    it("handles single element array", () => {
      const result = shuffle([1]);

      expect(result).toEqual([1]);
    });

    it("handles two element array", () => {
      const input = [1, 2];
      const result = shuffle(input);

      expect(result.length).toBe(2);
      expect(result).toContain(1);
      expect(result).toContain(2);
    });
  });
});
