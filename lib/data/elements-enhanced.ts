/**
 * Enhanced Five Elements (五行) Data
 *
 * Comprehensive information about the Five Elements:
 * - Seasonal associations
 * - Body organ correspondences
 * - Emotional associations
 * - Naming recommendations
 * - Character examples
 *
 * References:
 * - 《黄帝内经》中华书局，2010
 * - 《五行大义》上海古籍出版社，2015
 * - 《中医基础理论》中国中医药出版社，2018
 */

import type { FiveElement } from "../types";

export interface ElementInfoEnhanced {
  en: string;
  ja: string;
  ko: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  description: { zh: string; en: string; ja: string; ko: string };
  characteristics: {
    zh: string[];
    en: string[];
    ja: string[];
    ko: string[];
  };
  compatibleElements: FiveElement[];
  incompatibleElements: FiveElement[];
  // Enhanced fields
  suitableNameMeanings: {
    zh: string[];
    en: string[];
  };
  namingAdvice: {
    zh: string;
    en: string;
  };
  famousCharacters: {
    char: string;
    meaning: string;
  }[];
  season: string;
  seasonEn: string;
  direction: string;
  directionEn: string;
  colorAssociation: string;
  colorEn: string;
  bodyOrgan: { zh: string; en: string };
  emotion: { zh: string; en: string };
  virtues: { zh: string[]; en: string[] };
  planet: { zh: string; en: string };
  hour: string;
}

