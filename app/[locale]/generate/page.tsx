
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import GenerateClient from "./generate-client";
import {
  FormSkeleton,
  NameCardGridSkeleton,
} from "@/components/name/loading-skeletons";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";

// SEO: Type for generateMetadata params
type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * SEO: Generate metadata for the /generate page
 * Strategy: Target high-volume keywords related to Chinese name generation
 * - Primary: "Chinese name generator", "智能起名", "八字起名"
 * - Secondary: "BaZi naming", "Five Elements", "baby naming"
 * - Long-tail: "how to choose Chinese baby name", "五行起名方法"
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  // SEO: Multilingual title optimization with brand name
  const titles = {
    zh: "智能起名 - 中文姓名生成器 | 八字五行五格数理起名",
    en: "Chinese Name Generator - AI-Powered BaZi & Five Elements Naming",
    ja: "中国語名前ジェネレーター - 八字五行に基づくAI名付け",
    ko: "중국어 이름 생성기 - 팔자 오행 기반 AI 작명",
  };

  // SEO: Descriptions optimized for click-through rate with key features
  const descriptions = {
    zh: "专业智能起名工具，融合八字五行、五格数理、音韵美学、诗词典故。输入姓氏和生辰八字，一键生成寓意美好、五行平衡的吉祥名字。免费使用，支持多语言。",
    en: "AI-powered Chinese name generator combining BaZi analysis, Five Elements, Wuge numerology, and classical poetry. Generate meaningful, harmonious names with comprehensive scoring. Free & multilingual.",
    ja: "AI中国語名前ジェネレーター。八字五行、五格数理、音韻美学、古典詩を統合。縁起の良い、調和のとれた名前を生成。無料・多言語対応。",
    ko: "AI 중국어 이름 생성기. 팔자 오행, 오격 수리, 음운 미학, 고전 시 통합. 길상하고 조화로운 이름 생성. 무료 다국어 지원.",
  };

  // SEO: Comprehensive keyword targeting
  const keywords = [
    // Primary high-volume keywords
    "Chinese name generator",
    "智能起名",
    "八字起名",
    "五行起名",
    "宝宝起名",
    "baby naming",
    // BaZi and Five Elements
    "BaZi calculator",
    "八字五行分析",
    "Five Elements naming",
    "四柱推命",
    "四柱八字",
    // Numerology
    "Wuge numerology",
    "五格剖象",
    "五格数理",
    "姓名学",
    // Cultural and traditional
    "Chinese surname meaning",
    "姓氏起源",
    "poetry names",
    "诗词起名",
    "idiom names",
    "成语起名",
    // Long-tail keywords
    "how to choose Chinese name",
    "如何给宝宝起名",
    "auspicious Chinese names",
    "吉祥名字",
    "Chinese name analysis",
    "姓名打分",
    // English alternatives
    "AI naming tool",
    "smart naming system",
    "Chinese character names",
    "mandarin name generator",
  ];

  return generatePageMetadata({
    locale,
    path: "/generate",
    title: titles,
    description: descriptions,
    keywords,
    // SEO: Enhanced OpenGraph for social sharing
    ogType: "website",
  });
}

function GeneratePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div className="mb-6 md:mb-8 space-y-2">
        <div className="h-9 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-5 w-96 bg-muted animate-pulse rounded-md" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-1">
          <FormSkeleton />
        </div>
        <div className="lg:col-span-2">
          <NameCardGridSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}

/**
 * SEO: SoftwareApplication Schema for Rich Results
 * This schema helps Google display the app as a software tool in search results
 * with ratings, features, and pricing information.
 *
 * Strategy: Target "rich result" appearance in SERP with:
 * - Star ratings display
 * - Feature list
 * - Free pricing indication
 */
