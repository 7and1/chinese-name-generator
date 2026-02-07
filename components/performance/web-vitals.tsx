"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from "web-vitals";

// Performance thresholds (FID replaced by INP in web-vitals v4+)
const THRESHOLDS = {
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  lcp: { good: 2500, needsImprovement: 4000 },
  ttfb: { good: 800, needsImprovement: 1800 },
  inp: { good: 200, needsImprovement: 500 },
};

function getRating(metricName: string, value: number): string {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
  if (!threshold) return "poor";
  if (value <= threshold.good) return "good";
  if (value <= threshold.needsImprovement) return "needs-improvement";
  return "poor";
}

// Send metrics to analytics endpoint
function sendToAnalytics(metric: {
  name: string;
  value: number;
  id: string;
  delta: number;
  navigationType?: string;
}) {
  const rating = getRating(metric.name, metric.value);

  const payload = {
    name: metric.name,
    value: metric.value,
    rating,
    id: metric.id,
    delta: metric.delta,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", payload);
  }

  // Send to analytics endpoint (if configured)
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Web Vitals] Failed to send metrics:", err);
      }
    });
  }

  // Dispatch custom event for local handling
  window.dispatchEvent(new CustomEvent("web-vital", { detail: payload }));
}

export function reportWebVitals(onPerfEntry?: (metric: unknown) => void) {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry);
  } else {
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
    onINP(sendToAnalytics);
  }
}

export default function WebVitals({
  onPerfEntry,
}: { onPerfEntry?: (metric: unknown) => void } = {}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      reportWebVitals(onPerfEntry);
    }
  }, [onPerfEntry]);

  return null;
}

export function useWebVitals() {
  useEffect(() => {
    const handler = (event: Event) => {
      const vital = (
        event as CustomEvent<{ name: string; value: number; rating: string }>
      ).detail;
      if (process.env.NODE_ENV === "development") {
        const rating = vital.rating;
        const emoji =
          rating === "good"
            ? "OK"
            : rating === "needs-improvement"
              ? "WARN"
              : "FAIL";
        console.log("[" + emoji + "] " + vital.name + ": " + vital.value);
      }
    };

    window.addEventListener("web-vital", handler);
    return () => window.removeEventListener("web-vital", handler);
  }, []);
}

export { THRESHOLDS };
