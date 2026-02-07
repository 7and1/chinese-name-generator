/**
 * Application constants for Chinese Name Generator
 */

import type { FiveElement, HeavenlyStem, EarthlyBranch } from "../types";

// ============================================================================
// Five Elements (五行)
// ============================================================================

export const FIVE_ELEMENTS: FiveElement[] = ["金", "木", "水", "火", "土"];

export const FIVE_ELEMENTS_EN = {
  金: "Metal",
  木: "Wood",
  水: "Water",
  火: "Fire",
  土: "Earth",
} as const;

/**
 * Five Elements Generation Cycle (相生)
 * Wood feeds Fire, Fire creates Earth, Earth bears Metal, Metal enriches Water, Water nourishes Wood
 */
export const ELEMENT_GENERATION: Record<FiveElement, FiveElement> = {
  木: "火", // Wood generates Fire
  火: "土", // Fire generates Earth
  土: "金", // Earth generates Metal
  金: "水", // Metal generates Water
  水: "木", // Water generates Wood
};

/**
 * Five Elements Destruction Cycle (相克)
 * Wood parts Earth, Earth absorbs Water, Water quenches Fire, Fire melts Metal, Metal chops Wood
 */
export const ELEMENT_DESTRUCTION: Record<FiveElement, FiveElement> = {
  木: "土", // Wood destroys Earth
  土: "水", // Earth destroys Water
  水: "火", // Water destroys Fire
  火: "金", // Fire destroys Metal
  金: "木", // Metal destroys Wood
};

// ============================================================================
// Heavenly Stems (天干)
// ============================================================================

export const HEAVENLY_STEMS: HeavenlyStem[] = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
];

export const STEM_ELEMENTS: Record<HeavenlyStem, FiveElement> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

export const STEM_YIN_YANG: Record<HeavenlyStem, "阳" | "阴"> = {
  甲: "阳",
  乙: "阴",
  丙: "阳",
  丁: "阴",
  戊: "阳",
  己: "阴",
  庚: "阳",
  辛: "阴",
  壬: "阳",
  癸: "阴",
};

// ============================================================================
// Earthly Branches (地支)
// ============================================================================

export const EARTHLY_BRANCHES: EarthlyBranch[] = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];

export const BRANCH_ELEMENTS: Record<EarthlyBranch, FiveElement> = {
  寅: "木",
  卯: "木",
  巳: "火",
  午: "火",
  申: "金",
  酉: "金",
  亥: "水",
  子: "水",
  辰: "土",
  戌: "土",
  丑: "土",
  未: "土",
};

export const BRANCH_ZODIAC: Record<EarthlyBranch, string> = {
  子: "鼠",
  丑: "牛",
  寅: "虎",
  卯: "兔",
  辰: "龙",
  巳: "蛇",
  午: "马",
  未: "羊",
  申: "猴",
  酉: "鸡",
  戌: "狗",
  亥: "猪",
};

export const BRANCH_ZODIAC_EN: Record<EarthlyBranch, string> = {
  子: "Rat",
  丑: "Ox",
  寅: "Tiger",
  卯: "Rabbit",
  辰: "Dragon",
  巳: "Snake",
  午: "Horse",
  未: "Goat",
  申: "Monkey",
  酉: "Rooster",
  戌: "Dog",
  亥: "Pig",
};

// ============================================================================
// 81 Numerology (八十一数理吉凶)
// ============================================================================

export type FortuneLevel = "大吉" | "吉" | "半吉" | "凶" | "大凶";

export const NUMEROLOGY_81: Record<
  number,
  { fortune: FortuneLevel; meaning: string }
