import type { FiveElement } from "../types";

export type ElementInfo = {
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
};

export const FIVE_ELEMENTS: FiveElement[] = ["金", "木", "水", "火", "土"];

export const FIVE_ELEMENT_INFO: Record<FiveElement, ElementInfo> = {
  金: {
    en: "Metal",
    ja: "金",
    ko: "금",
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-800 dark:text-yellow-200",
    icon: "金",
    description: {
      zh: "金代表坚硬、锐利、变革。金性人通常意志坚定，果断刚毅，处事果断，有领导力。",
      en: "Metal represents hardness, sharpness, and transformation. People with strong Metal element are determined, decisive, and natural leaders.",
      ja: "金は硬さ、鋭さ、変革を表します。金の要素が強い人は意志が強く、決断力があり、自然的なリーダーシップを発揮します。",
      ko: "금은 강함, 날카로움, 변혁을 나타냅니다. 금의 요소가 강한 사람은 의지가 강하고 결단력이 있으며 자연스러운 리더십을 발휘합니다.",
    },
    characteristics: {
      zh: ["刚毅果断", "威严正直", "改革创新", "义气豪爽"],
      en: ["Determined", "Authoritative", "Innovative", "Righteous"],
      ja: ["意志が強い", "威厳がある", "革新的", "義理堅い"],
      ko: ["의지가 강함", "위엄 있음", "혁신적", "의리 있음"],
    },
    compatibleElements: ["水", "土"],
    incompatibleElements: ["火"],
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
      zh: "木代表生长、仁爱、向上。木性人性格温和，富有同情心，追求成长，有创造力。",
      en: "Wood represents growth, benevolence, and upward movement. People with strong Wood element are gentle, compassionate, and creative.",
      ja: "木は成長、仁愛、上向きな動きを表します。木の要素が強い人は穏やかで、同情心が豊かで、創造的です。",
      ko: "목은 성장, 인애, 상승을 나타냅니다. 목의 요소가 강한 사람은 온화하고 동정심이 풍부하며 창의적입니다.",
    },
    characteristics: {
      zh: ["仁爱温和", "向上生长", "富有创造力", "坚韧不拔"],
      en: ["Benevolent", "Growth-oriented", "Creative", "Resilient"],
      ja: ["仁愛", "成長志向", "創造的", "しなやか"],
      ko: ["인애", "성장 지향", "창의적", "강인함"],
    },
    compatibleElements: ["水", "火"],
    incompatibleElements: ["金"],
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
      zh: "水代表智慧、流动、适应。水性人聪明灵活，善于变通，富有智慧，适应力强。",
      en: "Water represents wisdom, flow, and adaptability. People with strong Water element are intelligent, flexible, and highly adaptable.",
      ja: "水は知恵、流れ、適応を表します。水の要素が強い人は賢く、柔軟で、適応力が高いです。",
      ko: "수는 지혜, 흐름, 적응을 나타냅니다. 수의 요소가 강한 사람은 지능적이고 유연하며 적응력이 높습니다.",
    },
    characteristics: {
      zh: ["智慧聪明", "灵活变通", "深邃内敛", "包容万物"],
      en: ["Wise", "Flexible", "Deep", "Inclusive"],
      ja: ["賢明", "柔軟", "深遠", "包容力"],
      ko: ["지혜", "유연함", "깊이", "포용력"],
    },
    compatibleElements: ["金", "木"],
    incompatibleElements: ["土"],
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
      zh: "火代表热情、光明、礼仪。火性人热情开朗，充满活力，待人礼貌，有感染力。",
      en: "Fire represents passion, brightness, and etiquette. People with strong Fire element are passionate, energetic, and charismatic.",
      ja: "火は情熱、輝き、礼儀を表します。火の要素が強い人は情熱的で活気があり、人を惹きつけます。",
      ko: "화는 열정, 밝음, 예의를 나타냅니다. 화의 요소가 강한 사람은 열정적이고 활력이 있으며 매력적입니다.",
    },
    characteristics: {
      zh: ["热情开朗", "光明磊落", "礼仪文明", "充满活力"],
      en: ["Passionate", "Bright", "Courteous", "Energetic"],
      ja: ["情熱的", "明るい", "礼儀正しい", "活気"],
      ko: ["열정적", "밝음", "예의 바름", "활력"],
    },
    compatibleElements: ["木", "土"],
    incompatibleElements: ["水"],
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
      zh: "土代表诚信、稳重、包容。土性人诚实可靠，做事稳重，值得信赖，包容力强。",
      en: "Earth represents trustworthiness, stability, and tolerance. People with strong Earth element are honest, reliable, and tolerant.",
      ja: "土は誠実、安定、包容を表します。土の要素が強い人は誠実で信頼でき、包容力があります。",
      ko: "토는 성실, 안정, 포용을 나타냅니다. 토의 요소가 강한 사람은 성실하고 신뢰할 수 있으며 포용력이 있습니다.",
    },
    characteristics: {
      zh: ["诚实守信", "稳重踏实", "包容厚德", "可靠稳重"],
      en: ["Honest", "Stable", "Tolerant", "Reliable"],
      ja: ["誠実", "安定", "包容力", "信頼"],
      ko: ["성실", "안정", "포용력", "신뢰"],
    },
    compatibleElements: ["火", "金"],
    incompatibleElements: ["木"],
  },
};
