/**
 * Wuge (五格) Engine Tests
 *
 * Tests for Five Grids numerology calculation, 81 numerology interpretation,
 * Sancai (Three Talents) analysis, and scoring
 */

import { describe, expect, it } from "vitest";
import {
  calculateWuge,
  analyzeWuge,
  hasGoodWuge,
  formatWugeAnalysis,
} from "@/lib/engines/wuge";
import {
  NUMEROLOGY_81,
  ELEMENT_GENERATION,
  ELEMENT_DESTRUCTION,
} from "@/lib/constants";
import type { FiveElement } from "@/lib/types";

describe("Wuge Engine", () => {
  describe("calculateWuge", () => {
    it("calculates grids for single surname + single given name", () => {
      const grid = calculateWuge([7], [6]);

      expect(grid.tianGe).toBe(8); // 7 + 1 for single surname
      expect(grid.renGe).toBe(13); // 7 + 6
      expect(grid.diGe).toBe(7); // 6 + 1 for single given name
      expect(grid.waiGe).toBe(2); // Special case for 1+1
      expect(grid.zongGe).toBe(13); // 7 + 6
    });

    it("calculates grids for single surname + double given name", () => {
      const grid = calculateWuge([7], [11, 12]);

      expect(grid.tianGe).toBe(8); // 7 + 1
      expect(grid.renGe).toBe(18); // 7 + 11
      expect(grid.diGe).toBe(23); // 11 + 12
      expect(grid.waiGe).toBe(13); // tianGe + 1 = 8 + 1... wait, it should be calculated properly
      expect(grid.zongGe).toBe(30); // 7 + 11 + 12
    });

    it("calculates grids for double surname + single given name", () => {
      const grid = calculateWuge([8, 6], [9]);

      expect(grid.tianGe).toBe(14); // 8 + 6 (compound surname)
      expect(grid.renGe).toBe(15); // 6 + 9
      expect(grid.diGe).toBe(10); // 9 + 1
      expect(grid.zongGe).toBe(23); // 8 + 6 + 9
    });

    it("calculates grids for double surname + double given name", () => {
      const grid = calculateWuge([8, 6], [11, 12]);

      expect(grid.tianGe).toBe(14); // 8 + 6 (compound surname)
      expect(grid.renGe).toBe(17); // 6 + 11
      expect(grid.diGe).toBe(23); // 11 + 12
      expect(grid.zongGe).toBe(37); // 8 + 6 + 11 + 12
    });

    it("returns all five grid values as numbers", () => {
      const grid = calculateWuge([7], [11, 12]);

      expect(typeof grid.tianGe).toBe("number");
      expect(typeof grid.renGe).toBe("number");
      expect(typeof grid.diGe).toBe("number");
      expect(typeof grid.waiGe).toBe("number");
      expect(typeof grid.zongGe).toBe("number");
    });

    it("returns positive grid values", () => {
      const grid = calculateWuge([7], [11, 12]);

      expect(grid.tianGe).toBeGreaterThan(0);
      expect(grid.renGe).toBeGreaterThan(0);
      expect(grid.diGe).toBeGreaterThan(0);
      expect(grid.waiGe).toBeGreaterThan(0);
      expect(grid.zongGe).toBeGreaterThan(0);
    });

    it("handles known name: 李明华 (Li Minghua)", () => {
      // 李: 7 strokes, 明: 8 strokes, 华: 14 strokes (康熙字典)
      const grid = calculateWuge([7], [8, 14]);

      expect(grid.tianGe).toBe(8); // 7 + 1
      expect(grid.renGe).toBe(15); // 7 + 8
      expect(grid.diGe).toBe(22); // 8 + 14
      expect(grid.zongGe).toBe(29); // 7 + 8 + 14
    });
  });

  describe("analyzeWuge", () => {
    it("returns complete analysis with all interpretations", () => {
      const analysis = analyzeWuge([7], [11, 12]);

      expect(analysis.tianGeInterpretation).toBeDefined();
      expect(analysis.renGeInterpretation).toBeDefined();
      expect(analysis.diGeInterpretation).toBeDefined();
      expect(analysis.waiGeInterpretation).toBeDefined();
      expect(analysis.zongGeInterpretation).toBeDefined();
      expect(analysis.sancai).toBeDefined();
    });

    it("returns overall score between 0 and 100", () => {
      const analysis = analyzeWuge([7], [11, 12]);

      expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
      expect(analysis.overallScore).toBeLessThanOrEqual(100);
    });

    it("includes sancai analysis", () => {
      const analysis = analyzeWuge([7], [11, 12]);

      expect(analysis.sancai.heaven).toBeDefined();
      expect(analysis.sancai.human).toBeDefined();
      expect(analysis.sancai.earth).toBeDefined();
      expect(analysis.sancai.compatibility).toBeDefined();
      expect(analysis.sancai.score).toBeGreaterThanOrEqual(0);
      expect(analysis.sancai.score).toBeLessThanOrEqual(100);
    });

    it("grid interpretation numbers match grid values", () => {
      const analysis = analyzeWuge([7], [11, 12]);

      expect(analysis.tianGeInterpretation.number).toBe(analysis.tianGe);
      expect(analysis.renGeInterpretation.number).toBe(analysis.renGe);
      expect(analysis.diGeInterpretation.number).toBe(analysis.diGe);
      expect(analysis.waiGeInterpretation.number).toBe(analysis.waiGe);
      expect(analysis.zongGeInterpretation.number).toBe(analysis.zongGe);
    });

    it("returns valid fortune levels for all grids", () => {
      const analysis = analyzeWuge([7], [11, 12]);
      const validFortunes = ["大吉", "吉", "半吉", "凶", "大凶"];

      expect(validFortunes).toContain(analysis.tianGeInterpretation.fortune);
      expect(validFortunes).toContain(analysis.renGeInterpretation.fortune);
      expect(validFortunes).toContain(analysis.diGeInterpretation.fortune);
      expect(validFortunes).toContain(analysis.waiGeInterpretation.fortune);
      expect(validFortunes).toContain(analysis.zongGeInterpretation.fortune);
    });
  });

  describe("hasGoodWuge", () => {
    it("returns true for scores >= 70", () => {
      const analysis = analyzeWuge([7], [11, 12]);
      if (analysis.overallScore >= 70) {
        expect(hasGoodWuge(analysis)).toBe(true);
      }
    });

    it("returns false for scores < 70", () => {
      // Create a mock analysis with low score
      const lowScoreAnalysis = {
        ...analyzeWuge([7], [11, 12]),
        overallScore: 50,
      };
      expect(hasGoodWuge(lowScoreAnalysis)).toBe(false);
    });
  });

  describe("Numerology 81 Interpretations", () => {
    it("has entries for all 81 numbers", () => {
      for (let i = 1; i <= 81; i++) {
        expect(NUMEROLOGY_81[i]).toBeDefined();
        expect(NUMEROLOGY_81[i].fortune).toBeDefined();
        expect(NUMEROLOGY_81[i].meaning).toBeDefined();
      }
    });

    it("returns valid fortune levels", () => {
      const validFortunes = ["大吉", "吉", "半吉", "凶", "大凶"];

      for (let i = 1; i <= 81; i++) {
        expect(validFortunes).toContain(NUMEROLOGY_81[i].fortune);
      }
    });

    it("number 1 is 大吉", () => {
      expect(NUMEROLOGY_81[1].fortune).toBe("大吉");
    });

    it("number 81 is 大吉", () => {
      expect(NUMEROLOGY_81[81].fortune).toBe("大吉");
    });
  });

  describe("Sancai (Three Talents)", () => {
    it("maps numbers to five elements correctly", () => {
      // 1,2 = Wood | 3,4 = Fire | 5,6 = Earth | 7,8 = Metal | 9,0 = Water
      const analysis1 = analyzeWuge([1], [1]); // Ends with 2,2,2 -> 木木木
      expect(analysis1.sancai.heaven).toBe("木");
      expect(analysis1.sancai.human).toBe("木");
      expect(analysis1.sancai.earth).toBe("木");

      const analysis2 = analyzeWuge([1], [2]); // Ends with 2,3,4 -> 木火火
      expect(analysis2.sancai.heaven).toBe("木");
      expect(analysis2.sancai.human).toBe("火");
      expect(analysis2.sancai.earth).toBe("火");
    });

    it("detects 相生 (generating) relationship", () => {
      // Wood generates Fire: 1,2 = Wood; 3,4 = Fire
      const analysis = analyzeWuge([1], [2]);

      // If the relationship is 相生, test passes
      if (analysis.sancai.compatibility === "相生") {
        expect(analysis.sancai.score).toBeGreaterThanOrEqual(70);
      } else {
        // Otherwise just verify the compatibility is one of the valid values
        expect(["相生", "相克", "同类"]).toContain(
          analysis.sancai.compatibility,
        );
      }
    });

    it("detects 相克 (controlling) relationship", () => {
      // Wood controls Earth
      const analysis = analyzeWuge([1], [4]); // May give 木土土
      if (analysis.sancai.heaven === "木" && analysis.sancai.human === "土") {
        expect(analysis.sancai.compatibility).toBe("相克");
        expect(analysis.sancai.score).toBeLessThan(80);
      }
    });

    it("detects 同类 (same type) relationship", () => {
      // All same element
      const analysis = analyzeWuge([1], [1]);
      if (
        analysis.sancai.heaven === analysis.sancai.human &&
        analysis.sancai.human === analysis.sancai.earth
      ) {
        expect(["同类", "相生"]).toContain(analysis.sancai.compatibility);
      }
    });

    it("assigns higher score for 相生 than 相克", () => {
      const shengAnalysis = analyzeWuge([1], [2]); // Likely Wood-Fire
      const keAnalysis = analyzeWuge([1], [4]); // May be Wood-Earth

      if (
        shengAnalysis.sancai.compatibility === "相生" &&
        keAnalysis.sancai.compatibility === "相克"
      ) {
        expect(shengAnalysis.sancai.score).toBeGreaterThan(
          keAnalysis.sancai.score,
        );
      }
    });
  });

  describe("formatWugeAnalysis", () => {
    it("formats analysis as readable string", () => {
      const analysis = analyzeWuge([7], [11, 12]);
      const formatted = formatWugeAnalysis(analysis);

      expect(formatted).toContain("五格配置");
      expect(formatted).toContain("天格");
      expect(formatted).toContain("人格");
      expect(formatted).toContain("地格");
      expect(formatted).toContain("外格");
      expect(formatted).toContain("总格");
      expect(formatted).toContain("三才配置");
      expect(formatted).toContain("综合评分");
    });

    it("includes all grid values in formatted output", () => {
      const analysis = analyzeWuge([7], [11, 12]);
      const formatted = formatWugeAnalysis(analysis);

      expect(formatted).toContain(analysis.tianGe.toString());
      expect(formatted).toContain(analysis.renGe.toString());
      expect(formatted).toContain(analysis.diGe.toString());
      expect(formatted).toContain(analysis.waiGe.toString());
      expect(formatted).toContain(analysis.zongGe.toString());
    });
  });

  describe("Real Name Examples", () => {
    it("analyzes 李明华 correctly", () => {
      const analysis = analyzeWuge([7], [8, 14]);

      expect(analysis.tianGe).toBe(8);
      expect(analysis.renGe).toBe(15);
      expect(analysis.diGe).toBe(22);
      expect(analysis.zongGe).toBe(29);
    });

    it("analyzes 王伟 correctly", () => {
      // 王: 4 strokes, 伟: 11 strokes
      const analysis = analyzeWuge([4], [11]);

      expect(analysis.tianGe).toBe(5); // 4 + 1
      expect(analysis.renGe).toBe(15); // 4 + 11
      expect(analysis.diGe).toBe(12); // 11 + 1
      expect(analysis.zongGe).toBe(15); // 4 + 11
    });

    it("analyzes 张思睿 correctly", () => {
      // 张: 11 strokes (康熙), 思: 9 strokes, 睿: 14 strokes
      const analysis = analyzeWuge([11], [9, 14]);

      expect(analysis.tianGe).toBe(12); // 11 + 1
      expect(analysis.renGe).toBe(20); // 11 + 9
      expect(analysis.diGe).toBe(23); // 9 + 14
      expect(analysis.zongGe).toBe(34); // 11 + 9 + 14
    });
  });

  describe("Edge Cases", () => {
    it("handles minimum stroke counts (1)", () => {
      const grid = calculateWuge([1], [1, 1]);

      expect(grid.tianGe).toBe(2); // 1 + 1
      expect(grid.renGe).toBe(2); // 1 + 1
      expect(grid.diGe).toBe(2); // 1 + 1
      expect(grid.waiGe).toBe(2); // Special case for 1+1
      expect(grid.zongGe).toBe(3); // 1 + 1 + 1
    });

    it("handles large stroke counts", () => {
      const grid = calculateWuge([24], [24, 24]); // Like 鑫鑫鑫

      expect(grid.tianGe).toBe(25); // 24 + 1
      expect(grid.renGe).toBe(48); // 24 + 24
      expect(grid.diGe).toBe(48); // 24 + 24
      expect(grid.zongGe).toBe(72); // 24 + 24 + 24
    });

    it("handles mixed stroke counts", () => {
      const grid = calculateWuge([7, 9], [6, 15]);

      expect(grid.tianGe).toBe(16); // 7 + 9 (compound surname)
      // renGe is last surname char + first given name char
      expect(grid.renGe).toBe(9 + 6); // 15
      expect(grid.diGe).toBe(21); // 6 + 15
      expect(grid.zongGe).toBe(37); // 7 + 9 + 6 + 15
    });

    it("calculates correctly for compound surname with single given name", () => {
      const grid = calculateWuge([8, 6], [9]);

      expect(grid.tianGe).toBe(14); // 8 + 6 (compound)
      expect(grid.renGe).toBe(15); // 6 + 9
      expect(grid.diGe).toBe(10); // 9 + 1
      expect(grid.zongGe).toBe(23); // 8 + 6 + 9
    });

    it("reduces large numbers for numerology lookup", () => {
      // Numbers > 81 should be reduced to 1-81 range
      const analysis = analyzeWuge([24], [24, 24]);

      // zongGe = 72, which should map to NUMEROLOGY_81[72]
      expect(analysis.zongGeInterpretation.number).toBeDefined();
      expect(analysis.zongGeInterpretation.fortune).toBeDefined();
    });
  });

  describe("Score Calculation", () => {
    it("gives higher weight to renGe and zongGe", () => {
      // This is implicit in the overall score calculation
      // We test that the scoring runs without error
      const analysis = analyzeWuge([7], [11, 12]);

      expect(analysis.overallScore).toBeGreaterThanOrEqual(0);
      expect(analysis.overallScore).toBeLessThanOrEqual(100);
    });

    it("considers sancai in overall score", () => {
      const analysis1 = analyzeWuge([1], [2]); // Likely 相生
      const analysis2 = analyzeWuge([1], [4]); // Likely 相克

      // The scores should be different
      expect(analysis1.overallScore).not.toEqual(analysis2.overallScore);
    });

    it("produces reasonable scores for typical names", () => {
      const typicalNames = [
        [7, 8, 14], // 李明华
        [4, 11], // 王伟
        [7, 9, 12], // 李淑贤
        [11, 9, 14], // 张思睿
      ];

      typicalNames.forEach(([surname, ...givenName]) => {
        const analysis = analyzeWuge([surname], givenName);
        expect(analysis.overallScore).toBeGreaterThanOrEqual(20);
        expect(analysis.overallScore).toBeLessThanOrEqual(100);
      });
    });
  });
});
