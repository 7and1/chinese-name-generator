
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import {
  getSurnameInfo,
  getSurnameEnhanced,
  CHINESE_SURNAMES,
} from "@/lib/data/surnames";
import { notFound } from "next/navigation";
import { getCharactersByElement } from "@/lib/data/characters";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { generateSurnameMetadata } from "@/lib/seo/metadata";
import { PageShareButton } from "@/components/share/page-share-button";
import { FIVE_ELEMENTS, FIVE_ELEMENT_INFO } from "@/lib/data/elements";
import type { FiveElement } from "@/lib/types";
import { SurnameInternalLinks } from "@/components/surname/surname-internal-links";
import { EnhancedSurnameCard } from "@/components/surname/enhanced-surname-card";

type Props = {
  params: Promise<{ locale: string; surname: string }>;
};

// Only pre-generate top 20 surnames for SEO
export async function generateStaticParams() {
  const surnames = CHINESE_SURNAMES.slice(0, 20);
  return surnames.map((surname) => ({
    surname: surname.surname,
  }));
}

// Enable dynamic rendering for non-pregenerated pages
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, surname } = await params;
  setRequestLocale(locale);

  const surnameInfo = getSurnameInfo(surname);
  const enhancedInfo = getSurnameEnhanced(surname);

  if (!surnameInfo) {
    return {
      title: "Surname Not Found",
    };
  }

  const title = enhancedInfo
    ? `${surnameInfo.surname}姓 - ${enhancedInfo.originDetails?.slice(0, 50)}...`
    : `${surnameInfo.surname} (${surnameInfo.pinyin}) - Chinese Surname`;

  return {
    title,
    description: enhancedInfo?.originDetails || surnameInfo.origin,
    openGraph: {
      title,
      description: enhancedInfo?.originDetails || surnameInfo.origin,
      url: new URL(`/${locale}/surnames/${surname}`, env.siteUrl).toString(),
      siteName: "Chinese Name Generator",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: enhancedInfo?.originDetails || surnameInfo.origin,
    },
    alternates: {
      canonical: new URL(
        `/${locale}/surnames/${surname}`,
        env.siteUrl,
      ).toString(),
    },
  };
}

