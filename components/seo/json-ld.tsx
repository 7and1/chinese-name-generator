import { env } from "@/lib/env";

type JSONLDProps = {
  data: Record<string, unknown>;
};

/**
 * JSON-LD Structured Data Component
 * Renders schema.org structured data for SEO
 */
export function JsonLd({ data }: JSONLDProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0),
      }}
    />
  );
}

/**
 * Organization Schema Generator
 */
export function generateOrganizationSchema(locale: string) {
  const names = {
    zh: "中文姓名生成器",
    en: "Chinese Name Generator",
    ja: "中国語名前ジェネレーター",
    ko: "중국어 이름 생성기",
  };

  const descriptions = {
    zh: "专业的中文姓名生成与分析工具。融合周易八字、五格数理、音韵学、诗词典故等传统文化，为您的宝宝起一个吉祥美好的名字。",
    en: "Professional Chinese name generator and analyzer. Integrating Zhou Yi BaZi, Wuge numerology, phonetics, and classical poetry for auspicious naming.",
    ja: "プロフェッショナルな中国語名前生成・分析ツール。周易八字、五格数理、音韻学、古典詩を統合し、縁起の良い名前を生成します。",
    ko: "전문 중국어 이름 생성 및 분석 도구. 주역 팔자, 오격 수리, 음운학, 고전 시를 통합하여 길상한 이름을 생성합니다.",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: names[locale as keyof typeof names] || names.zh,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    url: env.siteUrl.toString(),
    logo: {
      "@type": "ImageObject",
      url: new URL("/logo.svg", env.siteUrl).toString(),
      width: 512,
      height: 512,
    },
    sameAs: [
      // Add social media links when available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["zh", "en", "ja", "ko"],
    },
  };
}

/**
 * WebSite Schema with Search Action Generator
 */
export function generateWebSiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "zh" ? "中文姓名生成器" : "Chinese Name Generator",
    url: env.siteUrl.toString(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: new URL(
          `/${locale}/search?q={search_term_string}`,
          env.siteUrl,
        ).toString(),
      },
      "query-input": {
        "@type": "PropertyValueSpecification",
        valueRequired: true,
        valueName: "search_term_string",
      },
    },
  };
}

/**
 * FAQPage Schema Generator
 */
export function generateFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Article Schema Generator
 */
export function generateArticleSchema(params: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  imageUrl?: string;
}) {
  const {
    headline,
    description,
    datePublished,
    dateModified = datePublished,
    author = "Chinese Name Generator Team",
    url,
    imageUrl,
  } = params;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Chinese Name Generator",
      logo: {
        "@type": "ImageObject",
        url: new URL("/logo.svg", env.siteUrl).toString(),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    }),
  };
}

/**
 * Breadcrumb Schema Generator
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Product/Service Schema for Name Generator
 */
export function generateSoftwareApplicationSchema(locale: string) {
  const names = {
    zh: "中文姓名生成器",
    en: "Chinese Name Generator",
    ja: "中国語名前ジェネレーター",
    ko: "중국어 이름 생성기",
  };

  const descriptions = {
    zh: "基于周易八字、五格数理、音韵学的智能中文起名工具",
    en: "AI-powered Chinese name generator based on BaZi, Wuge numerology, and phonetics",
    ja: "八字、五格数理、音韻学に基づくAI中国語名前ジェネレーター",
    ko: "팔자, 오격 수리, 음운학 기반 AI 중국어 이름 생성기",
  };

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: names[locale as keyof typeof names] || names.zh,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };
}

/**
 * Video Object Schema Generator (for tutorial videos)
 */
export function generateVideoSchema(params: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  embedUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: params.name,
    description: params.description,
    thumbnailUrl: params.thumbnailUrl,
    uploadDate: params.uploadDate,
    ...(params.duration && { duration: params.duration }),
    ...(params.embedUrl && { embedUrl: params.embedUrl }),
  };
}

/**
 * Collection Page Schema Generator
 */
export function generateCollectionPageSchema(params: {
  name: string;
  description: string;
  url: string;
  numberOfItems?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: params.name,
    description: params.description,
    url: params.url,
    ...(params.numberOfItems && { numberOfItems: params.numberOfItems }),
  };
}

/**
 * HowTo Schema Generator (for guides)
 */
export function generateHowToSchema(params: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    step: params.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
