"use client";

import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FiveElement, FiveElementBalance } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FiveElementsChartProps {
  balance: FiveElementBalance;
  size?: "sm" | "md" | "lg";
  variant?: "bar" | "horizontal";
  className?: string;
}

const elementColors: Record<FiveElement, string> = {
  金: "#fbbf24", // amber-400
  木: "#22c55e", // green-500
  水: "#3b82f6", // blue-500
  火: "#ef4444", // red-500
  土: "#a16207", // yellow-700
};

const elementOrder: FiveElement[] = ["金", "木", "水", "火", "土"];

const elementNames: Record<FiveElement, { en: string; zh: string }> = {
  金: { en: "Metal", zh: "金" },
  木: { en: "Wood", zh: "木" },
  水: { en: "Water", zh: "水" },
  火: { en: "Fire", zh: "火" },
  土: { en: "Earth", zh: "土" },
};

function balanceToChartData(balance: FiveElementBalance) {
  return elementOrder.map((element) => ({
    element: elementNames[element].en,
    zh: elementNames[element].zh,
    value: balance[element],
    color: elementColors[element],
  }));
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { zh: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0];
  const zhElement = data.payload.zh;

  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md">
      <p className="text-sm font-medium">{zhElement}</p>
      <p className="text-sm text-muted-foreground">
        Count: <span className="font-medium text-foreground">{data.value}</span>
      </p>
    </div>
  );
}

export const FiveElementsChart = memo(function FiveElementsChart({
  balance,
  size = "md",
  variant = "bar",
  className,
}: FiveElementsChartProps) {
  const data = balanceToChartData(balance);

  const heightMap = { sm: 180, md: 240, lg: 300 };
  const height = heightMap[size];

  if (variant === "horizontal") {
    return (
      <div className={cn("w-full", className)}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="zh"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="zh"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export { elementColors, elementOrder };
