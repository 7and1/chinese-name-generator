/**
 * SEO Constants and Utilities
 * Centralized SEO-related constants for the Chinese Name Generator
 */

export const SITE_NAME = "Chinese Name Generator";

export const SITE_KEYWORDS = [
  // English keywords
  "Chinese name generator",
  "BaZi naming",
  "Wuge numerology",
  "baby naming",
  "Chinese astrology",
  "Five Elements naming",
  "Chinese surname",
  "Chinese characters",
  "name analysis",
  // Chinese keywords
  "中文起名",
  "姓名生成器",
  "八字起名",
  "五格数理",
  "宝宝起名",
  "周易起名",
  "五行起名",
  "诗词起名",
  "姓名分析",
  // Japanese keywords
  "中国語名前ジェネレーター",
  "八字の名付け",
  "五格数理",
  "赤ちゃんの名付け",
  // Korean keywords
  "중국어 이름 생성기",
  "팔자 작명",
  "오격 수리",
  "아기 이름",
] as const;

export const LOCALE_NAMES: Record<string, string> = {
  zh: "中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
} as const;

export const LOCALE_REGIONS: Record<string, string> = {
  zh: "CN",
  en: "US",
  ja: "JP",
  ko: "KR",
} as const;

/**
 * Page type definitions for SEO categorization
 */
export const PAGE_TYPES = {
  HOME: "home",
  GENERATE: "generate",
  ANALYZE: "analyze",
  EXPLORE: "explore",
  BLOG: "blog",
  BLOG_ARTICLE: "blog-article",
  FAQ: "faq",
  ABOUT: "about",
  SURNAMES: "surnames",
  SURNAME_DETAIL: "surname-detail",
  ELEMENTS: "elements",
  ELEMENT_DETAIL: "element-detail",
  GUIDE: "guide",
  GUIDE_DETAIL: "guide-detail",
  PRIVACY: "privacy",
  TERMS: "terms",
} as const;

/**
 * Default change frequencies for sitemap
 */
export const SITEMAP_CHANGE_FREQUENCIES = {
  home: "weekly",
  generate: "daily",
  analyze: "weekly",
  blog: "weekly",
  "blog-article": "monthly",
  surnames: "weekly",
  "surname-detail": "monthly",
  elements: "weekly",
  "element-detail": "weekly",
  guide: "weekly",
  "guide-detail": "monthly",
  faq: "monthly",
  about: "monthly",
  privacy: "yearly",
  terms: "yearly",
} as const;

/**
 * Default priorities for sitemap
 */
export const SITEMAP_PRIORITIES = {
  home: 1.0,
  generate: 0.9,
  analyze: 0.8,
  blog: 0.8,
  "blog-article": 0.6,
  surnames: 0.8,
  "surname-detail": 0.6,
  elements: 0.8,
  "element-detail": 0.7,
  guide: 0.8,
  "guide-detail": 0.7,
  faq: 0.7,
  about: 0.6,
  privacy: 0.3,
  terms: 0.3,
} as const;

/**
 * OpenGraph types
 */
export const OG_TYPES = {
  WEBSITE: "website",
  ARTICLE: "article",
  PRODUCT: "product",
  PROFILE: "profile",
} as const;

/**
 * Twitter card types
 */
export const TWITTER_CARD_TYPES = {
  SUMMARY: "summary",
  SUMMARY_LARGE_IMAGE: "summary_large_image",
  APP: "app",
  PLAYER: "player",
} as const;

/**
 * Common categories for blog articles
 */
export const BLOG_CATEGORIES = [
  "起名技巧",
  "五行起名",
  "八字起名",
  "五格剖象",
  "音韵起名",
  "姓氏文化",
  "诗词起名",
  "用字选择",
  "起名趋势",
  "naming-tips",
  "five-elements",
  "bazi",
  "wuge",
  "phonetics",
  "surname-culture",
  "poetry",
  "character-selection",
  "trends",
] as const;

/**
 * Supported locales
 */
export const SUPPORTED_LOCALES = ["zh", "en", "ja", "ko"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Get full locale with region
 */
export function getFullLocale(locale: SupportedLocale): string {
  return `${locale}-${LOCALE_REGIONS[locale]}`;
}

/**
 * Get locale name
 */
export function getLocaleName(locale: SupportedLocale): string {
  return LOCALE_NAMES[locale] || locale;
}

/**
 * Structured data types
 */
export const SCHEMA_TYPES = {
  ORGANIZATION: "Organization",
  WEB_SITE: "WebSite",
  ARTICLE: "Article",
  BLOG_POSTING: "BlogPosting",
  FAQ_PAGE: "FAQPage",
  BREADCRUMB_LIST: "BreadcrumbList",
  PERSON: "Person",
  SOFTWARE_APPLICATION: "SoftwareApplication",
  COLLECTION_PAGE: "CollectionPage",
  HOW_TO: "HowTo",
  VIDEO_OBJECT: "VideoObject",
} as const;
