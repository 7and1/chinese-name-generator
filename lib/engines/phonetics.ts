/**
 * Phonetics and Tone Analysis Engine
 *
 * Analyzes Chinese name pronunciation including:
 * - Pinyin extraction
 * - Tone pattern analysis
 * - Homophone detection (sounds like inappropriate words)
 * - Readability scoring
 */

import type { PhoneticAnalysis } from "../types";
import { TONE_PATTERNS_GOOD, TONE_PATTERNS_BAD } from "../constants";

// Lazy load pinyin-pro to reduce initial bundle size
let PinyinModule: typeof import("pinyin-pro") | null = null;

async function getPinyin() {
  if (!PinyinModule) {
    PinyinModule = await import("pinyin-pro");
  }
  return PinyinModule;
}

// ============================================================================
// Constants
// ============================================================================

/** Tone number for neutral tone (5th tone) */
const NEUTRAL_TONE = 5;

/** Default tone when no tone pattern is found */
const DEFAULT_TONE = 5;

/** Base score for tone harmony calculation */
const TONE_HARMONY_BASE_SCORE = 70;

/** Score adjustments for tone harmony */
const TONE_HARMONY_ADJUSTMENTS = {
  MONOTONOUS_PENALTY: 20,
  VARIETY_BONUS: 10,
  GOOD_PATTERN_BONUS: 15,
  BAD_PATTERN_PENALTY: 15,
  FOURTH_TONE_MULTIPLE_PENALTY: 10,
  FOURTH_TONE_START_PENALTY: 5,
} as const;

/** Minimum tones for variety check */
const MIN_VARIETY_COUNT = 3;

/** Threshold for multiple fourth tones */
const FOURTH_TONE_THRESHOLD = 2;

/** Given name length for two-character pattern check */
const TWO_CHAR_GIVEN_NAME_LENGTH = 3;

/** Base score for readability calculation */
const READABILITY_BASE_SCORE = 80;

/** Readability score adjustments */
const READABILITY_ADJUSTMENTS = {
  OPTIMAL_LENGTH_BONUS: 10,
  TOO_LONG_PENALTY: 20,
  COMPLEX_INITIAL_PENALTY: 2,
  VERY_COMPLEX_PENALTY: 5,
  SMOOTH_TRANSITION_BONUS: 5,
} as const;

/** Optimal name length range */
const OPTIMAL_NAME_LENGTH = { min: 2, max: 3 };

/** Maximum name length before penalty */
const MAX_NAME_LENGTH = 4;

/** Phonetic score component weights */
const PHONETIC_SCORE_WEIGHTS = {
  TONE_HARMONY: 0.4,
  READABILITY: 0.4,
  HOMOPHONE_PENALTY: 20,
  HOMOPHONE_BONUS: 20,
} as const;

/** Minimum name length for smooth transition check */
const MIN_SMOOTH_TRANSITION_LENGTH = 2;

/** Maximum difference for smooth tone transition */
const SMOOTH_TRANSITION_MAX_DIFF = 2;

/** Score range limits */
const SCORE_RANGE = { min: 0, max: 100 };

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Analyze phonetics of a Chinese name
 *
 * @param fullName - Complete Chinese name
 * @param surname - Surname characters
 * @param givenName - Given name characters
 * @returns Complete phonetic analysis
 */
export async function analyzePhonetics(
  fullName: string,
  surname: string,
  givenName: string,
): Promise<PhoneticAnalysis> {
  // Extract pinyin with tone numbers
  const pinyinArray = await getPinyinArray(fullName);
  const tonePattern = getTonePattern(pinyinArray);

  // Analyze tone harmony
  const toneHarmony = calculateToneHarmony(tonePattern);

  // Check for homophones (bad sound-alikes)
  const { hasHomophone, homophoneWarnings } = checkHomophones(
    fullName,
    surname,
    givenName,
    pinyinArray,
  );

  // Calculate readability
  const readability = calculateReadability(tonePattern, pinyinArray);

  return {
    tonePattern,
    toneHarmony,
    hasHomophone,
    homophoneWarnings,
    readability,
  };
}

/**
 * Get pinyin array with tone information
 *
 * @param text - Chinese text to convert
 * @returns Array of pinyin strings with tone numbers (e.g., ["ma1", "ma2"])
 */
async function getPinyinArray(text: string): Promise<string[]> {
  const { pinyin } = await getPinyin();
  return pinyin(text, {
    toneType: "num", // Use numbers for tones (ma1, ma2, etc.)
    type: "array",
  }) as string[];
}

/**
 * Extract tone numbers from pinyin array
 *
 * @param pinyinArray - Array of pinyin strings with tone numbers
 * @returns Array of tone numbers (1-5)
 */