> = {
  1: { fortune: "大吉", meaning: "天地开泰，万物资始，繁荣富贵" },
  2: { fortune: "凶", meaning: "混沌未定，分离破败，动荡不安" },
  3: { fortune: "大吉", meaning: "立身处世，有贵人助，成功发达" },
  4: { fortune: "凶", meaning: "万事不成，破坏家运，孤苦伶仃" },
  5: { fortune: "大吉", meaning: "阴阳和合，生意兴隆，名利双收" },
  6: { fortune: "大吉", meaning: "天官赐福，德高望重，大有作为" },
  7: { fortune: "吉", meaning: "刚毅果断，勇往直前，排除万难" },
  8: { fortune: "吉", meaning: "意志刚健，勤勉发展，富于进取" },
  9: { fortune: "凶", meaning: "虽有才能，无奈遭难，有始无终" },
  10: { fortune: "凶", meaning: "乌云遮月，暗淡无光，空费心力" },
  11: { fortune: "大吉", meaning: "草木逢春，枝叶沾露，稳健着实" },
  12: { fortune: "凶", meaning: "薄弱无力，孤立无援，外祥内苦" },
  13: { fortune: "大吉", meaning: "天赋吉运，德望兼备，继续努力" },
  14: { fortune: "凶", meaning: "忍得苦难，必有后福，是成是败" },
  15: { fortune: "大吉", meaning: "谦恭做事，外得人和，大事成就" },
  16: { fortune: "大吉", meaning: "能获众望，成就大业，名利双收" },
  17: { fortune: "吉", meaning: "排除万难，有贵人助，把握时机" },
  18: { fortune: "大吉", meaning: "经商做事，顺利昌隆，如能慎始" },
  19: { fortune: "凶", meaning: "成功虽早，慎防亏空，内外不和" },
  20: { fortune: "凶", meaning: "智高志大，历尽艰难，焦心忧劳" },
  21: { fortune: "大吉", meaning: "先历困苦，后得幸福，霜雪梅花" },
  22: { fortune: "凶", meaning: "秋草逢霜，怀才不遇，忧愁怨苦" },
  23: { fortune: "大吉", meaning: "旭日东升，壮丽壮观，权威旺盛" },
  24: { fortune: "大吉", meaning: "锦绣前程，须靠自力，多用智谋" },
  25: { fortune: "吉", meaning: "天时地利，只欠人和，讲信修睦" },
  26: { fortune: "凶", meaning: "波澜起伏，千变万化，凌驾万难" },
  27: { fortune: "凶", meaning: "一成一败，一盛一衰，惟靠谨慎" },
  28: { fortune: "凶", meaning: "鱼临旱地，难逃厄运，此数大凶" },
  29: { fortune: "吉", meaning: "如龙得云，青云直上，智谋奋进" },
  30: { fortune: "半吉", meaning: "吉凶参半，得失相伴，投机取巧" },
  31: { fortune: "大吉", meaning: "此数大吉，名利双收，渐进向上" },
  32: { fortune: "大吉", meaning: "池中之龙，风云际会，一跃上天" },
  33: { fortune: "大吉", meaning: "意气用事，人和必失，如能慎始" },
  34: { fortune: "凶", meaning: "灾难不绝，难望成功，此数大凶" },
  35: { fortune: "吉", meaning: "中吉之数，进退保守，生意安稳" },
  36: { fortune: "凶", meaning: "波澜重叠，常陷穷困，动不如静" },
  37: { fortune: "大吉", meaning: "逢凶化吉，吉人天相，风调雨顺" },
  38: { fortune: "半吉", meaning: "名虽可得，利则难获，艺界发展" },
  39: { fortune: "大吉", meaning: "云开见月，虽有劳碌，光明坦途" },
  40: { fortune: "半吉", meaning: "一盛一衰，浮沉不定，知难而退" },
  41: { fortune: "大吉", meaning: "天赋吉运，德望兼备，继续努力" },
  42: { fortune: "凶", meaning: "事业不专，十九不成，专心不移" },
  43: { fortune: "凶", meaning: "雨夜之花，外祥内苦，忍耐自重" },
  44: { fortune: "凶", meaning: "虽用心计，事难遂愿，贪功好进" },
  45: { fortune: "大吉", meaning: "杨柳遇春，绿叶发枝，冲破难关" },
  46: { fortune: "凶", meaning: "坎坷不平，艰难重重，若无耐心" },
  47: { fortune: "大吉", meaning: "有贵人助，可成大业，虽遇不幸" },
  48: { fortune: "大吉", meaning: "美花丰实，鹤立鸡群，名利俱全" },
  49: { fortune: "凶", meaning: "吉凶互见，一成一败，凶中有吉" },
  50: { fortune: "半吉", meaning: "一盛一衰，浮沉不常，自重自处" },
  51: { fortune: "半吉", meaning: "盛衰参半，先吉后凶，先凶后吉" },
  52: { fortune: "大吉", meaning: "草木逢春，雨过天晴，渡过难关" },
  53: { fortune: "半吉", meaning: "盛衰参半，外祥内苦，先吉后凶" },
  54: { fortune: "凶", meaning: "虽倾全力，难望成功，此数大凶" },
  55: { fortune: "半吉", meaning: "外观隆昌，内隐祸患，克服难关" },
  56: { fortune: "凶", meaning: "事与愿违，终难成功，欲速不达" },
  57: { fortune: "吉", meaning: "努力经营，时来运转，旷野枯草" },
  58: { fortune: "半吉", meaning: "先苦后甜，先甜后苦，如能持之" },
  59: { fortune: "凶", meaning: "遇事犹豫，难望成事，大刀阔斧" },
  60: { fortune: "凶", meaning: "黑暗无光，心迷意乱，出尔反尔" },
  61: { fortune: "大吉", meaning: "云遮半月，内隐风波，应自谨慎" },
  62: { fortune: "凶", meaning: "烦闷懊恼，事事难展，自防灾祸" },
  63: { fortune: "大吉", meaning: "万物化育，繁荣之象，专心一意" },
  64: { fortune: "凶", meaning: "见异思迁，十九不成，徒劳无功" },
  65: { fortune: "大吉", meaning: "吉运自来，能享盛名，把握机会" },
  66: { fortune: "凶", meaning: "黑夜漫长，进退维谷，内外不和" },
  67: { fortune: "大吉", meaning: "天赋幸运，四通八达，家道繁昌" },
  68: { fortune: "大吉", meaning: "思虑周详，计划力行，不失先机" },
  69: { fortune: "凶", meaning: "动摇不安，常陷逆境，不得时运" },
  70: { fortune: "凶", meaning: "惨淡经营，难免贫困，此数不吉" },
  71: { fortune: "半吉", meaning: "吉凶参半，惟赖勇气，贯彻力行" },
  72: { fortune: "凶", meaning: "利害混集，凶多吉少，得而复失" },
  73: { fortune: "半吉", meaning: "安乐自来，自然吉祥，力行不懈" },
  74: { fortune: "凶", meaning: "利不及费，坐食山空，如无章法" },
  75: { fortune: "半吉", meaning: "吉中带凶，欲速不达，进不如守" },
  76: { fortune: "凶", meaning: "此数大凶，破产之象，宜速改名" },
  77: { fortune: "半吉", meaning: "先苦后甘，先甘后苦，如能守成" },
  78: { fortune: "半吉", meaning: "有得有失，华而不实，须防劫财" },
  79: { fortune: "凶", meaning: "如走夜路，前途无光，希望不大" },
  80: { fortune: "凶", meaning: "得而复失，枉费心机，守成无贪" },
  81: { fortune: "大吉", meaning: "最极之数，还本归元，能得繁荣" },
};

