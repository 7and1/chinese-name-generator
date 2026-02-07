/**
 * Name Generator Engine (Optimized)
 *
 * Generates Chinese names based on:
 * - BaZi analysis (if birth date provided)
 * - Wuge numerology
 * - Phonetic harmony
 * - Character meaning quality
 *
 * Performance optimizations:
 * - Pre-computed character filtering
 * - Score caching
 * - Early termination
 * - Incremental generation
 */

import type {
  NameGenerationOptions,
  GeneratedName,
  BaZiChart,
  ChineseCharacter,
  FiveElement,
  NameScore,
} from "../types";
import { calculateBaZi } from "./bazi";
import { calculateNameScore } from "./scorer";
import { SAMPLE_CHARACTERS, getCharacter } from "../data/characters";
import {
  getCharactersByElementsOptimized,
  isFeminineCharacter,
  isMasculineCharacter,
} from "../data/lazy-characters";
import { POETRY_DATABASE, type PoetryVerse } from "../data/poetry";
import { IDIOM_DATABASE } from "../data/idioms";
import { shuffle } from "../utils";
import { getBaziCache, getNameScoreCache } from "../cache/memory-cache";
import { baziCacheKeyFromDate, nameScoreCacheKey } from "../cache/cache-keys";
import { createTimer } from "../performance/monitor";

// ============================================================================
// Constants
// ============================================================================

/** Multiplier for candidate generation to ensure enough results */
const CANDIDATE_MULTIPLIER = 5;

/** Minimum candidate count warning threshold */
const MIN_CANDIDATE_WARNING = 10;

/** Fallback character set size */
const FALLBACK_CHARACTER_SET_SIZE = 50;

/** Minimum score for name acceptance */
const MIN_ACCEPTABLE_NAME_SCORE = 50;

/** Target name count for generation (before sorting) */
const TARGET_NAME_COUNT_MULTIPLIER = 2;

/** Minimum feminine character count threshold */
const MIN_FEMININE_COUNT = 20;

/** Minimum masculine character count threshold */
const MIN_MASCULINE_COUNT = 20;

/** Style bonus values */
const STYLE_BONUS = {
  POETRY_POETRY: 6,
  ELEGANT_PHONETIC: 3,
  MODERN_MEANING: 2,
} as const;

/** Excellent score thresholds */
const SCORE_THRESHOLDS = {
  EXCELLENT_BAZI: 80,
  EXCELLENT_WUGE: 80,
  EXCELLENT_PHONETIC: 80,
  EXCELLENT_OVERALL_HIGH: 90,
  EXCELLENT_OVERALL_LOW: 80,
} as const;

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Generate Chinese names based on options (with performance optimizations)
 *
 * @param options - Name generation configuration
 * @returns Array of generated names sorted by score
 */
export async function generateNames(
  options: NameGenerationOptions,
): Promise<GeneratedName[]> {
  const endTimer = createTimer("generateNames");

  const {
    surname,
    gender,
    birthDate,
    birthHour,
    preferredElements,
    avoidElements,
    style = "classic",
    source = "any",
    characterCount = 2,
    maxResults = 20,
  } = options;

  // Calculate BaZi if birth date provided (with caching)
  let baziChart: BaZiChart | undefined;
  let favorableElements: FiveElement[] = [];

  if (birthDate) {
    baziChart = await getCachedBaZi(birthDate, birthHour);
    favorableElements = baziChart.favorableElements;
  }

  // Use preferred elements if provided, otherwise use BaZi favorable elements
  const targetElements = preferredElements?.length
    ? preferredElements
    : favorableElements;

  // Get filtered candidate characters (optimized)
  const candidateChars = await filterCandidateChars(
    SAMPLE_CHARACTERS,
    { gender, targetElements, avoidElements, style, source },
    maxResults,
  );

  // Generate name combinations with early termination
  const generatedNames = await generateNameCombinations(
    surname,
    candidateChars,
    characterCount,
    maxResults,
    source,
    style,
    baziChart,
  );

  endTimer();
  return generatedNames;
}

/**
 * Get BaZi chart with caching
 */
async function getCachedBaZi(
  birthDate: Date,
  birthHour?: number,
): Promise<BaZiChart> {
  const cache = getBaziCache();
  const cacheKey = baziCacheKeyFromDate(birthDate, birthHour);

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached as BaZiChart;
  }

  const baziChart = await calculateBaZi(birthDate, birthHour);
  cache.set(cacheKey, baziChart);
  return baziChart;
}

/**
 * Filter candidate characters with optimized lookups
 */
