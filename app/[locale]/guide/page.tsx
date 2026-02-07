
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { env } from "@/lib/env";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "起名指南 - 八字五行五格音韵全面起名教程",
    en: "Naming Guide - Complete Tutorial on BaZi, Five Elements, Wuge, and Phonetics",
    ja: "名付けガイド - 八字、五行、五格、音韻の完全チュートリアル",
    ko: "작명 가이드 - 팔자, 오행, 오격, 음운 완전 튜토리얼",
  };

  const descriptions = {
    zh: "全面的中文起名指南，包括八字起名、五行起名、五格剖象起名、音韵起名等多种方法，助您为宝宝起一个吉祥美好的名字。",
    en: "Complete Chinese naming guide covering BaZi, Five Elements, Wuge numerology, and phonetics for auspicious baby names.",
    ja: "中国語の名付けガイド。八字、五行、五格数理、音韻をカバーし、赤ちゃんに縁起の良い名前をつけます。",
    ko: "중국어 이름 작명 가이드. 팔자, 오행, 오격 수리, 음운을 포함하여 아기에게 길상한 이름을 짓습니다.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.zh,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.zh,
      url: new URL(`/${locale}/guide`, env.siteUrl).toString(),
    },
    alternates: {
      canonical: new URL(`/${locale}/guide`, env.siteUrl).toString(),
    },
  };
}

const GUIDE_SECTIONS = [
  {
    id: "bazi",
    icon: "八",
    title: {
      zh: "八字起名",
      en: "BaZi Naming",
      ja: "八字の名付け",
      ko: "팔자 작명",
    },
    description: {
      zh: "根据生辰八字分析五行喜忌，选择补益五行的汉字，达到命理平衡。",
      en: "Analyze birth date and time to determine Five Elements balance, select characters that strengthen favorable elements.",
      ja: "生年月日時の八字から五行のバランスを分析し、吉運を補う漢字を選びます。",
      ko: "생년월일시의 팔자에서 오행의 균형을 분석하고 길운을 보완하는 한자를 선택합니다.",
    },
    color: "from-blue-500 to-cyan-500",
    slug: "bazi",
  },
  {
    id: "wuge",
    icon: "五",
    title: {
      zh: "五格剖象",
      en: "Wuge Numerology",
      ja: "五格数理",
      ko: "오격 수리",
    },
    description: {
      zh: "通过天格、人格、地格、外格、总格五格分析，选择吉利的笔画组合。",
      en: "Analyze Heaven, Human, Earth, Outer, and Total grids to select auspicious stroke combinations.",
      ja: "天格、人格、地格、外格、総格の五格を分析し、縁起の良い画数の組み合わせを選びます。",
      ko: "천격, 인격, 지격, 외격, 총격의 오격을 분석하여 길한 획수 조합을 선택합니다.",
    },
    color: "from-purple-500 to-pink-500",
    slug: "wuge",
  },
  {
    id: "phonetics",
    icon: "音",
    title: {
      zh: "音韵起名",
      en: "Phonetic Naming",
      ja: "音韻の名付け",
      ko: "음운 작명",
    },
    description: {
      zh: "分析声调搭配，避免不良谐音，确保名字朗朗上口、优美动听。",
      en: "Analyze tone patterns, avoid negative homophones, ensure the name sounds pleasant and smooth.",
      ja: "声調の組み合わせを分析し、不快な響きを避け、美しく響く名前にします。",
      ko: "성조 조합을 분석하고 부정적인 동음이의어를 피해 아름답게 들리는 이름으로 만듭니다.",
    },
    color: "from-green-500 to-emerald-500",
    slug: "phonetics",
  },
];