export default async function SurnameDetailPage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const surnameInfo = getSurnameInfo(params.surname);
  const enhancedInfo = getSurnameEnhanced(params.surname);

  if (!surnameInfo) {
    notFound();
  }

  // Get related surnames (similar rank range)
  const relatedSurnames = CHINESE_SURNAMES.filter(
    (s) =>
      Math.abs(s.ranking - surnameInfo.ranking) <= 5 &&
      s.surname !== params.surname,
  ).slice(0, 8);

  const isZh = params.locale === "zh";
  const pageUrl = new URL(
    `/${params.locale}/surnames/${params.surname}`,
    env.siteUrl,
  ).toString();

  // Determine dominant element based on stroke count and surname
  const getElementByStroke = (strokes: number): FiveElement => {
    const mod = strokes % 5;
    const elements: FiveElement[] = ["金", "木", "水", "火", "土"];
    return elements[mod];
  };
  const dominantElement = getElementByStroke(surnameInfo.strokeCount);
  const elementInfo = FIVE_ELEMENT_INFO[dominantElement];

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${surnameInfo.surname} ${isZh ? "姓" : "Surname"}`,
    description: enhancedInfo?.originDetails || surnameInfo.origin,
    url: pageUrl,
    about: {
      "@type": "Thing",
      name: `${surnameInfo.surname} ${isZh ? "姓" : "Surname"}`,
      description: enhancedInfo?.originDetails || surnameInfo.origin,
    },
    mainEntity: {
      "@type": "Person",
      familyName: surnameInfo.surname,
    },
  };

  // Get characters suitable for this surname based on element
  const suitableCharacters = getCharactersByElement(dominantElement).slice(
    0,
    12,
  );

  // Recommended name combinations
  const recommendedNames = [
    "博文",
    "思远",
    "雨泽",
    "浩宇",
    "子轩",
    "梓涵",
    "欣怡",
    "诗涵",
    "天宇",
    "明哲",
    "诗雅",
    "梦琪",
    "宇航",
    "浩然",
    "欣妍",
    "雅琪",
    "嘉懿",
    "煜城",
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <JsonLd data={structuredData} />

      {/* Breadcrumb with Share */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <Breadcrumb
            locale={params.locale}
            items={[
              { name: isZh ? "首页" : "Home", href: `/${params.locale}` },
              {
                name: isZh ? "姓氏大全" : "Surnames",
                href: `/${params.locale}/surnames`,
              },
              {
                name: surnameInfo.surname,
                href: `/${params.locale}/surnames/${params.surname}`,
              },
            ]}
          />
        </div>
        <PageShareButton
          url={pageUrl}
          title={`${surnameInfo.surname} ${isZh ? "姓" : "Surname"}`}
          description={enhancedInfo?.originDetails || surnameInfo.origin}
          locale={params.locale}
        />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12 relative">
          {/* Background decoration */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${elementInfo.color} opacity-10 rounded-3xl -z-10`}
          />

          <div className="text-7xl md:text-8xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {surnameInfo.surname}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            {isZh ? "姓氏详情" : "Surname Details"}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-4">
            {surnameInfo.pinyin}
          </p>

          {/* Dominant Element Badge */}
          <div className="inline-flex items-center gap-2">
            <span
              className={`px-4 py-2 rounded-full ${elementInfo.bgColor} ${elementInfo.textColor} font-semibold`}
            >
              {dominantElement}行<span className="mx-1">·</span>
              {elementInfo.en}
            </span>
          </div>
        </div>

        {/* Quick Info Cards - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <EnhancedSurnameCard
            label={isZh ? "人口排名" : "Ranking"}
            value={`#${surnameInfo.ranking}`}
            color="blue"
            icon="#"
          />
          <EnhancedSurnameCard
            label={isZh ? "人口占比" : "Population"}
            value={`${surnameInfo.frequency}%`}
            color="green"
            icon="%"
          />
          <EnhancedSurnameCard
            label={isZh ? "笔画数" : "Strokes"}
            value={surnameInfo.strokeCount.toString()}
            color="purple"
            icon="✓"
          />
          <EnhancedSurnameCard
            label={isZh ? "五行属性" : "Element"}
            value={dominantElement}
            color={
              dominantElement === "金"
                ? "yellow"
                : dominantElement === "木"
                  ? "green"
                  : dominantElement === "水"
                    ? "blue"
                    : dominantElement === "火"
                      ? "red"
                      : "amber"
            }
            customClass={elementInfo.bgColor
              .replace("bg-", "text-")
              .replace("/30", "-600")}
          />
        </div>

        {/* Origin Section - Enhanced */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-600 rounded-full" />
            {isZh ? "姓氏起源" : "Origin"}
          </h2>
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              {surnameInfo.origin}
            </p>
            {enhancedInfo?.originDetails && (
              <p className="text-slate-500 dark:text-slate-500 leading-relaxed">
                {enhancedInfo.originDetails}
              </p>
            )}
          </div>
        </section>

        {/* Famous People Section - Enhanced with Details */}
        {enhancedInfo?.famousPersonsDetails &&
          enhancedInfo.famousPersonsDetails.length > 0 && (
            <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span className="w-1 h-8 bg-green-600 rounded-full" />
                {isZh ? "历史名人" : "Famous People"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {enhancedInfo.famousPersonsDetails.map((person, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-600"
                  >
                    <div className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">
                      {person.name}
                    </div>
                    {person.era && (
                      <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                        {person.era}
                      </div>
                    )}
                    {person.title && (
                      <div className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                        {person.title}
                      </div>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {person.achievement}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* Regional Distribution - Enhanced */}
        {enhancedInfo?.regionalDistribution && (
          <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="w-1 h-8 bg-purple-600 rounded-full" />
              {isZh ? "地区分布" : "Regional Distribution"}
            </h2>

            <div className="space-y-6">
              {/* Provinces */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                  {isZh ? "主要分布省份" : "Main Provinces"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {enhancedInfo.regionalDistribution.provinces.map(
                    (province) => (
                      <span
                        key={province}
                        className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                      >
                        {province}
                      </span>
                    ),
                  )}
                </div>
              </div>

              {/* Historical Regions */}
              {enhancedInfo.regionalDistribution.historicalRegions && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                    {isZh ? "历史郡望" : "Historical Regions"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {enhancedInfo.regionalDistribution.historicalRegions.map(
                      (region) => (
                        <span
                          key={region}
                          className="px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium"
                        >
                          {region}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {enhancedInfo.regionalDistribution.description && (
                <p className="text-slate-600 dark:text-slate-400">
                  {enhancedInfo.regionalDistribution.description}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Internal Links Section */}
        <SurnameInternalLinks
          locale={params.locale}
          currentSurname={params.surname}
          dominantElement={dominantElement}
        />

        {/* Naming Suggestions Section - Enhanced */}
        <section
          className={`bg-gradient-to-br ${elementInfo.color} p-8 rounded-xl shadow-lg mb-8 text-white`}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-white/50 rounded-full" />
            {isZh ? "起名建议" : "Naming Suggestions"}
          </h2>

          <div className="space-y-6">
            {/* Element-based Name Suggestions */}
            <div>
              <h3 className="text-lg font-semibold mb-4 opacity-90">
                {isZh
                  ? `推荐${dominantElement}行名字组合`
                  : `Recommended ${elementInfo.en} Element Names`}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {recommendedNames.slice(0, 12).map((name) => (
                  <Link
                    key={name}
                    href={`/${params.locale}/generate?surname=${encodeURIComponent(surnameInfo.surname)}&givenName=${encodeURIComponent(name)}`}
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-lg text-center hover:bg-white/30 transition-all hover:scale-105"
                  >
                    <div className="text-lg font-bold">
                      {surnameInfo.surname}
                      <span className="ml-1">{name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Suitable Characters by Element */}
            <div>
              <h3 className="text-lg font-semibold mb-4 opacity-90">
                {isZh
                  ? `适合${dominantElement}行的汉字`
                  : `Characters for ${elementInfo.en} Element`}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {suitableCharacters.map((char) => (
                  <Link
                    key={char.char}
                    href={`/${params.locale}/elements/${dominantElement}`}
                    className="bg-white/20 backdrop-blur-sm p-2 rounded text-center hover:bg-white/30 transition-all"
                  >
                    <div className="text-xl font-bold">{char.char}</div>
                    <div className="text-xs opacity-80">{char.pinyin}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Element Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 opacity-90">
                {isZh ? "查看其他五行" : "Explore Other Elements"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {FIVE_ELEMENTS.filter((e) => e !== dominantElement).map((e) => {
                  const info = FIVE_ELEMENT_INFO[e];
                  return (
                    <Link
                      key={e}
                      href={`/${params.locale}/elements/${e}`}
                      className={`px-4 py-2 rounded-full ${info.bgColor.replace("/30", "")} ${info.textColor} font-medium hover:opacity-80 transition-opacity`}
                    >
                      {e}行
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Related Surnames - Enhanced */}
        {relatedSurnames.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="w-1 h-8 bg-orange-600 rounded-full" />
              {isZh ? "相关姓氏" : "Related Surnames"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {relatedSurnames.map((s) => (
                <Link
                  key={s.surname}
                  href={`/${params.locale}/surnames/${s.surname}`}
                  className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow hover:shadow-lg transition-all text-center group hover:-translate-y-1"
                >
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {s.surname}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    #{s.ranking}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Five Elements Navigation */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-1 h-8 bg-indigo-600 rounded-full" />
            {isZh ? "五行起名指南" : "Five Elements Naming Guide"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {FIVE_ELEMENTS.map((e) => {
              const info = FIVE_ELEMENT_INFO[e];
              const isDominant = e === dominantElement;
              return (
                <Link
                  key={e}
                  href={`/${params.locale}/elements/${e}`}
                  className={`relative p-6 rounded-xl text-center transition-all hover:scale-105 ${
                    isDominant
                      ? `ring-2 ring-offset-2 ${info.textColor.replace("text-", "ring-")} shadow-lg`
                      : "hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${info.color} rounded-xl opacity-90`}
                  />
                  <div className="relative z-10 text-white">
                    <div className="text-4xl font-bold mb-2">{e}</div>
                    <div className="text-sm opacity-90">{info.en}</div>
                    {isDominant && (
                      <div className="mt-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                        {isZh ? "推荐" : "Recommended"}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-xl shadow-lg text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {isZh
              ? `为${surnameInfo.surname}姓宝宝起一个吉祥的名字`
              : `Create an Auspicious Name for ${surnameInfo.surname}`}
          </h2>
          <p className="mb-6 opacity-90 text-lg">
            {isZh
              ? "结合八字、五行、诗词，为您的孩子生成一个寓意美好的名字"
              : "Combine BaZi, Five Elements, and poetry to create a meaningful name"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${params.locale}/generate?surname=${encodeURIComponent(surnameInfo.surname)}`}
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isZh ? "开始起名" : "Start Naming"}
            </Link>
            <Link
              href={`/${params.locale}/elements/${dominantElement}`}
              className="inline-block px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              {isZh
                ? `查看${dominantElement}行起名`
                : `${elementInfo.en} Element Names`}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
