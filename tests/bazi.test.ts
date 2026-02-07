import { describe, expect, it } from "vitest";
import { calculateBaZiFromYmd } from "@/lib/engines/bazi";

describe("BaZi engine", () => {
  it("calculates pillars deterministically from YMDH", async () => {
    const chart = await calculateBaZiFromYmd(1990, 12, 23, 8);
    expect(chart.year).toEqual({ stem: "庚", branch: "午" });
    expect(chart.month).toEqual({ stem: "戊", branch: "子" });
    expect(chart.day).toEqual({ stem: "壬", branch: "戌" });
    expect(chart.hour).toEqual({ stem: "甲", branch: "辰" });
    expect(chart.favorableElements.length).toBeGreaterThan(0);
    expect(new Set(chart.favorableElements).size).toBe(
      chart.favorableElements.length,
    );
  });
});