// ============================================================================
// Pinyin Tones
// ============================================================================

export const TONE_PATTERNS_GOOD = [
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 1],
  [2, 3],
  [2, 4],
  [3, 1],
  [3, 2],
  [3, 4],
  [4, 1],
  [4, 2],
  [4, 3],
];

export const TONE_PATTERNS_BAD = [
  [4, 4], // Avoid double fourth tone
];

// ============================================================================
// Common Chinese Surnames (百家姓)
// ============================================================================

export const TOP_100_SURNAMES = [
  "王",
  "李",
  "张",
  "刘",
  "陈",
  "杨",
  "黄",
  "赵",
  "周",
  "吴",
  "徐",
  "孙",
  "马",
  "朱",
  "胡",
  "郭",
  "何",
  "林",
  "高",
  "罗",
  "郑",
  "梁",
  "谢",
  "宋",
  "唐",
  "许",
  "邓",
  "韩",
  "冯",
  "曹",
  "彭",
  "曾",
  "肖",
  "田",
  "董",
  "袁",
  "潘",
  "于",
  "蒋",
  "蔡",
  "余",
  "杜",
  "叶",
  "程",
  "苏",
  "魏",
  "吕",
  "丁",
  "任",
  "沈",
  "姚",
  "卢",
  "姜",
  "崔",
  "钟",
  "谭",
  "陆",
  "汪",
  "范",
  "金",
  "石",
  "廖",
  "贾",
  "夏",
  "韦",
  "付",
  "方",
  "白",
  "邹",
  "孟",
  "熊",
  "秦",
  "邱",
  "江",
  "尹",
  "薛",
  "闫",
  "段",
  "雷",
  "侯",
  "龙",
  "史",
  "陶",
  "黎",
  "贺",
  "顾",
  "毛",
  "郝",
  "龚",
  "邵",
  "万",
  "钱",
  "严",
  "覃",
  "武",
  "戴",
  "莫",
  "孔",
  "向",
  "常",
];

