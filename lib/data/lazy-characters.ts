/**
 * Lazy Loading Character Data Module
 *
 * Features:
 * - Lazy load characters by element
 * - Character indexing for fast lookups
 * - Precomputed character sets
 */

import type { ChineseCharacter, FiveElement } from "../types";
import { SAMPLE_CHARACTERS } from "./characters";

// ============================================================================
// Character Index
// ============================================================================

interface CharacterIndex {
  byChar: Map<string, ChineseCharacter>;
  byElement: Map<FiveElement, ChineseCharacter[]>;
  byPinyin: Map<string, ChineseCharacter[]>;
  loadedElements: Set<FiveElement>;
}

/**
 * Global character index (lazily initialized)
 */
let characterIndex: CharacterIndex | null = null;

/**
 * Initialize the character index
 */
function initializeIndex(): CharacterIndex {
  if (characterIndex) {
    return characterIndex;
  }

  const byChar = new Map<string, ChineseCharacter>();
  const byElement = new Map<FiveElement, ChineseCharacter[]>();
  const byPinyin = new Map<string, ChineseCharacter[]>();
  const loadedElements = new Set<FiveElement>();

  // Initialize empty arrays for each element
  const elements: FiveElement[] = ["金", "木", "水", "火", "土"];
  for (const element of elements) {
    byElement.set(element, []);
  }

  characterIndex = {
    byChar,
    byElement,
    byPinyin,
    loadedElements,
  };

  // Pre-index all characters (since SAMPLE_CHARACTERS is already loaded)
  // In a real scenario with database, this would be lazy
  for (const char of SAMPLE_CHARACTERS) {
    // Index by character
    byChar.set(char.char, char);

    // Index by element
    const elementChars = byElement.get(char.fiveElement);
    if (elementChars) {
      elementChars.push(char);
    }

    // Index by pinyin
    const pinyinKey = char.pinyin.toLowerCase();
    if (!byPinyin.has(pinyinKey)) {
      byPinyin.set(pinyinKey, []);
    }
    byPinyin.get(pinyinKey)!.push(char);

    // Mark element as loaded
    loadedElements.add(char.fiveElement);
  }

  return characterIndex;
}

/**
 * Get the character index (lazy initialization)
 */
function getIndex(): CharacterIndex {
  if (!characterIndex) {
    return initializeIndex();
  }
  return characterIndex;
}

// ============================================================================
// Optimized Character Access Functions
// ============================================================================

/**
 * Get a character by its string (O(1) lookup)
 */
export function getCharacterOptimized(
  char: string,
): ChineseCharacter | undefined {
  const index = getIndex();
  return index.byChar.get(char);
}

/**
 * Get characters by element (uses precomputed index)
 */
export function getCharactersByElementOptimized(
  element: FiveElement,
): ChineseCharacter[] {
  const index = getIndex();
  return index.byElement.get(element) || [];
}

/**
 * Get characters by multiple elements (uses precomputed index)
 */
export function getCharactersByElementsOptimized(
  elements: FiveElement[],
): ChineseCharacter[] {
  const index = getIndex();
  const result: ChineseCharacter[] = [];

  for (const element of elements) {
    const chars = index.byElement.get(element);
    if (chars) {
      result.push(...chars);
    }
  }

  return result;
}

/**
 * Get characters by pinyin
 */
export function getCharactersByPinyin(pinyin: string): ChineseCharacter[] {
  const index = getIndex();
  return index.byPinyin.get(pinyin.toLowerCase()) || [];
}

/**
 * Filter characters with optimized filtering
 */
export function filterCharactersOptimized(
  predicate: (char: ChineseCharacter) => boolean,
  maxResults?: number,
): ChineseCharacter[] {
  const index = getIndex();
  const result: ChineseCharacter[] = [];

  for (const char of index.byChar.values()) {
    if (predicate(char)) {
      result.push(char);
      if (maxResults && result.length >= maxResults) {
        break;
      }
    }
  }

  return result;
}

/**
 * Batch get characters by array of char strings
 */
export function getCharactersBatch(chars: string[]): ChineseCharacter[] {
  const index = getIndex();
  const result: ChineseCharacter[] = [];

  for (const char of chars) {
    const found = index.byChar.get(char);
    if (found) {
      result.push(found);
    }
  }

  return result;
}

// ============================================================================
// Fast Character Set Precomputation
// ============================================================================

/**
 * Precomputed character sets for common queries
 */