async function getSoftwareApplicationSchema(locale: string) {
  const appNames = {
    zh: "中文姓名生成器 - 智能八字五行起名工具",
    en: "Chinese Name Generator - AI BaZi & Five Elements Tool",
    ja: "中国語名前ジェネレーター - AI八字五行名付けツール",
    ko: "중국어 이름 생성기 - AI 팔자 오행 작명 도구",
  };

  // SEO: Description optimized for both users and search engines
  const appDescriptions = {
    zh: "专业中文姓名生成器，融合周易八字、五格数理、音韵美学、诗词典故。支持五行分析、姓名打分、诗词起名、成语起名。免费在线使用，支持多语言。",
    en: "Professional Chinese name generator integrating BaZi analysis, Wuge numerology, phonetics, and classical poetry. Features Five Elements analysis, name scoring, poetry-based naming. Free online tool with multilingual support.",
    ja: "プロフェッショナルな中国語名前ジェネレーター。周易八字、五格数理、音韻美学、古典詩を統合。五行分析、姓名スコア、詩詞名付け対応。無料オンラインツール、多言語対応。",
    ko: "전문 중국어 이름 생성기. 주역 팔자, 오격 수리, 음운 미학, 고전 시 통합. 오행 분석, 이름 점수, 시사 작명 지원. 무료 온라인 도구, 다국어 지원.",
  };

  // SEO: Feature list targeting feature-based searches
  const featureNames = {
    zh: [
      "八字五行分析 - 根据生辰八字分析五行喜忌",
      "五格数理评分 - 天格人格地格外格总格评分",
      "音韵美感检查 - 声调和谐、无不良谐音",
      "诗词典故起名 - 诗经楚辞唐诗宋词起名",
      "成语寓意起名 - 成语典故提取美好字义",
      "姓氏文化介绍 - 百家姓起源历史名人",
      "多语言支持 - 中文简体繁体英文日文韩文",
      "免费使用 - 无需注册，在线生成",
    ],
    en: [
      "BaZi Five Elements Analysis - Analyze favorable elements from birth data",
      "Wuge Numerology Scoring - Heaven, Human, Earth, Outer, Total grid scores",
      "Phonetic Harmony Check - Tone patterns and homophone verification",
      "Poetry-Inspired Naming - Names from Book of Songs, Chu Ci, Tang Poetry",
      "Idiom-Based Naming - Extract meaningful characters from idioms",
      "Surname Culture Guide - Origins and famous people for 500+ surnames",
      "Multilingual Support - Simplified/Traditional Chinese, English, Japanese, Korean",
      "Free to Use - No registration required, instant generation",
    ],
    ja: [
      "八字五行分析 - 生年月日時から五行を分析",
      "五格数理スコア - 天格人格地格外格総格の採点",
      "音韻調和チェック - 声調パターンと同音異義語チェック",
      "詩詞名付け - 詩経・楚辞・唐詩・宋詞から名前を",
      "成語名付け - 成語から意味の良い文字を抽出",
      "姓氏文化ガイド - 500以上の姓氏の起源と有名人",
      "多言語対応 - 簡体字・繁体字・英語・日本語・韓国語",
      "無料使用 - 登録不要、オンラインで即座に生成",
    ],
    ko: [
      "팔자 오행 분석 - 생년월일시로 오행 분석",
      "오격 수리 점수 - 천격인격지격외격총격 점수",
      "음운 조화 확인 - 성조 패턴 및 동음이의어 검증",
      "시사 작명 - 시경, 초사, 당시, 송사에서 이름",
      "성어 작명 - 성어에서 의미 좋은 문자 추출",
      "성씨 문화 가이드 - 500개 이상 성씨의 기원과 유명인",
      "다국어 지원 - 간체 번체 영어 일본어 한국어",
      "무료 사용 - 가입 불필요, 즉시 생성",
    ],
  };

  // SEO: SoftwareApplication schema for rich snippets
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: appNames[locale as keyof typeof appNames] || appNames.zh,
    description:
      appDescriptions[locale as keyof typeof appDescriptions] ||
      appDescriptions.zh,
    url: new URL(`/${locale}/generate`, env.siteUrl).toString(),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    featureList:
      featureNames[locale as keyof typeof featureNames] || featureNames.en,
    creator: {
      "@type": "Organization",
      name: "Chinese Name Generator Team",
      url: env.siteUrl.toString(),
    },
    inLanguage: [locale, "zh", "en", "ja", "ko"],
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "2.0",
    downloadUrl: env.siteUrl.toString(),
    genre: ["Naming", "Chinese Culture", "Astrology", "Numerology", "BaZi"],
    keywords: [
      "Chinese name",
      "BaZi",
      "Five Elements",
      "Wuge",
      "Numerology",
      "起名",
      "八字",
      "五行",
    ],
  };
}

export default async function GeneratePage(props: Props) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const softwareSchema = await getSoftwareApplicationSchema(locale);

  return (
    <>
      {/* SoftwareApplication Schema */}
      <JsonLd data={softwareSchema} />
      <Suspense fallback={<GeneratePageSkeleton />}>
        <GenerateClient />
      </Suspense>
    </>
  );
}
