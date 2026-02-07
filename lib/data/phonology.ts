/**
 * Chinese Phonology for Naming (音韵学)
 *
 * Contains tone patterns, rhyme compatibility, and phonetic harmony rules
 * for Chinese name generation.
 */

export type Tone = 1 | 2 | 3 | 4; // Four tones in Mandarin
export type ToneCategory = "平" | "仄"; // Level vs Oblique tones

/**
 * Tone classification
 * Level tones (平): 1st (yin flat), 2nd (yang flat)
 * Oblique tones (仄): 3rd (rising), 4th (falling)
 */
export const TONE_CATEGORIES: Record<Tone, ToneCategory> = {
  1: "平",
  2: "平",
  3: "仄",
  4: "仄",
};

/**
 * Vowel final categories for rhyme analysis
 * Based on Chinese phonology (十三辙 - 13 rhyme categories)
 */
export const FINAL_CATEGORIES = {
  // 发花辙 - a, ia, ua
  faHua: ["a", "ia", "ua"],
  // 梭波辙 - o, e, uo
  suoBo: ["o", "e", "uo"],
  // 乜斜辙 - ie, ue
  mieXie: ["ie", "ue"],
  // 一七辙 - i, v, er
  yiQi: ["i", "v", "er"],
  // 姑苏辙 - u
  guSu: ["u"],
  // 怀来辙 - ai, uai
  huaiLai: ["ai", "uai"],
  // 灰堆辙 - ei, ui
  huiDui: ["ei", "ui"],
  // 遥条辙 - ao, iao
  yaoTiao: ["ao", "iao"],
  // 油求辙 - ou, iu
  youQiu: ["ou", "iu"],
  // 言前辙 - an, ian, uan, van
  yanQian: ["an", "ian", "uan", "van"],
  // 人辰辙 - en, in, un, vn
  renChen: ["en", "in", "un", "vn"],
  // 江阳辙 - ang, iang, uang
  jiangYang: ["ang", "iang", "uang"],
  // 中东辙 - eng, ing, ong, iong
  zhongDong: ["eng", "ing", "ong", "iong"],
};

/**
 * Get final category for a pinyin syllable
 */
export function getFinalCategory(pinyin: string): string | null {
  const final = pinyin.slice(1).replace(/^[aeiou]/, "");
  for (const [category, finals] of Object.entries(FINAL_CATEGORIES)) {
    if (finals.some((f) => final.endsWith(f) || final === f)) {
      return category;
    }
  }
  return null;
}

/**
 * Check if two finals rhyme (belong to same category)
 */
export function isRhyme(pinyin1: string, pinyin2: string): boolean {
  const cat1 = getFinalCategory(pinyin1);
  const cat2 = getFinalCategory(pinyin2);
  return cat1 !== null && cat1 === cat2;
}

/**
 * Tone harmony patterns (声调搭配)
 * Good combinations for pleasant rhythm
 */
export const TONE_PATTERNS: Array<{
  pattern: number[];
  name: string;
  description: string;
  score: number;
}> = [
  {
    pattern: [1, 3, 1],
    name: "平平仄平",
    description: "First character level, third oblique, last level - melodious",
    score: 95,
  },
  {
    pattern: [2, 1, 4],
    name: "阳平阴平去",
    description: "Rising then level then falling - strong rhythm",
    score: 92,
  },
  {
    pattern: [1, 2, 4],
    name: "平阳去",
    description: "Level, rising, falling - expressive",
    score: 90,
  },
  {
    pattern: [3, 1, 2],
    name: "仄平平",
    description: "Oblique, level, rising - gentle start",
    score: 88,
  },
  {
    pattern: [4, 1, 3],
    name: "去平仄",
    description: "Falling, level, rising - dramatic",
    score: 87,
  },
  {
    pattern: [1, 4, 2],
    name: "平去阳",
    description: "Level, falling, rising - balanced",
    score: 86,
  },
  {
    pattern: [2, 3, 1],
    name: "阳仄平",
    description: "Rising, oblique, level - flowing",
    score: 85,
  },
];

/**
 * Poor tone patterns to avoid (poor rhythm)
 */
export const AVOID_TONE_PATTERNS: number[][] = [
  [4, 4, 4], // All falling - too harsh
  [3, 3, 3], // All rising - monotonous
  [1, 1, 1], // All level flat - lacks energy
  [4, 4], // Double falling in two-character name
];