export const FIVE_ELEMENTS_ENHANCED: Record<FiveElement, ElementInfoEnhanced> =
  {
    金: {
      en: "Metal",
      ja: "金",
      ko: "금",
      color: "from-yellow-400 to-amber-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-800 dark:text-yellow-200",
      icon: "金",
      description: {
        zh: "金代表坚硬、锐利、变革。金性人通常意志坚定，果断刚毅，处事果断，有领导力。金对应秋季，象征收获与成熟。",
        en: "Metal represents hardness, sharpness, and transformation. People with strong Metal element are determined, decisive, and natural leaders. Metal corresponds to autumn, symbolizing harvest and maturity.",
        ja: "金は硬さ、鋭さ、変革を表します。金の要素が強い人は意志が強く、決断力があり、自然的なリーダーシップを発揮します。金は秋に対応し、収穫と成熟を象徴します。",
        ko: "금은 강함, 날카로움, 변혁을 나타냅니다. 금의 요소가 강한 사람은 의지가 강하고 결단력이 있으며 자연스러운 리더십을 발휘합니다. 금은 가을에 해당하며 수확과 성숙을 상징합니다.",
      },
      characteristics: {
        zh: ["刚毅果断", "威严正直", "改革创新", "义气豪爽"],
        en: ["Determined", "Authoritative", "Innovative", "Righteous"],
        ja: ["意志が強い", "威厳がある", "革新的", "義理堅い"],
        ko: ["의지가 강함", "위엄 있음", "혁신적", "의리 있음"],
      },
      compatibleElements: ["水", "土"],
      incompatibleElements: ["火"],
      suitableNameMeanings: {
        zh: [
          "珍贵",
          "坚固",
          "明亮",
          "锋利",
          "纯洁",
          "钟",
          "钰",
          "铭",
          "锐",
          "铮",
        ],
        en: ["Precious", "Strong", "Bright", "Sharp", "Pure"],
      },
      namingAdvice: {
        zh: "金行适合的字：钟、钰、铭、锐、铮、锦、钱、银、钧、鉴等。适合与水、土行搭配使用，避免与火行冲突。",
        en: "Suitable Metal characters: 钟, 钰, 铭, 锐, 铮, 锦, 钱, 银, 钧, 鉴. Best paired with Water and Earth elements, avoid Fire.",
      },
      famousCharacters: [
        { char: "钟", meaning: "钟表，重视" },
        { char: "钰", meaning: "珍宝，坚硬" },
        { char: "铭", meaning: "铭记，铭刻" },
        { char: "锐", meaning: "锐利，进取" },
        { char: "锦", meaning: "锦绣，美好" },
      ],
      season: "秋季",
      seasonEn: "Autumn",
      direction: "西方",
      directionEn: "West",
      colorAssociation: "白色、金色",
      colorEn: "White, Gold",
      bodyOrgan: { zh: "肺、大肠", en: "Lungs, Large Intestine" },
      emotion: { zh: "悲、忧", en: "Grief, Melancholy" },
      virtues: {
        zh: ["义", "刚", "节"],
        en: ["Righteousness", "Firmness", "Integrity"],
      },
      planet: { zh: "太白金星", en: "Venus" },
      hour: "15:00-19:00 (申时-酉时)",
    },
    木: {
      en: "Wood",
      ja: "木",
      ko: "목",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-800 dark:text-green-200",
      icon: "木",
      description: {
        zh: "木代表生长、仁爱、向上。木性人性格温和，富有同情心，追求成长，有创造力。木对应春季，象征生机与希望。",
        en: "Wood represents growth, benevolence, and upward movement. People with strong Wood element are gentle, compassionate, and creative. Wood corresponds to spring, symbolizing vitality and hope.",
        ja: "木は成長、仁愛、上向きな動きを表します。木の要素が強い人は穏やかで、同情心が豊かで、創造的です。木は春に対応し、生命力と希望を象徴します。",
        ko: "목은 성장, 인애, 상승을 나타냅니다. 목의 요소가 강한 사람은 온화하고 동정심이 풍부하며 창의적입니다. 목은 봄에 해당하며 생명력과 희망을 상징합니다.",
      },
      characteristics: {
        zh: ["仁爱温和", "向上生长", "富有创造力", "坚韧不拔"],
        en: ["Benevolent", "Growth-oriented", "Creative", "Resilient"],
        ja: ["仁愛", "成長志向", "創造的", "しなやか"],
        ko: ["인애", "성장 지향", "창의적", "강인함"],
      },
      compatibleElements: ["水", "火"],
      incompatibleElements: ["金"],
      suitableNameMeanings: {
        zh: [
          "生长",
          "仁爱",
          "正直",
          "栋梁",
          "森林",
          "梓",
          "楠",
          "柯",
          "松",
          "柏",
        ],
        en: ["Growth", "Benevolence", "Upright", "Pillar", "Forest"],
      },
      namingAdvice: {
        zh: "木行适合的字：梓、楠、柯、松、柏、林、森、栋、梁、材等。适合与水、火行搭配使用，避免与金行冲突。",
        en: "Suitable Wood characters: 梓, 楠, 柯, 松, 柏, 林, 森, 栋, 梁, 材. Best paired with Water and Fire elements, avoid Metal.",
      },
      famousCharacters: [
        { char: "梓", meaning: "梓树，故乡" },
        { char: "楠", meaning: "楠木，珍贵" },
        { char: "柯", meaning: "枝条，法则" },
        { char: "松", meaning: "松树，坚贞" },
        { char: "柏", meaning: "柏树，长寿" },
      ],
      season: "春季",
      seasonEn: "Spring",
      direction: "东方",
      directionEn: "East",
      colorAssociation: "青色、绿色",
      colorEn: "Cyan, Green",
      bodyOrgan: { zh: "肝、胆", en: "Liver, Gallbladder" },
      emotion: { zh: "怒", en: "Anger" },
      virtues: {
        zh: ["仁", "慈", "和"],
        en: ["Benevolence", "Kindness", "Harmony"],
      },
      planet: { zh: "岁星 (木星)", en: "Jupiter" },
      hour: "05:00-07:00 (卯时)",
    },
    水: {
      en: "Water",
      ja: "水",
      ko: "수",
      color: "from-blue-400 to-cyan-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-800 dark:text-blue-200",
      icon: "水",
      description: {
        zh: "水代表智慧、流动、适应。水性人聪明灵活，善于变通，富有智慧，适应力强。水对应冬季，象征沉淀与积累。",
        en: "Water represents wisdom, flow, and adaptability. People with strong Water element are intelligent, flexible, and highly adaptable. Water corresponds to winter, symbolizing accumulation and depth.",
        ja: "水は知恵、流れ、適応を表します。水の要素が強い人は賢く、柔軟で、適応力が高いです。水は冬に対応し、蓄積と深さを象徴します。",
        ko: "수는 지혜, 흐름, 적응을 나타냅니다. 수의 요소가 강한 사람은 지능적이고 유연하며 적응력이 높습니다. 수는 겨울에 해당하며 축적과 깊이를 상징합니다.",
      },
      characteristics: {
        zh: ["智慧聪明", "灵活变通", "深邃内敛", "包容万物"],
        en: ["Wise", "Flexible", "Deep", "Inclusive"],
        ja: ["賢明", "柔軟", "深遠", "包容力"],
        ko: ["지혜", "유연함", "깊이", "포용력"],
      },
      compatibleElements: ["金", "木"],
      incompatibleElements: ["土"],
      suitableNameMeanings: {
        zh: [
          "智慧",
          "清澈",
          "流动",
          "深邃",
          "浩瀚",
          "涵",
          "泽",
          "清",
          "浩",
          "渊",
          "淳",
        ],
        en: ["Wisdom", "Clear", "Flow", "Deep", "Vast"],
      },
      namingAdvice: {
        zh: "水行适合的字：涵、泽、清、浩、渊、淳、源、溪、润、沐等。适合与金、木行搭配使用，避免与土行冲突。",
        en: "Suitable Water characters: 涵, 泽, 清, 浩, 渊, 淳, 源, 溪, 润, 沐. Best paired with Metal and Wood elements, avoid Earth.",
      },
      famousCharacters: [
        { char: "涵", meaning: "包容，涵养" },
        { char: "泽", meaning: "恩泽，滋润" },
        { char: "清", meaning: "清澈，纯洁" },
        { char: "浩", meaning: "浩大，广阔" },
        { char: "渊", meaning: "深渊，深厚" },
      ],
      season: "冬季",
      seasonEn: "Winter",
      direction: "北方",
      directionEn: "North",
      colorAssociation: "黑色、蓝色",
      colorEn: "Black, Blue",
      bodyOrgan: { zh: "肾、膀胱", en: "Kidneys, Bladder" },
      emotion: { zh: "恐", en: "Fear" },
      virtues: {
        zh: ["智", "慧", "谋"],
        en: ["Wisdom", "Intelligence", "Strategy"],
      },
      planet: { zh: "辰星 (水星)", en: "Mercury" },
      hour: "21:00-01:00 (亥时-子时)",
    },
    火: {
      en: "Fire",
      ja: "火",
      ko: "화",
      color: "from-red-400 to-orange-500",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-800 dark:text-red-200",
      icon: "火",
      description: {
        zh: "火代表热情、光明、礼仪。火性人热情开朗，充满活力，待人礼貌，有感染力。火对应夏季，象征热烈与繁盛。",
        en: "Fire represents passion, brightness, and etiquette. People with strong Fire element are passionate, energetic, and charismatic. Fire corresponds to summer, symbolizing passion and prosperity.",
        ja: "火は情熱、輝き、礼儀を表します。火の要素が強い人は情熱的で活気があり、人を惹きつけます。火は夏に対応し、情熱と繁栄を象徴します。",
        ko: "화는 열정, 밝음, 예의를 나타냅니다. 화의 요소가 강한 사람은 열정적이고 활력이 있으며 매력적입니다. 화는 여름에 해당하며 열정과 번영을 상징합니다.",
      },
      characteristics: {
        zh: ["热情开朗", "光明磊落", "礼仪文明", "充满活力"],
        en: ["Passionate", "Bright", "Courteous", "Energetic"],
        ja: ["情熱的", "明るい", "礼儀正しい", "活気"],
        ko: ["열정적", "밝음", "예의 바름", "활력"],
      },
      compatibleElements: ["木", "土"],
      incompatibleElements: ["水"],
      suitableNameMeanings: {
        zh: [
          "热情",
          "光明",
          "温暖",
          "繁荣",
          "辉煌",
          "焕",
          "灿",
          "炜",
          "煜",
          "烁",
          "暖",
        ],
        en: ["Passion", "Bright", "Warm", "Prosperity", "Brilliance"],
      },
      namingAdvice: {
        zh: "火行适合的字：焕、灿、炜、煜、烁、暖、曦、昊、炎、烨等。适合与木、土行搭配使用，避免与水行冲突。",
        en: "Suitable Fire characters: 焕, 灿, 炜, 煜, 烁, 暖, 曦, 昊, 炎, 烨. Best paired with Wood and Earth elements, avoid Water.",
      },
      famousCharacters: [
        { char: "焕", meaning: "焕发，光明" },
        { char: "灿", meaning: "灿烂，明亮" },
        { char: "炜", meaning: "光辉，鲜明" },
        { char: "煜", meaning: "照耀，光辉" },
        { char: "暖", meaning: "温暖，暖心" },
      ],
      season: "夏季",
      seasonEn: "Summer",
      direction: "南方",
      directionEn: "South",
      colorAssociation: "红色",
      colorEn: "Red",
      bodyOrgan: { zh: "心、小肠", en: "Heart, Small Intestine" },
      emotion: { zh: "喜", en: "Joy" },
      virtues: {
        zh: ["礼", "诚", "信"],
        en: ["Etiquette", "Sincerity", "Trust"],
      },
      planet: { zh: "荧惑 (火星)", en: "Mars" },
      hour: "11:00-15:00 (午时)",
    },
    土: {
      en: "Earth",
      ja: "土",
      ko: "토",
      color: "from-amber-400 to-yellow-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-800 dark:text-amber-200",
      icon: "土",
      description: {
        zh: "土代表诚信、稳重、包容。土性人诚实可靠，做事稳重，值得信赖，包容力强。土对应季夏（长夏），象征承载与孕育。",
        en: "Earth represents trustworthiness, stability, and tolerance. People with strong Earth element are honest, reliable, and tolerant. Earth corresponds to late summer, symbolizing support and nurturing.",
        ja: "土は誠実、安定、包容を表します。土の要素が強い人は誠実で信頼でき、包容力があります。土は晩夏に対応し、支持と育成を象徴します。",
        ko: "토는 성실, 안정, 포용을 나타냅니다. 토의 요소가 강한 사람은 성실하고 신뢰할 수 있으며 포용력이 있습니다. 토는 늦여름에 해당하며 지지와 육성을 상징합니다.",
      },
      characteristics: {
        zh: ["诚实守信", "稳重踏实", "包容厚德", "可靠稳重"],
        en: ["Honest", "Stable", "Tolerant", "Reliable"],
        ja: ["誠実", "安定", "包容力", "信頼"],
        ko: ["성실", "안정", "포용력", "신뢰"],
      },
      compatibleElements: ["火", "金"],
      incompatibleElements: ["木"],
      suitableNameMeanings: {
        zh: [
          "稳重",
          "包容",
          "诚信",
          "承载",
          "厚德",
          "坤",
          "坦",
          "培",
          "基",
          "域",
          "垚",
        ],
        en: ["Stability", "Tolerance", "Honesty", "Support", "Virtue"],
      },
      namingAdvice: {
        zh: "土行适合的字：坤、坦、培、基、域、垚、佳、均、坚、圣等。适合与火、金行搭配使用，避免与木行冲突。",
        en: "Suitable Earth characters: 坤, 坦, 培, 基, 域, 垚, 佳, 均, 坚, 圣. Best paired with Fire and Metal elements, avoid Wood.",
      },
      famousCharacters: [
        { char: "坤", meaning: "大地，厚德" },
        { char: "坦", meaning: "坦荡，平坦" },
        { char: "培", meaning: "培养，培育" },
        { char: "基", meaning: "基础，根基" },
        { char: "佳", meaning: "美好，优秀" },
      ],
      season: "季夏",
      seasonEn: "Late Summer",
      direction: "中央",
      directionEn: "Center",
      colorAssociation: "黄色",
      colorEn: "Yellow",
      bodyOrgan: { zh: "脾、胃", en: "Spleen, Stomach" },
      emotion: { zh: "思", en: "Thought" },
      virtues: { zh: ["信", "诚", "德"], en: ["Trust", "Honesty", "Virtue"] },
      planet: { zh: "镇星 (土星)", en: "Saturn" },
      hour: "13:00-15:00 (未时-申时)",
    },
  };

