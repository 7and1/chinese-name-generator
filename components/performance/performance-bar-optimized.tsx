"use client";

import { useState, useEffect } from "react";
import { Activity, Zap, Clock, Eye } from "@/components/icons";
import { X } from "@/components/icons";

type MetricName = "LCP" | "FCP" | "CLS" | "INP";

const METRIC_CONFIG: Record<
  MetricName,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    unit: string;
    threshold: number;
  }
> = {
  LCP: { label: "LCP", icon: Activity, unit: "ms", threshold: 2500 },
  FCP: { label: "FCP", icon: Clock, unit: "ms", threshold: 1800 },
  CLS: { label: "CLS", icon: Eye, unit: "", threshold: 0.1 },
  INP: { label: "INP", icon: Zap, unit: "ms", threshold: 200 },
};

type MetricRating = "good" | "needs-improvement" | "poor";

function getColor(rating: MetricRating): string {
  if (rating === "good") return "text-green-600 dark:text-green-400";
  if (rating === "needs-improvement")
    return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getBgColor(rating: MetricRating): string {
  if (rating === "good") return "bg-green-500";
  if (rating === "needs-improvement") return "bg-yellow-500";
  return "bg-red-500";
}

export function PerformanceBarOptimized() {
  const [metrics, setMetrics] = useState<
    Record<string, { name: string; value: number; rating: MetricRating }>
  >({});
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    setIsVisible(true);

    const handler = (event: Event) => {
      const vital = (
        event as CustomEvent<{
          name: string;
          value: number;
          rating: MetricRating;
        }>
      ).detail;
      setMetrics((prev) => ({
        ...prev,
        [vital.name]: vital,
      }));
    };

    window.addEventListener("web-vital", handler);
    return () => window.removeEventListener("web-vital", handler);
  }, []);

  if (!isVisible) return null;

  const metricEntries = Object.entries(metrics);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-background border-2 border-primary shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150"
        title="Toggle Performance Metrics"
      >
        <Activity className="h-5 w-5 text-primary" />
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-80 bg-background border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Core Web Vitals</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {metricEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Waiting for metrics...
              </p>
            ) : (
              metricEntries.map(([name, data]) => {
                const config = METRIC_CONFIG[name as MetricName];
                if (!config) return null;

                const Icon = config.icon;
                const percentage = Math.min(
                  (data.value / config.threshold) * 100,
                  100,
                );

                return (
                  <div key={name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{config.label}</span>
                      </div>
                      <span
                        className={"font-semibold " + getColor(data.rating)}
                      >
                        {name === "CLS"
                          ? data.value.toFixed(3)
                          : Math.round(data.value)}
                        {config.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={
                          "h-full " +
                          getBgColor(data.rating) +
                          " transition-all duration-500 ease-out"
                        }
                        style={{ width: Math.min(percentage, 100) + "%" }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rating:{" "}
                      <span className={getColor(data.rating)}>
                        {data.rating}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground text-center">
            Development-only panel
          </div>
        </div>
      )}
    </>
  );
}
