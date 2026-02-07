"use client";

import { lazy, Suspense } from "react";
import type { FiveElement, FiveElementBalance } from "@/lib/types";

interface LazyFiveElementsChartProps {
  balance: FiveElementBalance;
  size?: "sm" | "md" | "lg";
  variant?: "bar" | "horizontal";
  className?: string;
}

function ChartSkeleton() {
  return (
    <div className="w-full h-[240px] flex items-center justify-center bg-muted/30 rounded-lg animate-pulse">
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Loading chart...</div>
      </div>
    </div>
  );
}

const FiveElementsChart = lazy(() =>
  import("./five-elements-chart").then((mod) => ({
    default: mod.FiveElementsChart,
  })),
);

export function LazyFiveElementsChart(props: LazyFiveElementsChartProps) {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <FiveElementsChart {...props} />
    </Suspense>
  );
}