async function filterCandidateChars(
  baseChars: typeof SAMPLE_CHARACTERS,
  filters: {
    gender?: NameGenerationOptions["gender"];
    targetElements: FiveElement[];
    avoidElements?: FiveElement[];
    style?: NameGenerationOptions["style"];
    source?: NameGenerationOptions["source"];
  },
  maxResults: number,
): Promise<ChineseCharacter[]> {
  const endFilterTimer = createTimer("filterCharacters");

  let candidates = baseChars;

  // Filter by source inspiration
  if (filters.source && filters.source !== "any") {
    const allowedCharsBySource = getAllowedCharsBySource(filters.source);
    if (allowedCharsBySource.size > 0) {
      const filtered = candidates.filter((c) =>
        allowedCharsBySource.has(c.char),
      );
      if (filtered.length >= MIN_CANDIDATE_WARNING) {
        candidates = filtered;
      }
    }
  }

  // Filter by elements (use optimized function)
  if (filters.targetElements.length > 0) {
    candidates = getCharactersByElementsOptimized(filters.targetElements);
  }

  // Remove avoided elements (early continue optimization)
  if (filters.avoidElements?.length) {
    const avoidSet = new Set(filters.avoidElements);
    candidates = candidates.filter((char) => !avoidSet.has(char.fiveElement));
  }

  // Apply style filtering
  if (filters.style === "modern") {
    candidates = candidates.filter((char) => char.frequency < 3000);
  }

  // Gender-specific filtering (use optimized functions)
  if (filters.gender === "female") {
    candidates = candidates.filter(isFeminineCharacter);
    if (candidates.length < MIN_FEMININE_COUNT) {
      candidates = baseChars.filter(isFeminineCharacter);
    }
  } else if (filters.gender === "male") {
    candidates = candidates.filter(isMasculineCharacter);
    if (candidates.length < MIN_MASCULINE_COUNT) {
      candidates = baseChars.filter(isMasculineCharacter);
    }
  }

  // Final safety check
  if (candidates.length < MIN_CANDIDATE_WARNING) {
    console.warn(
      `Too few candidate characters (${candidates.length}), using fallback set`,
    );
    candidates = baseChars.slice(0, FALLBACK_CHARACTER_SET_SIZE);
  }

  // Limit candidates for performance (early termination)
  const maxCandidates = Math.min(
    candidates.length,
    maxResults * CANDIDATE_MULTIPLIER,
  );

  endFilterTimer();
  return candidates.slice(0, maxCandidates);
}

/**
 * Generate name combinations with early termination
 */
async function generateNameCombinations(
  surname: string,
  candidateChars: ChineseCharacter[],
  characterCount: 1 | 2,
  maxResults: number,
  source: NameGenerationOptions["source"],
  style: NameGenerationOptions["style"],
  baziChart?: BaZiChart,
): Promise<GeneratedName[]> {
  const endTimer = createTimer("generateCombinations");

  const generatedNames: GeneratedName[] = [];
  const seen = new Set<string>();
  const targetCount = maxResults * TARGET_NAME_COUNT_MULTIPLIER;

  // Pre-compute surname character
  const surnameChar = getCharacter(surname);

  if (characterCount === 1) {
    // Single character given name
    for (const char of candidateChars) {
      if (generatedNames.length >= targetCount) break;

      const fullName = surname + char.char;
      if (seen.has(fullName)) continue;
      seen.add(fullName);

      const characters = surnameChar ? [surnameChar, char] : [char];
      const score = await getCachedNameScore(
        fullName,
        surname,
        char.char,
        characters,
        baziChart,
      );

      // Early termination: skip very low scores
      if (score.overall < MIN_ACCEPTABLE_NAME_SCORE) continue;

      const inspiration = findInspiration(source, char.char);
      generatedNames.push({
        fullName,
        surname,
        givenName: char.char,
        pinyin: surnameChar
          ? `${surnameChar.pinyin} ${char.pinyin}`
          : char.pinyin,
        characters,
        score,
        ...(inspiration ? { source: inspiration } : {}),
        explanation: generateExplanation(
          char.char,
          characters,
          score,
          inspiration,
        ),
      });
    }
  } else {
    // Double character given name - optimized with early termination
    const shuffledChars = shuffle([...candidateChars]);
    const maxI = Math.min(shuffledChars.length, targetCount);

    for (let i = 0; i < maxI && generatedNames.length < targetCount; i++) {
      const char1 = shuffledChars[i];

      for (
        let j = i + 1;
        j < shuffledChars.length && generatedNames.length < targetCount;
        j++
      ) {
        const char2 = shuffledChars[j];

        const givenName = char1.char + char2.char;
        const fullName = surname + givenName;
        if (seen.has(fullName)) continue;
        seen.add(fullName);

        const characters = surnameChar
          ? [surnameChar, char1, char2]
          : [char1, char2];

        const score = await getCachedNameScore(
          fullName,
          surname,
          givenName,
          characters,
          baziChart,
        );

        // Early termination: skip very low scores
        if (score.overall < MIN_ACCEPTABLE_NAME_SCORE) continue;

        const inspiration = findInspiration(source, givenName);
        generatedNames.push({
          fullName,
          surname,
          givenName,
          pinyin: surnameChar
            ? `${surnameChar.pinyin} ${char1.pinyin} ${char2.pinyin}`
            : `${char1.pinyin} ${char2.pinyin}`,
          characters,
          score,
          ...(inspiration ? { source: inspiration } : {}),
          explanation: generateExplanation(
            givenName,
            characters,
            score,
            inspiration,
          ),
        });
      }
    }
  }

  // Sort by overall score with style bonus
  generatedNames.sort((a, b) => {
    const aScore = a.score.overall + getStyleBonus(a, style);
    const bScore = b.score.overall + getStyleBonus(b, style);
    return bScore - aScore;
  });

  endTimer();
  return generatedNames.slice(0, maxResults);
}