function getTonePattern(pinyinArray: string[]): number[] {
  return pinyinArray.map((py) => {
    const match = py.match(/[1-5]/);
    return match ? parseInt(match[0]) : DEFAULT_TONE;
  });
}

/**
 * Calculate tone harmony score (0-100)
 *
 * Good tone patterns:
 * - Variety of tones (not all the same)
 * - Avoid multiple 4th tones in a row
 * - Prefer rising/falling/rising patterns
 *
 * @param tonePattern - Array of tone numbers
 * @returns Harmony score from 0-100
 */
function calculateToneHarmony(tonePattern: number[]): number {
  let score = TONE_HARMONY_BASE_SCORE;

  // Check for variety
  const uniqueTones = new Set(tonePattern);
  if (uniqueTones.size === 1) {
    score -= TONE_HARMONY_ADJUSTMENTS.MONOTONOUS_PENALTY;
  } else if (uniqueTones.size >= MIN_VARIETY_COUNT) {
    score += TONE_HARMONY_ADJUSTMENTS.VARIETY_BONUS;
  }

  // Check for good patterns (for 2-char given names)
  if (tonePattern.length === TWO_CHAR_GIVEN_NAME_LENGTH) {
    const givenNamePattern = [tonePattern[1], tonePattern[2]];

    const isGoodPattern = TONE_PATTERNS_GOOD.some(
      (pattern) =>
        pattern[0] === givenNamePattern[0] &&
        pattern[1] === givenNamePattern[1],
    );

    const isBadPattern = TONE_PATTERNS_BAD.some(
      (pattern) =>
        pattern[0] === givenNamePattern[0] &&
        pattern[1] === givenNamePattern[1],
    );

    if (isGoodPattern) {
      score += TONE_HARMONY_ADJUSTMENTS.GOOD_PATTERN_BONUS;
    }

    if (isBadPattern) {
      score -= TONE_HARMONY_ADJUSTMENTS.BAD_PATTERN_PENALTY;
    }
  }

  // Avoid multiple 4th tones
  const fourthToneCount = tonePattern.filter((t) => t === 4).length;
  if (fourthToneCount >= FOURTH_TONE_THRESHOLD) {
    score -= TONE_HARMONY_ADJUSTMENTS.FOURTH_TONE_MULTIPLE_PENALTY;
  }

  // Prefer not starting with 4th tone for softer sound
  if (tonePattern[0] === 4) {
    score -= TONE_HARMONY_ADJUSTMENTS.FOURTH_TONE_START_PENALTY;
  }

  return Math.max(SCORE_RANGE.min, Math.min(SCORE_RANGE.max, score));
}

/**
 * Check for homophone issues (sounds like inappropriate words)
 *
 * This checks common problematic sound combinations in Chinese
 */
function checkHomophones(
  fullName: string,
  surname: string,
  givenName: string,
  pinyinArray: string[],
): { hasHomophone: boolean; homophoneWarnings: string[] } {
  const warnings: string[] = [];

  // Get pinyin without tone marks for comparison
  const pinyinNoTone = pinyinArray.map((py) => py.replace(/[0-9]/g, ""));

  // Common problematic combinations (this is a simplified list)
  const problematicSounds: Record<string, string> = {
    shi: "死",
    sha: "杀、傻",
    gui: "鬼",
    die: "跌、爹",
    sang: "丧",
    diao: "吊、屌",
    mao: "冒、毛（某些组合）",
    hu: "虎、糊（某些组合）",
  };

  // Check individual syllables
  pinyinNoTone.forEach((py, index) => {
    if (problematicSounds[py]) {
      warnings.push(
        `"${fullName[index]}" 的拼音 "${py}" 可能与 "${problematicSounds[py]}" 谐音`,
      );
    }
  });

  // Check combined sounds (surname + first char of given name)
  if (pinyinNoTone.length >= 2) {
    const combined = pinyinNoTone[0] + pinyinNoTone[1];
    const problematicCombinations: Record<string, string> = {
      shabi: "傻逼",
      caoni: "粗口用语",
      wangba: "王八",
      fangjian: "房间（某些语境）",
      duliang: "肚量",
    };

    if (problematicCombinations[combined]) {
      warnings.push(
        `姓名连读 "${combined}" 可能与 "${problematicCombinations[combined]}" 谐音`,
      );
    }
  }

  // Check full name pinyin (without spaces)
  const fullPinyin = pinyinNoTone.join("");
  const fullNameProblematic: Record<string, string> = {
    wangcai: "旺财（宠物名）",
    laiwang: "来旺（宠物名）",
    dagou: "大狗",
  };

  if (fullNameProblematic[fullPinyin]) {
    warnings.push(
      `全名拼音 "${fullPinyin}" 可能与 "${fullNameProblematic[fullPinyin]}" 谐音`,
    );
  }

  return {
    hasHomophone: warnings.length > 0,
    homophoneWarnings: warnings,
  };
}

