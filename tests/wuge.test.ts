import { describe, expect, it } from "vitest";
import { analyzeWuge, calculateWuge } from "@/lib/engines/wuge";

describe("Wuge engine", () => {
  it("calculates grids for a 1-char surname + 2-char given name", () => {
    const grid = calculateWuge([7], [11, 12]);
    expect(grid).toEqual({
      tianGe: 8,
      renGe: 18,
      diGe: 23,
      waiGe: 13,
      zongGe: 30,
    });
  });

  it("returns a full analysis with interpretations", () => {
    const analysis = analyzeWuge([7], [11, 12]);
    expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
    expect(analysis.overallScore).toBeLessThanOrEqual(100);
    expect(analysis.tianGeInterpretation.number).toBe(analysis.tianGe);
  });
});
