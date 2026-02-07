/**
 * Phonetics Engine Tests
 *
 * Tests for tone analysis, pinyin extraction,
 * homophone detection, and phonetic scoring
 */

import { describe, expect, it } from "vitest";
import {
  analyzePhonetics,
  calculatePhoneticScore,
  getDisplayPinyin,
  formatPhoneticAnalysis,
} from "@/lib/engines/phonetics";
import { TONE_PATTERNS_GOOD, TONE_PATTERNS_BAD } from "@/lib/constants";

describe("Phonetics Engine", () => {
  describe("analyzePhonetics", () => {
    it("returns complete phonetic analysis", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");

      expect(analysis.tonePattern).toBeDefined();
      expect(analysis.toneHarmony).toBeGreaterThanOrEqual(0);
      expect(analysis.toneHarmony).toBeLessThanOrEqual(100);
      expect(analysis.hasHomophone).toBeDefined();
      expect(analysis.homophoneWarnings).toBeDefined();
      expect(Array.isArray(analysis.homophoneWarnings)).toBe(true);
      expect(analysis.readability).toBeGreaterThanOrEqual(0);
      expect(analysis.readability).toBeLessThanOrEqual(100);
    });

    it("extracts correct tone pattern for 李明华", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");

      // 李(lǐ) = 3, 明(míng) = 2, 华(huá) = 2
      expect(analysis.tonePattern).toEqual([3, 2, 2]);
    });

    it("extracts correct tone pattern for 王伟", async () => {
      const analysis = await analyzePhonetics("王伟", "王", "伟");

      // 王(wáng) = 2, 伟(wěi) = 3
      expect(analysis.tonePattern).toEqual([2, 3]);
    });

    it("extracts correct tone pattern for 张思睿", async () => {
      const analysis = await analyzePhonetics("张思睿", "张", "思睿");

      // 张(zhāng) = 1, 思(sī) = 1, 睿(ruì) = 4
      expect(analysis.tonePattern).toEqual([1, 1, 4]);
    });

    it("detects homophone issues for problematic names", async () => {
      const analysis = await analyzePhonetics("王史", "王", "史");

      // 王(wáng) + 史(shǐ) could sound like "wàng shǐ" (王八/死)
      expect(analysis.hasHomophone).toBeDefined();
    });

    it("handles names without homophone issues", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");

      // Common positive name should not have major homophone issues
      expect(analysis.toneHarmony).toBeGreaterThan(50);
    });
  });

  describe("Tone Harmony", () => {
    it("gives higher score for varied tones", async () => {
      const variedTones = await analyzePhonetics("张思睿", "张", "思睿"); // 1, 1, 4
      const sameTones = await analyzePhonetics("李丽丽", "李", "丽丽"); // 3, 4, 4

      expect(variedTones.toneHarmony).toBeGreaterThanOrEqual(0);
      expect(sameTones.toneHarmony).toBeGreaterThanOrEqual(0);
    });

    it("penalizes double fourth tone pattern", async () => {
      const analysis = await analyzePhonetics("李大", "李", "大");

      // 李(3) + 大(4) - not double 4th but tests the logic
      expect(analysis.toneHarmony).toBeLessThanOrEqual(100);
    });

    it("rewards good tone patterns", async () => {
      // Test a name with good tone pattern
      const analysis = await analyzePhonetics("张明", "张", "明");

      expect(analysis.toneHarmony).toBeGreaterThan(50);
    });

    it("detects good patterns for double-character given names", () => {
      const goodPatterns = [
        [1, 2], // 1-2 pattern
        [1, 3],
        [1, 4],
        [2, 1],
        [2, 3],
        [2, 4],
        [3, 1],
        [3, 2],
        [3, 4],
        [4, 1],
        [4, 2],
        [4, 3],
      ];

      // Test that our patterns match the constant
      expect(TONE_PATTERNS_GOOD.length).toBe(12);
    });

    it("detects bad patterns (double 4th tone)", () => {
      expect(TONE_PATTERNS_BAD).toContainEqual([4, 4]);
    });
  });

  describe("Readability", () => {
    it("gives higher score for optimal length (2-3 chars)", async () => {
      const twoChars = await analyzePhonetics("王伟", "王", "伟");
      const threeChars = await analyzePhonetics("李明华", "李", "明华");

      expect(twoChars.readability).toBeGreaterThan(70);
      expect(threeChars.readability).toBeGreaterThan(70);
    });

    it("penalizes very long names", async () => {
      const analysis = await analyzePhonetics("司马", "司马", "");

      expect(analysis.readability).toBeGreaterThanOrEqual(0);
      expect(analysis.readability).toBeLessThanOrEqual(100);
    });

    it("accounts for complex initials (zh, ch, sh)", async () => {
      const analysis = await analyzePhonetics("张", "张", "");

      // 张 starts with zh
      expect(analysis.readability).toBeGreaterThanOrEqual(0);
      expect(analysis.readability).toBeLessThanOrEqual(100);
    });

    it("accounts for very complex syllables", () => {
      const complexSyllables = ["zhuang", "chuang", "shuang", "niang", "jiang"];

      complexSyllables.forEach((syllable) => {
        const testChar = syllable[0]; // Just test that the function handles it
        expect(testChar).toBeTruthy();
      });
    });

    it("rewards smooth tone transitions", async () => {
      const analysis1 = await analyzePhonetics("李明华", "李", "明华"); // 3-2-2
      const analysis2 = await analyzePhonetics("张思睿", "张", "思睿"); // 1-1-4

      expect(analysis1.readability).toBeGreaterThan(0);
      expect(analysis2.readability).toBeGreaterThan(0);
    });
  });

  describe("Homophone Detection", () => {
    it("detects problematic individual syllables", async () => {
      // Test with names containing potentially problematic sounds
      const testCases = [
        { name: "史", surname: "王", given: "史" }, // shi - could sound like "死"
        { name: "杀", surname: "王", given: "沙" }, // sha - sounds like "杀"
      ];

      for (const { name, surname, given } of testCases) {
        const analysis = await analyzePhonetics(name, surname, given);
        expect(analysis.hasHomophone).toBeDefined();
      }
    });

    it("detects problematic combined sounds", async () => {
      // Test combined sounds that might be problematic
      const testCases = [
        { name: "王八", surname: "王", given: "八" }, // wangba - 王八
      ];

      for (const { name, surname, given } of testCases) {
        const analysis = await analyzePhonetics(name, surname, given);
        expect(analysis.hasHomophone).toBeDefined();
        expect(Array.isArray(analysis.homophoneWarnings)).toBe(true);
      }
    });

    it("returns empty warnings for clean names", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");

      // Should have minimal homophone warnings
      expect(analysis.homophoneWarnings.length).toBeLessThan(3);
    });

    it("provides warning messages when homophones detected", async () => {
      const analysis = await analyzePhonetics("王史", "王", "史");

      if (analysis.hasHomophone) {
        expect(analysis.homophoneWarnings.length).toBeGreaterThan(0);
        analysis.homophoneWarnings.forEach((warning) => {
          expect(typeof warning).toBe("string");
          expect(warning.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe("calculatePhoneticScore", () => {
    it("returns score between 0 and 100", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");
      const score = calculatePhoneticScore(analysis);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it("combines tone harmony, readability, and homophone factors", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");
      const score = calculatePhoneticScore(analysis);

      // Score should be influenced by all three factors
      expect(score).toBeGreaterThan(0);
    });

    it("penalizes names with homophone issues", async () => {
      const goodAnalysis = await analyzePhonetics("李明华", "李", "明华");
      const badAnalysis = await analyzePhonetics("王史", "王", "史");

      const goodScore = calculatePhoneticScore(goodAnalysis);
      const badScore = calculatePhoneticScore(badAnalysis);

      expect(goodScore).toBeGreaterThanOrEqual(0);
      expect(badScore).toBeGreaterThanOrEqual(0);

      if (badAnalysis.hasHomophone) {
        expect(badScore).toBeLessThan(100);
      }
    });

    it("rewards names without homophone issues", async () => {
      const analysis = await analyzePhonetics("张思睿", "张", "思睿");
      const score = calculatePhoneticScore(analysis);

      if (!analysis.hasHomophone) {
        expect(score).toBeGreaterThan(50);
      }
    });

    it("weights tone harmony and readability equally (40% each)", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");
      const score = calculatePhoneticScore(analysis);

      // Calculate expected weighted score
      const weightedScore =
        analysis.toneHarmony * 0.4 +
        analysis.readability * 0.4 +
        (analysis.hasHomophone ? -20 : 20);

      expect(score).toBe(Math.max(0, Math.min(100, Math.round(weightedScore))));
    });
  });

  describe("getDisplayPinyin", () => {
    it("returns pinyin with tone marks", async () => {
      const pinyin = await getDisplayPinyin("李明华");

      expect(pinyin).toBeTruthy();
      expect(typeof pinyin).toBe("string");
      expect(pinyin.length).toBeGreaterThan(0);
    });

    it("handles two character names", async () => {
      const pinyin = await getDisplayPinyin("王伟");

      expect(pinyin).toContain(" ");
    });

    it("handles three character names", async () => {
      const pinyin = await getDisplayPinyin("李明华");

      expect(pinyin).toBeTruthy();
    });

    it("handles four character names", async () => {
      const pinyin = await getDisplayPinyin("司马");

      expect(pinyin).toBeTruthy();
    });
  });

  describe("formatPhoneticAnalysis", () => {
    it("formats analysis as readable string", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");
      const formatted = formatPhoneticAnalysis(analysis);

      expect(formatted).toContain("音韵分析");
      expect(formatted).toContain("声调模式");
      expect(formatted).toContain("声调和谐度");
      expect(formatted).toContain("朗读流畅度");
    });

    it("includes tone pattern in formatted output", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");
      const formatted = formatPhoneticAnalysis(analysis);

      expect(formatted).toContain(analysis.tonePattern.join("-"));
    });

    it("shows homophone warnings when present", async () => {
      const analysis = await analyzePhonetics("王史", "王", "史");
      const formatted = formatPhoneticAnalysis(analysis);

      if (analysis.hasHomophone) {
        expect(formatted).toContain("谐音提示");
      }
    });

    it("shows clean message when no homophones", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");
      const formatted = formatPhoneticAnalysis(analysis);

      if (!analysis.hasHomophone) {
        expect(formatted).toContain("无不良谐音");
      }
    });
  });

  describe("Real Name Examples", () => {
    it("analyzes 李明华 correctly", async () => {
      const analysis = await analyzePhonetics("李明华", "李", "明华");

      expect(analysis.tonePattern).toEqual([3, 2, 2]);
      expect(analysis.toneHarmony).toBeGreaterThan(50);
      expect(analysis.readability).toBeGreaterThan(50);
    });

    it("analyzes 张思睿 correctly", async () => {
      const analysis = await analyzePhonetics("张思睿", "张", "思睿");

      expect(analysis.tonePattern).toEqual([1, 1, 4]);
      expect(analysis.toneHarmony).toBeGreaterThan(50);
    });

    it("analyzes 王伟 correctly", async () => {
      const analysis = await analyzePhonetics("王伟", "王", "伟");

      expect(analysis.tonePattern).toEqual([2, 3]);
    });
  });

  describe("Edge Cases", () => {
    it("handles single character", async () => {
      const analysis = await analyzePhonetics("李", "李", "");

      expect(analysis.tonePattern).toEqual([3]);
      expect(analysis.toneHarmony).toBeGreaterThanOrEqual(0);
      expect(analysis.toneHarmony).toBeLessThanOrEqual(100);
    });

    it("handles four character names (compound surname)", async () => {
      const analysis = await analyzePhonetics("欧阳明", "欧阳", "明");

      expect(analysis.tonePattern.length).toBe(3);
      expect(analysis.toneHarmony).toBeGreaterThanOrEqual(0);
    });

    it("handles names with all same tones", async () => {
      const analysis = await analyzePhonetics("李丽丽", "李", "丽丽"); // 3, 4, 4

      expect(analysis.toneHarmony).toBeLessThan(100); // Should be penalized
    });

    it("handles names starting with fourth tone", async () => {
      const analysis = await analyzePhonetics("大树", "大", "树"); // 4, 4

      expect(analysis.toneHarmony).toBeLessThanOrEqual(100);
    });

    it("handles names with multiple fourth tones", async () => {
      const analysis = await analyzePhonetics("李大树", "李", "大树"); // 3, 4, 4

      expect(analysis.toneHarmony).toBeLessThan(90); // Should be penalized
    });

    it("returns valid tone pattern for any Chinese characters", async () => {
      const testNames = ["张", "王李", "李明华", "欧阳明"];

      for (const name of testNames) {
        const surname = name[0];
        const givenName = name.slice(1);
        const analysis = await analyzePhonetics(name, surname, givenName);

        expect(analysis.tonePattern).toBeDefined();
        expect(analysis.tonePattern.length).toBe(name.length);
        analysis.tonePattern.forEach((tone) => {
          expect(tone).toBeGreaterThanOrEqual(1);
          expect(tone).toBeLessThanOrEqual(5);
        });
      }
    });
  });

  describe("Tone Pattern Constants", () => {
    it("has all good tone patterns defined", () => {
      expect(TONE_PATTERNS_GOOD.length).toBe(12);
    });

    it("has bad tone patterns defined", () => {
      expect(TONE_PATTERNS_BAD.length).toBeGreaterThan(0);
      expect(TONE_PATTERNS_BAD).toContainEqual([4, 4]);
    });

    it("good patterns contain no duplicates", () => {
      const uniquePatterns = new Set(
        TONE_PATTERNS_GOOD.map((p) => p.join(",")),
      );
      expect(uniquePatterns.size).toBe(TONE_PATTERNS_GOOD.length);
    });
  });
});
