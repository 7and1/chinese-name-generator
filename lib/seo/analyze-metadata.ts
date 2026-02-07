import { Metadata } from "next";
import { generatePageMetadata } from "./metadata";

/**
 * Generate metadata for analyze page
 */
export function generateAnalyzeMetadata(locale: string): Metadata {
  const titles = {
    zh: "姓名分析 - 八字五格音韵字义专业分析",
    en: "Name Analysis - Professional BaZi, Wuge, Phonetics & Meaning Analysis",
    ja: "名前分析 - 八字、五格、音韻、意味の専門分析",
    ko: "이름 분석 - 팔자, 오격, 운율, 의미 전문 분석",
  };

  const descriptions = {
    zh: "专业的中文姓名分析工具，从八字契合度、五格数理、音韵和谐、字义品质等多维度评估名字，提供详细的起名建议和改进方案。",
    en: "Professional Chinese name analysis tool evaluating names from multiple dimensions: BaZi compatibility, Wuge numerology, phonetic harmony, and character meaning with detailed recommendations.",
    ja: "プロフェッショナルな中国語名前分析ツール。八字適合度、五格数理、音韻調和、文字の意味など多角的に評価し、詳細な改善案を提供。",
    ko: "전문 중국어 이름 분석 도구. 팔자 적합도, 오격 수리, 운율 조화, 한자 의미 등 다각도로 평가하고 상세한 개선안을 제공.",
  };

  return generatePageMetadata({
    locale,
    path: "/analyze",
    title: titles,
    description: descriptions,
    keywords: [
      "姓名分析",
      "name analysis",
      "八字分析",
      "BaZi analysis",
      "五格剖象",
      "Wuge numerology",
      "音韵分析",
      "phonetic analysis",
      "名字测评",
      "name evaluation",
    ],
  });
}