/**
 * Get name score with caching
 */
async function getCachedNameScore(
  fullName: string,
  surname: string,
  givenName: string,
  characters: ChineseCharacter[],
  baziChart?: BaZiChart,
): Promise<NameScore> {
  const cache = getNameScoreCache();
  const cacheKey = nameScoreCacheKey(surname, givenName, !!baziChart);

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached as NameScore;
  }

  const score = await calculateNameScore(
    fullName,
    surname,
    givenName,
    characters,
    baziChart,
  );
  cache.set(cacheKey, score);
  return score;
}

/**
 * Generate explanation for a name
 *
 * @param givenName - Given name characters
 * @param characters - Full character information array
 * @param score - Name score analysis
 * @param inspiration - Optional source inspiration
 * @returns Formatted explanation string
 */
function generateExplanation(
  givenName: string,
  characters: ChineseCharacter[],
  score: NameScore,
  inspiration?: GeneratedName["source"],
): string {
  const charMeanings = characters
    .filter((c) => givenName.includes(c.char))
    .map((c) => `"${c.char}"(${c.meaning})`)
    .join("、");

  let explanation = `此名由${charMeanings}组成。`;

  if (inspiration) {
    if (
      inspiration.type === "poetry" &&
      inspiration.title &&
      inspiration.quote
    ) {
      explanation += `灵感出自《${inspiration.title}》：“${inspiration.quote}”。`;
    }
    if (inspiration.type === "idiom" && inspiration.title) {
      explanation += `取意于成语"${inspiration.title}"。`;
    }
  }

  if (score.baziScore > SCORE_THRESHOLDS.EXCELLENT_BAZI) {
    explanation += `八字契合度优秀，有助于补足命局。`;
  }

  if (score.wugeScore > SCORE_THRESHOLDS.EXCELLENT_WUGE) {
    explanation += `五格配置吉祥，数理大吉。`;
  }

  if (score.phoneticScore > SCORE_THRESHOLDS.EXCELLENT_PHONETIC) {
    explanation += `音韵和谐，读音流畅优美。`;
  }

  if (score.overall >= SCORE_THRESHOLDS.EXCELLENT_OVERALL_HIGH) {
    explanation += `综合评分极高，是一个非常优秀的名字！`;
  } else if (score.overall >= SCORE_THRESHOLDS.EXCELLENT_OVERALL_LOW) {
    explanation += `综合评分良好，是一个不错的选择。`;
  }

  return explanation;
}

/**
 * Get allowed characters set by source type
 *
 * @param source - Source type for name inspiration
 * @returns Set of allowed characters
 */
function getAllowedCharsBySource(
  source: NameGenerationOptions["source"],
): Set<string> {
  if (source === "poetry") {
    return new Set(POETRY_DATABASE.flatMap((v) => v.suitableChars));
  }
  if (source === "classics") {
    return new Set(
      POETRY_DATABASE.filter(
        (v) => v.source === "诗经" || v.source === "楚辞",
      ).flatMap((v) => v.suitableChars),
    );
  }
  if (source === "idioms") {
    return new Set(IDIOM_DATABASE.flatMap((i) => i.suitableChars));
  }
  return new Set();
}

/**
 * Find source inspiration for a given name
 *
 * @param source - Source type to search
 * @param givenName - Given name characters
 * @returns Inspiration data or undefined
 */
function findInspiration(
  source: NameGenerationOptions["source"],
  givenName: string,
): GeneratedName["source"] | undefined {
  const chars = Array.from(givenName);

  if (source === "idioms") {
    const hit = IDIOM_DATABASE.find((i) =>
      chars.every((c) => i.suitableChars.includes(c)),
    );
    if (!hit) return;
    return { type: "idiom", title: hit.idiom, quote: hit.meaning };
  }

  const isPoetry =
    source === "poetry" || source === "classics" || source === "any";

  if (isPoetry) {
    const verse = findPoetryVerse(source, chars);
    if (!verse) return;
    return {
      type: "poetry",
      title: verse.title,
      author: verse.author,
      quote: verse.verse,
    };
  }

  return;
}

function findPoetryVerse(
  source: NameGenerationOptions["source"],
  chars: string[],
): PoetryVerse | undefined {
  const pool =
    source === "classics"
      ? POETRY_DATABASE.filter(
          (v) => v.source === "诗经" || v.source === "楚辞",
        )
      : POETRY_DATABASE;

  return pool.find((v) => chars.every((c) => v.suitableChars.includes(c))) as
    | PoetryVerse
    | undefined;
}

function getStyleBonus(
  name: GeneratedName,
  style: NameGenerationOptions["style"],
): number {
  if (style === "poetic") {
    return name.source?.type === "poetry" ? 6 : 0;
  }
  if (style === "elegant") {
    return name.score.phoneticScore >= 85 ? 3 : 0;
  }
  if (style === "modern") {
    return name.score.meaningScore >= 85 ? 2 : 0;
  }
  return 0;
}
