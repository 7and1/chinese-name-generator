"use client";

import { memo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { NameScore } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ScoreRadarChartProps {
  score: NameScore;
  showLabels?: boolean;
  className?: string;
}

const chartData = (score: NameScore) => [
  {
    subject: "BaZi",
    value: score.baziScore,
    fullMark: 100,
  },
  {
    subject: "WuGe",
    value: score.wugeScore,
    fullMark: 100,
  },
  {
    subject: "Phonetic",
    value: score.phoneticScore,
    fullMark: 100,
  },
  {
    subject: "Meaning",
    value: score.meaningScore,
    fullMark: 100,
  },
];

export const ScoreRadarChart = memo(function ScoreRadarChart({
  score,
  showLabels = true,
  className,
}: ScoreRadarChartProps) {
  const getScoreColor = (value: number) => {
    if (value >= 90) return "#22c55e"; // green-500
    if (value >= 80) return "#3b82f6"; // blue-500
    if (value >= 70) return "#eab308"; // yellow-500
    return "#6b7280"; // gray-500
  };

  const mainColor = getScoreColor(score.overall);

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" aspect={1}>
        <RadarChart
          data={chartData(score)}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <PolarGrid
            stroke="hsl(var(--border))"
            strokeWidth={1}
            radialLines={true}
          />
          {showLabels && (
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
            />
          )}
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke={mainColor}
            fill={mainColor}
            fillOpacity={0.3}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
});
