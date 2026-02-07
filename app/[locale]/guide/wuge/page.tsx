
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import { JsonLd, generateHowToSchema } from "@/components/seo/json-ld";
import { generatePageMetadata } from "@/lib/seo/metadata";

// SEO: Type for page params
type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * SEO: Generate metadata for Wuge guide page
 * Target keywords: "五格剖象", "Wuge numerology", "五格数理", "Chinese name numerology"
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "五格剖象起名指南 - 姓名五格数理分析起名方法 | 81数理吉凶",
    en: "Wuge Numerology Guide - Five Grids Analysis for Chinese Names | 81 Numerology Meanings",
    ja: "五格数理名付けガイド - 中国名の五格分析 | 81数理の吉凶",
    ko: "오격 수리 작명 가이드 - 중국 이름의 오격 분석 | 81수리 길흉",
  };

  const descriptions = {
    zh: "详解五格剖象姓名学，包括天格、人格、地格、外格、总格的含义和计算方法，以及81数理吉凶解释。教您如何选择吉利的笔画组合。",
    en: "Complete Wuge numerology guide: learn Heaven, Human, Earth, Outer, and Total grids with calculation methods and 81 numerology interpretations. Choose auspicious stroke combinations for Chinese names.",
    ja: "五格数理ガイド。天格、人格、地格、外格、総格の意味と計算方法、81数理の吉凶を詳しく解説。縁起の良い画数の組み合わせを選びましょう。",
    ko: "오격 수리 가이드. 천격, 인격, 지격, 외격, 총격의 의미와 계산 방법, 81수리의 길흉을 상세히 설명. 길한 획수 조합을 선택하세요.",
  };

  return generatePageMetadata({
    locale,
    path: "/guide/wuge",
    title: titles,
    description: descriptions,
    keywords: [
      "五格剖象",
      "Wuge numerology",
      "五格数理",
      "81数理",
      "天格人格地格",
      "Chinese name numerology",
      "姓名学",
      "笔画吉凶",
      "姓名打分",
      "三才五格",
    ],
  });
}

const WUGE_GRIDS = [
  {
    name: "天格",
    en: "Heaven Grid",
    ja: "天格",
    ko: "천격",
    description: {
      zh: "代表祖先运、先天运，影响前半生运势",
      en: "Represents ancestral fortune, innate luck, affects early life",
      ja: "祖先運、先天的運を表し、前半生に影響",
      ko: "조상운, 선천적 운을 나타내며 전반생에 영향",
    },
    formula: {
      zh: "姓氏笔画+1（单姓）或姓氏笔画之和（复姓）",
      en: "Surname strokes + 1 (single) or sum of surname strokes (compound)",
      ja: "姓の画数+1（単姓）または姓の画数の和（複姓）",
      ko: "성의 획수+1(단성) 또는 성의 획수의 합(복성)",
    },
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "人格",
    en: "Human Grid",
    ja: "人格",
    ko: "인격",
    description: {
      zh: "代表主运、核心性格，影响一生运势",
      en: "Represents main fortune, core personality, affects entire life",
      ja: "主運、核心的性格を表し、一生に影響",
      ko: "주운, 핵심 성격을 나타내며 일생에 영향",
    },
    formula: {
      zh: "姓氏最后字+名字第一个字的笔画之和",
      en: "Sum of last surname character and first given name character strokes",
      ja: "姓の最後の文字と名の最初の文字の画数の和",
      ko: "성의 마지막 문자와 이름의 첫 문자의 획수의 합",
    },
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "地格",
    en: "Earth Grid",
    ja: "地格",
    ko: "지격",
    description: {
      zh: "代表前运、基础运，影响中年前运势",
      en: "Represents early fortune, foundation luck, affects life before middle age",
      ja: "前運、基礎運を表し、中年前に影響",
      ko: "전운, 기초 운을 나타내며 중년 전에 영향",
    },
    formula: {
      zh: "名字笔画之和（单名+1）",
      en: "Sum of given name strokes (+1 for single character names)",
      ja: "名の画数の和（単名は+1）",
      ko: "이름의 획수의 합(단명은 +1)",
    },
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "外格",
    en: "Outer Grid",
    ja: "外格",
    ko: "외격",
    description: {
      zh: "代表副运、社交运，影响人际关系",
      en: "Represents auxiliary fortune, social luck, affects interpersonal relationships",
      ja: "副運、社交運を表し、人間関係に影響",
      ko: "부운, 사교운을 나타내며 인간관계에 영향",
    },
    formula: {
      zh: "总格-人格+1（单名）或名字笔画+姓氏首字+1",
      en: "Total Grid - Human Grid + 1, or given name strokes + first surname char + 1",
      ja: "総格-人格+1 または 名の画数+姓の最初の文字+1",
      ko: "총격-인격+1 또는 이름의 획수+성의 첫 문자+1",
    },
    color: "from-orange-500 to-red-500",
  },
  {
    name: "总格",
    en: "Total Grid",
    ja: "総格",
    ko: "총격",
    description: {
      zh: "代表总运、晚运，影响中年以后运势",
      en: "Represents total fortune, late luck, affects life after middle age",
      ja: "総運、晩運を表し、中年以降に影響",
      ko: "총운, 만운을 나타내며 중년 이후에 영향",
    },
    formula: {
      zh: "姓氏和名字的笔画总和",
      en: "Sum of all surname and given name character strokes",
      ja: "姓と名のすべての文字の画数の和",
      ko: "성과 이름의 모든 문자의 획수의 합",
    },
    color: "from-pink-500 to-rose-500",
  },
];

