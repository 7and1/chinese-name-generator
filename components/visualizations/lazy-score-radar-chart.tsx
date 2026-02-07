"use client";

import { lazy, Suspense } from "react";
import type { NameScore } from "@/lib/types";

interface LazyScoreRadarChartProps {
  score: NameScore;
  showLabels?: boolean;
  className?: string;
}

function RadarChartSkeleton() {
  return (
    <div className="w-full h-[200px] flex items-center justify-center bg-muted/30 rounded-lg animate-pulse">
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Loading chart...</div>
      </div>
    </div>
  );
}

const ScoreRadarChart = lazy(() =>
  import("./score-radar-chart").then((mod) => ({
    default: mod.ScoreRadarChart,
  })),
);

export function LazyScoreRadarChart(props: LazyScoreRadarChartProps) {
  return (
    <Suspense fallback={<RadarChartSkeleton />}>
      <ScoreRadarChart {...props} />
    </Suspense>
  );
}
