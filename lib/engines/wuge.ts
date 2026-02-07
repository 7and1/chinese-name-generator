/**
 * Wuge (五格 / Five Grids) Name Numerology Engine
 *
 * Calculates the Five Grids based on stroke counts:
 * - Tian Ge (天格): Heaven Grid - surname strokes
 * - Ren Ge (人格): Human Grid - surname + first char of given name
 * - Di Ge (地格): Earth Grid - given name strokes
 * - Wai Ge (外格): Outer Grid - total - ren ge + 1
 * - Zong Ge (总格): Total Grid - all strokes
 *
 * Also calculates Sancai (三才 / Three Talents) and 81 Numerology
 */

import type {
  WugeGrid,
  WugeAnalysis,
  NumerologyInterpretation,
  SancaiAnalysis,
  FiveElement,
} from "../types";
import {
  NUMEROLOGY_81,
  ELEMENT_GENERATION,
  ELEMENT_DESTRUCTION,
  type FortuneLevel,
} from "../constants";

// ============================================================================
// Constants
// ============================================================================

/** Number range for 81 numerology reduction */
const NUMEROLOGY_RANGE = { min: 1, max: 81 };

/** Numerology reduction calculation constant */
const NUMEROLOGY_MODULO = 81;

/** Single character wai ge value */
const SINGLE_CHAR_WAI_GE = 2;

/** Grid weights for overall score calculation */
const GRID_WEIGHTS = {
  TIAN_GE: 0.15,
  REN_GE: 0.25, // Most important - represents core personality
  DI_GE: 0.2,
  WAI_GE: 0.15,
  ZONG_GE: 0.25, // Very important - represents overall life
} as const;

/** Score combination weights */
const SCORE_COMBINATION_WEIGHTS = {
  GRID_SCORE: 0.7,
  SANCAI_SCORE: 0.3,
} as const;

/** Minimum score for good Wuge configuration */
const WUGE_GOOD_SCORE_THRESHOLD = 70;

/** Numerology score mappings */
const FORTUNE_SCORES: Record<FortuneLevel, number> = {
  大吉: 95,
  吉: 80,
  半吉: 60,
  凶: 40,
  大凶: 20,
} as const;

/** Number to element mapping digits */
const ELEMENT_DIGITS = {
  WOOD_END: 2,
  FIRE_END: 4,
  EARTH_END: 6,
  METAL_END: 8,
  WATER_END: 0,
} as const;

/** Sancai compatibility scores */
const SANCAI_SCORES = {
  GENERATION: 90, // 相生
  SAME: 70, // 同类
  DESTRUCTION: 50, // 相克
} as const;

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Calculate Five Grids from stroke counts
 *
 * @param surnameStrokes - Array of stroke counts for surname characters
 * @param givenNameStrokes - Array of stroke counts for given name characters
 * @returns WugeGrid with all five grid numbers
 */
export function calculateWuge(
  surnameStrokes: number[],
  givenNameStrokes: number[],
): WugeGrid {
  const surnameTotal = surnameStrokes.reduce((sum, s) => sum + s, 0);
  const givenNameTotal = givenNameStrokes.reduce((sum, s) => sum + s, 0);
  const total = surnameTotal + givenNameTotal;

  // Tian Ge (天格) - Heaven Grid
  // For compound surnames, it's the sum of both characters
  // For single surnames, add 1
  const tianGe =
    surnameStrokes.length > 1 ? surnameTotal : surnameStrokes[0] + 1;

  // Ren Ge (人格) - Human Grid
  // Last character of surname + first character of given name
  const renGe =
    surnameStrokes[surnameStrokes.length - 1] + (givenNameStrokes[0] || 0);

  // Di Ge (地格) - Earth Grid
  // Sum of given name characters
  // For single given name, add 1
  const diGe =
    givenNameStrokes.length > 1 ? givenNameTotal : givenNameTotal + 1;

  // Wai Ge (外格) - Outer Grid
  // Total - Ren Ge + 1
  // Special case for single surname + single given name
  let waiGe: number;
  if (surnameStrokes.length === 1 && givenNameStrokes.length === 1) {
    waiGe = SINGLE_CHAR_WAI_GE;
  } else if (givenNameStrokes.length === 1) {
    waiGe = tianGe + 1;
  } else if (surnameStrokes.length === 1) {
    waiGe = givenNameStrokes[givenNameStrokes.length - 1] + 1;
  } else {
    waiGe = total - renGe + 1;
  }

  // Zong Ge (总格) - Total Grid
  const zongGe = total;

  return {
    tianGe,
    renGe,
    diGe,
    waiGe,
    zongGe,
  };
}

/**
 * Get full Wuge analysis with interpretations
 */
