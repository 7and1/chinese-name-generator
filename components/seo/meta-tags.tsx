import { env } from "@/lib/env";
import type { ReactElement } from "react";

export interface MetaTagsProps {
  title?: string;
  description?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article" | "product";
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
    site?: string;
  };
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
  additionalMetaTags?: Array<{
    name: string;
    content: string;
    property?: string;
  }>;
}

/**
 * SEO Meta Tags Component
 * Provides comprehensive meta tags for SEO and social sharing
 */
export function MetaTags({
  description,
  noindex = false,
  nofollow = false,
  canonical,
  openGraph,
  twitter,
  alternates,
  additionalMetaTags,
}: MetaTagsProps) {
  const metaTags: ReactElement[] = [];

  // Basic meta tags
  if (noindex || nofollow) {
    const robotsValue = `${noindex ? "noindex" : "index"},${nofollow ? "nofollow" : "follow"}`;
    metaTags.push(<meta key="robots" name="robots" content={robotsValue} />);
  }

  // Description
  if (description) {
    metaTags.push(
      <meta key="description" name="description" content={description} />,
    );
  }

  // Canonical URL
  if (canonical) {
    metaTags.push(<link key="canonical" rel="canonical" href={canonical} />);
  }

  // Open Graph tags
  if (openGraph) {
    const ogImage = openGraph.image || `/opengraph-image.png`;

    metaTags.push(
      <meta
        key="og:type"
        property="og:type"
        content={openGraph.type || "website"}
      />,
    );

    if (openGraph.title) {
      metaTags.push(
        <meta key="og:title" property="og:title" content={openGraph.title} />,
      );
    }

    if (openGraph.description) {
      metaTags.push(
        <meta
          key="og:description"
          property="og:description"
          content={openGraph.description}
        />,
      );
    }

    if (ogImage) {
      const fullImageUrl = ogImage.startsWith("http")
        ? ogImage
        : new URL(ogImage, env.siteUrl).toString();
      metaTags.push(
        <meta key="og:image" property="og:image" content={fullImageUrl} />,
      );
      metaTags.push(
        <meta key="og:image:width" property="og:image:width" content="1200" />,
      );
      metaTags.push(
        <meta key="og:image:height" property="og:image:height" content="630" />,
      );
      metaTags.push(
        <meta
          key="og:image:alt"
          property="og:image:alt"
          content={openGraph.title || "Chinese Name Generator"}
        />,
      );
    }

    if (openGraph.publishedTime) {
      metaTags.push(
        <meta
          key="article:published_time"
          property="article:published_time"
          content={openGraph.publishedTime}
        />,
      );
    }

    if (openGraph.modifiedTime) {
      metaTags.push(
        <meta
          key="article:modified_time"
          property="article:modified_time"
          content={openGraph.modifiedTime}
        />,
      );
    }

    if (openGraph.author) {
      metaTags.push(
        <meta
          key="article:author"
          property="article:author"
          content={openGraph.author}
        />,
      );
    }

    if (openGraph.section) {
      metaTags.push(
        <meta
          key="article:section"
          property="article:section"
          content={openGraph.section}
        />,
      );
    }

    if (openGraph.tags && openGraph.tags.length > 0) {
      openGraph.tags.forEach((tag, index) => {
        metaTags.push(
          <meta
            key={`article:tag:${index}`}
            property="article:tag"
            content={tag}
          />,
        );
      });
    }
  }

  // Twitter Card tags
  if (twitter) {
    const twitterImage =
      twitter.image || openGraph?.image || `/twitter-image.png`;

    metaTags.push(
      <meta
        key="twitter:card"
        name="twitter:card"
        content={twitter.card || "summary_large_image"}
      />,
    );

    if (twitter.site) {
      metaTags.push(
        <meta key="twitter:site" name="twitter:site" content={twitter.site} />,
      );
    }

    if (twitter.creator) {
      metaTags.push(
        <meta
          key="twitter:creator"
          name="twitter:creator"
          content={twitter.creator}
        />,
      );
    }

    if (twitter.title) {
      metaTags.push(
        <meta
          key="twitter:title"
          name="twitter:title"
          content={twitter.title}
        />,
      );
    } else if (openGraph?.title) {
      metaTags.push(
        <meta
          key="twitter:title2"
          name="twitter:title"
          content={openGraph.title}
        />,
      );
    }

    if (twitter.description) {
      metaTags.push(
        <meta
          key="twitter:description"
          name="twitter:description"
          content={twitter.description}
        />,
      );
    } else if (openGraph?.description) {
      metaTags.push(
        <meta
          key="twitter:description2"
          name="twitter:description"
          content={openGraph.description}
        />,
      );
    }

    if (twitterImage) {
      const fullImageUrl = twitterImage.startsWith("http")
        ? twitterImage
        : new URL(twitterImage, env.siteUrl).toString();
      metaTags.push(
        <meta
          key="twitter:image"
          name="twitter:image"
          content={fullImageUrl}
        />,
      );
    }
  }

  // Language alternate links
  if (alternates?.languages) {
    Object.entries(alternates.languages).forEach(([lang, url]) => {
      metaTags.push(
        <link
          key={`hreflang:${lang}`}
          rel="alternate"
          hrefLang={lang}
          href={url}
        />,
      );
    });
    metaTags.push(
      <link
        key="hreflang:x-default"
        rel="alternate"
        hrefLang="x-default"
        href={alternates.canonical || Object.values(alternates.languages)[0]}
      />,
    );
  }

  // Additional meta tags
  if (additionalMetaTags) {
    additionalMetaTags.forEach((tag, index) => {
      if (tag.property) {
        metaTags.push(
          <meta
            key={`additional:${index}`}
            property={tag.property}
            content={tag.content}
          />,
        );
      } else {
        metaTags.push(
          <meta
            key={`additional:${index}`}
            name={tag.name}
            content={tag.content}
          />,
        );
      }
    });
  }

  return <>{metaTags}</>;
}

/**
 * Generate default OpenGraph props
 */
export function getDefaultOpenGraphProps(
  locale: string,
  path: string,
  overrides?: Partial<MetaTagsProps["openGraph"]>,
) {
  const defaultTitle =
    {
      zh: "中文姓名生成器 - 基于八字五格的智能起名系统",
      en: "Chinese Name Generator - AI-Powered Naming Based on BaZi & Wuge",
      ja: "中国語名前ジェネレーター - 八字と五格に基づくAI命名",
      ko: "중국어 이름 생성기 - 팔자와 오격 기반 AI 작명",
    }[locale] || "Chinese Name Generator";

  const defaultDescription =
    {
      zh: "专业的中文姓名生成与分析工具。融合周易八字、五格数理、音韵学、诗词典故等传统文化，为您的宝宝起一个吉祥美好的名字。",
      en: "Professional Chinese name generator and analyzer. Integrating Zhou Yi BaZi, Wuge numerology, phonetics, and classical poetry.",
      ja: "プロフェッショナルな中国語名前生成・分析ツール。周易八字、五格数理、音韻学、古典詩を統合。",
      ko: "전문 중국어 이름 생성 및 분석 도구. 주역 팔자, 오격 수리, 음운학, 고전 시를 통합.",
    }[locale] || "Professional Chinese name generator and analyzer.";

  return {
    title: defaultTitle,
    description: defaultDescription,
    type: "website" as const,
    ...overrides,
  };
}