/**
 * Get element by season
 */
export function getElementBySeason(season: string): FiveElement | undefined {
  const seasonMap: Record<string, FiveElement> = {
    spring: "木",
    summer: "火",
    autumn: "金",
    winter: "水",
    lateSummer: "土",
    春季: "木",
    夏季: "火",
    秋季: "金",
    冬季: "水",
    季夏: "土",
  };
  return seasonMap[season];
}

/**
 * Get elements by personality traits
 */
export function getElementsByTrait(trait: string): FiveElement[] {
  const traitMap: Record<string, FiveElement[]> = {
    determined: ["金"],
    creative: ["木", "水"],
    wise: ["水"],
    passionate: ["火"],
    honest: ["土"],
    reliable: ["土", "金"],
    gentle: ["木", "水"],
    energetic: ["火"],
    decisive: ["金", "火"],
    // Chinese traits
    坚定: ["金"],
    创造: ["木", "水"],
    智慧: ["水"],
    热情: ["火"],
    诚实: ["土"],
    温和: ["木", "水"],
  };
  return traitMap[trait] || [];
}

/**
 * Get balanced elements for a person
 * Calculate what elements can strengthen or weaken a given element
 */
export function getElementBalance(element: FiveElement): {
  strengthens: FiveElement;
  strengthenedBy: FiveElement;
  weakens: FiveElement;
  weakenedBy: FiveElement;
  description: { zh: string; en: string };
} {
  const cycles: Record<
    FiveElement,
    {
      strengthens: FiveElement;
      strengthenedBy: FiveElement;
      weakens: FiveElement;
      weakenedBy: FiveElement;
    }
  > = {
    金: {
      strengthens: "水",
      strengthenedBy: "土",
      weakens: "木",
      weakenedBy: "火",
    },
    木: {
      strengthens: "火",
      strengthenedBy: "水",
      weakens: "土",
      weakenedBy: "金",
    },
    水: {
      strengthens: "木",
      strengthenedBy: "金",
      weakens: "火",
      weakenedBy: "土",
    },
    火: {
      strengthens: "土",
      strengthenedBy: "木",
      weakens: "金",
      weakenedBy: "水",
    },
    土: {
      strengthens: "金",
      strengthenedBy: "火",
      weakens: "水",
      weakenedBy: "木",
    },
  };

  const descriptions: Record<string, { zh: string; en: string }> = {
    "金-水": {
      zh: "金生水：金能化水，金为水之源",
      en: "Metal generates Water: Metal transforms into Water",
    },
    "水-木": {
      zh: "水生木：水能滋养树木",
      en: "Water generates Wood: Water nourishes plants",
    },
    "木-火": {
      zh: "木生火：木能燃烧生火",
      en: "Wood generates Fire: Wood fuels fire",
    },
    "火-土": {
      zh: "火生土：火燃烧后化为灰土",
      en: "Fire generates Earth: Fire becomes ash",
    },
    "土-金": {
      zh: "土生金：土中蕴藏金属",
      en: "Earth generates Metal: Earth contains metal",
    },
  };

  const cycle = cycles[element];
  const key = `${cycle.strengthenedBy}-${element}`;

  return {
    strengthens: cycle.strengthens,
    strengthenedBy: cycle.strengthenedBy,
    weakens: cycle.weakens,
    weakenedBy: cycle.weakenedBy,
    description: descriptions[key] || { zh: "", en: "" },
  };
}