/**
 * Consonant combinations to avoid (difficult to pronounce)
 */
export const AVOID_CONSONANT_CLUSTERS: string[][] = [
  ["zh", "zh"], // 庄周 - too many retroflex
  ["sh", "sh"],
  ["ch", "ch"],
  ["z", "z"], // 资紫 - too many dental sibilants
  ["c", "c"],
  ["s", "s"],
  ["j", "j"], // 基济 - too many palatals
  ["q", "q"],
  ["x", "x"],
];

/**
 * Homophone combinations to avoid (sounds like inappropriate words)
 */
export const AVOID_HOMOPHONES: Array<{
  pinyin: string;
  meaning: string;
  reason: string;
}> = [
  { pinyin: "wang ba", meaning: "turtle", reason: "negative connotation" },
  { pinyin: "si", meaning: "death", reason: "inauspicious" },
  { pinyin: "kui", meaning: "lose", reason: "negative meaning" },
  { pinyin: "duan", meaning: "break", reason: "negative meaning" },
  { pinyin: "bing", meaning: "sick", reason: "inauspicious" },
  { pinyin: " mei", meaning: "no/without", reason: "negative" },
  { pinyin: "cao", meaning: "grass/vulgar", reason: "potential vulgarity" },
];

/**
 * Auspicious sound combinations (pleasant to hear)
 */
export const AUSPICIOUS_COMBINATIONS: Array<{
  pattern: string;
  description: string;
}> = [
  { pattern: "ling", description: " tinkling sound (bell)" },
  { pattern: "yu", description: "gentle, soft sound" },
  { pattern: "xi", description: "happy, bright sound" },
  { pattern: "an", description: "peaceful, stable sound" },
  { pattern: "jia", description: "excellent, praised sound" },
  { pattern: "hua", description: "magnificent sound" },
  { pattern: "yun", description: "rhyming, harmonious sound" },
  { pattern: "xin", description: "new, fresh sound" },
  { pattern: "yi", description: "meaningful, joyful sound" },
  { pattern: "ze", description: "brilliant, lustrous sound" },
];

/**
 * Name ending sounds (final character preferences)
 * Sounds that create good closure for names
 */
export const GOOD_ENDING_SOUNDS = {
  preferred: [
    "an", // 安然, peaceful
    "ing", // 宁静, tranquil
    "en", // 温和, gentle
    "yu", // 舒畅, smooth
    "hua", // 光华, bright
    "xin", // 欣欣, joyful
    "yi", // 诗意, poetic
    "yun", // 韵律, rhythmic
  ],
  avoid: [
    "si", // 死, death
    "kui", // 亏, loss
    "dui", // 对, confrontation
    "bi", // 闭, closed
    "mo", // 末, end
  ],
};

/**
 * Check if a name has good phonetic qualities
 */
export function checkNamePhonetics(
  surnamePinyin: string,
  givenNamePinyin: string[],
): {
  score: number;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Get tones
  const surnameTone = extractTone(surnamePinyin);
  const nameTones = givenNamePinyin.map(extractTone);

  // Check tone pattern
  const fullPattern = [surnameTone, ...nameTones];
  if (
    AVOID_TONE_PATTERNS.some(
      (p) =>
        p.length === nameTones.length &&
        JSON.stringify(p) === JSON.stringify(nameTones),
    )
  ) {
    score -= 20;
    warnings.push("Tone pattern lacks variety");
  }

  // Check for good tone pattern
  const namePattern = nameTones;
  const matchingPattern = TONE_PATTERNS.find(
    (p) => JSON.stringify(p.pattern) === JSON.stringify(namePattern),
  );
  if (matchingPattern) {
    score += Math.floor((matchingPattern.score - 80) / 2);
    suggestions.push(`Good tone pattern: ${matchingPattern.name}`);
  }

  // Check consonant clusters
  const allPinyin = [surnamePinyin, ...givenNamePinyin];
  for (let i = 0; i < allPinyin.length - 1; i++) {
    const initial1 = extractInitial(allPinyin[i]);
    const initial2 = extractInitial(allPinyin[i + 1]);
    if (
      AVOID_CONSONANT_CLUSTERS.some(
        (c) => c[0] === initial1 && c[1] === initial2,
      )
    ) {
      score -= 10;
      warnings.push(`Difficult consonant cluster: ${initial1}${initial2}`);
    }
  }

  // Check homophone issues
  const fullName = givenNamePinyin.join("");
  for (const bad of AVOID_HOMOPHONES) {
    if (fullName.includes(bad.pinyin) || fullName === bad.pinyin) {
      score -= 30;
      warnings.push(`Sounds like: ${bad.meaning} (${bad.reason})`);
    }
  }

  // Check ending sound
  const lastChar = givenNamePinyin[givenNamePinyin.length - 1];
  if (GOOD_ENDING_SOUNDS.preferred.some((s) => lastChar.endsWith(s))) {
    score += 5;
  } else if (GOOD_ENDING_SOUNDS.avoid.some((s) => lastChar.endsWith(s))) {
    score -= 5;
    warnings.push("Ending sound has negative connotations");
  }

  // Check for alliteration (repeated initials) - can be good or bad
  const initials = allPinyin.map(extractInitial);
  const uniqueInitials = new Set(initials);
  if (uniqueInitials.size === 1) {
    score -= 15;
    warnings.push("Too much alliteration, difficult to pronounce");
  } else if (uniqueInitials.size === 2) {
    score += 3;
    suggestions.push("Moderate alliteration adds rhythm");
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    warnings,
    suggestions,
  };
}

