import { describe, it, expect, beforeEach } from "vitest";
import {
  PERFORMANCE_THRESHOLDS,
  isGoodMetric,
  getMetricRating,
  calculatePerformanceScore,
  getPerformanceRecommendations,
} from "@/lib/performance/web-vitals";

describe("Web Vitals Utilities", () => {
  describe("PERFORMANCE_THRESHOLDS", () => {
    it("should have thresholds for all core metrics", () => {
      expect(PERFORMANCE_THRESHOLDS).toHaveProperty("lcp");
      expect(PERFORMANCE_THRESHOLDS).toHaveProperty("fcp");
      expect(PERFORMANCE_THRESHOLDS).toHaveProperty("cls");
      // Note: FID was replaced with INP in newer Web Vitals
      // expect(PERFORMANCE_THRESHOLDS).toHaveProperty("fid");
      expect(PERFORMANCE_THRESHOLDS).toHaveProperty("inp");
      expect(PERFORMANCE_THRESHOLDS).toHaveProperty("ttfb");
    });

    it("should have reasonable threshold values", () => {
      expect(PERFORMANCE_THRESHOLDS.lcp.good).toBeLessThan(
        PERFORMANCE_THRESHOLDS.lcp.needsImprovement,
      );
      expect(PERFORMANCE_THRESHOLDS.cls.good).toBeLessThan(
        PERFORMANCE_THRESHOLDS.cls.needsImprovement,
      );
      expect(PERFORMANCE_THRESHOLDS.fcp.good).toBeLessThan(
        PERFORMANCE_THRESHOLDS.fcp.needsImprovement,
      );
    });
  });

  describe("isGoodMetric", () => {
    it("should return true for good LCP values", () => {
      expect(isGoodMetric("lcp", 2000)).toBe(true);
      expect(isGoodMetric("lcp", 2500)).toBe(true);
      expect(isGoodMetric("lcp", 3000)).toBe(false);
    });

    it("should return true for good CLS values", () => {
      expect(isGoodMetric("cls", 0.05)).toBe(true);
      expect(isGoodMetric("cls", 0.1)).toBe(true);
      expect(isGoodMetric("cls", 0.2)).toBe(false);
    });

    it("should return true for good FCP values", () => {
      expect(isGoodMetric("fcp", 1500)).toBe(true);
      expect(isGoodMetric("fcp", 1800)).toBe(true);
      expect(isGoodMetric("fcp", 2500)).toBe(false);
    });

    it("should return true for good INP values", () => {
      expect(isGoodMetric("inp", 150)).toBe(true);
      expect(isGoodMetric("inp", 200)).toBe(true);
      expect(isGoodMetric("inp", 300)).toBe(false);
    });

    it("should return true for good TTFB values", () => {
      expect(isGoodMetric("ttfb", 600)).toBe(true);
      expect(isGoodMetric("ttfb", 800)).toBe(true);
      expect(isGoodMetric("ttfb", 1000)).toBe(false);
    });
  });

  describe("getMetricRating", () => {
    it("should return 'good' for values at or below good threshold", () => {
      expect(getMetricRating("lcp", 2000)).toBe("good");
      expect(getMetricRating("cls", 0.05)).toBe("good");
      expect(getMetricRating("fcp", 1500)).toBe("good");
    });

    it("should return 'needs-improvement' for values between thresholds", () => {
      expect(getMetricRating("lcp", 3000)).toBe("needs-improvement");
      expect(getMetricRating("cls", 0.15)).toBe("needs-improvement");
      expect(getMetricRating("fcp", 2500)).toBe("needs-improvement");
    });

    it("should return 'poor' for values above needsImprovement threshold", () => {
      expect(getMetricRating("lcp", 5000)).toBe("poor");
      expect(getMetricRating("cls", 0.3)).toBe("poor");
      expect(getMetricRating("fcp", 4000)).toBe("poor");
    });
  });

  describe("calculatePerformanceScore", () => {
    it("should return 0 for empty metrics", () => {
      expect(calculatePerformanceScore({})).toBe(0);
    });

    it("should calculate score from all good metrics", () => {
      const score = calculatePerformanceScore({
        lcp: 2000,
        fcp: 1500,
        cls: 0.05,
        inp: 150,
        ttfb: 600,
      });
      expect(score).toBeGreaterThan(80);
    });

    it("should calculate lower score for poor metrics", () => {
      const goodScore = calculatePerformanceScore({
        lcp: 2000,
        fcp: 1500,
        cls: 0.05,
      });
      const poorScore = calculatePerformanceScore({
        lcp: 5000,
        fcp: 4000,
        cls: 0.3,
      });
      expect(goodScore).toBeGreaterThan(poorScore);
      expect(poorScore).toBeLessThan(50);
    });

    it("should handle partial metrics", () => {
      const score = calculatePerformanceScore({
        lcp: 2000,
        fcp: 1500,
      });
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe("getPerformanceRecommendations", () => {
    it("should return empty array for all good metrics", () => {
      const recommendations = getPerformanceRecommendations({
        lcp: 2000,
        fcp: 1500,
        cls: 0.05,
        inp: 150,
        ttfb: 600,
      });
      expect(recommendations).toHaveLength(0);
    });

    it("should return LCP recommendation for slow LCP", () => {
      const recommendations = getPerformanceRecommendations({
        lcp: 3000,
      });
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0]).toContain("LCP");
    });

    it("should return CLS recommendation for high CLS", () => {
      const recommendations = getPerformanceRecommendations({
        cls: 0.2,
      });
      expect(recommendations).toHaveLength(1);
      expect(recommendations[0]).toContain("CLS");
    });

    it("should return multiple recommendations for multiple poor metrics", () => {
      const recommendations = getPerformanceRecommendations({
        lcp: 5000,
        cls: 0.3,
        fcp: 4000,
      });
      expect(recommendations.length).toBeGreaterThan(1);
    });

    it("should include actionable advice", () => {
      const recommendations = getPerformanceRecommendations({
        lcp: 5000,
        cls: 0.3,
      });
      recommendations.forEach((rec) => {
        expect(rec).toBeTruthy();
        expect(typeof rec).toBe("string");
        expect(rec.length).toBeGreaterThan(20);
      });
    });
  });
});
