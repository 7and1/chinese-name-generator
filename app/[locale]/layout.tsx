import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import type { Metadata } from "next";
import "../globals.css";
import SiteHeader from "@/components/site/site-header";
import SiteFooter from "@/components/site/site-footer";
import { Toaster } from "@/components/ui/toaster";
import { JsonLd } from "@/components/seo/json-ld";
import { HreflangTags } from "@/components/seo/hreflang-tags";
import { generateHomeMetadata } from "@/lib/seo/metadata";
import { env } from "@/lib/env";
import { WebVitals, PerformanceBar } from "@/components/performance";
import { ErrorBoundary } from "@/components/error/global-error";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  return generateHomeMetadata(locale);
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params in Next.js 15
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for this locale (validation is already done in i18n.ts)
  const messages = await getMessages();

  // Organization names and descriptions
  const orgNames = {
    zh: "中文姓名生成器",
    en: "Chinese Name Generator",
    ja: "中国語名前ジェネレーター",
    ko: "중국어 이름 생성기",
  };

  const orgDescriptions = {
    zh: "专业的中文姓名生成与分析工具。融合周易八字、五格数理、音韵学、诗词典故等传统文化，为您的宝宝起一个吉祥美好的名字。",
    en: "Professional Chinese name generator and analyzer. Integrating Zhou Yi BaZi, Wuge numerology, phonetics, and classical poetry for auspicious naming.",
    ja: "プロフェッショナルな中国語名前生成・分析ツール。周易八字、五格数理、音韻学、古典詩を統合し、縁起の良い名前を生成します。",
    ko: "전문 중국어 이름 생성 및 분석 도구. 주역 팔자, 오격 수리, 음운학, 고전 시를 통합하여 길상한 이름을 생성합니다.",
  };

  const names = orgNames[locale as keyof typeof orgNames] || orgNames.zh;
  const descriptions =
    orgDescriptions[locale as keyof typeof orgDescriptions] ||
    orgDescriptions.zh;

  // Generate global structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: names,
    description: descriptions,
    url: env.siteUrl.toString(),
    logo: {
      "@type": "ImageObject",
      url: new URL("/logo.svg", env.siteUrl).toString(),
      width: 512,
      height: 512,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["zh", "en", "ja", "ko"],
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: names,
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

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        {/* Performance: Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Performance: DNS prefetch for potential external resources */}
        <link rel="dns-prefetch" href="https://*.githubusercontent.com" />

        {/* Hreflang tags for SEO */}
        <HreflangTags path="" />

        {/* Global Structured Data */}
        <JsonLd data={organizationSchema} />
        <JsonLd data={webSiteSchema} />

        {/* Performance: Inline critical CSS for preventing FOUC */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS to prevent layout shift */
              body { min-height: 100vh; }
              .container { width: 100%; max-width: 1400px; margin: 0 auto; padding: 0 1rem; }
              @media (min-width: 640px) { .container { padding: 0 1.5rem; } }
              @media (min-width: 1024px) { .container { padding: 0 2rem; } }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <ErrorBoundary>
            <SiteHeader locale={locale} />
            {/* Main content with contain for layout stability */}
            <main className="flex-1 contain-layout">{children}</main>
            <SiteFooter locale={locale} />
          </ErrorBoundary>
          <Toaster />
          <WebVitals />
          <PerformanceBar />
        </NextIntlClientProvider>

        {/* Performance: Defer non-critical scripts */}
        <Script
          id="defer-animations"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Enable reduced motion for users who prefer it
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
              if (prefersReducedMotion.matches) {
                document.documentElement.classList.add('reduce-motion');
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