/**
 * Calculate readability score
 *
 * Factors:
 * - Syllable structure (avoid complex consonant clusters)
 * - Tone pattern smoothness
 * - Length (2-3 characters is optimal)
 *
 * @param tonePattern - Array of tone numbers
 * @param pinyinArray - Array of pinyin strings
 * @returns Readability score from 0-100
 */
function calculateReadability(
  tonePattern: number[],
  pinyinArray: string[],
): number {
  let score = READABILITY_BASE_SCORE;

  // Length factor
  if (
    tonePattern.length === OPTIMAL_NAME_LENGTH.min ||
    tonePattern.length === OPTIMAL_NAME_LENGTH.max
  ) {
    score += READABILITY_ADJUSTMENTS.OPTIMAL_LENGTH_BONUS;
  } else if (tonePattern.length > MAX_NAME_LENGTH) {
    score -= READABILITY_ADJUSTMENTS.TOO_LONG_PENALTY;
  }

  // Check for difficult syllable combinations
  pinyinArray.forEach((py) => {
    const noTone = py.replace(/[0-9]/g, "");

    // Complex initials
    const complexInitials = ["zh", "ch", "sh"];
    const hasComplexInitial = complexInitials.some((init) =>
      noTone.startsWith(init),
    );

    if (hasComplexInitial) {
      score -= READABILITY_ADJUSTMENTS.COMPLEX_INITIAL_PENALTY;
    }

    // Very complex syllables
    const veryComplex = ["zhuang", "chuang", "shuang", "niang", "jiang"];
    if (veryComplex.includes(noTone)) {
      score -= READABILITY_ADJUSTMENTS.VERY_COMPLEX_PENALTY;
    }
  });

  // Bonus for smooth transitions
  if (tonePattern.length >= MIN_SMOOTH_TRANSITION_LENGTH) {
    let hasSmoothTransition = false;
    for (let i = 0; i < tonePattern.length - 1; i++) {
      const diff = Math.abs(tonePattern[i] - tonePattern[i + 1]);
      if (diff <= SMOOTH_TRANSITION_MAX_DIFF) {
        hasSmoothTransition = true;
      }
    }
    if (hasSmoothTransition) {
      score += READABILITY_ADJUSTMENTS.SMOOTH_TRANSITION_BONUS;
    }
  }

  return Math.max(SCORE_RANGE.min, Math.min(SCORE_RANGE.max, score));
}

/**
 * Calculate overall phonetic score (0-100)
 *
 * @param analysis - Complete phonetic analysis
 * @returns Overall phonetic score from 0-100
 */
export function calculatePhoneticScore(analysis: PhoneticAnalysis): number {
  let score = 0;

  // Tone harmony: 40%
  score += analysis.toneHarmony * PHONETIC_SCORE_WEIGHTS.TONE_HARMONY;

  // Readability: 40%
  score += analysis.readability * PHONETIC_SCORE_WEIGHTS.READABILITY;

  // Homophone penalty/bonus
  if (analysis.hasHomophone) {
    score -= PHONETIC_SCORE_WEIGHTS.HOMOPHONE_PENALTY;
  } else {
    score += PHONETIC_SCORE_WEIGHTS.HOMOPHONE_BONUS;
  }

  return Math.max(SCORE_RANGE.min, Math.min(SCORE_RANGE.max, score));
}

/**
 * Get pinyin with tone marks for display
 */
export async function getDisplayPinyin(text: string): Promise<string> {
  const { pinyin } = await getPinyin();
  return pinyin(text, {
    toneType: "symbol", // Use tone marks (ā, á, ǎ, à)
    type: "string",
    separator: " ",
  }) as string;
}

/**
 * Format phonetic analysis as string
 */
export function formatPhoneticAnalysis(analysis: PhoneticAnalysis): string {
  let result = `
音韵分析:
声调模式: ${analysis.tonePattern.join("-")}
声调和谐度: ${analysis.toneHarmony}/100
朗读流畅度: ${analysis.readability}/100
  `.trim();

  if (analysis.hasHomophone) {
    result += `\n\n⚠️ 谐音提示:\n${analysis.homophoneWarnings.join("\n")}`;
  } else {
    result += `\n\n✓ 无不良谐音`;
  }

  return result;
}
