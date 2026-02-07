/**
 * Web Vitals utilities for server-side performance monitoring
 */

export interface WebVitalsReport {
  timestamp: number;
  url: string;
  metrics: {
    lcp?: number;
    fcp?: number;
    cls?: number;
    inp?: number;
    ttfb?: number;
  };
}

export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
  cls: { good: number; needsImprovement: number };
  inp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
}

export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fcp: { good: 1800, needsImprovement: 3000 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  inp: { good: 200, needsImprovement: 500 },
  ttfb: { good: 800, needsImprovement: 1800 },
};

/**
 * Check if a metric value is within good range
 */
export function isGoodMetric(
  metricName: keyof PerformanceThresholds,
  value: number,
): boolean {
  return value <= PERFORMANCE_THRESHOLDS[metricName].good;
}

/**
 * Get performance rating for a metric
 */
export function getMetricRating(
  metricName: keyof PerformanceThresholds,
  value: number,
): "good" | "needs-improvement" | "poor" {
  const threshold = PERFORMANCE_THRESHOLDS[metricName];
  if (value <= threshold.good) return "good";
  if (value <= threshold.needsImprovement) return "needs-improvement";
  return "poor";
}

/**
 * Calculate overall performance score (0-100)
 */
export function calculatePerformanceScore(
  metrics: Partial<Record<keyof PerformanceThresholds, number>>,
): number {
  const weights = {
    lcp: 0.25,
    fcp: 0.15,
    cls: 0.25,
    inp: 0.2,
    ttfb: 0.15,
  };

  let totalScore = 0;
  let totalWeight = 0;

  for (const [metricName, value] of Object.entries(metrics)) {
    const key = metricName as keyof PerformanceThresholds;
    if (value === undefined || !weights[key]) continue;

    const threshold = PERFORMANCE_THRESHOLDS[key];
    let score = 0;

    if (value <= threshold.good) {
      // Good: score between 80-100 based on how much under the threshold
      const ratio = value / threshold.good;
      score = 100 - ratio * 20; // Max 100, min 80 when at threshold
    } else if (value <= threshold.needsImprovement) {
      // Needs improvement: score between 50-80
      const range = threshold.needsImprovement - threshold.good;
      const position = (value - threshold.good) / range;
      score = 80 - position * 30; // 80 down to 50
    } else {
      // Poor: score between 0-50
      score = Math.max(
        0,
        50 -
          ((value - threshold.needsImprovement) / threshold.needsImprovement) *
            50,
      );
    }

    totalScore += score * weights[key];
    totalWeight += weights[key];
  }

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

/**
 * Generate performance recommendations based on metrics
 */
export function getPerformanceRecommendations(
  metrics: Partial<Record<keyof PerformanceThresholds, number>>,
): string[] {
  const recommendations: string[] = [];

  if (metrics.lcp && metrics.lcp > PERFORMANCE_THRESHOLDS.lcp.good) {
    recommendations.push(
      "LCP is slow. Consider preloading critical images, optimizing largest content elements, or using Next.js Image component.",
    );
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_THRESHOLDS.cls.good) {
    recommendations.push(
      "CLS is high. Ensure all dynamic content has reserved space, avoid inserting content above existing content, and use skeleton screens.",
    );
  }

  if (metrics.fcp && metrics.fcp > PERFORMANCE_THRESHOLDS.fcp.good) {
    recommendations.push(
      "FCP is slow. Consider reducing render-blocking resources, minimizing CSS, and improving server response time.",
    );
  }

  if (metrics.inp && metrics.inp > PERFORMANCE_THRESHOLDS.inp.good) {
    recommendations.push(
      "INP is slow. Optimize long tasks, reduce JavaScript execution time, and use web workers for heavy computations.",
    );
  }

  if (metrics.ttfb && metrics.ttfb > PERFORMANCE_THRESHOLDS.ttfb.good) {
    recommendations.push(
      "TTFB is slow. Consider using CDN, caching, and optimizing server-side rendering.",
    );
  }

  return recommendations;
}
