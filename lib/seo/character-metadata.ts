import { Metadata } from "next";
import { generatePageMetadata } from "./metadata";

/**
 * Generate metadata for character detail pages
 */
export function generateCharacterMetadata(config: {
  locale: string;
  char: string;
  pinyin: string;
  meaning: string;
  fiveElement: string;
}): Metadata {
  const { locale, char, pinyin, meaning, fiveElement } = config;

  const titles = {
    zh: `${char}字 - ${pinyin} - 五行属${fiveElement} - 起名详解`,
    en: `${char} Chinese Character (${pinyin}) - ${fiveElement} Element - Meaning & Naming Guide`,
    ja: `${char}漢字（${pinyin}）- ${fiveElement}行 - 意味と名付けガイド`,
    ko: `${char} 한자(${pinyin}) - ${fiveElement}행 - 의미와 작명 가이드`,
  };

  const descriptions = {
    zh: `${char}字详解：拼音${pinyin}，五行属${fiveElement}，${meaning}。适合宝宝起名用字，包含笔画数、五行属性、寓意解释。`,
    en: `Detailed guide for Chinese character ${char} (${pinyin}): ${fiveElement} element, meaning "${meaning}". Includes stroke count, five elements, and naming suggestions.`,
    ja: `漢字${char}の詳細ガイド：読み${pinyin}、${fiveElement}行、意味「${meaning}」。画数、五行、名付けのアドバイスを含む。`,
    ko: `한자 ${char} 상세 가이드: 읽기 ${pinyin}, ${fiveElement}행, 의미 "${meaning}". 획수, 오행, 작명 제안 포함.`,
  };

  return generatePageMetadata({
    locale,
    path: `/characters/${char}`,
    title: titles,
    description: descriptions,
    keywords: [
      char,
      pinyin,
      `${char} character`,
      `${char} meaning`,
      `${char} Chinese character`,
      `${char}字`,
      `${char}字起名`,
      fiveElement,
      `五行${fiveElement}`,
      `${fiveElement} element names`,
      `Chinese character for names`,
    ],
  });
}
