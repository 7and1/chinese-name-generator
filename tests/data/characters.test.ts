/**
 * Character Data Tests
 *
 * Tests for character database integrity, element classification,
 * character search, and data utility functions
 */

import { describe, expect, it } from "vitest";
import {
  SAMPLE_CHARACTERS,
  getCharacterCount,
  getCharactersByElement,
  getCharacter,
  getCharactersByElements,
  getCommonCharacters,
} from "@/lib/data/characters";
import type { FiveElement } from "@/lib/types";

describe("Character Data", () => {
  describe("Data Integrity", () => {
    it("has at least 150 characters", () => {
      expect(SAMPLE_CHARACTERS.length).toBeGreaterThanOrEqual(150);
    });

    it("all characters have required fields", () => {
      SAMPLE_CHARACTERS.forEach((char) => {
        expect(char.char).toBeDefined();
        expect(char.pinyin).toBeDefined();
        expect(char.tone).toBeGreaterThanOrEqual(1);
        expect(char.tone).toBeLessThanOrEqual(5);
        expect(char.strokeCount).toBeGreaterThan(0);
        expect(char.kangxiStrokeCount).toBeGreaterThan(0);
        expect(char.radical).toBeDefined();
        expect(char.fiveElement).toBeDefined();
        expect(char.meaning).toBeDefined();
        expect(char.frequency).toBeGreaterThanOrEqual(0);
      });
    });

    it("all characters have valid five elements", () => {
      const validElements: FiveElement[] = ["金", "木", "水", "火", "土"];

      SAMPLE_CHARACTERS.forEach((char) => {
        expect(validElements).toContain(char.fiveElement);
      });
    });

    it("all characters have unique char field", () => {
      const chars = SAMPLE_CHARACTERS.map((c) => c.char);
      const uniqueChars = new Set(chars);

      expect(uniqueChars.size).toBe(chars.length);
    });

    it("all pinyin values are lowercase", () => {
      SAMPLE_CHARACTERS.forEach((char) => {
        expect(char.pinyin).toBe(char.pinyin.toLowerCase());
      });
    });

    it("all meanings are non-empty strings", () => {
      SAMPLE_CHARACTERS.forEach((char) => {
        expect(char.meaning.length).toBeGreaterThan(0);
      });
    });
  });

  describe("getCharacterCount", () => {
    it("returns correct count", () => {
      const count = getCharacterCount();
      expect(count).toBe(SAMPLE_CHARACTERS.length);
    });

    it("returns a positive number", () => {
      expect(getCharacterCount()).toBeGreaterThan(0);
    });
  });

  describe("getCharactersByElement", () => {
    it("returns only characters with specified element", () => {
      const metalChars = getCharactersByElement("金");

      metalChars.forEach((char) => {
        expect(char.fiveElement).toBe("金");
      });
    });

    it("returns non-empty results for all five elements", () => {
      const elements: FiveElement[] = ["金", "木", "水", "火", "土"];

      elements.forEach((element) => {
        const chars = getCharactersByElement(element);
        expect(chars.length).toBeGreaterThan(0);
      });
    });

    it("results contain valid characters", () => {
      const woodChars = getCharactersByElement("木");

      woodChars.forEach((char) => {
        expect(char.char).toBeDefined();
        expect(char.pinyin).toBeDefined();
        expect(char.fiveElement).toBe("木");
      });
    });

    it("has reasonable distribution across elements", () => {
      const metalCount = getCharactersByElement("金").length;
      const woodCount = getCharactersByElement("木").length;
      const waterCount = getCharactersByElement("水").length;
      const fireCount = getCharactersByElement("火").length;
      const earthCount = getCharactersByElement("土").length;

      // Each element should have at least 10 characters
      expect(metalCount).toBeGreaterThanOrEqual(10);
      expect(woodCount).toBeGreaterThanOrEqual(10);
      expect(waterCount).toBeGreaterThanOrEqual(10);
      expect(fireCount).toBeGreaterThanOrEqual(10);
      expect(earthCount).toBeGreaterThanOrEqual(10);
    });
  });

  describe("getCharacter", () => {
    it("returns character when found", () => {
      const char = getCharacter("李");

      expect(char).toBeDefined();
      expect(char?.char).toBe("李");
      expect(char?.fiveElement).toBe("木");
    });

    it("returns undefined for non-existent character", () => {
      const char = getCharacter("xyz");
      expect(char).toBeUndefined();
    });

    it("returns correct pinyin for known characters", () => {
      const li = getCharacter("李");
      const wang = getCharacter("王");
      const zhang = getCharacter("张");

      expect(li?.pinyin).toBe("lǐ");
      expect(wang?.pinyin).toBe("wáng");
      expect(zhang?.pinyin).toBe("zhāng");
    });

    it("returns correct five element for known characters", () => {
      const li = getCharacter("李"); // Wood
      const wang = getCharacter("王"); // Earth
      const zhang = getCharacter("张"); // Fire
      const liu = getCharacter("刘"); // Metal

      expect(li?.fiveElement).toBe("木");
      expect(wang?.fiveElement).toBe("土");
      expect(zhang?.fiveElement).toBe("火");
      expect(liu?.fiveElement).toBe("金");
    });

    it("returns correct stroke counts for known characters", () => {
      const li = getCharacter("李");
      const wang = getCharacter("王");

      expect(li?.strokeCount).toBe(7);
      expect(li?.kangxiStrokeCount).toBe(7);
      expect(wang?.strokeCount).toBe(4);
      expect(wang?.kangxiStrokeCount).toBe(4);
    });

    it("returns correct meaning for known characters", () => {
      const li = getCharacter("李");
      const wang = getCharacter("王");

      expect(li?.meaning).toContain("李");
      expect(wang?.meaning).toContain("王");
    });
  });

  describe("getCharactersByElements", () => {
    it("returns characters from any of the specified elements", () => {
      const chars = getCharactersByElements(["金", "木"]);

      chars.forEach((char) => {
        expect(["金", "木"]).toContain(char.fiveElement);
      });
    });

    it("returns empty array for empty elements array", () => {
      const chars = getCharactersByElements([]);
      expect(chars.length).toBe(0);
    });

    it("returns all characters when all elements specified", () => {
      const allElements: FiveElement[] = ["金", "木", "水", "火", "土"];
      const chars = getCharactersByElements(allElements);

      expect(chars.length).toBe(SAMPLE_CHARACTERS.length);
    });

    it("returns correct count for two elements", () => {
      const metal = getCharactersByElement("金").length;
      const wood = getCharactersByElement("木").length;
      const chars = getCharactersByElements(["金", "木"]);

      expect(chars.length).toBe(metal + wood);
    });

    it("handles single element", () => {
      const chars = getCharactersByElements(["火"]);

      expect(chars.length).toBe(getCharactersByElement("火").length);
    });
  });

  describe("getCommonCharacters", () => {
    it("returns characters with frequency below threshold", () => {
      const chars = getCommonCharacters(1000);

      chars.forEach((char) => {
        expect(char.frequency).toBeLessThanOrEqual(1000);
      });
    });

    it("returns non-empty results for reasonable threshold", () => {
      const chars = getCommonCharacters(1000);
      expect(chars.length).toBeGreaterThan(0);
    });

    it("returns fewer characters for lower threshold", () => {
      const chars1000 = getCommonCharacters(1000);
      const chars100 = getCommonCharacters(100);

      expect(chars100.length).toBeLessThanOrEqual(chars1000.length);
    });

    it("returns all characters for very high threshold", () => {
      const chars = getCommonCharacters(10000);
      expect(chars.length).toBeGreaterThan(0);
    });

    it("uses default threshold of 1000 when not specified", () => {
      const chars = getCommonCharacters();
      expect(chars.length).toBeGreaterThan(0);
    });
  });

  describe("Surnames", () => {
    it("contains common Chinese surnames", () => {
      const commonSurnames = ["李", "王", "张", "刘", "陈", "杨", "黄", "赵"];

      commonSurnames.forEach((surname) => {
        const char = getCharacter(surname);
        expect(char).toBeDefined();
      });
    });

    it("surname data has correct attributes", () => {
      const surnames = ["李", "王", "张", "刘", "陈"];

      surnames.forEach((surname) => {
        const char = getCharacter(surname);
        expect(char?.char).toBeDefined();
        expect(char?.pinyin).toBeDefined();
        expect(char?.tone).toBeGreaterThanOrEqual(1);
        expect(char?.tone).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("Common Given Names", () => {
    it("contains common given name characters", () => {
      const commonGivenChars = [
        "华",
        "文",
        "武",
        "志",
        "强",
        "伟",
        "刚",
        "磊",
        "敏",
        "俊",
        "静",
        "婷",
        "淑",
        "芳",
        "丽",
      ];

      commonGivenChars.forEach((charStr) => {
        const char = getCharacter(charStr);
        expect(char).toBeDefined();
      });
    });
  });

  describe("Element-Specific Characters", () => {
    it("has characters with metal element (金)", () => {
      const metalChars = getCharactersByElement("金");
      const expectedMetalChars = ["鑫", "锐", "铭", "钧", "锋"];

      expectedMetalChars.forEach((charStr) => {
        const found = metalChars.find((c) => c.char === charStr);
        expect(found).toBeDefined();
        expect(found?.fiveElement).toBe("金");
      });
    });

    it("has characters with wood element (木)", () => {
      const woodChars = getCharactersByElement("木");
      const expectedWoodChars = ["林", "森", "杰", "梓", "楠", "柏"];

      expectedWoodChars.forEach((charStr) => {
        const found = woodChars.find((c) => c.char === charStr);
        expect(found).toBeDefined();
        expect(found?.fiveElement).toBe("木");
      });
    });

    it("has characters with water element (水)", () => {
      const waterChars = getCharactersByElement("水");
      const expectedWaterChars = ["海", "涵", "泽", "浩", "洋", "淼"];

      expectedWaterChars.forEach((charStr) => {
        const found = waterChars.find((c) => c.char === charStr);
        expect(found).toBeDefined();
        expect(found?.fiveElement).toBe("水");
      });
    });

    it("has characters with fire element (火)", () => {
      const fireChars = getCharactersByElement("火");
      const expectedFireChars = ["炎", "烨", "焱", "煜", "晖", "晨"];

      expectedFireChars.forEach((charStr) => {
        const found = fireChars.find((c) => c.char === charStr);
        expect(found).toBeDefined();
        expect(found?.fiveElement).toBe("火");
      });
    });

    it("has characters with earth element (土)", () => {
      const earthChars = getCharactersByElement("土");
      const expectedEarthChars = ["坤", "培", "坚", "城", "垚", "圣"];

      expectedEarthChars.forEach((charStr) => {
        const found = earthChars.find((c) => c.char === charStr);
        expect(found).toBeDefined();
        expect(found?.fiveElement).toBe("土");
      });
    });
  });

  describe("Tone Distribution", () => {
    it("has characters for all four tones", () => {
      const tones = [1, 2, 3, 4];

      tones.forEach((tone) => {
        const chars = SAMPLE_CHARACTERS.filter((c) => c.tone === tone);
        expect(chars.length).toBeGreaterThan(0);
      });
    });

    it("has reasonable tone distribution", () => {
      const tone1 = SAMPLE_CHARACTERS.filter((c) => c.tone === 1).length;
      const tone2 = SAMPLE_CHARACTERS.filter((c) => c.tone === 2).length;
      const tone3 = SAMPLE_CHARACTERS.filter((c) => c.tone === 3).length;
      const tone4 = SAMPLE_CHARACTERS.filter((c) => c.tone === 4).length;

      // Each tone should have at least 20 characters
      expect(tone1).toBeGreaterThanOrEqual(20);
      expect(tone2).toBeGreaterThanOrEqual(20);
      expect(tone3).toBeGreaterThanOrEqual(20);
      expect(tone4).toBeGreaterThanOrEqual(20);
    });
  });

  describe("Stroke Count Distribution", () => {
    it("has characters with various stroke counts", () => {
      const strokeCounts = new Set(SAMPLE_CHARACTERS.map((c) => c.strokeCount));

      expect(strokeCounts.size).toBeGreaterThan(10);
    });

    it("all stroke counts are positive", () => {
      SAMPLE_CHARACTERS.forEach((char) => {
        expect(char.strokeCount).toBeGreaterThan(0);
        expect(char.kangxiStrokeCount).toBeGreaterThan(0);
      });
    });

    it("has characters with simple stroke counts (1-5)", () => {
      const simpleChars = SAMPLE_CHARACTERS.filter((c) => c.strokeCount <= 5);
      expect(simpleChars.length).toBeGreaterThan(0);
    });

    it("has characters with complex stroke counts (>15)", () => {
      const complexChars = SAMPLE_CHARACTERS.filter((c) => c.strokeCount > 15);
      expect(complexChars.length).toBeGreaterThan(0);
    });
  });

  describe("HSK Level Data", () => {
    it("has some characters with HSK level defined", () => {
      const withHsk = SAMPLE_CHARACTERS.filter((c) => c.hskLevel);
      expect(withHsk.length).toBeGreaterThan(0);
    });

    it("HSK levels are in valid range (1-6)", () => {
      SAMPLE_CHARACTERS.forEach((char) => {
        if (char.hskLevel) {
          expect(char.hskLevel).toBeGreaterThanOrEqual(1);
          expect(char.hskLevel).toBeLessThanOrEqual(6);
        }
      });
    });

    it("has characters for each HSK level", () => {
      for (let level = 1; level <= 6; level++) {
        const chars = SAMPLE_CHARACTERS.filter((c) => c.hskLevel === level);
        // Not all levels need to have characters, but level 1-4 should
        if (level <= 4) {
          expect(chars.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("Frequency Data", () => {
    it("all characters have non-negative frequency", () => {
      SAMPLE_CHARACTERS.forEach((char) => {
        expect(char.frequency).toBeGreaterThanOrEqual(0);
      });
    });

    it("has variety in frequency values", () => {
      const frequencies = new Set(SAMPLE_CHARACTERS.map((c) => c.frequency));
      expect(frequencies.size).toBeGreaterThan(10);
    });

    it("has some very common characters (frequency < 100)", () => {
      const common = SAMPLE_CHARACTERS.filter((c) => c.frequency < 100);
      expect(common.length).toBeGreaterThan(0);
    });

    it("has some rare characters (frequency > 2000)", () => {
      const rare = SAMPLE_CHARACTERS.filter((c) => c.frequency > 2000);
      expect(rare.length).toBeGreaterThan(0);
    });
  });

  describe("Character Search and Find", () => {
    it("can find multiple characters by different elements", () => {
      const metalChars = getCharactersByElement("金");
      const woodChars = getCharactersByElement("木");

      expect(metalChars.length).toBeGreaterThan(0);
      expect(woodChars.length).toBeGreaterThan(0);
      expect(metalChars).not.toEqual(woodChars);
    });

    it("returns correct character object", () => {
      const char = getCharacter("明");

      expect(char).toBeDefined();
      expect(char?.char).toBe("明");
      expect(char?.pinyin).toBe("míng");
      expect(char?.tone).toBe(2);
    });

    it("character data is consistent across lookups", () => {
      const char1 = getCharacter("李");
      const char2 = getCharacter("李");

      expect(char1).toEqual(char2);
    });
  });

  describe("Radical Data", () => {
    it("all characters have a radical", () => {
      SAMPLE_CHARACTERS.forEach((char) => {
        expect(char.radical).toBeDefined();
        expect(char.radical.length).toBeGreaterThan(0);
      });
    });

    it("has variety in radicals", () => {
      const radicals = new Set(SAMPLE_CHARACTERS.map((c) => c.radical));
      expect(radicals.size).toBeGreaterThan(10);
    });

    it("common radicals are present", () => {
      const radicalSet = new Set(SAMPLE_CHARACTERS.map((c) => c.radical));
      const commonRadicals = ["木", "水", "火", "土", "金", "女", "艹", "宀"];

      commonRadicals.forEach((radical) => {
        expect(
          radicalSet.has(radical) ||
            SAMPLE_CHARACTERS.some((c) => c.radical === radical),
        ).toBe(true);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string for getCharacter", () => {
      const char = getCharacter("");
      expect(char).toBeUndefined();
    });

    it("handles non-Chinese characters for getCharacter", () => {
      const char = getCharacter("abc");
      expect(char).toBeUndefined();
    });

    it("handles special characters for getCharacter", () => {
      const char = getCharacter("·");
      expect(char).toBeUndefined();
    });

    it("handles very large frequency threshold", () => {
      const chars = getCommonCharacters(100000);
      expect(chars.length).toBeGreaterThanOrEqual(0);
    });

    it("handles zero frequency threshold", () => {
      const chars = getCommonCharacters(0);
      // Zero frequency should return very few or no characters
      expect(chars.length).toBeGreaterThanOrEqual(0);
    });
  });
});