// ============================================================================
// Application Config
// ============================================================================

export const APP_CONFIG = {
  name: "Chinese Name Generator",
  nameZH: "中文姓名生成器",
  description:
    "AI-powered Chinese name generator with BaZi, Wuge, and classical poetry",
  defaultLocale: "zh",
  supportedLocales: ["zh", "en", "ja", "ko"],
  maxNameResults: 100,
  defaultNameResults: 20,
} as const;

// ============================================================================
// Score Weights
// ============================================================================

export const SCORE_WEIGHTS = {
  bazi: 0.3, // 30% - BaZi compatibility
  wuge: 0.25, // 25% - Five Grids numerology
  phonetics: 0.2, // 20% - Phonetic harmony
  meaning: 0.25, // 25% - Character meaning quality
} as const;

// ============================================================================
// Scoring Thresholds and Adjustments
// ============================================================================

/** Default BaZi score when no birth date is provided */
export const DEFAULT_BAZI_SCORE = 70;

/** Score thresholds for rating classification */
export const SCORE_RATING_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 80,
  AVERAGE: 70,
  FAIR: 60,
} as const;

/** Base score for meaning calculation */
export const MEANING_BASE_SCORE = 60;

/** Score adjustment values for meaning analysis */
export const MEANING_SCORE_ADJUSTMENTS = {
  POSITIVE_MEANING_BONUS: 20,
  NEGATIVE_MEANING_PENALTY: 30,
  TOO_COMMON_PENALTY: 5,
  GOOD_FREQUENCY_BONUS: 15,
  ACCEPTABLE_FREQUENCY_BONUS: 10,
  TOO_RARE_PENALTY: 10,
  HSK_EASY_BONUS: 10,
  HSK_HARD_PENALTY: 5,
} as const;

/** Frequency ranges for character commonness */
export const FREQUENCY_RANGES = {
  TOO_COMMON_MAX: 100,
  GOOD_MIN: 100,
  GOOD_MAX: 1000,
  ACCEPTABLE_MAX: 3000,
  TOO_RARE_MIN: 5000,
} as const;

/** HSK level thresholds */
export const HSK_LEVELS = {
  EASY_MAX: 4,
  HARD_MIN: 5,
} as const;

/** BaZi score adjustments per element */
export const BAZI_SCORE_ADJUSTMENTS = {
  FAVORABLE_BONUS: 20,
  UNFAVORABLE_PENALTY: 15,
  VARIETY_BONUS: 10,
} as const;

/** Minimum unique favorable elements for variety bonus */
export const MIN_UNIQUE_FAVORABLE_FOR_BONUS = 2;

/** Wuge score threshold for good configuration */
export const WUGE_GOOD_THRESHOLD = 50;

/** Phonetic score threshold for harmony issues */
export const PHONETIC_HARMONY_THRESHOLD = 50;

/** Minimum score for passing overall evaluation */
export const MIN_PASSING_OVERALL_SCORE = 60;

/** Minimum strength for Day Master to be considered strong */
export const DAY_MASTER_STRENGTH_THRESHOLD = 2;

/** Default hour when no birth hour is provided */
export const DEFAULT_BIRTH_HOUR = 0;
