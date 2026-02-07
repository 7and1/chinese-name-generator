/**
 * Comprehensive Name Scoring System
 *
 * Combines scores from:
 * - BaZi compatibility (30%)
 * - Wuge numerology (25%)
 * - Phonetic harmony (20%)
 * - Character meaning quality (25%)
 */

import type { NameScore, BaZiChart, ChineseCharacter } from "../types";
import { calculateBaZiScore } from "./bazi";
import { analyzeWuge } from "./wuge";
import { analyzePhonetics, calculatePhoneticScore } from "./phonetics";
import {
  SCORE_WEIGHTS,
  DEFAULT_BAZI_SCORE,
  SCORE_RATING_THRESHOLDS,
  MEANING_BASE_SCORE,
  MEANING_SCORE_ADJUSTMENTS,
  FREQUENCY_RANGES,
  HSK_LEVELS,
  WUGE_GOOD_THRESHOLD,
  PHONETIC_HARMONY_THRESHOLD,
  MIN_PASSING_OVERALL_SCORE,
} from "../constants";

// ============================================================================
// Core Scoring Functions
// ============================================================================

/**
 * Calculate comprehensive score for a Chinese name
 *
 * @param fullName - Complete name (surname + given name)
 * @param surname - Surname
 * @param givenName - Given name
 * @param characters - Character information array
 * @param baziChart - Optional BaZi chart (if birth date provided)
 * @returns Complete name score with breakdown
 */
export async function calculateNameScore(
  fullName: string,
  surname: string,
  givenName: string,
  characters: ChineseCharacter[],
  baziChart?: BaZiChart,
): Promise<NameScore> {
  // Extract stroke counts
  const surnameChars = Array.from(surname);
  const givenNameChars = Array.from(givenName);

  const surnameStrokes = surnameChars.map((char) => {
    const charInfo = characters.find((c) => c.char === char);
    return charInfo?.kangxiStrokeCount || charInfo?.strokeCount || 1;
  });

  const givenNameStrokes = givenNameChars.map((char) => {
    const charInfo = characters.find((c) => c.char === char);
    return charInfo?.kangxiStrokeCount || charInfo?.strokeCount || 1;
  });

  // 1. Calculate Wuge score (25%)
  const wugeAnalysis = analyzeWuge(surnameStrokes, givenNameStrokes);
  const wugeScore = wugeAnalysis.overallScore;

  // 2. Calculate Phonetic score (20%) - now async
  const phoneticAnalysis = await analyzePhonetics(fullName, surname, givenName);
  const phoneticScore = calculatePhoneticScore(phoneticAnalysis);

  // 3. Calculate BaZi score (30%) - if birth date provided
  let baziScore = DEFAULT_BAZI_SCORE;
  if (baziChart) {
    const nameElements = characters.map((c) => c.fiveElement);
    baziScore = calculateBaZiScore(baziChart, nameElements);
  }

  // 4. Calculate Meaning score (25%)
  const meaningScore = calculateMeaningScore(characters);

  // Calculate weighted overall score
  const overall = Math.round(
    baziScore * SCORE_WEIGHTS.bazi +
      wugeScore * SCORE_WEIGHTS.wuge +
      phoneticScore * SCORE_WEIGHTS.phonetics +
      meaningScore * SCORE_WEIGHTS.meaning,
  );

  // Get rating based on overall score
  const ratingInfo = getScoreRating(overall);

  return {
    overall,
    rating: ratingInfo.rating,
    baziScore,
    wugeScore,
    phoneticScore,
    meaningScore,
    breakdown: {
      bazi: baziChart,
      wuge: wugeAnalysis,
      phonetics: phoneticAnalysis,
    },
  };
}

/**
 * Calculate meaning quality score based on character meanings
 *
 * Factors:
 * - Positive meaning (吉祥、美好、才华等)
 * - Frequency (common but not too common)
 * - HSK level (reasonable difficulty)
 *
 * @param characters - Array of character information
 * @returns Meaning score from 0-100
 */