/**
 * Extract tone from pinyin (returns tone number 1-4)
 */
function extractTone(pinyin: string): Tone {
  const toneMatch = pinyin.match(/[1-4]/);
  if (toneMatch) {
    return parseInt(toneMatch[0]) as Tone;
  }
  // Common tone mappings for pinyin without tone marks
  // This is a simplified approach - actual implementation would need tone database
  return 1; // Default to first tone
}

/**
 * Extract initial consonant from pinyin
 */
function extractInitial(pinyin: string): string {
  const initials = [
    "zh",
    "ch",
    "sh",
    "b",
    "p",
    "m",
    "f",
    "d",
    "t",
    "n",
    "l",
    "g",
    "k",
    "h",
    "j",
    "q",
    "x",
    "r",
    "z",
    "c",
    "s",
    "w",
    "y",
  ];
  const lowerPinyin = pinyin.toLowerCase().replace(/[1-4]/g, "");
  for (const initial of initials) {
    if (lowerPinyin.startsWith(initial)) {
      return initial;
    }
  }
  return "";
}

/**
 * Get tone category (平/仄)
 */
export function getToneCategory(tone: Tone): ToneCategory {
  return TONE_CATEGORIES[tone];
}

/**
 * Check if tone pattern has good balance of 平 and 仄
 */
export function hasToneBalance(tones: Tone[]): boolean {
  const categories = tones.map((t) => getToneCategory(t));
  const pingCount = categories.filter((c) => c === "平").length;
  const zeCount = categories.filter((c) => c === "仄").length;

  // Good balance is not all same
  return pingCount > 0 && zeCount > 0;
}

/**
 * Traditional tonal patterns for names
 * Based on classical prosody
 */
export const TRADITIONAL_PATTERNS = {
  /**
   * 平起式 - starts with level tone
   */
  levelStart: {
    threeChars: ["平平仄", "平仄平", "平仄仄"],
    twoChars: ["平平", "平仄"],
  },
  /**
   * 仄起式 - starts with oblique tone
   */
  obliqueStart: {
    threeChars: ["仄仄平", "仄平平", "仄平仄"],
    twoChars: ["仄平", "仄仄"],
  },
};

/**
 * Euphony (悦耳) combinations
 * Pairs of sounds that go well together
 */
export const EUPHONY_PAIRS: Array<{
  sound1: string;
  sound2: string;
  description: string;
}> = [
  { sound1: "l", sound2: "ing", description: "ling - clear, bell-like" },
  { sound1: "x", sound2: "i", description: "xi - refined, elegant" },
  { sound1: "y", sound2: "u", description: "yu - gentle, flowing" },
  { sound1: "j", sound2: "ia", description: "jia - excellent, fine" },
  { sound1: "zh", sound2: "en", description: "zhen - precious" },
  { sound1: "m", sound2: "ing", description: "ming - bright" },
  { sound1: "h", sound2: "ua", description: "hua - magnificent" },
  { sound1: "t", sound2: "ao", description: "tao - waves" },
];
