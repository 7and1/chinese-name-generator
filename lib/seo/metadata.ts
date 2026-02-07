import { Metadata } from "next";
import { env } from "@/lib/env";

export interface SEOConfig {
  locale: string;
  path: string;
  title: {
    zh: string;
    en: string;
    ja?: string;
    ko?: string;
  };
  description: {
    zh: string;
    en: string;
    ja?: string;
    ko?: string;
  };
  keywords?: string[];
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  noindex?: boolean;
  canonical?: string;
}

/**
 * Generate standardized metadata for pages
 */
export function generatePageMetadata(config: SEOConfig): Metadata {
  const {
    locale,
    path,
    title,
    description,
    keywords = [],
    ogImage,
    ogType = "website",
    publishedTime,
    modifiedTime,
    articleSection,
    articleTags,
    noindex = false,
    canonical,
  } = config;

  const pageTitle = title[locale as keyof typeof title] || title.zh;
  const pageDescription =
    description[locale as keyof typeof description] || description.zh;

  const url = canonical
    ? new URL(canonical, env.siteUrl).toString()
    : new URL(path, env.siteUrl).toString();

  // Default keywords
  const defaultKeywords = [
    "Chinese name generator",
    "BaZi naming",
    "Wuge numerology",
    "baby naming",
    "Chinese astrology",
    "中文起名",
    "姓名生成器",
    "八字起名",
    "五格数理",
    "宝宝起名",
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  // Build metadata object
  const metadata: Metadata = {
    metadataBase: env.siteUrl,
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords,
    authors: [{ name: "Chinese Name Generator Team" }],
    creator: "Chinese Name Generator",
    publisher: "Chinese Name Generator",
    robots: {
      index: !noindex,
      follow: true,
      googleBot: {
        index: !noindex,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: ogType,
      locale: locale,
      url,
      title: pageTitle,
      description: pageDescription,
      siteName: "Chinese Name Generator",
      images: ogImage
        ? [
            {
              url: ogImage.startsWith("http")
                ? ogImage
                : new URL(ogImage, env.siteUrl).toString(),
              width: 1200,
              height: 630,
              alt: pageTitle,
            },
          ]
        : [
            {
              url: new URL(
                `/${locale}/opengraph-image`,
                env.siteUrl,
              ).toString(),
              width: 1200,
              height: 630,
              alt: pageTitle,
            },
          ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(articleSection && { article: { section: articleSection } }),
      ...(articleTags && { article: { tags: articleTags } }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ogImage
        ? [
            ogImage.startsWith("http")
              ? ogImage
              : new URL(ogImage, env.siteUrl).toString(),
          ]
        : [new URL(`/${locale}/twitter-image`, env.siteUrl).toString()],
    },
    alternates: {
      canonical: url,
      languages: {
        "zh-CN": new URL(`/zh${path}`, env.siteUrl).toString(),
        "en-US": new URL(`/en${path}`, env.siteUrl).toString(),
        "ja-JP": new URL(`/ja${path}`, env.siteUrl).toString(),
        "ko-KR": new URL(`/ko${path}`, env.siteUrl).toString(),
        "x-default": new URL(`/en${path}`, env.siteUrl).toString(),
      },
    },
    ...(env.googleSiteVerification ||
    env.yandexVerification ||
    env.yahooVerification
      ? {
          verification: {
            ...(env.googleSiteVerification
              ? { google: env.googleSiteVerification }
              : {}),
            ...(env.yandexVerification
              ? { yandex: env.yandexVerification }
              : {}),
            ...(env.yahooVerification ? { yahoo: env.yahooVerification } : {}),
          },
        }
      : {}),
  };

  return metadata;
}

/**
 * Generate blog article metadata
 */
export function generateArticleMetadata(config: {
  locale: string;
  slug: string;
  title: {
    zh: string;
    en: string;
    ja?: string;
    ko?: string;
  };
  description: {
    zh: string;
    en: string;
    ja?: string;
    ko?: string;
  };
  publishedDate: string;
  modifiedDate?: string;
  category: string;
  author?: string;
  imageUrl?: string;
}): Metadata {
  const {
    locale,
    slug,
    title,
    description,
    publishedDate,
    modifiedDate,
    category,
    imageUrl,
  } = config;

  return generatePageMetadata({
    locale,
    path: `/blog/${slug}`,
    title,
    description,
    ogImage: imageUrl,
    ogType: "article",
    publishedTime: publishedDate,
    modifiedTime: modifiedDate,
    articleSection: category,
    articleTags: [category],
  });
}

/**
 * Generate surname page metadata
 */
export function generateSurnameMetadata(config: {
  locale: string;
  surname: string;
  pinyin: string;
  ranking: number;
}): Metadata {
  const { locale, surname, pinyin, ranking } = config;

  const titles = {
    zh: `${surname}姓 - ${pinyin} - 起源、历史名人、起名建议`,
    en: `${surname} Surname (${pinyin}) - Origins, Famous People, Naming Guide`,
    ja: `${surname}姓（${pinyin}）- 由来、有名人、名付けアドバイス`,
    ko: `${surname}성(${pinyin}) - 기원, 유명인, 작명 제안`,
  };

  const descriptions = {
    zh: `了解${surname}姓的起源、历史名人、地区分布和起名建议。${surname}姓排名第${ranking}位。`,
    en: `Learn about the ${surname} surname: origins, famous people, regional distribution, and naming suggestions. Ranked #${ranking} in China.`,
    ja: `${surname}姓の由来、有名人、地域分布、名付けアドバイスを詳しく紹介。中国で第${ranking}位。`,
    ko: `${surname}성의 기원, 유명인, 지역 분포, 작명 제안을 상세히 소개. 중국에서 ${ranking}위.`,
  };

  return generatePageMetadata({
    locale,
    path: `/surnames/${surname}`,
    title: titles,
    description: descriptions,
    keywords: [
      surname,
      pinyin,
      `${surname} surname`,
      `姓氏${surname}`,
      `${surname}姓`,
      `${surname}姓起源`,
      ranking.toString(),
    ],
  });
}

/**
 * Generate guide page metadata
 */
export function generateGuideMetadata(config: {
  locale: string;
  slug: string;
  title: {
    zh: string;
    en: string;
    ja?: string;
    ko?: string;
  };
  description: {
    zh: string;
    en: string;
    ja?: string;
    ko?: string;
  };
}): Metadata {
  const { locale, slug, title, description } = config;

  return generatePageMetadata({
    locale,
    path: `/guide/${slug}`,
    title,
    description,
    keywords: [
      "起名指南",
      "naming guide",
      "how to name",
      "baby naming tips",
      "起名技巧",
    ],
  });
}

/**
 * Generate element page metadata
 */
export function generateElementMetadata(config: {
  locale: string;
  element: string;
}): Metadata {
  const { locale, element } = config;

  const elementNames: Record<
    string,
    { zh: string; en: string; ja: string; ko: string }
  > = {
    金: { zh: "金", en: "Metal", ja: "金", ko: "금" },
    木: { zh: "木", en: "Wood", ja: "木", ko: "목" },
    水: { zh: "水", en: "Water", ja: "水", ko: "수" },
    火: { zh: "火", en: "Fire", ja: "火", ko: "화" },
    土: { zh: "土", en: "Earth", ja: "土", ko: "토" },
  };

  const elementName = elementNames[element] || elementNames.金;

  const titles = {
    zh: `${elementName.zh}行起名 - 五行属${elementName.zh}的字大全与起名建议`,
    en: `${elementName.en} Element Names - Complete List of ${elementName.en} Characters for Naming`,
    ja: `${elementName.ja}行の名付け - ${elementName.ja}の漢字リストと名付けアドバイス`,
    ko: `${elementName.ko}행 작명 - ${elementName.ko} 한자 목록과 작명 제안`,
  };

  const descriptions = {
    zh: `五行属${elementName.zh}的汉字起名大全，包含适合宝宝起名的${elementName.zh}属性汉字推荐，以及五行${elementName.zh}的起名方法和注意事项。`,
    en: `Complete list of ${elementName.en} element Chinese characters for baby naming. Learn about ${elementName.en} element naming methods and recommendations.`,
    ja: `${elementName.ja}行の漢字名付けリスト。${elementName.ja}属性の漢字と名付けの方法を詳しく紹介。`,
    ko: `${elementName.ko}행 한자 이름 짓기 목록. ${elementName.ko} 속성 한자와 작명 방법을 상세히 소개.`,
  };

  return generatePageMetadata({
    locale,
    path: `/elements/${element}`,
    title: titles,
    description: descriptions,
    keywords: [
      `${elementName.zh}行起名`,
      `${elementName.en} element names`,
      `五行${elementName.zh}`,
      `five elements ${elementName.en}`,
      element,
    ],
  });
}

/**
 * Generate home page metadata
 */
export function generateHomeMetadata(locale: string): Metadata {
  const titles = {
    zh: "中文姓名生成器 - 基于八字五格的智能起名系统",
    en: "Chinese Name Generator - AI-Powered Naming Based on BaZi & Wuge",
    ja: "中国語名前ジェネレーター - 八字と五格に基づくAI命名",
    ko: "중국어 이름 생성기 - 팔자와 오격 기반 AI 작명",
  };

  const descriptions = {
    zh: "专业的中文姓名生成与分析工具。融合周易八字、五格数理、音韵学、诗词典故等传统文化，为您的宝宝起一个吉祥美好的名字。支持多维度评分、详细解析。",
    en: "Professional Chinese name generator and analyzer. Integrating Zhou Yi BaZi, Wuge numerology, phonetics, and classical poetry. Generate auspicious names with comprehensive scoring and analysis.",
    ja: "プロフェッショナルな中国語名前生成・分析ツール。周易八字、五格数理、音韻学、古典詩を統合し、縁起の良い名前を生成します。",
    ko: "전문 중국어 이름 생성 및 분석 도구. 주역 팔자, 오격 수리, 음운학, 고전 시를 통합하여 길상한 이름을 생성합니다.",
  };

  return generatePageMetadata({
    locale,
    path: "",
    title: titles,
    description: descriptions,
  });
}

/**
 * Format date for sitemap
 */
export function getSitemapDate(date?: Date): string {
  return date
    ? date.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];
}

/**
 * Get change frequency for sitemap based on page type
 */
export function getChangeFrequency(
  pageType: "home" | "daily" | "weekly" | "monthly" | "yearly",
): "daily" | "weekly" | "monthly" | "yearly" {
  const frequencies: Record<
    typeof pageType,
    "daily" | "weekly" | "monthly" | "yearly"
  > = {
    home: "weekly",
    daily: "daily",
    weekly: "weekly",
    monthly: "monthly",
    yearly: "yearly",
  };
  return frequencies[pageType];
}

/**
 * Get priority for sitemap based on page type
 */
export function getPriority(
  pageType: "home" | "seo" | "content" | "detail",
): number {
  const priorities: Record<typeof pageType, number> = {
    home: 1.0,
    seo: 0.8,
    content: 0.7,
    detail: 0.6,
  };
  return priorities[pageType];
}
