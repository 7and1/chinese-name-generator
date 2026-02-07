/**
 * API Utility Functions Tests
 *
 * Tests for API request parsing, validation, and response formatting
 */

import { describe, expect, it } from "vitest";
import { readJson, ZodRequestError } from "@/lib/api/parse";
import { ok, fail } from "@/lib/api/response";
import { parseBirthDateYmd } from "@/lib/api/birthdate";
import {
  generateNameRequestSchema,
  analyzeNameRequestSchema,
} from "@/lib/api/schemas";

describe("API Utilities", () => {
  describe("readJson", () => {
    it("parses valid JSON against schema", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
        }),
      });

      const result = await readJson(req, generateNameRequestSchema);

      expect(result.surname).toBe("李");
      expect(result.gender).toBe("male");
    });

    it("validates against schema", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname: "李",
          gender: "male",
        }),
      });

      const result = await readJson(req, generateNameRequestSchema);

      expect(result.surname).toBe("李");
      expect(result.gender).toBe("male");
    });

    it("throws ZodRequestError for empty body", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "",
      });

      await expect(readJson(req, generateNameRequestSchema)).rejects.toThrow(
        ZodRequestError,
      );
    });

    it("throws ZodRequestError for invalid JSON", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{invalid json",
      });

      await expect(readJson(req, generateNameRequestSchema)).rejects.toThrow(
        ZodRequestError,
      );
    });

    it("throws ZodRequestError for validation failure", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender: "invalid" }),
      });

      await expect(readJson(req, generateNameRequestSchema)).rejects.toThrow(
        ZodRequestError,
      );
    });

    it("includes error code in ZodRequestError", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "",
      });

      try {
        await readJson(req, generateNameRequestSchema);
      } catch (error) {
        expect(error).toBeInstanceOf(ZodRequestError);
        if (error instanceof ZodRequestError) {
          expect(error.code).toBe("EMPTY_BODY");
        }
      }
    });

    it("includes zodError in ZodRequestError for validation failures", async () => {
      const req = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender: "invalid" }),
      });

      try {
        await readJson(req, generateNameRequestSchema);
      } catch (error) {
        expect(error).toBeInstanceOf(ZodRequestError);
        if (error instanceof ZodRequestError) {
          expect(error.zodError).toBeDefined();
        }
      }
    });
  });

  describe("ok response", () => {
    it("creates successful JSON response", () => {
      const res = ok({ message: "success" });

      expect(res.status).toBe(200);
    });

    it("includes success: true in response", async () => {
      const res = ok({ message: "success" });
      const json = await res.json();

      expect(json.success).toBe(true);
      expect(json.data).toEqual({ message: "success" });
    });

    it("sets cache-control header", () => {
      const res = ok({ message: "success" });

      expect(res.headers.get("cache-control")).toContain("no-store");
    });

    it("accepts custom init options", () => {
      const res = ok({ message: "success" }, { status: 201 });

      expect(res.status).toBe(201);
    });

    it("accepts custom headers", () => {
      const res = ok(
        { message: "success" },
        {
          headers: { "X-Custom-Header": "custom-value" },
        },
      );

      expect(res.headers.get("X-Custom-Header")).toBe("custom-value");
    });
  });

  describe("fail response", () => {
    it("creates error JSON response with status", () => {
      const res = fail(400, "INVALID_INPUT", "Invalid input provided");

      expect(res.status).toBe(400);
    });

    it("includes success: false in response", async () => {
      const res = fail(400, "INVALID_INPUT", "Invalid input provided");
      const json = await res.json();

      expect(json.success).toBe(false);
      expect(json.error.code).toBe("INVALID_INPUT");
      expect(json.error.message).toBe("Invalid input provided");
    });

    it("includes details when provided", async () => {
      const res = fail(400, "INVALID_INPUT", "Invalid input provided", {
        field: "surname",
        reason: "too short",
      });
      const json = await res.json();

      expect(json.error.details).toEqual({
        field: "surname",
        reason: "too short",
      });
    });

    it("sets cache-control header", () => {
      const res = fail(400, "ERROR", "Error message");

      expect(res.headers.get("cache-control")).toContain("no-store");
    });

    it("accepts custom init options", () => {
      const res = fail(401, "UNAUTHORIZED", "Unauthorized");

      expect(res.status).toBe(401);
    });

    it("handles various HTTP status codes", () => {
      const res400 = fail(400, "BAD_REQUEST", "Bad request");
      const res404 = fail(404, "NOT_FOUND", "Not found");
      const res500 = fail(500, "SERVER_ERROR", "Server error");

      expect(res400.status).toBe(400);
      expect(res404.status).toBe(404);
      expect(res500.status).toBe(500);
    });
  });

  describe("parseBirthDateYmd", () => {
    it("parses valid YYYY-MM-DD format", () => {
      const result = parseBirthDateYmd("2024-01-15");

      expect(result).toEqual({ year: 2024, month: 1, day: 15 });
    });

    it("handles leap year dates", () => {
      const result = parseBirthDateYmd("2024-02-29");

      expect(result).toEqual({ year: 2024, month: 2, day: 29 });
    });

    it("handles end of month dates", () => {
      const result = parseBirthDateYmd("2024-01-31");

      expect(result).toEqual({ year: 2024, month: 1, day: 31 });
    });

    it("trims input", () => {
      const result = parseBirthDateYmd("  2024-01-15  ");

      expect(result).toEqual({ year: 2024, month: 1, day: 15 });
    });

    it("throws for invalid format", () => {
      expect(() => parseBirthDateYmd("01-01-2024")).toThrow();
      expect(() => parseBirthDateYmd("2024/01/15")).toThrow();
      expect(() => parseBirthDateYmd("invalid")).toThrow();
    });

    it("throws for invalid month", () => {
      expect(() => parseBirthDateYmd("2024-13-01")).toThrow();
      expect(() => parseBirthDateYmd("2024-00-01")).toThrow();
    });

    it("throws for invalid day", () => {
      expect(() => parseBirthDateYmd("2024-01-32")).toThrow();
      expect(() => parseBirthDateYmd("2024-01-00")).toThrow();
    });

    it("handles non-leap year Feb 29 (does not throw, but parses)", () => {
      // The function just parses numbers, doesn't validate date validity
      const result = parseBirthDateYmd("2023-02-29");
      expect(result).toEqual({ year: 2023, month: 2, day: 29 });
    });

    it("parses dates with time component", () => {
      const result = parseBirthDateYmd("2024-01-15T10:30:00Z");

      expect(result).toEqual({ year: 2024, month: 1, day: 15 });
    });
  });

  describe("generateNameRequestSchema", () => {
    const validPayload = {
      surname: "李",
      gender: "male",
      birthDate: "2024-01-15",
      birthHour: 10,
      preferredElements: ["金", "水"],
      avoidElements: ["火"],
      style: "poetic",
      source: "poetry",
      characterCount: 2,
      maxResults: 10,
    };

    it("accepts valid request with all fields", () => {
      const result = generateNameRequestSchema.safeParse(validPayload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.surname).toBe("李");
        expect(result.data.gender).toBe("male");
      }
    });

    it("accepts minimal valid request", () => {
      const minimal = {
        surname: "王",
        gender: "female",
      };

      const result = generateNameRequestSchema.safeParse(minimal);

      expect(result.success).toBe(true);
    });

    it("rejects missing surname", () => {
      const invalid = { gender: "male" };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects empty surname", () => {
      const invalid = { surname: "", gender: "male" };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects surname longer than 2 characters", () => {
      const invalid = { surname: "欧阳修", gender: "male" };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects invalid gender", () => {
      const invalid = { surname: "李", gender: "invalid" };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects invalid birthHour", () => {
      const invalid = { surname: "李", gender: "male", birthHour: 24 };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects invalid element in preferredElements", () => {
      const invalid = {
        surname: "李",
        gender: "male",
        preferredElements: ["invalid"],
      };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects too many elements", () => {
      const invalid = {
        surname: "李",
        gender: "male",
        preferredElements: ["金", "木", "水", "火", "土", "extra"],
      };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects invalid style", () => {
      const invalid = { surname: "李", gender: "male", style: "invalid" };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects invalid source", () => {
      const invalid = { surname: "李", gender: "male", source: "invalid" };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects invalid characterCount", () => {
      const invalid = { surname: "李", gender: "male", characterCount: 3 };

      const result = generateNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects maxResults out of range", () => {
      const invalid1 = { surname: "李", gender: "male", maxResults: 0 };
      const invalid2 = { surname: "李", gender: "male", maxResults: 51 };

      const result1 = generateNameRequestSchema.safeParse(invalid1);
      const result2 = generateNameRequestSchema.safeParse(invalid2);

      expect(result1.success).toBe(false);
      expect(result2.success).toBe(false);
    });
  });

  describe("analyzeNameRequestSchema", () => {
    it("accepts valid request with all fields", () => {
      const valid = {
        fullName: "李明华",
        birthDate: "2024-01-15",
        birthHour: 10,
      };

      const result = analyzeNameRequestSchema.safeParse(valid);

      expect(result.success).toBe(true);
    });

    it("accepts minimal valid request", () => {
      const minimal = {
        fullName: "王伟",
      };

      const result = analyzeNameRequestSchema.safeParse(minimal);

      expect(result.success).toBe(true);
    });

    it("rejects missing fullName", () => {
      const invalid = {};

      const result = analyzeNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects name that's too short", () => {
      const invalid = { fullName: "李" };

      const result = analyzeNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects name that's too long", () => {
      const invalid = { fullName: "李明华伟大" };

      const result = analyzeNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects non-Chinese characters", () => {
      const invalid = { fullName: "ABC" };

      const result = analyzeNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("rejects mixed Chinese and non-Chinese", () => {
      const invalid = { fullName: "李A华" };

      const result = analyzeNameRequestSchema.safeParse(invalid);

      expect(result.success).toBe(false);
    });

    it("accepts names with middle dot", () => {
      const valid = { fullName: "李·明华" };

      const result = analyzeNameRequestSchema.safeParse(valid);

      expect(result.success).toBe(true);
    });

    it("accepts various valid Chinese names", () => {
      const validNames = ["王伟", "李明华", "张思睿", "刘淑贤", "陈子轩"];

      validNames.forEach((fullName) => {
        const result = analyzeNameRequestSchema.safeParse({ fullName });
        expect(result.success).toBe(true);
      });
    });
  });
});
