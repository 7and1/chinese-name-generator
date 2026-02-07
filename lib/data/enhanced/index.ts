/**
 * Enhanced Data Index
 *
 * Exports all enhanced content databases for the Chinese Name Generator
 *
 * Enhanced features:
 * - Poetry with cultural context and name themes
 * - Idioms with detailed explanations and stories
 * - Surnames with regional distribution and famous people details
 * - Five Elements with comprehensive metadata
 */

// Re-export all enhanced data
export {
  POETRY_ENHANCED,
  getEnhancedPoetryBySource,
  getEnhancedPoetryByTheme,
  getEnhancedPoetryByPopularity,
  searchEnhancedPoetry,
  type PoetryVerseEnhanced,
} from "../poetry-enhanced";

export {
  IDIOM_ENHANCED,
  getEnhancedIdiomsByCategory,
  getEnhancedIdiomsByPopularity,
  searchEnhancedIdioms,
  getEnhancedIdiomsByCharacter,
  type IdiomEnhanced,
} from "../idioms-enhanced";

export {
  SURNAMES_ENHANCED,
  getSurnameEnhanced,
  getSurnamesByRegion,
  getSurnamesByRanking,
} from "../surnames-enhanced";

export {
  FIVE_ELEMENTS_ENHANCED,
  getElementBySeason,
  getElementsByTrait,
  getElementBalance,
  getCharactersForElement,
  getFiveElementsAdvice,
  type ElementInfoEnhanced,
} from "../elements-enhanced";

/**
 * Content Statistics
 */
export const CONTENT_STATS = {
  poetry: {
    total: 42, // Number of enhanced poetry entries
    bySource: {
      诗经: 12,
      楚辞: 6,
      唐诗: 13,
      宋词: 11,
    },
    byPopularity: {
      high: 28,
      medium: 12,
      low: 2,
    },
  },
  idioms: {
    total: 60, // Number of enhanced idiom entries
    byCategory: {
      品德: 10,
      才华: 8,
      美好: 8,
      成功: 8,
      自然: 6,
      智慧: 5,
      情感: 7,
    },
    byPopularity: {
      high: 40,
      medium: 18,
      low: 2,
    },
  },
  surnames: {
    total: 20, // Number of enhanced surname entries (top 20 with full details)
    top10: ["李", "王", "张", "刘", "陈", "杨", "黄", "赵", "吴", "周"],
    top20: [
      "李",
      "王",
      "张",
      "刘",
      "陈",
      "杨",
      "黄",
      "赵",
      "吴",
      "周",
      "徐",
      "孙",
      "马",
      "朱",
      "胡",
      "郭",
      "何",
      "林",
      "罗",
      "高",
    ],
  },
  elements: {
    total: 5, // Five Elements
    elements: ["金", "木", "水", "火", "土"],
  },
} as const;

/**
 * Data Sources and References
 */
export const DATA_SOURCES = {
  poetry: [
    "《诗经》中华书局，2015",
    "《楚辞》上海古籍出版社，2018",
    "《唐诗三百首》中华书局，1959",
    "《宋词三百首》中华书局，1962",
  ],
  idioms: [
    "《成语大词典》上海辞书出版社，2014",
    "《中华成语词典》商务印书馆，2018",
    "《成语故事》中华书局，2016",
  ],
  surnames: [
    "《中华姓氏大辞典》中华书局，2018",
    "《中国姓氏大全》北京出版社，2016",
    "《百家姓溯源》上海古籍出版社，2014",
  ],
  elements: [
    "《黄帝内经》中华书局，2010",
    "《五行大义》上海古籍出版社，2015",
    "《中医基础理论》中国中医药出版社，2018",
  ],
} as const;

/**
 * Get all data for a specific theme
 */
export async function getDataByTheme(theme: string) {
  const { searchEnhancedPoetry } = await import("../poetry-enhanced");
  const { searchEnhancedIdioms } = await import("../idioms-enhanced");

  const poetry = searchEnhancedPoetry(theme);
  const idioms = searchEnhancedIdioms(theme);

  return {
    poetry,
    idioms,
    total: poetry.length + idioms.length,
  };
}

/**
 * Get naming recommendations based on element
 */
export async function getNamingRecommendations(element: string) {
  const { FIVE_ELEMENTS_ENHANCED, getCharactersForElement } =
    await import("../elements-enhanced");

  const elementInfo =
    FIVE_ELEMENTS_ENHANCED[element as keyof typeof FIVE_ELEMENTS_ENHANCED];
  const characters = getCharactersForElement(
    element as "金" | "木" | "水" | "火" | "土",
  );

  return {
    element,
    description: elementInfo?.description,
    namingAdvice: elementInfo?.namingAdvice,
    characters,
  };
}
