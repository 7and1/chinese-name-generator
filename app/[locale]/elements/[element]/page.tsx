
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import {
  getCharactersByElement,
  SAMPLE_CHARACTERS,
} from "@/lib/data/characters";
import type { FiveElement } from "@/lib/types";
import { notFound } from "next/navigation";
import { FIVE_ELEMENTS, FIVE_ELEMENT_INFO } from "@/lib/data/elements";
import {
  FIVE_ELEMENTS_ENHANCED,
  getCharactersForElement,
} from "@/lib/data/elements-enhanced";
import { PageShareButton } from "@/components/share/page-share-button";
import { ElementVisualization } from "@/components/elements/element-visualization";
import { ElementInternalLinks } from "@/components/elements/element-internal-links";

type Props = {
  params: Promise<{ locale: string; element: FiveElement }>;
};

const ELEMENTS: FiveElement[] = FIVE_ELEMENTS;
const ELEMENT_INFO = FIVE_ELEMENT_INFO;
const ELEMENT_INFO_ENHANCED = FIVE_ELEMENTS_ENHANCED;

// Generate static params for all elements
export async function generateStaticParams() {
  return ELEMENTS.map((element) => ({
    element: element,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, element } = await params;
  setRequestLocale(locale);

  const info = ELEMENT_INFO[element];
  const enhanced = ELEMENT_INFO_ENHANCED[element];

  const titles = {
    zh: `${element}行起名 - ${info.en}五行适合的字与名字推荐`,
    en: `${element} (${info.en}) Element - Characters and Naming Guide`,
    ja: `${element}（${info.en}）五行 - 漢字と名付けガイド`,
    ko: `${element}（${info.en}）오행 - 한자와 작명 가이드`,
  };

  const descriptions = {
    zh: `${element}行起名指南：了解${element}的含义，查看适合${element}的汉字，获取${element}行的起名建议和推荐名字。`,
    en: `Five Elements naming guide for ${element} (${info.en}): Learn about the ${info.en.toLowerCase()} element, suitable characters, and naming suggestions.`,
    ja: `${element}（${info.en}）五行の名付けガイド：${info.en}の意味を理解し、適切な漢字と名付けのアドバイスを入手。`,
    ko: `${element}（${info.en}）오행 작명 가이드：${info.en}의 의미를 이해하고 적합한 한자와 작명 제안을 받으세요.`,
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.zh,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.zh,
      url: new URL(`/${locale}/elements/${element}`, env.siteUrl).toString(),
      siteName: "Chinese Name Generator",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      type: "article",
      images: [
        {
          url: `/api/og/element?element=${element}`,
          width: 1200,
          height: 630,
          alt: `${element} ${info.en} Element`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale as keyof typeof titles] || titles.zh,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    },
    alternates: {
      canonical: new URL(
        `/${locale}/elements/${element}`,
        env.siteUrl,
      ).toString(),
    },
  };
}

export default async function ElementDetailPage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const element = params.element;

  if (!ELEMENTS.includes(element)) {
    notFound();
  }

  const info = ELEMENT_INFO[element];
  const enhanced = ELEMENT_INFO_ENHANCED[element];
  const characters = getCharactersByElement(element);
  const isZh = params.locale === "zh";

  // Get name suggestions combining with this element
  const nameSuggestions = SAMPLE_CHARACTERS.filter(
    (c) => c.fiveElement === element && c.hskLevel && c.hskLevel <= 5,
  ).slice(0, 24);

  const pageUrl = new URL(
    `/${params.locale}/elements/${element}`,
    env.siteUrl,
  ).toString();

  // Get suitable characters from enhanced data
  const enhancedCharacters = getCharactersForElement(element);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${element} ${isZh ? "五行" : "Five Element"} - ${info.en}`,
            description:
              info.description[
                params.locale as keyof typeof info.description
              ] || info.description.zh,
            url: pageUrl,
            about: {
              "@type": "Thing",
              name: `${element} ${isZh ? "五行" : "Five Element"}`,
              description: info.description.zh,
            },
          }),
        }}
      />

      {/* Header with Share */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            <Link
              href={`/${params.locale}/elements`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {isZh ? "五行大全" : "Five Elements"}
            </Link>
            <span className="mx-2">/</span>
            {element}
          </div>
        </div>
        <PageShareButton
          url={pageUrl}
          title={`${element} (${info.en}) ${isZh ? "五行" : "Element"}`}
          description={
            enhanced.description[
              params.locale as keyof typeof enhanced.description
            ] || enhanced.description.zh
          }
          locale={params.locale}
        />
      </div>

      {/* Hero Section - Enhanced */}
      <div
        className={`max-w-5xl mx-auto mb-12 p-8 md:p-12 rounded-2xl bg-gradient-to-br ${info.color} text-white relative overflow-hidden`}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 text-9xl font-bold opacity-20">
            {element}
          </div>
          <div className="absolute bottom-0 left-0 text-9xl font-bold opacity-20">
            {element}
          </div>
        </div>

        <div className="relative z-10 text-center">
          <div className="text-7xl md:text-8xl font-bold mb-4 drop-shadow-lg">
            {element}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{info.en}</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {info.description[params.locale as keyof typeof info.description] ||
              info.description.zh}
          </p>

          {/* Seasonal Association */}
          {enhanced && (
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full">
                {isZh ? "季节" : "Season"}: {enhanced.season}
                <span className="mx-1">·</span>
                {enhanced.seasonEn}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full">
                {isZh ? "方位" : "Direction"}: {enhanced.direction}
                <span className="mx-1">·</span>
                {enhanced.directionEn}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full">
                {isZh ? "颜色" : "Color"}: {enhanced.colorAssociation}
                <span className="mx-1">·</span>
                {enhanced.colorEn}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Characteristics */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="w-1 h-8 bg-blue-600 rounded-full" />
          {isZh
            ? "五行特性"
            : params.locale === "ja"
              ? "五行の特性"
              : params.locale === "ko"
                ? "오행 특성"
                : "Characteristics"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(
            info.characteristics[
              params.locale as keyof typeof info.characteristics
            ] || info.characteristics.zh
          ).map((characteristic, idx) => (
            <div
              key={idx}
              className={`${info.bgColor} p-4 rounded-xl text-center border border-slate-200 dark:border-slate-700`}
            >
              <div className={`font-semibold ${info.textColor}`}>
                {characteristic}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Attributes */}
        {enhanced && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {isZh ? "脏腑" : "Organ"}
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {enhanced.bodyOrgan[isZh ? "zh" : "en"]}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {isZh ? "情志" : "Emotion"}
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {enhanced.emotion[isZh ? "zh" : "en"]}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {isZh ? "德行" : "Virtue"}
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {enhanced.virtues[isZh ? "zh" : "en"].join("·")}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {isZh ? "时辰" : "Hour"}
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {enhanced.hour}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Element Visualization */}
      <ElementVisualization currentElement={element} locale={params.locale} />

      {/* Compatible & Incompatible Elements - Enhanced */}
      <section className="max-w-5xl mx-auto mb-12 grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-green-600 dark:text-green-400 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
              +
            </span>
            {isZh
              ? "相生（生我者）"
              : params.locale === "ja"
                ? "相生（生む）"
                : params.locale === "ko"
                  ? "상생（나를 생김）"
                  : "Compatible (Generates Me)"}
          </h3>
          <div className="flex flex-wrap gap-3">
            {info.compatibleElements.map((e) => {
              const eInfo = ELEMENT_INFO[e as FiveElement];
              return (
                <Link
                  key={e}
                  href={`/${params.locale}/elements/${e}`}
                  className={`px-4 py-2 rounded-lg ${eInfo.bgColor.replace("/30", "")} ${eInfo.textColor} font-semibold hover:opacity-80 transition-opacity`}
                >
                  {e}
                </Link>
              );
            })}
          </div>
          {enhanced && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {isZh
                ? `${enhanced.compatibleElements.join("、")}生${element}`
                : `${enhanced.compatibleElements.join(", ")} generates ${element}`}
            </p>
          )}
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
              -
            </span>
            {isZh
              ? "相克（克我者）"
              : params.locale === "ja"
                ? "相克（克む）"
                : params.locale === "ko"
                  ? "상극（나를 극함）"
                  : "Incompatible (Controls Me)"}
          </h3>
          <div className="flex flex-wrap gap-3">
            {info.incompatibleElements.map((e) => {
              const eInfo = ELEMENT_INFO[e as FiveElement];
              return (
                <Link
                  key={e}
                  href={`/${params.locale}/elements/${e}`}
                  className={`px-4 py-2 rounded-lg ${eInfo.bgColor.replace("/30", "")} ${eInfo.textColor} font-semibold hover:opacity-80 transition-opacity`}
                >
                  {e}
                </Link>
              );
            })}
          </div>
          {enhanced && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              {isZh
                ? `${enhanced.incompatibleElements.join("、")}克${element}`
                : `${enhanced.incompatibleElements.join(", ")} controls ${element}`}
            </p>
          )}
        </div>
      </section>

      {/* Internal Links Section */}
      <ElementInternalLinks
        locale={params.locale}
        currentElement={element}
        characters={characters.slice(0, 6)}
      />

      {/* Characters with this Element - Enhanced */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="w-1 h-8 bg-purple-600 rounded-full" />
          {isZh
            ? `适合${element}行的汉字`
            : params.locale === "ja"
              ? `${element}の漢字`
              : params.locale === "ko"
                ? `${element}의 한자`
                : `Characters for ${element} Element`}
        </h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {characters.slice(0, 60).map((char) => (
              <Link
                key={char.char}
                href={`/${params.locale}/generate?element=${encodeURIComponent(element)}&character=${encodeURIComponent(char.char)}`}
                className={`${info.bgColor} p-3 rounded-lg text-center hover:shadow-md transition-shadow group`}
              >
                <div
                  className={`text-2xl font-bold ${info.textColor} group-hover:scale-110 transition-transform`}
                >
                  {char.char}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {char.pinyin}
                </div>
              </Link>
            ))}
          </div>

          {/* Enhanced Famous Characters */}
          {enhanced && enhanced.famousCharacters.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                {isZh ? `${element}行常用字` : `Common ${info.en} Characters`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {enhanced.famousCharacters.map((char) => (
                  <span
                    key={char.char}
                    className={`px-3 py-2 rounded-lg ${info.bgColor} ${info.textColor}`}
                  >
                    <span className="font-bold">{char.char}</span>
                    <span className="text-xs ml-1 opacity-70">
                      {char.meaning}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Name Suggestions - Enhanced */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="w-1 h-8 bg-green-600 rounded-full" />
          {isZh
            ? `${element}行名字推荐`
            : params.locale === "ja"
              ? `${element}の名前`
              : params.locale === "ko"
                ? `${element}의 이름`
                : `Name Suggestions for ${element}`}
        </h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {nameSuggestions.map((char) => (
              <Link
                key={char.char}
                href={`/${params.locale}/generate?element=${encodeURIComponent(element)}&character=${encodeURIComponent(char.char)}`}
                className={`${info.bgColor} p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition-shadow hover:scale-105`}
              >
                <div className={`text-3xl font-bold ${info.textColor} mb-2`}>
                  {char.char}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {char.pinyin}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {char.meaning}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Naming Guide - Enhanced */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="w-1 h-8 bg-amber-600 rounded-full" />
          {isZh
            ? `${element}行起名指南`
            : params.locale === "ja"
              ? `${element}の名付けガイド`
              : params.locale === "ko"
                ? `${element} 작명 가이드`
                : `Naming Guide for ${element}`}
        </h2>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-8 rounded-xl shadow-lg">
          <div className="prose dark:prose-invert max-w-none">
            {params.locale === "zh" ? (
              <>
                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  五行相生相克原理
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  五行理论认为，金生水、水生木、木生火、火生土、土生金（相生）；
                  金克木、木克土、土克水、水克火、火克金（相克）。
                  在起名时，如果孩子八字中{element}行不足，可以用{element}
                  行的字来补足。
                </p>

                {enhanced && (
                  <>
                    <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                      {element}行适合的寓意
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {enhanced.suitableNameMeanings.zh.map((meaning) => (
                        <span
                          key={meaning}
                          className={`px-3 py-1 rounded-full ${info.bgColor} ${info.textColor} text-sm`}
                        >
                          {meaning}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  如何判断需要{element}行
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  通过分析孩子的生辰八字，计算五行强弱。如果{element}
                  行较弱或缺失， 起名时应多选用{element}行的字，以达到五行平衡。
                </p>

                {enhanced && (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">起名建议：</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {enhanced.namingAdvice.zh}
                    </p>
                  </div>
                )}

                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  {element}行起名示例
                </h3>
                <ul className="list-none grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                  {nameSuggestions.slice(0, 6).map((char) => (
                    <li key={char.char} className="flex items-center gap-2">
                      <span className={`font-bold ${info.textColor}`}>
                        {char.char}
                      </span>
                      <span>：{char.meaning}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  Five Elements Principle
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  The Five Elements theory states that Metal generates Water,
                  Water generates Wood, Wood generates Fire, Fire generates
                  Earth, and Earth generates Metal (generation cycle).
                  Conversely, Metal controls Wood, Wood controls Earth, Earth
                  controls Water, Water controls Fire, and Fire controls Metal
                  (control cycle).
                </p>

                {enhanced && (
                  <>
                    <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                      Suitable Meanings for {info.en} Element
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {enhanced.suitableNameMeanings.en.map((meaning) => (
                        <span
                          key={meaning}
                          className={`px-3 py-1 rounded-full ${info.bgColor} ${info.textColor} text-sm`}
                        >
                          {meaning}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <h3 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  When to Use {element} Element
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Analyze the child&apos;s BaZi (Four Pillars) to determine the
                  balance of Five Elements. If {element} (
                  {info.en.toLowerCase()}) is weak or missing, incorporate
                  characters with this element to achieve harmony.
                </p>

                {enhanced && (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2">Naming Advice:</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {enhanced.namingAdvice.en}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* All Elements Navigation - Enhanced */}
      <section className="max-w-5xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span className="w-1 h-8 bg-indigo-600 rounded-full" />
          {isZh
            ? "其他五行"
            : params.locale === "ja"
              ? "他の五行"
              : params.locale === "ko"
                ? "다른 오행"
                : "Other Elements"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ELEMENTS.filter((e) => e !== element).map((e) => {
            const eInfo = ELEMENT_INFO[e];
            return (
              <Link
                key={e}
                href={`/${params.locale}/elements/${e}`}
                className={`bg-gradient-to-br ${eInfo.color} p-6 rounded-xl text-white text-center hover:scale-105 transition-transform shadow-lg`}
              >
                <div className="text-4xl font-bold mb-2">{e}</div>
                <div className="text-sm opacity-90">{eInfo.en}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA - Enhanced */}
      <div className="max-w-5xl mx-auto">
        <Link
          href={`/${params.locale}/generate?element=${encodeURIComponent(element)}`}
          className={`block bg-gradient-to-r ${info.color} p-8 rounded-xl shadow-lg text-white text-center hover:scale-[1.02] transition-transform`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {isZh
              ? `生成${element}行名字`
              : params.locale === "ja"
                ? `${element}の名前を生成`
                : params.locale === "ko"
                  ? `${element} 이름 생성`
                  : `Generate ${element} Names`}
          </h2>
          <p className="opacity-90 text-lg">
            {isZh
              ? `使用智能算法为您的孩子生成符合${element}行的吉祥名字`
              : `Generate auspicious names with ${element} (${info.en}) element for your child`}
          </p>
          {enhanced && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm opacity-80">
              {enhanced.suitableNameMeanings[isZh ? "zh" : "en"]
                .slice(0, 5)
                .map((m) => (
                  <span key={m} className="px-3 py-1 bg-white/20 rounded-full">
                    {m}
                  </span>
                ))}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