/**
 * Get recommended characters for an element
 */
export function getCharactersForElement(element: FiveElement): string[] {
  const elementChars: Record<FiveElement, string[]> = {
    金: [
      "钟",
      "钰",
      "铭",
      "锐",
      "铮",
      "锦",
      "钱",
      "银",
      "钧",
      "鉴",
      "铎",
      "钦",
      "钢",
      "铭",
      "铮",
    ],
    木: [
      "梓",
      "楠",
      "柯",
      "松",
      "柏",
      "林",
      "森",
      "栋",
      "梁",
      "材",
      "枫",
      "桐",
      "榆",
      "槐",
      "檀",
    ],
    水: [
      "涵",
      "泽",
      "清",
      "浩",
      "渊",
      "淳",
      "源",
      "溪",
      "润",
      "沐",
      "淑",
      "洁",
      "涵",
      "洋",
      "涛",
    ],
    火: [
      "焕",
      "灿",
      "炜",
      "煜",
      "烁",
      "暖",
      "曦",
      "昊",
      "炎",
      "烨",
      "灵",
      "灿",
      "烁",
      "煜",
      "炜",
    ],
    土: [
      "坤",
      "坦",
      "培",
      "基",
      "域",
      "垚",
      "佳",
      "均",
      "坚",
      "圣",
      "坤",
      "培",
      "堂",
      "墁",
      "垚",
    ],
  };
  return elementChars[element] || [];
}

/**
 * Get five elements interaction advice
 */
export function getFiveElementsAdvice(
  missingElements: FiveElement[],
  strongElements: FiveElement[],
): {
  zh: string;
  en: string;
  recommendations: FiveElement[];
} {
  const recommendations: FiveElement[] = [];

  // Add missing elements that are compatible
  missingElements.forEach((missing) => {
    const enhanced = FIVE_ELEMENTS_ENHANCED[missing];
    const compatible = enhanced.compatibleElements.some((e) =>
      strongElements.includes(e),
    );
    if (compatible || strongElements.length === 0) {
      recommendations.push(missing);
    }
  });

  return {
    zh: `根据五行分析，您五行中${missingElements.join("、")}较弱。建议补足${recommendations.join("、")}行，以达到五行平衡。`,
    en: `Based on Five Elements analysis, your ${missingElements.join(", ")} elements are weak. Consider adding ${recommendations.join(", ")} to achieve balance.`,
    recommendations,
  };
}
