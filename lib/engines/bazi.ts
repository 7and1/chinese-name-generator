/**
 * BaZi (八字 / Four Pillars of Destiny) Calculation Engine
 *
 * This engine calculates the Four Pillars (Year, Month, Day, Hour) based on birth date/time
 * and analyzes the Five Elements balance to determine favorable elements for naming.
 */

import type {
  BaZiChart,
  Pillar,
  HeavenlyStem,
  EarthlyBranch,
  FiveElement,
  FiveElementBalance,
} from "../types";
import {
  STEM_ELEMENTS,
  BRANCH_ELEMENTS,
  ELEMENT_GENERATION,
  ELEMENT_DESTRUCTION,
  DEFAULT_BIRTH_HOUR,
  DAY_MASTER_STRENGTH_THRESHOLD,
  BAZI_SCORE_ADJUSTMENTS,
  MIN_UNIQUE_FAVORABLE_FOR_BONUS,
} from "../constants";

// Lazy load lunar-javascript to reduce initial bundle size
let LunarModule: typeof import("lunar-javascript") | null = null;

async function getLunar() {
  if (!LunarModule) {
    LunarModule = await import("lunar-javascript");
  }
  return LunarModule;
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Calculate Four Pillars (BaZi) from birth date and time
 *
 * @param birthDate - Date of birth
 * @param birthHour - Hour of birth (0-23), optional
 * @returns Complete BaZi chart with analysis
 */
export async function calculateBaZi(
  birthDate: Date,
  birthHour?: number,
): Promise<BaZiChart> {
  // Use UTC date parts to avoid server-timezone shifting when callers pass ISO dates.
  return calculateBaZiFromYmd(
    birthDate.getUTCFullYear(),
    birthDate.getUTCMonth() + 1,
    birthDate.getUTCDate(),
    birthHour,
  );
}

/**
 * Calculate Four Pillars (BaZi) from a calendar date (YYYY-MM-DD) and optional hour (0-23).
 *
 * Prefer this function when your input is a `type="date"` string (YYYY-MM-DD).
 *
 * @param year - Full year (e.g., 1990)
 * @param month - Month 1-12
 * @param day - Day of month
 * @param birthHour - Hour of birth 0-23 (optional, defaults to 0)
 * @returns Complete BaZi chart with elements and favorable/unfavorable analysis
 */
export async function calculateBaZiFromYmd(
  year: number,
  month: number,
  day: number,
  birthHour?: number,
): Promise<BaZiChart> {
  const safeHour = birthHour ?? DEFAULT_BIRTH_HOUR;

  // Lazy load lunar-javascript
  const { Solar } = await getLunar();

  // Convert to lunar calendar using lunar-javascript (timezone-independent when using YMDHMS).
  const lunar = Solar.fromYmdHms(year, month, day, safeHour, 0, 0).getLunar();

  // Calculate Year Pillar (年柱)
  const yearPillar: Pillar = {
    stem: lunar.getYearInGanZhi().substring(0, 1) as HeavenlyStem,
    branch: lunar.getYearInGanZhi().substring(1, 2) as EarthlyBranch,
  };

  // Calculate Month Pillar (月柱)
  const monthPillar: Pillar = {
    stem: lunar.getMonthInGanZhi().substring(0, 1) as HeavenlyStem,
    branch: lunar.getMonthInGanZhi().substring(1, 2) as EarthlyBranch,
  };

  // Calculate Day Pillar (日柱)
  const dayPillar: Pillar = {
    stem: lunar.getDayInGanZhi().substring(0, 1) as HeavenlyStem,
    branch: lunar.getDayInGanZhi().substring(1, 2) as EarthlyBranch,
  };

  // Calculate Hour Pillar (时柱)
  const timeGanZhi = lunar.getTimeInGanZhi();
  const hourPillar: Pillar = {
    stem: timeGanZhi.substring(0, 1) as HeavenlyStem,
    branch: timeGanZhi.substring(1, 2) as EarthlyBranch,
  };

  // Day Master is the Heavenly Stem of Day Pillar
  const dayMaster = dayPillar.stem;

  // Calculate Five Elements distribution
  const elements = calculateElementBalance([
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
  ]);

  // Determine favorable and unfavorable elements
  const { favorableElements, unfavorableElements } = analyzeFavorableElements(
    dayMaster,
    elements,
  );

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster,
    elements,
    favorableElements,
    unfavorableElements,
  };
}

