import { calculateNameScore } from "@/lib/engines/scorer";
import { calculateBaZiFromYmd } from "@/lib/engines/bazi";
import { getCharacter } from "@/lib/data/characters";
import type { BaZiChart, ChineseCharacter } from "@/lib/types";
import { readJson, ZodRequestError } from "@/lib/api/parse";
import { ok, fail } from "@/lib/api/response";
import { analyzeNameRequestSchema } from "@/lib/api/schemas";
import { parseBirthDateYmd } from "@/lib/api/birthdate";
import { withRateLimit } from "@/lib/security/rate-limit";


async function analyzeNameHandler(request: Request) {
  const startTime = performance.now();

  try {
    const body = await readJson(request, analyzeNameRequestSchema);
    const fullName = body.fullName;

    // Extract surname (first character) and given name (remaining characters)
    const surname = fullName[0];
    const givenName = fullName.slice(1);

    // Get character information
    const characters: ChineseCharacter[] = [];
    for (const char of fullName) {
      const charInfo = getCharacter(char);
      if (charInfo) {
        characters.push(charInfo);
      }
    }

    // If we don't have complete character data, return a warning
    if (characters.length !== fullName.length) {
      const duration = performance.now() - startTime;
      const response = fail(
        404,
        "CHARACTER_NOT_FOUND",
        `Some characters in the name are not in our database. Found ${characters.length}/${fullName.length} characters.`,
        {
          fullName,
          foundCharacters: characters.map((c) => c.char).join(""),
          missingCharacters: fullName
            .split("")
            .filter((c) => !characters.find((ch) => ch.char === c))
            .join(""),
        },
      );
      response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);
      return response;
    }

    // Calculate BaZi if birth date provided
    let baziChart: BaZiChart | undefined;
    if (body.birthDate) {
      const ymd = parseBirthDateYmd(body.birthDate);
      baziChart = await calculateBaZiFromYmd(
        ymd.year,
        ymd.month,
        ymd.day,
        body.birthHour,
      );
    }

    // Calculate comprehensive score
    const score = await calculateNameScore(
      fullName,
      surname,
      givenName,
      characters,
      baziChart,
    );

    // Build response
    const responseData = {
      fullName,
      surname,
      givenName,
      pinyin: characters.map((c) => c.pinyin).join(" "),
      characters: characters.map((c) => ({
        char: c.char,
        pinyin: c.pinyin,
        tone: c.tone,
        strokeCount: c.strokeCount,
        kangxiStrokeCount: c.kangxiStrokeCount,
        radical: c.radical,
        fiveElement: c.fiveElement,
        meaning: c.meaning,
      })),
      score: {
        overall: score.overall,
        rating: score.rating,
        baziScore: score.baziScore,
        wugeScore: score.wugeScore,
        phoneticScore: score.phoneticScore,
        meaningScore: score.meaningScore,
        breakdown: score.breakdown,
      },
      baziAnalysis: baziChart
        ? {
            dayMaster: baziChart.dayMaster,
            elements: baziChart.elements,
            favorableElements: baziChart.favorableElements,
            unfavorableElements: baziChart.unfavorableElements,
            pillars: {
              year: baziChart.year,
              month: baziChart.month,
              day: baziChart.day,
              hour: baziChart.hour,
            },
          }
        : null,
    };

    const duration = performance.now() - startTime;
    const response = ok(responseData);
    response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);
    return response;
  } catch (error) {
    const duration = performance.now() - startTime;

    if (error instanceof ZodRequestError) {
      const response = fail(
        400,
        error.code,
        error.message,
        error.zodError ? { issues: error.zodError.issues } : undefined,
      );
      response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);
      return response;
    }

    console.error("Error analyzing name:", error);
    const response = fail(500, "ANALYSIS_ERROR", "Failed to analyze name");
    response.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);
    return response;
  }
}

// Apply rate limiting: 20 requests per minute per IP
export const POST = withRateLimit(analyzeNameHandler, "analyze");