const COMMON_SETS = {
  feminine: new Set<string>([
    "嘉",
    "慧",
    "雅",
    "颖",
    "悦",
    "婷",
    "涵",
    "淑",
    "瑶",
    "琪",
    "萱",
    "欣",
    "怡",
    "诗",
    "梦",
    "思",
    "语",
    "晴",
    "澜",
    "美",
    "秀",
    "文",
    "静",
    "清",
    "柔",
    "婉",
    "琳",
    "瑜",
    "媛",
    "莉",
    "芳",
    "芸",
    "菲",
    "薇",
    "蕾",
    "荷",
    "莲",
    "梅",
    "兰",
    "竹",
    "菊",
    "桂",
    "芬",
    "月",
    "星",
    "云",
    "霞",
    "露",
    "霜",
    "雪",
    "冰",
    "玉",
    "珍",
    "珠",
    "琼",
    "娟",
    "娜",
    "娅",
    "婕",
    "娴",
    "婉",
    "嫣",
    "妍",
    "妮",
    "姗",
    "姣",
    "姿",
    "娇",
    "娥",
  ]),

  masculine: new Set<string>([
    "杰",
    "强",
    "伟",
    "刚",
    "磊",
    "浩",
    "宇",
    "轩",
    "博",
    "涛",
    "鹏",
    "志",
    "俊",
    "文",
    "华",
    "明",
    "宏",
    "毅",
    "豪",
    "雄",
    "勇",
    "威",
    "武",
    "坚",
    "健",
    "力",
    "锋",
    "昊",
    "天",
    "宸",
    "辰",
    "晨",
    "阳",
    "煜",
    "炎",
    "烈",
    "焕",
    "耀",
    "曜",
    "晖",
    "辉",
  ]),

  positiveKeywords: new Set<string>([
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
  ]),

  negativeKeywords: new Set<string>([
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
    "臭",
    "烂",
    "坏",
    "差",
  ]),

  feminineRadicals: /[女艹氵玉月]/,
  masculineRadicals: /[力山火日]/,
};

/**
 * Fast check if character is typically feminine
 */
export function isFeminineCharacter(char: ChineseCharacter): boolean {
  return (
    COMMON_SETS.feminine.has(char.char) ||
    Array.from(COMMON_SETS.positiveKeywords).some((kw) =>
      char.meaning.includes(kw),
    ) ||
    COMMON_SETS.feminineRadicals.test(char.char)
  );
}

/**
 * Fast check if character is typically masculine
 */
export function isMasculineCharacter(char: ChineseCharacter): boolean {
  return (
    COMMON_SETS.masculine.has(char.char) ||
    Array.from(COMMON_SETS.positiveKeywords).some((kw) =>
      char.meaning.includes(kw),
    ) ||
    COMMON_SETS.masculineRadicals.test(char.char)
  );
}

/**
 * Fast check if character has positive meaning
 */
export function hasPositiveMeaning(char: ChineseCharacter): boolean {
  return Array.from(COMMON_SETS.positiveKeywords).some((kw) =>
    char.meaning.includes(kw),
  );
}

/**
 * Fast check if character has negative meaning
 */
export function hasNegativeMeaning(char: ChineseCharacter): boolean {
  return Array.from(COMMON_SETS.negativeKeywords).some((kw) =>
    char.meaning.includes(kw),
  );
}

// ============================================================================
// Character Score Cache
// ============================================================================

interface CharacterScoreCache {
  meaningScore: number;
  positiveBonus: number;
  hasNegative: boolean;
}

const characterScoreCache = new Map<string, CharacterScoreCache>();

/**
 * Get cached character score or compute it
 */
export function getCharacterMeaningScore(char: ChineseCharacter): number {
  const cached = characterScoreCache.get(char.char);
  if (cached) {
    return cached.meaningScore;
  }

  let score = 60; // Base score

  if (hasPositiveMeaning(char)) {
    score += 20;
  }

  if (hasNegativeMeaning(char)) {
    score -= 30;
  }

  // Frequency factor
  if (char.frequency > 0 && char.frequency < 100) {
    score -= 5; // Too common
  } else if (char.frequency >= 100 && char.frequency < 1000) {
    score += 15; // Good frequency
  } else if (char.frequency >= 1000 && char.frequency < 3000) {
    score += 10; // Acceptable
  } else if (char.frequency > 5000) {
    score -= 10; // Too rare
  }

  // HSK level factor
  if (char.hskLevel && char.hskLevel <= 4) {
    score += 10;
  } else if (char.hskLevel && char.hskLevel > 5) {
    score -= 5;
  }

  const cacheEntry: CharacterScoreCache = {
    meaningScore: Math.max(0, Math.min(100, score)),
    positiveBonus: hasPositiveMeaning(char) ? 20 : 0,
    hasNegative: hasNegativeMeaning(char),
  };

  characterScoreCache.set(char.char, cacheEntry);
  return cacheEntry.meaningScore;
}

// ============================================================================
// Index Statistics
// ============================================================================

/**
 * Get index statistics
 */
export function getIndexStats(): {
  totalCharacters: number;
  byElement: Record<FiveElement, number>;
  indexLoaded: boolean;
} {
  const index = getIndex();
  const stats = {
    totalCharacters: index.byChar.size,
    byElement: {} as Record<FiveElement, number>,
    indexLoaded: true,
  };

  for (const [element, chars] of index.byElement) {
    stats.byElement[element] = chars.length;
  }

  return stats;
}

/**
 * Clear all caches
 */
export function clearCharacterCache(): void {
  characterScoreCache.clear();
}
