/**
 * BaZi (八字) Engine Tests
 *
 * Tests for Four Pillars calculation, Five Elements analysis,
 * and favorable/unfavorable element determination
 */

import { describe, expect, it } from "vitest";
import {
  calculateBaZi,
  calculateBaZiFromYmd,
  calculateBaZiScore,
  getElementPercentages,
  formatBaZiChart,
  getElementAnalysis,
} from "@/lib/engines/bazi";
import type { FiveElement, BaZiChart } from "@/lib/types";
import {
  STEM_ELEMENTS,
  BRANCH_ELEMENTS,
  ELEMENT_GENERATION,
  ELEMENT_DESTRUCTION,
  BAZI_SCORE_ADJUSTMENTS,
  MIN_UNIQUE_FAVORABLE_FOR_BONUS,
} from "@/lib/constants";

describe("BaZi Engine", () => {
  describe("calculateBaZiFromYmd", () => {
    it("calculates pillars for a known date (1990-12-23, hour 8)", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);

      expect(chart.year).toEqual({ stem: "庚", branch: "午" });
      expect(chart.month).toEqual({ stem: "戊", branch: "子" });
      expect(chart.day).toEqual({ stem: "壬", branch: "戌" });
      expect(chart.hour).toEqual({ stem: "甲", branch: "辰" });
    });

    it("uses default hour 0 when birthHour is not provided", async () => {
      const chartWithHour = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const chartWithoutHour = await calculateBaZiFromYmd(1990, 12, 23);

      expect(chartWithHour.year).toEqual(chartWithoutHour.year);
      expect(chartWithHour.month).toEqual(chartWithoutHour.month);
      expect(chartWithHour.day).toEqual(chartWithoutHour.day);
      // Hour pillar should be different
      expect(chartWithHour.hour).not.toEqual(chartWithoutHour.hour);
    });

    it("returns valid day master (Heavenly Stem of Day Pillar)", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      expect(chart.dayMaster).toBe(chart.day.stem);
      expect([
        "甲",
        "乙",
        "丙",
        "丁",
        "戊",
        "己",
        "庚",
        "辛",
        "壬",
        "癸",
      ]).toContain(chart.dayMaster);
    });

    it("calculates element balance for all pillars", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);

      // Total elements should be 8 (4 pillars * 2 positions)
      const totalElements = Object.values(chart.elements).reduce(
        (sum, count) => sum + count,
        0,
      );
      expect(totalElements).toBe(8);

      // All five elements should be present in the balance object
      expect(chart.elements).toHaveProperty("金");
      expect(chart.elements).toHaveProperty("木");
      expect(chart.elements).toHaveProperty("水");
      expect(chart.elements).toHaveProperty("火");
      expect(chart.elements).toHaveProperty("土");
    });

    it("determines favorable and unfavorable elements", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);

      expect(chart.favorableElements.length).toBeGreaterThan(0);
      expect(chart.unfavorableElements.length).toBeGreaterThan(0);
      expect(chart.favorableElements.length).toBeLessThanOrEqual(5);
      expect(chart.unfavorableElements.length).toBeLessThanOrEqual(5);
    });

    it("ensures favorable and unfavorable elements don't overlap", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);

      const favorableSet = new Set(chart.favorableElements);
      const hasOverlap = chart.unfavorableElements.some((el) =>
        favorableSet.has(el),
      );
      expect(hasOverlap).toBe(false);
    });

    it("calculates for leap year dates", async () => {
      const chart = await calculateBaZiFromYmd(2000, 2, 29, 12); // Leap day

      expect(chart.year.stem).toBeTruthy();
      expect(chart.year.branch).toBeTruthy();
      expect(chart.month.stem).toBeTruthy();
      expect(chart.day.stem).toBeTruthy();
    });
  });

  describe("calculateBaZi (Date object)", () => {
    it("calculates BaZi from Date object using UTC", async () => {
      const date = new Date(Date.UTC(1990, 11, 23, 8, 0, 0)); // Dec 23, 1990
      const chart = await calculateBaZi(date, 8);

      expect(chart.year).toEqual({ stem: "庚", branch: "午" });
      expect(chart.day).toEqual({ stem: "壬", branch: "戌" });
    });

    it("handles Date objects without explicit hour", async () => {
      const date = new Date(Date.UTC(1990, 11, 23));
      const chart = await calculateBaZi(date);

      expect(chart.day).toBeDefined();
      expect(chart.hour).toBeDefined();
    });
  });

  describe("calculateBaZiScore", () => {
    it("returns score between 0 and 100", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const nameElements: FiveElement[] = ["木", "火"];

      const score = calculateBaZiScore(chart, nameElements);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("increases score for favorable elements", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const favorableElements = chart.favorableElements;

      if (favorableElements.length >= 2) {
        const scoreWithFavorable = calculateBaZiScore(chart, [
          favorableElements[0],
          favorableElements[1],
        ]);

        const scoreWithUnfavorable = calculateBaZiScore(
          chart,
          chart.unfavorableElements,
        );

        expect(scoreWithFavorable).toBeGreaterThan(scoreWithUnfavorable);
      }
    });

    it("decreases score for unfavorable elements", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const baseScore = calculateBaZiScore(chart, []);

      // With one favorable element
      const scoreWithFavorable = calculateBaZiScore(chart, [
        chart.favorableElements[0] || "木",
      ]);

      // With one unfavorable element
      const scoreWithUnfavorable = calculateBaZiScore(chart, [
        chart.unfavorableElements[0] || "金",
      ]);

      expect(scoreWithFavorable).toBeGreaterThan(baseScore);
      expect(scoreWithUnfavorable).toBeLessThan(baseScore);
    });

    it("adds bonus for variety of favorable elements", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);

      if (chart.favorableElements.length >= 2) {
        const sameElementScore = calculateBaZiScore(chart, [
          chart.favorableElements[0],
          chart.favorableElements[0],
        ]);

        const varietyScore = calculateBaZiScore(chart, [
          chart.favorableElements[0],
          chart.favorableElements[1],
        ]);

        expect(varietyScore).toBeGreaterThan(sameElementScore);
      }
    });
  });

  describe("getElementPercentages", () => {
    it("calculates percentages that sum to approximately 100", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const percentages = getElementPercentages(chart.elements);

      const sum = Object.values(percentages).reduce((sum, val) => sum + val, 0);
      // Sum may be 100 or slightly different due to rounding
      expect(sum).toBeGreaterThanOrEqual(98);
      expect(sum).toBeLessThanOrEqual(102);
    });

    it("returns integer percentages", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const percentages = getElementPercentages(chart.elements);

      for (const element in percentages) {
        expect(Number.isInteger(percentages[element as FiveElement])).toBe(
          true,
        );
      }
    });

    it("handles all zero elements gracefully", () => {
      const emptyBalance = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
      const percentages = getElementPercentages(emptyBalance);

      // When all zeros, returns NaN for percentages - check it doesn't crash
      expect(percentages).toBeDefined();
      expect(Object.keys(percentages)).toHaveLength(5);
    });
  });

  describe("formatBaZiChart", () => {
    it("formats chart as readable string", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const formatted = formatBaZiChart(chart);

      expect(formatted).toContain("年柱");
      expect(formatted).toContain("月柱");
      expect(formatted).toContain("日柱");
      expect(formatted).toContain("时柱");
      expect(formatted).toContain("五行分布");
      expect(formatted).toContain("喜用神");
      expect(formatted).toContain("忌神");
    });

    it("includes day master in formatted output", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const formatted = formatBaZiChart(chart);

      expect(formatted).toContain("日主");
      expect(formatted).toContain(chart.dayMaster);
    });
  });

  describe("getElementAnalysis", () => {
    it("returns descriptive analysis for weak day master", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const analysis = getElementAnalysis(chart);

      expect(analysis).toBeTruthy();
      expect(typeof analysis).toBe("string");
      expect(analysis.length).toBeGreaterThan(10);
    });

    it("returns descriptive analysis for strong day master", async () => {
      // Find a date with strong day master (>= 2 occurrences)
      const chart = await calculateBaZiFromYmd(1985, 5, 15, 10);
      const analysis = getElementAnalysis(chart);

      expect(analysis).toBeTruthy();
      expect(typeof analysis).toBe("string");
    });

    it("includes favorable elements in analysis", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const analysis = getElementAnalysis(chart);

      chart.favorableElements.forEach((element) => {
        expect(analysis).toContain(element);
      });
    });
  });

  describe("Five Elements Integration", () => {
    it("uses correct element mapping for Heavenly Stems", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const allStems = [
        chart.year.stem,
        chart.month.stem,
        chart.day.stem,
        chart.hour.stem,
      ];

      allStems.forEach((stem) => {
        expect(STEM_ELEMENTS[stem]).toBeDefined();
        expect(["金", "木", "水", "火", "土"]).toContain(STEM_ELEMENTS[stem]);
      });
    });

    it("uses correct element mapping for Earthly Branches", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const allBranches = [
        chart.year.branch,
        chart.month.branch,
        chart.day.branch,
        chart.hour.branch,
      ];

      allBranches.forEach((branch) => {
        expect(BRANCH_ELEMENTS[branch]).toBeDefined();
        expect(["金", "木", "水", "火", "土"]).toContain(
          BRANCH_ELEMENTS[branch],
        );
      });
    });

    it("validates element generation cycle", () => {
      expect(ELEMENT_GENERATION["木"]).toBe("火");
      expect(ELEMENT_GENERATION["火"]).toBe("土");
      expect(ELEMENT_GENERATION["土"]).toBe("金");
      expect(ELEMENT_GENERATION["金"]).toBe("水");
      expect(ELEMENT_GENERATION["水"]).toBe("木");
    });

    it("validates element destruction cycle", () => {
      expect(ELEMENT_DESTRUCTION["木"]).toBe("土");
      expect(ELEMENT_DESTRUCTION["土"]).toBe("水");
      expect(ELEMENT_DESTRUCTION["水"]).toBe("火");
      expect(ELEMENT_DESTRUCTION["火"]).toBe("金");
      expect(ELEMENT_DESTRUCTION["金"]).toBe("木");
    });
  });

  describe("Edge Cases", () => {
    it("handles minimum valid date (year 1900)", async () => {
      const chart = await calculateBaZiFromYmd(1900, 1, 1, 0);

      expect(chart.year).toBeDefined();
      expect(chart.day).toBeDefined();
      expect(chart.favorableElements).toBeDefined();
    });

    it("handles far future dates", async () => {
      const chart = await calculateBaZiFromYmd(2100, 12, 31, 23);

      expect(chart.year).toBeDefined();
      expect(chart.day).toBeDefined();
      expect(chart.favorableElements).toBeDefined();
    });

    it("handles all valid hours (0-23)", async () => {
      const results = [];
      for (let hour = 0; hour <= 23; hour++) {
        const chart = await calculateBaZiFromYmd(1990, 12, 23, hour);
        results.push(chart.hour);
      }

      // All hours should produce valid hour pillars
      results.forEach((hourPillar) => {
        expect(hourPillar.stem).toBeTruthy();
        expect(hourPillar.branch).toBeTruthy();
      });

      // Different hours should produce different hour pillars (at least some)
      const uniqueResults = new Set(results.map((h) => `${h.stem}${h.branch}`));
      expect(uniqueResults.size).toBeGreaterThan(1);
    });

    it("handles empty name elements array", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const score = calculateBaZiScore(chart, []);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("handles all favorable elements in name", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const score = calculateBaZiScore(chart, chart.favorableElements);

      expect(score).toBeGreaterThan(70); // Should be high score
    });

    it("handles all unfavorable elements in name", async () => {
      const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
      const score = calculateBaZiScore(chart, chart.unfavorableElements);

      expect(score).toBeLessThan(70); // Should be lower score
    });
  });
});