export function analyzeWuge(
  surnameStrokes: number[],
  givenNameStrokes: number[],
): WugeAnalysis {
  const grid = calculateWuge(surnameStrokes, givenNameStrokes);

  const tianGeInterpretation = getNumerologyInterpretation(grid.tianGe);
  const renGeInterpretation = getNumerologyInterpretation(grid.renGe);
  const diGeInterpretation = getNumerologyInterpretation(grid.diGe);
  const waiGeInterpretation = getNumerologyInterpretation(grid.waiGe);
  const zongGeInterpretation = getNumerologyInterpretation(grid.zongGe);

  const sancai = calculateSancai(grid.tianGe, grid.renGe, grid.diGe);

  // Calculate overall score
  const overallScore = calculateWugeScore({
    tianGe: grid.tianGe,
    renGe: grid.renGe,
    diGe: grid.diGe,
    waiGe: grid.waiGe,
    zongGe: grid.zongGe,
    tianGeInterpretation,
    renGeInterpretation,
    diGeInterpretation,
    waiGeInterpretation,
    zongGeInterpretation,
    sancai,
    overallScore: 0, // Will be calculated
  });

  return {
    ...grid,
    tianGeInterpretation,
    renGeInterpretation,
    diGeInterpretation,
    waiGeInterpretation,
    zongGeInterpretation,
    sancai,
    overallScore,
  };
}

/**
 * Get 81 numerology interpretation for a number
 *
 * @param num - Raw grid number to interpret
 * @returns Numerology interpretation with fortune level and meaning
 */
function getNumerologyInterpretation(num: number): NumerologyInterpretation {
  // Reduce to 1-81 range
  const reducedNum =
    ((num - NUMEROLOGY_RANGE.min) % NUMEROLOGY_MODULO) + NUMEROLOGY_RANGE.min;

  const data = NUMEROLOGY_81[reducedNum] || {
    fortune: "半吉" as FortuneLevel,
    meaning: "未知数理",
  };

  return {
    number: num,
    fortune: data.fortune,
    meaning: data.meaning,
    description: getFortuneDescription(data.fortune),
  };
}

/**
 * Get fortune description in Chinese
 */
function getFortuneDescription(fortune: FortuneLevel): string {
  const descriptions: Record<FortuneLevel, string> = {
    大吉: "大吉大利，功成名就，富贵荣华",
    吉: "吉祥如意，顺风顺水，小有成就",
    半吉: "吉凶参半，需谨慎行事，稳中求进",
    凶: "运势不顺，多有坎坷，需要化解",
    大凶: "大凶之数，灾祸连连，急需改名",
  };
  return descriptions[fortune];
}

/**
 * Calculate Sancai (三才 / Three Talents): Heaven-Human-Earth
 *
 * The relationship between Tian Ge, Ren Ge, and Di Ge
 * Each is mapped to a Five Element based on last digit
 */
function calculateSancai(
  tianGe: number,
  renGe: number,
  diGe: number,
): SancaiAnalysis {
  const heaven = numberToElement(tianGe);
  const human = numberToElement(renGe);
  const earth = numberToElement(diGe);

  const compatibility = analyzeElementCompatibility(heaven, human, earth);
  const interpretation = getSancaiInterpretation(
    heaven,
    human,
    earth,
    compatibility,
  );
  const score = getSancaiScore(compatibility);

  return {
    heaven,
    human,
    earth,
    compatibility,
    interpretation,
    score,
  };
}

/**
 * Map number to Five Element based on last digit
 * 1,2 = Wood | 3,4 = Fire | 5,6 = Earth | 7,8 = Metal | 9,0 = Water
 *
 * @param num - Number to map (typically a grid value)
 * @returns Corresponding Five Element
 */
function numberToElement(num: number): FiveElement {
  const lastDigit = num % 10;

  if (lastDigit === 1 || lastDigit === ELEMENT_DIGITS.WOOD_END) return "木";
  if (lastDigit === 3 || lastDigit === ELEMENT_DIGITS.FIRE_END) return "火";
  if (lastDigit === 5 || lastDigit === ELEMENT_DIGITS.EARTH_END) return "土";
  if (lastDigit === 7 || lastDigit === ELEMENT_DIGITS.METAL_END) return "金";
  return "水"; // 9 or 0
}

/**
 * Analyze compatibility between three elements
 */
function analyzeElementCompatibility(
  heaven: FiveElement,
  human: FiveElement,
  earth: FiveElement,
): "相生" | "相克" | "同类" {
  // Check if all same
  if (heaven === human && human === earth) {
    return "同类";
  }

  // Check generation cycles
  const heavenGeneratesHuman = ELEMENT_GENERATION[heaven] === human;
  const humanGeneratesEarth = ELEMENT_GENERATION[human] === earth;
  const earthGeneratesHeaven = ELEMENT_GENERATION[earth] === heaven;

  if (
    (heavenGeneratesHuman && humanGeneratesEarth) ||
    (humanGeneratesEarth && earthGeneratesHeaven) ||
    (earthGeneratesHeaven && heavenGeneratesHuman)
  ) {
    return "相生";
  }

  // Check destruction cycles
  const heavenDestroysHuman = ELEMENT_DESTRUCTION[heaven] === human;
  const humanDestroysEarth = ELEMENT_DESTRUCTION[human] === earth;

  if (heavenDestroysHuman || humanDestroysEarth) {
    return "相克";
  }

  // Default to neutral
  return "同类";
}

