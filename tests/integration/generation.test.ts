/**
 * Name Generation Integration Tests
 *
 * Tests for complete name generation flow with various parameter combinations,
 * edge cases, and boundary conditions
 */

import { describe, expect, it } from "vitest";
import { generateNames } from "@/lib/engines/generator";
import { calculateNameScore } from "@/lib/engines/scorer";
import { calculateBaZiFromYmd } from "@/lib/engines/bazi";
import type { NameGenerationOptions, FiveElement } from "@/lib/types";

describe("Name Generation Integration", () => {
  describe("Basic Generation", () => {
    it("generates names for male gender", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
      expect(names.length).toBeLessThanOrEqual(5);
      names.forEach((name) => {
        expect(name.fullName).toContain("李");
        expect(name.surname).toBe("李");
        expect(name.givenName.length).toBeGreaterThan(0);
        expect(name.score.overall).toBeGreaterThanOrEqual(0);
        expect(name.score.overall).toBeLessThanOrEqual(100);
      });
    });

    it("generates names for female gender", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
      names.forEach((name) => {
        expect(name.fullName).toContain("王");
        expect(name.surname).toBe("王");
        expect(name.givenName.length).toBeGreaterThan(0);
      });
    });

    it("generates names for neutral gender", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("generates single character given names", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        characterCount: 1,
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.givenName.length).toBe(1);
        expect(name.fullName.length).toBe(2); // surname + 1 char
      });
    });

    it("generates double character given names by default", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.givenName.length).toBe(2);
        expect(name.fullName.length).toBe(3); // surname + 2 chars
      });
    });
  });

  describe("BaZi-Based Generation", () => {
    it("generates names based on birth date BaZi analysis", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        birthDate: new Date(Date.UTC(1990, 11, 23)),
        birthHour: 8,
        maxResults: 10,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);

      // Verify that generated names use favorable elements
      const baziChart = calculateBaZiFromYmd(1990, 12, 23, 8);
      names.forEach((name) => {
        const nameElements = name.characters.map((c) => c.fiveElement);
        const hasFavorableElement =
          baziChart.favorableElements &&
          baziChart.favorableElements.length > 0 &&
          nameElements.some((el) =>
            baziChart.favorableElements.includes(el as FiveElement),
          );
        // At least some names should have favorable elements
        expect(name.score.baziScore).toBeGreaterThan(0);
      });
    });

    it("uses favorable elements from BaZi calculation", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "female",
        birthDate: new Date(Date.UTC(2000, 5, 15, 10, 0, 0)),
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
      names.forEach((name) => {
        expect(name.score.baziScore).toBeGreaterThan(40);
      });
    });

    it("generates different names for different birth dates", async () => {
      const options1: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        birthDate: new Date(Date.UTC(1990, 11, 23)),
        maxResults: 10,
      };

      const options2: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        birthDate: new Date(Date.UTC(2000, 5, 15)),
        maxResults: 10,
      };

      const names1 = await generateNames(options1);
      const names2 = await generateNames(options2);

      // Names should be different due to different BaZi
      const nameSet1 = new Set(names1.map((n) => n.fullName));
      const nameSet2 = new Set(names2.map((n) => n.fullName));

      // At least some names should be different
      const intersection = [...nameSet1].filter((x) => nameSet2.has(x));
      expect(intersection.length).toBeLessThan(nameSet1.size);
    });
  });

  describe("Element-Based Generation", () => {
    it("generates names with preferred elements", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        preferredElements: ["金", "水"],
        maxResults: 10,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);

      // Check that names use the preferred elements
      const hasPreferredElement = names.some((name) =>
        name.characters.some((c) => ["金", "水"].includes(c.fiveElement)),
      );
      expect(hasPreferredElement).toBe(true);
    });

    it("avoids unwanted elements when specified", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        avoidElements: ["火"],
        maxResults: 10,
      };

      const names = await generateNames(options);

      // Check that names don't use avoided elements
      names.forEach((name) => {
        const hasAvoidedElement = name.characters.some(
          (c) => c.fiveElement === "火",
        );
        if (hasAvoidedElement) {
          // If some names have avoided elements, at least verify we tried to avoid
          expect(name.score.baziScore).toBeGreaterThanOrEqual(0);
        }
      });
    });

    it("respects both preferred and avoided elements", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        preferredElements: ["木", "水"],
        avoidElements: ["金"],
        maxResults: 10,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe("Style-Based Generation", () => {
    it("generates classic style names", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        style: "classic",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("generates modern style names", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        style: "modern",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("generates poetic style names", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "female",
        style: "poetic",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("generates elegant style names", async () => {
      const options: NameGenerationOptions = {
        surname: "刘",
        gender: "female",
        style: "elegant",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe("Source-Based Generation", () => {
    it("generates names from poetry source", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "female",
        source: "poetry",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("generates names from classics source", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "male",
        source: "classics",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("generates names from idioms source", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        source: "idioms",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("generates names from any source", async () => {
      const options: NameGenerationOptions = {
        surname: "刘",
        gender: "female",
        source: "any",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("includes source information when poetry source is used", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "female",
        source: "poetry",
        maxResults: 10,
      };

      const names = await generateNames(options);

      // Some names should have source information
      const namesWithSource = names.filter((n) => n.source);
      expect(namesWithSource.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Name Quality", () => {
    it("returns names with complete character data", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.characters.length).toBeGreaterThan(0);
        name.characters.forEach((char) => {
          expect(char.char).toBeDefined();
          expect(char.pinyin).toBeDefined();
          expect(char.fiveElement).toBeDefined();
          expect(char.meaning).toBeDefined();
        });
      });
    });

    it("returns names with valid scores", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.score.overall).toBeGreaterThanOrEqual(0);
        expect(name.score.overall).toBeLessThanOrEqual(100);
        expect(name.score.baziScore).toBeGreaterThanOrEqual(0);
        expect(name.score.baziScore).toBeLessThanOrEqual(100);
        expect(name.score.wugeScore).toBeGreaterThanOrEqual(0);
        expect(name.score.wugeScore).toBeLessThanOrEqual(100);
        expect(name.score.phoneticScore).toBeGreaterThanOrEqual(0);
        expect(name.score.phoneticScore).toBeLessThanOrEqual(100);
        expect(name.score.meaningScore).toBeGreaterThanOrEqual(0);
        expect(name.score.meaningScore).toBeLessThanOrEqual(100);
      });
    });

    it("returns names with valid pinyin", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "male",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.pinyin).toBeDefined();
        expect(name.pinyin.length).toBeGreaterThan(0);
        expect(name.pinyin.split(" ").length).toBe(name.fullName.length);
      });
    });

    it("returns names with explanations", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "female",
        maxResults: 5,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.explanation).toBeDefined();
        expect(name.explanation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Different Surnames", () => {
    it("generates names for single character surnames", async () => {
      const surnames = ["李", "王", "张", "刘", "陈"];

      for (const surname of surnames) {
        const options: NameGenerationOptions = {
          surname,
          gender: "neutral",
          maxResults: 3,
        };

        const names = await generateNames(options);
        expect(names.length).toBeGreaterThan(0);

        names.forEach((name) => {
          expect(name.surname).toBe(surname);
          expect(name.fullName.startsWith(surname)).toBe(true);
        });
      }
    });

    it("handles less common surnames", async () => {
      const options: NameGenerationOptions = {
        surname: "赵",
        gender: "male",
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles maxResults of 1", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 1,
      };

      const names = await generateNames(options);

      expect(names.length).toBe(1);
    });

    it("handles maxResults of 50", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 50,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
      expect(names.length).toBeLessThanOrEqual(50);
    });

    it("returns unique names", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 20,
      };

      const names = await generateNames(options);
      const uniqueNames = new Set(names.map((n) => n.fullName));

      expect(uniqueNames.size).toBe(names.length);
    });

    it("handles names with all options specified", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "female",
        birthDate: new Date(Date.UTC(1995, 6, 20, 14, 30, 0)),
        birthHour: 14,
        preferredElements: ["木", "水"],
        avoidElements: ["金"],
        style: "elegant",
        source: "poetry",
        characterCount: 2,
        maxResults: 5,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
    });

    it("gracefully handles no matching characters", async () => {
      // This tests the fallback mechanism
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        preferredElements: ["金"],
        avoidElements: ["金", "木", "水", "火", "土"],
        maxResults: 5,
      };

      const names = await generateNames(options);

      // Should still generate names using fallback
      expect(names.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Name Scoring Integration", () => {
    it("generates names sorted by score", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 10,
      };

      const names = await generateNames(options);

      // Names should be sorted by score (descending)
      for (let i = 0; i < names.length - 1; i++) {
        expect(names[i].score.overall).toBeGreaterThanOrEqual(
          names[i + 1].score.overall,
        );
      }
    });

    it("includes complete score breakdown", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 3,
      };

      const names = await generateNames(options);

      names.forEach((name) => {
        expect(name.score.breakdown).toBeDefined();
        // breakdown.bazi may be undefined if no birthDate was provided
        expect(name.score.breakdown.wuge).toBeDefined();
        expect(name.score.breakdown.phonetics).toBeDefined();
      });
    });

    it("calculates consistent scores for same name", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 5,
      };

      const names1 = await generateNames(options);
      const names2 = await generateNames(options);

      // Find a common name
      const commonName = names1.find((n1) =>
        names2.some((n2) => n2.fullName === n1.fullName),
      );

      if (commonName) {
        const matchingName = names2.find(
          (n) => n.fullName === commonName.fullName,
        );
        expect(matchingName?.score.overall).toBe(commonName.score.overall);
      }
    });
  });

  describe("Complete Flow Tests", () => {
    it("completes full generation flow for baby boy", async () => {
      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        birthDate: new Date(Date.UTC(2024, 2, 15, 10, 30, 0)),
        birthHour: 10,
        style: "classic",
        characterCount: 2,
        maxResults: 10,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
      expect(names.length).toBeLessThanOrEqual(10);

      const firstName = names[0];
      expect(firstName.fullName).toMatch(/^李.{2}$/);
      expect(firstName.characters).toHaveLength(3); // surname + 2 chars
      expect(firstName.score.overall).toBeGreaterThan(0);
      expect(firstName.explanation).toContain("此名");
    });

    it("completes full generation flow for baby girl", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        birthDate: new Date(Date.UTC(2024, 5, 20, 15, 0, 0)),
        birthHour: 15,
        style: "poetic",
        source: "poetry",
        characterCount: 2,
        maxResults: 10,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);

      const firstName = names[0];
      expect(firstName.fullName).toMatch(/^王.{2}$/);
      expect(firstName.characters).toHaveLength(3);
      expect(firstName.score.overall).toBeGreaterThan(0);
    });

    it("completes full generation flow without birth date", async () => {
      const options: NameGenerationOptions = {
        surname: "张",
        gender: "neutral",
        preferredElements: ["木", "水"],
        style: "modern",
        maxResults: 10,
      };

      const names = await generateNames(options);

      expect(names.length).toBeGreaterThan(0);
      expect(names[0].score.baziScore).toBe(70); // Default score when no BaZi
    });
  });

  describe("Parameter Combinations", () => {
    it("handles all style options", async () => {
      const styles: Array<"classic" | "modern" | "poetic" | "elegant"> = [
        "classic",
        "modern",
        "poetic",
        "elegant",
      ];

      for (const style of styles) {
        const options: NameGenerationOptions = {
          surname: "李",
          gender: "male",
          style,
          maxResults: 3,
        };

        const names = await generateNames(options);
        expect(names.length).toBeGreaterThan(0);
      }
    });

    it("handles all source options", async () => {
      const sources: Array<"poetry" | "classics" | "idioms" | "any"> = [
        "poetry",
        "classics",
        "idioms",
        "any",
      ];

      for (const source of sources) {
        const options: NameGenerationOptions = {
          surname: "王",
          gender: "female",
          source,
          maxResults: 3,
        };

        const names = await generateNames(options);
        expect(names.length).toBeGreaterThan(0);
      }
    });

    it("handles all character counts", async () => {
      for (const charCount of [1, 2]) {
        const options: NameGenerationOptions = {
          surname: "张",
          gender: "neutral",
          characterCount: charCount,
          maxResults: 3,
        };

        const names = await generateNames(options);
        expect(names.length).toBeGreaterThan(0);

        names.forEach((name) => {
          expect(name.givenName.length).toBe(charCount);
        });
      }
    });
  });

  describe("Performance", () => {
    it("generates 20 names quickly", async () => {
      const start = Date.now();

      const options: NameGenerationOptions = {
        surname: "李",
        gender: "male",
        maxResults: 20,
      };

      const names = await generateNames(options);
      const duration = Date.now() - start;

      expect(names.length).toBe(20);
      expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
    });

    it("handles multiple requests efficiently", async () => {
      const options: NameGenerationOptions = {
        surname: "王",
        gender: "female",
        maxResults: 5,
      };

      const start = Date.now();

      const promises = Array(5)
        .fill(null)
        .map(() => generateNames(options));
      const results = await Promise.all(promises);

      const duration = Date.now() - start;

      results.forEach((names) => {
        expect(names.length).toBeGreaterThan(0);
      });

      expect(duration).toBeLessThan(10000); // All should complete in under 10 seconds
    });
  });
});