function calculateMeaningScore(characters: ChineseCharacter[]): number {
  if (characters.length === 0) return 50;

  let totalScore = 0;

  characters.forEach((char) => {
    let charScore = MEANING_BASE_SCORE;

    // Check meaning for positive keywords
    const positiveMeanings = [
      "吉",
      "祥",
      "福",
      "贵",
      "富",
      "康",
      "健",
      "美",
      "丽",
      "慧",
      "智",
      "文",
      "武",
      "德",
      "仁",
      "义",
      "礼",
      "信",
      "忠",
      "孝",
      "勇",
      "才",
      "华",
      "英",
      "俊",
      "秀",
      "雅",
      "清",
      "明",
      "亮",
      "辉",
      "春",
      "夏",
      "秋",
      "冬",
      "花",
      "草",
      "树",
      "林",
      "山",
      "水",
      "云",
      "天",
      "月",
      "星",
      "日",
      "光",
      "彩",
      "宝",
      "玉",
      "金",
    ];

    const hasPositiveMeaning = positiveMeanings.some((keyword) =>
      char.meaning.includes(keyword),
    );
    if (hasPositiveMeaning) {
      charScore += MEANING_SCORE_ADJUSTMENTS.POSITIVE_MEANING_BONUS;
    }

    // Check for negative meanings
    const negativeMeanings = [
      "死",
      "亡",
      "病",
      "灾",
      "祸",
      "凶",
      "恶",
      "鬼",
      "魔",
      "妖",
      "贫",
      "穷",
      "衰",
      "败",
      "丑",
      "恶",
      "臭",
      "烂",
      "坏",
      "差",
    ];

    const hasNegativeMeaning = negativeMeanings.some((keyword) =>
      char.meaning.includes(keyword),
    );
    if (hasNegativeMeaning) {
      charScore -= MEANING_SCORE_ADJUSTMENTS.NEGATIVE_MEANING_PENALTY;
    }

    // Frequency factor (prefer common characters, but not top 100)
    if (
      char.frequency > 0 &&
      char.frequency < FREQUENCY_RANGES.TOO_COMMON_MAX
    ) {
      charScore -= MEANING_SCORE_ADJUSTMENTS.TOO_COMMON_PENALTY;
    } else if (
      char.frequency >= FREQUENCY_RANGES.GOOD_MIN &&
      char.frequency < FREQUENCY_RANGES.GOOD_MAX
    ) {
      charScore += MEANING_SCORE_ADJUSTMENTS.GOOD_FREQUENCY_BONUS;
    } else if (
      char.frequency >= FREQUENCY_RANGES.GOOD_MAX &&
      char.frequency < FREQUENCY_RANGES.ACCEPTABLE_MAX
    ) {
      charScore += MEANING_SCORE_ADJUSTMENTS.ACCEPTABLE_FREQUENCY_BONUS;
    } else if (char.frequency > FREQUENCY_RANGES.TOO_RARE_MIN) {
      charScore -= MEANING_SCORE_ADJUSTMENTS.TOO_RARE_PENALTY;
    }

    // HSK level factor (prefer HSK 1-4 for easy recognition)
    if (char.hskLevel && char.hskLevel <= HSK_LEVELS.EASY_MAX) {
      charScore += MEANING_SCORE_ADJUSTMENTS.HSK_EASY_BONUS;
    } else if (char.hskLevel && char.hskLevel > HSK_LEVELS.HARD_MIN) {
      charScore -= MEANING_SCORE_ADJUSTMENTS.HSK_HARD_PENALTY;
    }

    totalScore += charScore;
  });

  const averageScore = totalScore / characters.length;
  return Math.max(0, Math.min(100, Math.round(averageScore)));
}

/**
 * Get overall score rating
 *
 * @param score - Overall score value (0-100)
 * @returns Rating information with text, description, and emoji
 */
export function getScoreRating(score: number): {
  rating: string;
  description: string;
  emoji: string;
} {
  if (score >= SCORE_RATING_THRESHOLDS.EXCELLENT) {
    return {
      rating: "优秀",
      description: "非常出色的名字，五行、五格、音韵各方面都很和谐",
      emoji: "🌟",
    };
  } else if (score >= SCORE_RATING_THRESHOLDS.GOOD) {
    return {
      rating: "良好",
      description: "很好的名字，整体协调，寓意美好",
      emoji: "✨",
    };
  } else if (score >= SCORE_RATING_THRESHOLDS.AVERAGE) {
    return {
      rating: "中等",
      description: "可以使用的名字，各方面基本合格",
      emoji: "👍",
    };
  } else if (score >= SCORE_RATING_THRESHOLDS.FAIR) {
    return {
      rating: "一般",
      description: "名字有一些不足之处，建议考虑其他选项",
      emoji: "😐",
    };
  } else {
    return {
      rating: "欠佳",
      description: "名字存在较多问题，强烈建议更换",
      emoji: "⚠️",
    };
  }
}

/**
 * Format complete name score analysis as string
 */
export function formatNameScoreAnalysis(score: NameScore): string {
  const rating = getScoreRating(score.overall);

  const result = `
${rating.emoji} 综合评分: ${score.overall}/100 (${rating.rating})
${rating.description}

详细评分:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 八字契合度: ${score.baziScore}/100 (权重 30%)
📐 五格数理: ${score.wugeScore}/100 (权重 25%)
🎵 音韵和谐: ${score.phoneticScore}/100 (权重 20%)
✍️  字义品质: ${score.meaningScore}/100 (权重 25%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  return result;
}

/**
 * Compare two names and return the better one
 */
export function compareNames(
  score1: NameScore,
  score2: NameScore,
): { winner: 1 | 2; difference: number } {
  const difference = Math.abs(score1.overall - score2.overall);

  return {
    winner: score1.overall >= score2.overall ? 1 : 2,
    difference,
  };
}

/**
 * Check if a name meets minimum quality standards
 *
 * @param score - Complete name score to evaluate
 * @returns Object indicating whether name passes standards and any issues found
 */
export function meetsMinimumStandards(score: NameScore): {
  meets: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (score.overall < MIN_PASSING_OVERALL_SCORE) {
    issues.push("综合评分过低");
  }

  if (score.wugeScore < WUGE_GOOD_THRESHOLD) {
    issues.push("五格数理不佳");
  }

  if (score.breakdown.phonetics.hasHomophone) {
    issues.push("存在不良谐音");
  }

  if (score.phoneticScore < PHONETIC_HARMONY_THRESHOLD) {
    issues.push("音韵不够和谐");
  }

  if (score.meaningScore < WUGE_GOOD_THRESHOLD) {
    issues.push("字义品质欠佳");
  }

  return {
    meets: issues.length === 0,
    issues,
  };
}
