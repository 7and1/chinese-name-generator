/**
 * Scorer Engine Tests
 *
 * Tests for comprehensive name scoring system that combines:
 * - BaZi compatibility (30%)
 * - Wuge numerology (25%)
 * - Phonetic harmony (20%)
 * - Character meaning quality (25%)
 */

import { describe, expect, it } from "vitest";
import {
  calculateNameScore,
  getScoreRating,
  compareNames,
  meetsMinimumStandards,
  formatNameScoreAnalysis,
} from "@/lib/engines/scorer";
import type { ChineseCharacter, BaZiChart, FiveElement } from "@/lib/types";
import { SCORE_WEIGHTS } from "@/lib/constants";

describe("Scorer Engine", () => {
  const getMockCharacters = (): ChineseCharacter[] => [
    {
      char: "李",
      pinyin: "lǐ",
      tone: 3,
      strokeCount: 7,
      kangxiStrokeCount: 7,
      radical: "木",
      fiveElement: "木",
      meaning: "李树、吉祥",
      frequency: 50,
      hskLevel: 1,
    },
    {
      char: "明",
      pinyin: "míng",
      tone: 2,
      strokeCount: 8,
      kangxiStrokeCount: 8,
      radical: "日",
      fiveElement: "火",
      meaning: "光明、明亮、吉祥",
      frequency: 200,
      hskLevel: 1,
    },
    {
      char: "华",
      pinyin: "huá",
      tone: 2,
      strokeCount: 14,
      kangxiStrokeCount: 14,
      radical: "十",
      fiveElement: "水",
      meaning: "华丽、华美、繁荣、才华",
      frequency: 300,
      hskLevel: 2,
    },
  ];

  const getMockBaZiChart = (): BaZiChart => ({
    year: { stem: "庚", branch: "午" },
    month: { stem: "戊", branch: "子" },
    day: { stem: "壬", branch: "戌" },
    hour: { stem: "甲", branch: "辰" },
    dayMaster: "壬",
    elements: { 金: 2, 木: 0, 水: 2, 火: 2, 土: 2 },
    favorableElements: ["金", "水", "土"],
    unfavorableElements: ["木", "火"],
  });

  describe("calculateNameScore", () => {
    it("returns complete score object with all required fields", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(score).toHaveProperty("overall");
      expect(score).toHaveProperty("rating");
      expect(score).toHaveProperty("baziScore");
      expect(score).toHaveProperty("wugeScore");
      expect(score).toHaveProperty("phoneticScore");
      expect(score).toHaveProperty("meaningScore");
      expect(score).toHaveProperty("breakdown");
    });

    it("returns overall score between 0 and 100", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
    });

    it("returns valid rating based on overall score", async () => {
      const score1 = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(["优秀", "良好", "中等", "一般", "欠佳"]).toContain(score1.rating);
    });

    it("calculates baziScore using favorable/unfavorable elements", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(score.baziScore).toBeGreaterThanOrEqual(0);
      expect(score.baziScore).toBeLessThanOrEqual(100);
    });

    it("calculates wugeScore based on stroke counts", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(score.wugeScore).toBeGreaterThanOrEqual(0);
      expect(score.wugeScore).toBeLessThanOrEqual(100);
    });

    it("calculates phoneticScore based on tone analysis", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(score.phoneticScore).toBeGreaterThanOrEqual(0);
      expect(score.phoneticScore).toBeLessThanOrEqual(100);
    });

    it("calculates meaningScore based on character meanings", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(score.meaningScore).toBeGreaterThanOrEqual(0);
      expect(score.meaningScore).toBeLessThanOrEqual(100);
    });

    it("includes breakdown with bazi, wuge, and phonetics", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(score.breakdown.bazi).toBeDefined();
      expect(score.breakdown.wuge).toBeDefined();
      expect(score.breakdown.phonetics).toBeDefined();
    });

    it("works without BaZi chart (uses default neutral score)", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        undefined,
      );

      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
      expect(score.breakdown.bazi).toBeUndefined();
    });
  });

  describe("getScoreRating", () => {
    it("returns '优秀' for scores >= 90", () => {
      const rating = getScoreRating(95);
      expect(rating.rating).toBe("优秀");
      expect(rating.emoji).toBe("🌟");
    });

    it("returns '良好' for scores >= 80", () => {
      const rating = getScoreRating(85);
      expect(rating.rating).toBe("良好");
      expect(rating.emoji).toBe("✨");
    });

    it("returns '中等' for scores >= 70", () => {
      const rating = getScoreRating(75);
      expect(rating.rating).toBe("中等");
      expect(rating.emoji).toBe("👍");
    });

    it("returns '一般' for scores >= 60", () => {
      const rating = getScoreRating(65);
      expect(rating.rating).toBe("一般");
      expect(rating.emoji).toBe("😐");
    });

    it("returns '欠佳' for scores < 60", () => {
      const rating = getScoreRating(45);
      expect(rating.rating).toBe("欠佳");
      expect(rating.emoji).toBe("⚠️");
    });

    it("returns description with all ratings", () => {
      const rating95 = getScoreRating(95);
      const rating85 = getScoreRating(85);
      const rating75 = getScoreRating(75);
      const rating65 = getScoreRating(65);
      const rating45 = getScoreRating(45);

      expect(rating95.description).toBeTruthy();
      expect(rating85.description).toBeTruthy();
      expect(rating75.description).toBeTruthy();
      expect(rating65.description).toBeTruthy();
      expect(rating45.description).toBeTruthy();
    });

    it("handles edge case score of exactly 90", () => {
      const rating = getScoreRating(90);
      expect(rating.rating).toBe("优秀");
    });

    it("handles edge case score of exactly 80", () => {
      const rating = getScoreRating(80);
      expect(rating.rating).toBe("良好");
    });

    it("handles edge case score of exactly 70", () => {
      const rating = getScoreRating(70);
      expect(rating.rating).toBe("中等");
    });

    it("handles edge case score of exactly 60", () => {
      const rating = getScoreRating(60);
      expect(rating.rating).toBe("一般");
    });

    it("handles minimum score of 0", () => {
      const rating = getScoreRating(0);
      expect(rating.rating).toBe("欠佳");
    });

    it("handles maximum score of 100", () => {
      const rating = getScoreRating(100);
      expect(rating.rating).toBe("优秀");
    });
  });

  describe("compareNames", () => {
    it("returns winner 1 when first score is higher", () => {
      const score1 = {
        overall: 85,
        rating: "良好",
        baziScore: 80,
        wugeScore: 85,
        phoneticScore: 90,
        meaningScore: 85,
        breakdown: {},
      };
      const score2 = {
        overall: 75,
        rating: "中等",
        baziScore: 70,
        wugeScore: 75,
        phoneticScore: 80,
        meaningScore: 75,
        breakdown: {},
      };

      const result = compareNames(score1, score2);
      expect(result.winner).toBe(1);
      expect(result.difference).toBe(10);
    });

    it("returns winner 2 when second score is higher", () => {
      const score1 = {
        overall: 70,
        rating: "中等",
        baziScore: 70,
        wugeScore: 70,
        phoneticScore: 70,
        meaningScore: 70,
        breakdown: {},
      };
      const score2 = {
        overall: 90,
        rating: "优秀",
        baziScore: 90,
        wugeScore: 90,
        phoneticScore: 90,
        meaningScore: 90,
        breakdown: {},
      };

      const result = compareNames(score1, score2);
      expect(result.winner).toBe(2);
      expect(result.difference).toBe(20);
    });

    it("returns winner 1 when scores are equal (first wins)", () => {
      const score1 = {
        overall: 80,
        rating: "良好",
        baziScore: 80,
        wugeScore: 80,
        phoneticScore: 80,
        meaningScore: 80,
        breakdown: {},
      };
      const score2 = {
        overall: 80,
        rating: "良好",
        baziScore: 80,
        wugeScore: 80,
        phoneticScore: 80,
        meaningScore: 80,
        breakdown: {},
      };

      const result = compareNames(score1, score2);
      expect(result.winner).toBe(1);
      expect(result.difference).toBe(0);
    });

    it("calculates correct difference", () => {
      const score1 = {
        overall: 95,
        rating: "优秀",
        baziScore: 95,
        wugeScore: 95,
        phoneticScore: 95,
        meaningScore: 95,
        breakdown: {},
      };
      const score2 = {
        overall: 60,
        rating: "一般",
        baziScore: 60,
        wugeScore: 60,
        phoneticScore: 60,
        meaningScore: 60,
        breakdown: {},
      };

      const result = compareNames(score1, score2);
      expect(result.difference).toBe(35);
    });

    it("handles extreme scores", () => {
      const score1 = {
        overall: 100,
        rating: "优秀",
        baziScore: 100,
        wugeScore: 100,
        phoneticScore: 100,
        meaningScore: 100,
        breakdown: {},
      };
      const score2 = {
        overall: 0,
        rating: "欠佳",
        baziScore: 0,
        wugeScore: 0,
        phoneticScore: 0,
        meaningScore: 0,
        breakdown: {},
      };

      const result = compareNames(score1, score2);
      expect(result.winner).toBe(1);
      expect(result.difference).toBe(100);
    });
  });

  describe("meetsMinimumStandards", () => {
    it("returns true for high-scoring name", () => {
      const score = {
        overall: 85,
        rating: "良好",
        baziScore: 80,
        wugeScore: 85,
        phoneticScore: 90,
        meaningScore: 85,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(true);
      expect(result.issues).toEqual([]);
    });

    it("returns false when overall score < 60", () => {
      const score = {
        overall: 45,
        rating: "欠佳",
        baziScore: 50,
        wugeScore: 60,
        phoneticScore: 60,
        meaningScore: 60,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(false);
      expect(result.issues).toContain("综合评分过低");
    });

    it("returns false when wugeScore < 50", () => {
      const score = {
        overall: 65,
        rating: "一般",
        baziScore: 70,
        wugeScore: 40,
        phoneticScore: 80,
        meaningScore: 80,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(false);
      expect(result.issues).toContain("五格数理不佳");
    });

    it("returns false when hasHomophone is true", () => {
      const score = {
        overall: 70,
        rating: "中等",
        baziScore: 70,
        wugeScore: 70,
        phoneticScore: 60,
        meaningScore: 80,
        breakdown: {
          phonetics: { hasHomophone: true },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(false);
      expect(result.issues).toContain("存在不良谐音");
    });

    it("returns false when phoneticScore < 50", () => {
      const score = {
        overall: 60,
        rating: "一般",
        baziScore: 60,
        wugeScore: 70,
        phoneticScore: 40,
        meaningScore: 80,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(false);
      expect(result.issues).toContain("音韵不够和谐");
    });

    it("returns false when meaningScore < 50", () => {
      const score = {
        overall: 60,
        rating: "一般",
        baziScore: 70,
        wugeScore: 70,
        phoneticScore: 70,
        meaningScore: 40,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(false);
      expect(result.issues).toContain("字义品质欠佳");
    });

    it("collects multiple issues", () => {
      const score = {
        overall: 45,
        rating: "欠佳",
        baziScore: 40,
        wugeScore: 40,
        phoneticScore: 40,
        meaningScore: 40,
        breakdown: {
          phonetics: { hasHomophone: true },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(false);
      expect(result.issues.length).toBeGreaterThan(1);
    });

    it("handles edge case of exactly 60 overall score", () => {
      const score = {
        overall: 60,
        rating: "一般",
        baziScore: 60,
        wugeScore: 60,
        phoneticScore: 60,
        meaningScore: 60,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(true);
    });

    it("handles edge case of exactly 50 wugeScore", () => {
      const score = {
        overall: 65,
        rating: "一般",
        baziScore: 70,
        wugeScore: 50,
        phoneticScore: 70,
        meaningScore: 70,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(true);
    });

    it("handles edge case of exactly 50 phoneticScore", () => {
      const score = {
        overall: 65,
        rating: "一般",
        baziScore: 70,
        wugeScore: 70,
        phoneticScore: 50,
        meaningScore: 70,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(true);
    });

    it("handles edge case of exactly 50 meaningScore", () => {
      const score = {
        overall: 65,
        rating: "一般",
        baziScore: 70,
        wugeScore: 70,
        phoneticScore: 70,
        meaningScore: 50,
        breakdown: {
          phonetics: { hasHomophone: false },
        },
      };

      const result = meetsMinimumStandards(score);
      expect(result.meets).toBe(true);
    });
  });

  describe("formatNameScoreAnalysis", () => {
    it("formats score analysis as readable string", () => {
      const score = {
        overall: 85,
        rating: "良好",
        baziScore: 80,
        wugeScore: 85,
        phoneticScore: 90,
        meaningScore: 85,
        breakdown: {
          bazi: getMockBaZiChart(),
          wuge: {
            tianGe: 8,
            renGe: 15,
            diGe: 22,
            waiGe: 9,
            zongGe: 29,
            tianGeInterpretation: {
              number: 8,
              fortune: "吉",
              meaning: "test",
              description: "test desc",
            },
            renGeInterpretation: {
              number: 15,
              fortune: "大吉",
              meaning: "test",
              description: "test desc",
            },
            diGeInterpretation: {
              number: 22,
              fortune: "凶",
              meaning: "test",
              description: "test desc",
            },
            waiGeInterpretation: {
              number: 9,
              fortune: "凶",
              meaning: "test",
              description: "test desc",
            },
            zongGeInterpretation: {
              number: 29,
              fortune: "吉",
              meaning: "test",
              description: "test desc",
            },
            sancai: {
              heaven: "金",
              human: "土",
              earth: "水",
              compatibility: "相生",
              interpretation: "test",
              score: 90,
            },
            overallScore: 85,
          },
          phonetics: {
            tonePattern: [3, 2, 2],
            toneHarmony: 85,
            hasHomophone: false,
            homophoneWarnings: [],
            readability: 90,
          },
        },
      };

      const formatted = formatNameScoreAnalysis(score);

      expect(formatted).toContain("综合评分");
      expect(formatted).toContain("85/100");
      expect(formatted).toContain("良好");
      expect(formatted).toContain("八字契合度");
      expect(formatted).toContain("五格数理");
      expect(formatted).toContain("音韵和谐");
      expect(formatted).toContain("字义品质");
    });

    it("includes emoji for rating", () => {
      const score = {
        overall: 95,
        rating: "优秀",
        baziScore: 95,
        wugeScore: 95,
        phoneticScore: 95,
        meaningScore: 95,
        breakdown: {},
      };

      const formatted = formatNameScoreAnalysis(score);
      expect(formatted).toContain("🌟");
    });

    it("shows all score components", () => {
      const score = {
        overall: 80,
        rating: "良好",
        baziScore: 75,
        wugeScore: 82,
        phoneticScore: 88,
        meaningScore: 79,
        breakdown: {},
      };

      const formatted = formatNameScoreAnalysis(score);
      expect(formatted).toContain("75/100");
      expect(formatted).toContain("82/100");
      expect(formatted).toContain("88/100");
      expect(formatted).toContain("79/100");
    });
  });

  describe("Real Name Examples", () => {
    it("scores 李明华 correctly", async () => {
      const score = await calculateNameScore(
        "李明华",
        "李",
        "明华",
        getMockCharacters(),
        getMockBaZiChart(),
      );

      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
    });

    it("scores 王伟 correctly", async () => {
      const characters = [
        {
          char: "王",
          pinyin: "wáng",
          tone: 2,
          strokeCount: 4,
          kangxiStrokeCount: 4,
          radical: "王",
          fiveElement: "土" as FiveElement,
          meaning: "君王",
          frequency: 30,
          hskLevel: 1,
        },
        {
          char: "伟",
          pinyin: "wěi",
          tone: 3,
          strokeCount: 11,
          kangxiStrokeCount: 11,
          radical: "亻",
          fiveElement: "土" as FiveElement,
          meaning: "伟大、宏伟",
          frequency: 150,
          hskLevel: 2,
        },
      ];

      const score = await calculateNameScore(
        "王伟",
        "王",
        "伟",
        characters,
        getMockBaZiChart(),
      );

      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
    });
  });

  describe("Meaning Score Calculation", () => {
    it("rewards positive meaning keywords", async () => {
      const positiveCharacters = [
        {
          char: "吉",
          pinyin: "jí",
          tone: 2,
          strokeCount: 6,
          kangxiStrokeCount: 6,
          radical: "口",
          fiveElement: "木" as FiveElement,
          meaning: "吉祥、吉利",
          frequency: 500,
          hskLevel: 2,
        },
        {
          char: "祥",
          pinyin: "xiáng",
          tone: 2,
          strokeCount: 10,
          kangxiStrokeCount: 10,
          radical: "示",
          fiveElement: "金" as FiveElement,
          meaning: "祥瑞、祥和",
          frequency: 800,
          hskLevel: 3,
        },
      ];

      const score = await calculateNameScore("吉祥", "吉", "祥", positiveCharacters);
      expect(score.meaningScore).toBeGreaterThan(60);
    });

    it("penalizes negative meaning keywords", async () => {
      const negativeCharacters = [
        {
          char: "贫",
          pinyin: "pín",
          tone: 2,
          strokeCount: 8,
          kangxiStrokeCount: 8,
          radical: "分",
          fiveElement: "木" as FiveElement,
          meaning: "贫穷、贫困",
          frequency: 2000,
          hskLevel: 4,
        },
        {
          char: "衰",
          pinyin: "shuāi",
          tone: 1,
          strokeCount: 10,
          kangxiStrokeCount: 10,
          radical: "衣",
          fiveElement: "金" as FiveElement,
          meaning: "衰败、衰落",
          frequency: 3000,
          hskLevel: 5,
        },
      ];

      const score = await calculateNameScore("贫衰", "贫", "衰", negativeCharacters);
      expect(score.meaningScore).toBeLessThan(60);
    });

    it("handles characters with no HSK level", async () => {
      const noHskCharacters = [
        {
          char: "龘",
          pinyin: "dá",
          tone: 2,
          strokeCount: 48,
          kangxiStrokeCount: 48,
          radical: "龍",
          fiveElement: "火" as FiveElement,
          meaning: "龙腾飞的样子",
          frequency: 10000,
        },
      ];

      const score = await calculateNameScore("龘", "龘", "", noHskCharacters);
      expect(score.meaningScore).toBeGreaterThanOrEqual(0);
      expect(score.meaningScore).toBeLessThanOrEqual(100);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty characters array", async () => {
      const score = await calculateNameScore("", "", "", [], getMockBaZiChart());
      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
    });

    it("handles single character name", async () => {
      const singleChar = [
        {
          char: "李",
          pinyin: "lǐ",
          tone: 3,
          strokeCount: 7,
          kangxiStrokeCount: 7,
          radical: "木",
          fiveElement: "木" as FiveElement,
          meaning: "李树",
          frequency: 50,
          hskLevel: 1,
        },
      ];

      const score = await calculateNameScore(
        "李",
        "李",
        "",
        singleChar,
        getMockBaZiChart(),
      );
      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
    });

    it("handles four character name (compound surname)", async () => {
      const fourChars = [
        {
          char: "欧",
          pinyin: "ōu",
          tone: 1,
          strokeCount: 8,
          kangxiStrokeCount: 8,
          radical: "欠",
          fiveElement: "土" as FiveElement,
          meaning: "姓",
          frequency: 100,
          hskLevel: 2,
        },
        {
          char: "阳",
          pinyin: "yáng",
          tone: 2,
          strokeCount: 6,
          kangxiStrokeCount: 6,
          radical: "阝",
          fiveElement: "土" as FiveElement,
          meaning: "太阳、向阳",
          frequency: 50,
          hskLevel: 1,
        },
        {
          char: "明",
          pinyin: "míng",
          tone: 2,
          strokeCount: 8,
          kangxiStrokeCount: 8,
          radical: "日",
          fiveElement: "火" as FiveElement,
          meaning: "光明",
          frequency: 200,
          hskLevel: 1,
        },
      ];

      const score = await calculateNameScore(
        "欧阳明",
        "欧阳",
        "明",
        fourChars,
        getMockBaZiChart(),
      );
      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
    });

    it("handles characters missing strokeCount (uses default 1)", async () => {
      const noStrokeChars = [
        {
          char: "李",
          pinyin: "lǐ",
          tone: 3,
          strokeCount: 7,
          kangxiStrokeCount: 7,
          radical: "木",
          fiveElement: "木" as FiveElement,
          meaning: "李树",
          frequency: 50,
          hskLevel: 1,
        },
        {
          char: "明",
          pinyin: "míng",
          tone: 2,
          strokeCount: 0,
          kangxiStrokeCount: 0,
          radical: "日",
          fiveElement: "火" as FiveElement,
          meaning: "光明",
          frequency: 200,
          hskLevel: 1,
        },
      ];

      const score = await calculateNameScore(
        "李明",
        "李",
        "明",
        noStrokeChars,
        getMockBaZiChart(),
      );
      expect(score.overall).toBeGreaterThanOrEqual(0);
    });
  });
});