/**
 * Get Sancai interpretation
 */
function getSancaiInterpretation(
  heaven: FiveElement,
  human: FiveElement,
  earth: FiveElement,
  compatibility: string,
): string {
  const config = `${heaven}-${human}-${earth}`;

  if (compatibility === "相生") {
    return `三才配置【${config}】为吉祥之象，天人地三才相生，运势顺畅，能得长辈提拔，下属拥戴，事业有成，家庭和睦。`;
  } else if (compatibility === "相克") {
    return `三才配置【${config}】存在相克，需要注意调和。虽有才能，但容易遭遇阻碍，需要加倍努力，注意身体健康和人际关系。`;
  } else {
    return `三才配置【${config}】为平稳之象，运势平和，按部就班，稳中求进，适合踏实发展。`;
  }
}

/**
 * Get Sancai compatibility score
 *
 * @param compatibility - Type of compatibility between elements
 * @returns Score from 0-100
 */
function getSancaiScore(compatibility: string): number {
  if (compatibility === "相生") return SANCAI_SCORES.GENERATION;
  if (compatibility === "同类") return SANCAI_SCORES.SAME;
  return SANCAI_SCORES.DESTRUCTION;
}

/**
 * Calculate overall Wuge score (0-100)
 *
 * @param analysis - Complete Wuge analysis
 * @returns Overall score from 0-100
 */
function calculateWugeScore(analysis: WugeAnalysis): number {
  const gridScores = {
    tianGe: fortuneToScore(analysis.tianGeInterpretation.fortune),
    renGe: fortuneToScore(analysis.renGeInterpretation.fortune),
    diGe: fortuneToScore(analysis.diGeInterpretation.fortune),
    waiGe: fortuneToScore(analysis.waiGeInterpretation.fortune),
    zongGe: fortuneToScore(analysis.zongGeInterpretation.fortune),
  };

  const gridScore =
    gridScores.tianGe * GRID_WEIGHTS.TIAN_GE +
    gridScores.renGe * GRID_WEIGHTS.REN_GE +
    gridScores.diGe * GRID_WEIGHTS.DI_GE +
    gridScores.waiGe * GRID_WEIGHTS.WAI_GE +
    gridScores.zongGe * GRID_WEIGHTS.ZONG_GE;

  // Combine grid score with Sancai score
  const totalScore =
    gridScore * SCORE_COMBINATION_WEIGHTS.GRID_SCORE +
    analysis.sancai.score * SCORE_COMBINATION_WEIGHTS.SANCAI_SCORE;

  return Math.round(totalScore);
}

/**
 * Convert fortune level to numeric score
 *
 * @param fortune - Fortune level from numerology
 * @returns Numeric score from 0-100
 */
function fortuneToScore(fortune: FortuneLevel): number {
  return FORTUNE_SCORES[fortune];
}

/**
 * Check if a name has good Wuge configuration
 *
 * @param analysis - Complete Wuge analysis
 * @returns True if overall score meets good threshold
 */
export function hasGoodWuge(analysis: WugeAnalysis): boolean {
  return analysis.overallScore >= WUGE_GOOD_SCORE_THRESHOLD;
}

/**
 * Format Wuge analysis as string
 */
export function formatWugeAnalysis(analysis: WugeAnalysis): string {
  return `
五格配置:
天格: ${analysis.tianGe} (${analysis.tianGeInterpretation.fortune}) - ${analysis.tianGeInterpretation.meaning}
人格: ${analysis.renGe} (${analysis.renGeInterpretation.fortune}) - ${analysis.renGeInterpretation.meaning}
地格: ${analysis.diGe} (${analysis.diGeInterpretation.fortune}) - ${analysis.diGeInterpretation.meaning}
外格: ${analysis.waiGe} (${analysis.waiGeInterpretation.fortune}) - ${analysis.waiGeInterpretation.meaning}
总格: ${analysis.zongGe} (${analysis.zongGeInterpretation.fortune}) - ${analysis.zongGeInterpretation.meaning}

三才配置: ${analysis.sancai.heaven}-${analysis.sancai.human}-${analysis.sancai.earth} (${analysis.sancai.compatibility})
${analysis.sancai.interpretation}

综合评分: ${analysis.overallScore}/100
  `.trim();
}