export default async function GuidePage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const isZh = params.locale === "zh";

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: isZh ? "中文起名指南" : "Chinese Naming Guide",
            description: isZh
              ? "全面的中文起名指南"
              : "Complete guide to Chinese naming",
            step: GUIDE_SECTIONS.map((section) => ({
              "@type": "HowToStep",
              name:
                section.title[params.locale as keyof typeof section.title] ||
                section.title.zh,
              text:
                section.description[
                  params.locale as keyof typeof section.description
                ] || section.description.zh,
              url: new URL(
                `/${params.locale}/guide/${section.slug}`,
                env.siteUrl,
              ).toString(),
            })),
          }),
        }}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {isZh
            ? "起名指南"
            : params.locale === "ja"
              ? "名付けガイド"
              : params.locale === "ko"
                ? "작명 가이드"
                : "Naming Guide"}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isZh
            ? "掌握传统起名方法，为您的孩子起一个吉祥美好的名字"
            : params.locale === "ja"
              ? "伝統的な名付け方法をマスターし、赤ちゃんに縁起の良い名前を"
              : params.locale === "ko"
                ? "전통적인 작명 방법을 마스터하고 아기에게 길상한 이름을"
                : "Master traditional naming methods for an auspicious name"}
        </p>
      </div>

      {/* Guide Sections */}
      <div className="max-w-5xl mx-auto space-y-6">
        {GUIDE_SECTIONS.map((section) => (
          <Link
            key={section.id}
            href={`/${params.locale}/guide/${section.slug}`}
            className="block"
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${section.color}`} />
              <div className="p-6 md:p-8 flex items-start gap-6">
                <div
                  className={`text-5xl bg-gradient-to-br ${section.color} text-white w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">
                    {section.title[
                      params.locale as keyof typeof section.title
                    ] || section.title.zh}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    {section.description[
                      params.locale as keyof typeof section.description
                    ] || section.description.zh}
                  </p>
                </div>
                <div className="text-slate-400 dark:text-slate-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Introduction Content */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          {isZh
            ? "为什么起名很重要？"
            : params.locale === "ja"
              ? "なぜ名付けが重要なのか？"
              : params.locale === "ko"
                ? "왜 작명이 중요한가요?"
                : "Why Naming Matters"}
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          {isZh ? (
            <>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                在中国传统文化中，名字是一个人一生的标志，承载着父母对孩子的期望和祝福。
                一个好名字不仅要读起来优美动听，更重要的是要与孩子的生辰八字相合，
                以此来弥补命理中的不足，增强运势。
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
                起名的四大要素
              </h3>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>
                  <strong>八字分析</strong>
                  ：根据出生时间分析五行强弱，确定喜用神
                </li>
                <li>
                  <strong>五行补益</strong>：选择符合喜用神的汉字，达到五行平衡
                </li>
                <li>
                  <strong>五格剖象</strong>
                  ：分析姓名笔画数理，选择吉祥的数理组合
                </li>
                <li>
                  <strong>音韵优美</strong>：注意声调搭配，避免不良谐音
                </li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                In traditional Chinese culture, a name is a lifelong symbol that
                carries parents&apos; expectations and blessings for their
                child. A good name should not only sound pleasant but also
                harmonize with the child&apos;s BaZi (Four Pillars) to enhance
                their fortune.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
                Four Key Elements of Naming
              </h3>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                <li>
                  <strong>BaZi Analysis</strong>: Analyze Five Elements strength
                  based on birth time
                </li>
                <li>
                  <strong>Five Elements Balance</strong>: Select characters that
                  strengthen favorable elements
                </li>
                <li>
                  <strong>Wuge Numerology</strong>: Analyze stroke counts for
                  auspicious combinations
                </li>
                <li>
                  <strong>Phonetic Harmony</strong>: Ensure proper tone patterns
                  and avoid negative homophones
                </li>
              </ul>
            </>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto mt-12">
        <Link
          href={`/${params.locale}/generate`}
          className="block bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white text-center hover:opacity-95 transition-opacity"
        >
          <h2 className="text-2xl font-bold mb-2">
            {isZh
              ? "开始起名"
              : params.locale === "ja"
                ? "名付けを始める"
                : params.locale === "ko"
                  ? "작명 시작"
                  : "Start Naming"}
          </h2>
          <p className="opacity-90">
            {isZh
              ? "使用我们的智能起名工具，结合多种方法为您生成完美名字"
              : params.locale === "ja"
                ? "スマート名付けツールを使用して、完璧な名前を生成"
                : params.locale === "ko"
                  ? "스마트 작명 도구를 사용하여 완벽한 이름 생성"
                  : "Use our smart naming tool to generate perfect names"}
          </p>
        </Link>
      </div>
    </div>
  );
}