export default async function WugeGuidePage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const isZh = params.locale === "zh";

  // SEO: HowTo structured data for Wuge naming process
  const howToSchema = generateHowToSchema({
    name: isZh
      ? "如何根据五格剖象起名"
      : params.locale === "ja"
        ? "五格数理で名付けする方法"
        : params.locale === "ko"
          ? "오격 수리로 작명하는 법"
          : "How to Choose a Chinese Name Based on Wuge Numerology",
    description: isZh
      ? "根据姓名五格数理分析，选择吉利的笔画数组合，起一个数理吉祥的好名字"
      : "Analyze name through Wuge (Five Grids) numerology to select auspicious stroke combinations for a harmonious Chinese name",
    steps: [
      {
        name: isZh ? "确定姓氏笔画" : "Determine Surname Stroke Count",
        text: isZh
          ? "查字典或使用笔画查询工具，确定姓氏的标准笔画数（康熙笔画）。注意繁体字和简体字的笔画可能不同。"
          : "Use a dictionary or stroke count tool to determine the standard stroke count for the surname (Kangxi strokes). Note that traditional and simplified characters may have different counts.",
      },
      {
        name: isZh ? "计算五格" : "Calculate the Five Grids",
        text: isZh
          ? "天格=姓氏笔画+1（单姓）或姓氏笔画之和（复姓）；人格=姓氏最后字+名字第一字笔画；地格=名字笔画之和（单名+1）；外格=总格-人格+1；总格=姓名笔画总和。"
          : "Heaven Grid = Surname strokes + 1 (single) or sum (compound); Human Grid = Last surname char + First given name char; Earth Grid = Given name sum (+1 for single); Outer Grid = Total - Human + 1; Total Grid = All strokes sum.",
      },
      {
        name: isZh ? "查阅81数理" : "Check 81 Numerology",
        text: isZh
          ? "将五格的计算结果（1-81的数字）对照81数理吉凶表，确定各格的吉凶。吉数为1、3、5、6、7、8、11、13、15、16、18、21、23、24、25、31、32、33、35、37、39、41、45、47、48、52、57、61、63、65、67、68、81。"
          : "Compare the Five Grids results (numbers 1-81) with the 81 Numerology auspiciousness table. Lucky numbers: 1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 18, 21, 23, 24, 25, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81.",
      },
      {
        name: isZh
          ? "选择吉利笔画组合"
          : "Select Auspicious Stroke Combinations",
        text: isZh
          ? "根据五格吉数，筛选出笔画数合适的汉字。人格和总格最重要，应选择吉数。三才配置（天格人格地格的五行关系）也要相生相合。"
          : "Based on auspicious Five Grid numbers, select characters with appropriate stroke counts. Human Grid and Total Grid are most important and should be auspicious. Three Elements configuration (Five Elements relationship between Heaven, Human, Earth grids) should be harmonious.",
      },
      {
        name: isZh ? "组合名字并验证" : "Combine and Verify",
        text: isZh
          ? "将选定的汉字组合成名字，再次计算五格，确保所有格数吉利。同时检查音韵美感和无不良谐音。建议用起名工具进行最终验证。"
          : "Combine selected characters into a name and recalculate the Five Grids to ensure all are auspicious. Also check phonetic harmony and avoid negative homophones. Use a naming tool for final verification.",
      },
    ],
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* SEO: HowTo structured data for rich results */}
      <JsonLd data={howToSchema} />

      {/* Breadcrumb */}
      <nav className="max-w-4xl mx-auto mb-8 text-sm">
        <ol className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <li>
            <Link href={`/${params.locale}`} className="hover:underline">
              {isZh ? "首页" : "Home"}
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/${params.locale}/guide`} className="hover:underline">
              {isZh ? "起名指南" : "Guide"}
            </Link>
          </li>
          <li>/</li>
          <li className="text-slate-800 dark:text-slate-200 font-medium">
            {isZh ? "五格剖象" : "Wuge"}
          </li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">五</div>
          <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {isZh
              ? "五格剖象起名指南"
              : params.locale === "ja"
                ? "五格数理名付けガイド"
                : params.locale === "ko"
                  ? "오격 수리 작명 가이드"
                  : "Wuge Numerology Naming Guide"}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {isZh
              ? "通过姓名五格分析，选择吉利的笔画数组合，起一个数理吉祥的好名字"
              : params.locale === "ja"
                ? "姓名の五格分析により、縁起の良い画数の組み合わせを選び、数理的に吉運な名前を"
                : params.locale === "ko"
                  ? "성명의 오격 분석을 통해 길한 획수 조합을 선택하고 수리적으로 길상한 이름을"
                  : "Analyze name grids for auspicious stroke combinations and numerological harmony"}
          </p>
        </div>

        {/* What is Wuge */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {isZh
              ? "什么是五格剖象？"
              : params.locale === "ja"
                ? "五格数理とは？"
                : params.locale === "ko"
                  ? "오격 수리란 무엇인가?"
                  : "What is Wuge Numerology?"}
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            {isZh ? (
              <p className="text-slate-600 dark:text-slate-400">
                五格剖象，又称五格数理，是中国传统姓名学的重要组成部分。它通过分析姓名的笔画数，
                计算出天格、人格、地格、外格、总格五格，并结合81数理吉凶来判断名字的好坏。
              </p>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                Wuge (Five Grids) numerology is an important component of
                traditional Chinese onomastics. It analyzes the stroke counts of
                Chinese characters to calculate five grids: Heaven, Human,
                Earth, Outer, and Total, combined with 81 numerology
                interpretations to determine the auspiciousness of a name.
              </p>
            )}
          </div>
        </section>

        {/* Five Grids */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            {isZh
              ? "五格详解"
              : params.locale === "ja"
                ? "五格の詳細"
                : params.locale === "ko"
                  ? "오격 상세"
                  : "The Five Grids"}
          </h2>
          <div className="space-y-4">
            {WUGE_GRIDS.map((grid, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${grid.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3
                      className={`text-xl font-bold bg-gradient-to-r ${grid.color} bg-clip-text text-transparent`}
                    >
                      {grid.name} ({grid.en})
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {grid.description[
                      params.locale as keyof typeof grid.description
                    ] || grid.description.zh}
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {isZh
                        ? "计算公式："
                        : params.locale === "ja"
                          ? "計算式："
                          : params.locale === "ko"
                            ? "계산 공식："
                            : "Formula: "}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {grid.formula[
                        params.locale as keyof typeof grid.formula
                      ] || grid.formula.zh}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 81 Numerology */}
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            {isZh
              ? "81数理吉凶"
              : params.locale === "ja"
                ? "81数理の吉凶"
                : params.locale === "ko"
                  ? "81수리의 길흉"
                  : "81 Numerology Meanings"}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
            {Array.from({ length: 81 }, (_, i) => i + 1).map((num) => {
              const isLucky = [
                1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 18, 21, 23, 24, 25, 31, 32,
                33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81,
              ].includes(num);
              return (
                <div
                  key={num}
                  className={`p-2 rounded text-center text-sm ${
                    isLucky
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  <div className="font-bold">{num}</div>
                  <div className="text-xs">
                    {isLucky ? (isZh ? "吉" : "Good") : isZh ? "凶" : "Bad"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <Link
          href={`/${params.locale}/generate`}
          className="block bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-lg text-white text-center hover:opacity-95 transition-opacity"
        >
          <h2 className="text-2xl font-bold mb-2">
            {isZh
              ? "开始五格起名"
              : params.locale === "ja"
                ? "五格名付けを開始"
                : params.locale === "ko"
                  ? "오격 작명 시작"
                  : "Start Wuge Naming"}
          </h2>
          <p className="opacity-90">
            {isZh
              ? "输入姓氏，系统自动计算五格并推荐吉利名字"
              : params.locale === "ja"
                ? "姓を入力すると、システムが五格を計算して縁起の良い名前を推奨"
                : params.locale === "ko"
                  ? "성을 입력하면 시스템이 오격을 계산하여 길상한 이름 추천"
                  : "Enter surname for automatic Wuge calculation and auspicious name recommendations"}
          </p>
        </Link>
      </div>
    </div>
  );
}