/**
 * Calculate Five Elements balance from pillars
 */
function calculateElementBalance(pillars: Pillar[]): FiveElementBalance {
  const balance: FiveElementBalance = {
    金: 0,
    木: 0,
    水: 0,
    火: 0,
    土: 0,
  };

  pillars.forEach((pillar) => {
    // Add stem element
    const stemElement = STEM_ELEMENTS[pillar.stem];
    balance[stemElement] += 1;

    // Add branch element
    const branchElement = BRANCH_ELEMENTS[pillar.branch];
    balance[branchElement] += 1;
  });

  return balance;
}

/**
 * Analyze favorable elements based on Day Master and element balance
 *
 * The logic:
 * - If Day Master element is weak, need to strengthen it
 * - If Day Master element is strong, need to balance with restraining elements
 * - Consider the generation and destruction cycles
 *
 * @param dayMaster - The Heavenly Stem representing the person (Day Master)
 * @param elements - Current balance of Five Elements in the chart
 * @returns Arrays of favorable and unfavorable elements
 */
function analyzeFavorableElements(
  dayMaster: HeavenlyStem,
  elements: FiveElementBalance,
): {
  favorableElements: FiveElement[];
  unfavorableElements: FiveElement[];
} {
  const dayMasterElement = STEM_ELEMENTS[dayMaster];

  // Count the strength of Day Master element
  const dayMasterStrength = elements[dayMasterElement];

  // Day Master is weak if below threshold
  const isDayMasterWeak = dayMasterStrength < DAY_MASTER_STRENGTH_THRESHOLD;

  const favorableElements: FiveElement[] = [];
  const unfavorableElements: FiveElement[] = [];

  if (isDayMasterWeak) {
    // Weak Day Master: need elements that support it
    // 1. Same element (self)
    favorableElements.push(dayMasterElement);

    // 2. Element that generates Day Master
    const generatingElement = Object.keys(ELEMENT_GENERATION).find(
      (key) => ELEMENT_GENERATION[key as FiveElement] === dayMasterElement,
    ) as FiveElement;
    if (generatingElement) {
      favorableElements.push(generatingElement);
    }

    // 3. Elements that destroy Day Master are unfavorable (the element that controls dayMasterElement)
    const controllingElement = (
      Object.keys(ELEMENT_DESTRUCTION) as FiveElement[]
    ).find((el) => ELEMENT_DESTRUCTION[el] === dayMasterElement);
    if (controllingElement) {
      unfavorableElements.push(controllingElement);
    }

    // 4. Element that Day Master destroys (drains energy)
    unfavorableElements.push(ELEMENT_DESTRUCTION[dayMasterElement]);
  } else {
    // Strong Day Master: need elements that balance it
    // 1. Element that Day Master generates (outlet)
    const outletElement = ELEMENT_GENERATION[dayMasterElement];
    favorableElements.push(outletElement);

    // 2. Element that destroys Day Master (control)
    const controlElement = (
      Object.keys(ELEMENT_DESTRUCTION) as FiveElement[]
    ).find((el) => ELEMENT_DESTRUCTION[el] === dayMasterElement);
    if (controlElement) favorableElements.push(controlElement);

    // 3. Same element and generating element are unfavorable (too strong)
    unfavorableElements.push(dayMasterElement);

    const generatingElement = Object.keys(ELEMENT_GENERATION).find(
      (key) => ELEMENT_GENERATION[key as FiveElement] === dayMasterElement,
    ) as FiveElement;
    if (generatingElement) {
      unfavorableElements.push(generatingElement);
    }
  }

  // Remove duplicates
  return {
    favorableElements: Array.from(new Set(favorableElements)),
    unfavorableElements: Array.from(new Set(unfavorableElements)),
  };
}

/**
 * Calculate BaZi compatibility score for a name
 *
 * @param baziChart - BaZi chart from birth date
 * @param nameElements - Five Elements of characters in the name
 * @returns Compatibility score (0-100)
 */
export function calculateBaZiScore(
  baziChart: BaZiChart,
  nameElements: FiveElement[],
): number {
  let score = 50; // Base score

  nameElements.forEach((element) => {
    // +BAZI_SCORE_ADJUSTMENTS.FAVORABLE_BONUS points for each favorable element
    if (baziChart.favorableElements.includes(element)) {
      score += BAZI_SCORE_ADJUSTMENTS.FAVORABLE_BONUS;
    }

    // -BAZI_SCORE_ADJUSTMENTS.UNFAVORABLE_PENALTY points for each unfavorable element
    if (baziChart.unfavorableElements.includes(element)) {
      score -= BAZI_SCORE_ADJUSTMENTS.UNFAVORABLE_PENALTY;
    }
  });

  // Bonus if name has variety of favorable elements
  const uniqueFavorableInName = nameElements.filter((el) =>
    baziChart.favorableElements.includes(el),
  );
  const uniqueCount = new Set(uniqueFavorableInName).size;
  if (uniqueCount >= MIN_UNIQUE_FAVORABLE_FOR_BONUS) {
    score += BAZI_SCORE_ADJUSTMENTS.VARIETY_BONUS;
  }

  // Ensure score is within 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Get element balance as percentages
 */
export function getElementPercentages(
  balance: FiveElementBalance,
): Record<FiveElement, number> {
  const total = Object.values(balance).reduce((sum, count) => sum + count, 0);

  return {
    金: Math.round((balance.金 / total) * 100),
    木: Math.round((balance.木 / total) * 100),
    水: Math.round((balance.水 / total) * 100),
    火: Math.round((balance.火 / total) * 100),
    土: Math.round((balance.土 / total) * 100),
  };
}

/**
 * Format BaZi chart as string for display
 */
export function formatBaZiChart(chart: BaZiChart): string {
  return `
年柱: ${chart.year.stem}${chart.year.branch}
月柱: ${chart.month.stem}${chart.month.branch}
日柱: ${chart.day.stem}${chart.day.branch} (日主: ${chart.dayMaster})
时柱: ${chart.hour.stem}${chart.hour.branch}

五行分布:
金: ${chart.elements.金} 木: ${chart.elements.木} 水: ${chart.elements.水} 火: ${chart.elements.火} 土: ${chart.elements.土}

喜用神: ${chart.favorableElements.join(", ")}
忌神: ${chart.unfavorableElements.join(", ")}
  `.trim();
}

/**
 * Get detailed element analysis description
 */
export function getElementAnalysis(chart: BaZiChart): string {
  const dayMasterElement = STEM_ELEMENTS[chart.dayMaster];
  const dayMasterStrength = chart.elements[dayMasterElement];

  const isWeak = dayMasterStrength < 2;

  if (isWeak) {
    return `日主${chart.dayMaster}属${dayMasterElement}，命局中${dayMasterElement}较弱（仅${dayMasterStrength}个），需要${chart.favorableElements.join("、")}来扶助。起名时宜选用五行属${chart.favorableElements.join("或")}的字，以增强命局平衡。`;
  } else {
    return `日主${chart.dayMaster}属${dayMasterElement}，命局中${dayMasterElement}较旺（有${dayMasterStrength}个），需要${chart.favorableElements.join("、")}来平衡。起名时宜选用五行属${chart.favorableElements.join("或")}的字，以调和五行。`;
  }
}
