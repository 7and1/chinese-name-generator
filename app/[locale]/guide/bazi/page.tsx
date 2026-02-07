
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
 * SEO: Generate metadata for BaZi guide page
 * Target keywords: "八字起名", "BaZi naming", "Four Pillars", "how to choose Chinese name by BaZi"
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "八字起名指南 - 生辰八字五行分析起名方法 | 如何根据八字起名",
    en: "BaZi Naming Guide - Four Pillars & Five Elements Analysis | How to Choose Chinese Name by BaZi",
    ja: "八字名付けガイド - 四柱推命と五行分析 | 八字で名付け",
    ko: "팔자 작명 가이드 - 사주와 오행 분석 | 팔자로 작명하는 법",
  };

  const descriptions = {
    zh: "详解八字起名方法，包括天干地支、五行生克、喜用神分析。手把手教您如何计算宝宝八字，分析五行强弱，确定喜用神忌神，起一个与命理相合的吉祥好名字。",
    en: "Complete BaZi naming guide: learn Heavenly Stems, Earthly Branches, Five Elements relationships, and how to analyze favorable elements. Step-by-step instructions for auspicious Chinese naming based on birth data.",
    ja: "八字名付けガイド。天干地支、五行相生相剋、喜用神の分析方法を詳しく解説。生年月日時から八字を計算し、縁起の良い名前を付ける手順を説明。",
    ko: "팔자 작명 가이드. 천간지지, 오행 상생상극, 희용신 분석 방법을 상세히 설명. 생년월일시로 팔자를 계산하고 길상한 이름을 짓는 단계별 안내.",
  };

  return generatePageMetadata({
    locale,
    path: "/guide/bazi",
    title: titles,
    description: descriptions,
    keywords: [
      "八字起名",
      "BaZi naming",
      "Four Pillars",
      "Five Elements",
      "天干地支",
      "喜用神",
      "生辰八字起名",
      "how to calculate BaZi",
      "五行分析",
      "四柱推命",
    ],
  });
}

export default async function BaziGuidePage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const isZh = params.locale === "zh";

  // SEO: HowTo structured data for "how to" rich results
  const howToSchema = generateHowToSchema({
    name: isZh
      ? "如何根据八字起名"
      : params.locale === "ja"
        ? "八字で名付けする方法"
        : params.locale === "ko"
          ? "팔자로 작명하는 방법"
          : "How to Choose a Chinese Name Based on BaZi",
    description: isZh
      ? "根据宝宝生辰八字分析五行喜忌，选择合适的汉字起一个吉祥的好名字"
      : "Analyze your baby's BaZi (Four Pillars) to determine favorable Five Elements and select appropriate characters for an auspicious name",
    steps: [
      {
        name: isZh ? "计算八字四柱" : "Calculate the Four Pillars (BaZi)",
        text: isZh
          ? "根据出生年月日时，排出年柱、月柱、日柱、时柱，每个柱由一个天干和一个地支组成，共八个字。"
          : "Based on birth year, month, day, and hour, determine the Year Pillar, Month Pillar, Day Pillar, and Hour Pillar. Each pillar consists of one Heavenly Stem and one Earthly Branch.",
      },
      {
        name: isZh ? "统计五行数量" : "Count the Five Elements",
        text: isZh
          ? "将八字中的天干地支按照金木水火土五行分类，统计每个五行的数量，判断五行强弱。"
          : "Classify each Heavenly Stem and Earthly Branch in the BaZi into Metal, Wood, Water, Fire, or Earth. Count the number of each element to determine strength.",
      },
      {
        name: isZh ? "确定喜用神" : "Identify Favorable Elements",
        text: isZh
          ? "通过五行强弱分析，找出八字中需要补益的五行（喜用神）和需要避免的五行（忌神）。缺什么补什么，过旺则克制。"
          : "Through Five Elements analysis, identify elements that need strengthening (favorable elements/Ji Yong Shen) and elements to avoid (unfavorable elements). Strengthen what's missing, control what's excessive.",
      },
      {
        name: isZh ? "选择五行汉字" : "Select Five Elements Characters",
        text: isZh
          ? "根据喜用神选择对应五行的汉字。金：铭、锦、钰；木：林、森、梓；水：涵、泽、浩；火：煜、晖、昊；土：宇、轩、坤。"
          : "Choose characters corresponding to favorable elements. Metal: Ming, Jin, Yu; Wood: Lin, Sen, Zi; Water: Han, Ze, Hao; Fire: Yu, Hui, Hao; Earth: Yu, Xuan, Kun.",
      },
      {
        name: isZh ? "组合吉祥名字" : "Combine into Auspicious Name",
        text: isZh
          ? "将选定的汉字组合成名字，注意音韵美感、五格数理和谐，避免不良谐音。建议用起名工具打分验证。"
          : "Combine selected characters into a name, paying attention to phonetic harmony and Wuge numerology. Avoid negative homophones. Use a naming tool for score verification.",
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
            {isZh ? "八字起名" : "BaZi"}
          </li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">八</div>
          <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {isZh
              ? "八字起名指南"
              : params.locale === "ja"
                ? "八字名付けガイド"
                : params.locale === "ko"
                  ? "팔자 작명 가이드"
                  : "BaZi Naming Guide"}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {isZh
              ? "根据生辰八字分析五行喜忌，起一个与命理相合的好名字"
              : params.locale === "ja"
                ? "生年月日時の八字から五行を分析し、命理に合った名前を"
                : params.locale === "ko"
                  ? "생년월일시의 팔자에서 오행을 분석하고 명리에 맞는 이름을"
                  : "Analyze Five Elements from birth date for an auspicious name"}
          </p>
        </div>

        {/* What is BaZi */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {isZh
              ? "什么是八字？"
              : params.locale === "ja"
                ? "八字とは？"
                : params.locale === "ko"
                  ? "팔자란 무엇인가?"
                  : "What is BaZi?"}
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            {isZh ? (
              <>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  八字，又称四柱，是中国传统命理学的核心概念。它根据一个人的出生年、月、日、时，
                  排列出天干地支的组合，共八个字，故称&quot;八字&quot;。
                </p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                  <li>
                    <strong>年柱</strong>：代表祖先、长辈、幼年运势
                  </li>
                  <li>
                    <strong>月柱</strong>：代表父母、兄弟、青年运势
                  </li>
                  <li>
                    <strong>日柱</strong>：代表自己、配偶、中年运势
                  </li>
                  <li>
                    <strong>时柱</strong>：代表子女、晚辈、晚年运势
                  </li>
                </ul>
              </>
            ) : (
              <>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  BaZi, also known as the Four Pillars of Destiny, is a core
                  concept in Chinese astrology. It arranges the Heavenly Stems
                  and Earthly Branches based on a person&apos;s birth year,
                  month, day, and hour.
                </p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
                  <li>
                    <strong>Year Pillar</strong>: Ancestors, elders, early life
                    fortune
                  </li>
                  <li>
                    <strong>Month Pillar</strong>: Parents, siblings, youth
                    fortune
                  </li>
                  <li>
                    <strong>Day Pillar</strong>: Self, spouse, middle-age
                    fortune
                  </li>
                  <li>
                    <strong>Hour Pillar</strong>: Children, juniors, late-life
                    fortune
                  </li>
                </ul>
              </>
            )}
          </div>
        </section>

        {/* Five Elements */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {isZh
              ? "五行分析"
              : params.locale === "ja"
                ? "五行分析"
                : params.locale === "ko"
                  ? "오행 분석"
                  : "Five Elements Analysis"}
          </h2>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {[
              {
                element: "金",
                color:
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                en: "Metal",
              },
              {
                element: "木",
                color:
                  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                en: "Wood",
              },
              {
                element: "水",
                color:
                  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                en: "Water",
              },
              {
                element: "火",
                color:
                  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                en: "Fire",
              },
              {
                element: "土",
                color:
                  "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
                en: "Earth",
              },
            ].map((item) => (
              <div
                key={item.element}
                className={`p-4 rounded-lg text-center ${item.color}`}
              >
                <div className="text-2xl font-bold">{item.element}</div>
                <div className="text-xs mt-1">{item.en}</div>
              </div>
            ))}
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {isZh ? (
              <>
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
                  五行相生相克
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  五行之间存在相生相克的关系：金生水、水生木、木生火、火生土、土生金（相生）；
                  金克木、木克土、土克水、水克火、火克金（相克）。
                </p>
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
                  喜用神与忌神
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  通过分析八字中五行的强弱，确定需要补益的五行（喜用神）和需要避免的五行（忌神）。
                  起名时应多选用喜用神对应的汉字。
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
                  Five Elements Relationships
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Five Elements have generative and controlling relationships:
                  Metal generates Water, Water generates Wood, Wood generates
                  Fire, Fire generates Earth, Earth generates Metal. Conversely,
                  Metal controls Wood, Wood controls Earth, Earth controls
                  Water, Water controls Fire, Fire controls Metal.
                </p>
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
                  Favorable and Unfavorable Elements
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Analyze the strength of Five Elements in the BaZi chart to
                  determine which elements need strengthening (favorable) and
                  which to avoid (unfavorable). Choose characters corresponding
                  to favorable elements when naming.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Naming Steps */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            {isZh
              ? "八字起名步骤"
              : params.locale === "ja"
                ? "八字名付けの手順"
                : params.locale === "ko"
                  ? "팔자 작명 단계"
                  : "BaZi Naming Steps"}
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: {
                  zh: "排出八字",
                  en: "Calculate BaZi",
                  ja: "八字を排出",
                  ko: "팔자 계산",
                },
                desc: {
                  zh: "根据出生年月日时，排出八字四柱",
                  en: "Calculate the Four Pillars based on birth date and time",
                  ja: "生年月日時から四柱を計算",
                  ko: "생년월일시로 사주 계산",
                },
              },
              {
                step: "2",
                title: {
                  zh: "分析五行",
                  en: "Analyze Five Elements",
                  ja: "五行を分析",
                  ko: "오행 분석",
                },
                desc: {
                  zh: "统计八字中各五行的数量，判断强弱",
                  en: "Count the Five Elements in the chart and determine their strength",
                  ja: "八字内の五行を数え、強弱を判断",
                  ko: "팔자 내 오행을 세어 강약 판단",
                },
              },
              {
                step: "3",
                title: {
                  zh: "确定喜用",
                  en: "Find Favorable Elements",
                  ja: "喜用神を確定",
                  ko: "희용신 확정",
                },
                desc: {
                  zh: "找出需要补益的五行（喜用神）",
                  en: "Identify elements that need strengthening (favorable elements)",
                  ja: "補強が必要な五行（喜用神）を見つける",
                  ko: "보강이 필요한 오행(희용신) 식별",
                },
              },
              {
                step: "4",
                title: {
                  zh: "选字起名",
                  en: "Select Characters",
                  ja: "漢字を選択",
                  ko: "한자 선택",
                },
                desc: {
                  zh: "选用对应喜用神的汉字组合成名字",
                  en: "Choose characters corresponding to favorable elements for the name",
                  ja: "喜用神に対応する漢字を選んで名前を構成",
                  ko: "희용신에 해당하는 한자를 선택하여 이름 구성",
                },
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.title[params.locale as keyof typeof item.title] ||
                      item.title.zh}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.desc[params.locale as keyof typeof item.desc] ||
                      item.desc.zh}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {isZh
              ? "起名示例"
              : params.locale === "ja"
                ? "名付け例"
                : params.locale === "ko"
                  ? "작명 예시"
                  : "Naming Example"}
          </h2>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  {isZh
                    ? "出生信息"
                    : params.locale === "ja"
                      ? "出生情報"
                      : params.locale === "ko"
                        ? "출생 정보"
                        : "Birth Information"}
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>
                    {isZh
                      ? "日期：2024年3月15日 14:30"
                      : "Date: March 15, 2024, 14:30"}
                  </li>
                  <li>{isZh ? "性别：男" : "Gender: Male"}</li>
                  <li>
                    {isZh
                      ? "八字：甲辰 丁卯 庚子 癸未"
                      : "BaZi: Jia-Chen Ding-Mao Geng-Zi Gui-Wei"}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  {isZh
                    ? "五行分析"
                    : params.locale === "ja"
                      ? "五行分析"
                      : params.locale === "ko"
                        ? "오행 분석"
                        : "Five Elements Analysis"}
                </h4>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>{isZh ? "金：1个（偏弱）" : "Metal: 1 (Weak)"}</li>
                  <li>{isZh ? "木：2个（适中）" : "Wood: 2 (Balanced)"}</li>
                  <li>{isZh ? "水：2个（适中）" : "Water: 2 (Balanced)"}</li>
                  <li>{isZh ? "火：1个（偏弱）" : "Fire: 1 (Weak)"}</li>
                  <li>{isZh ? "土：2个（适中）" : "Earth: 2 (Balanced)"}</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">
                {isZh
                  ? "推荐名字（补金、火）"
                  : params.locale === "ja"
                    ? "推奨名前（金・火補強）"
                    : params.locale === "ko"
                      ? "추천 이름(금·화 보강)"
                      : "Recommended Names (Metal/Fire)"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {["铭宇", "锦轩", "昊然", "煜祺", "瑞霖", "皓轩"].map(
                  (name) => (
                    <span
                      key={name}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded"
                    >
                      {name}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <Link
          href={`/${params.locale}/generate`}
          className="block bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white text-center hover:opacity-95 transition-opacity"
        >
          <h2 className="text-2xl font-bold mb-2">
            {isZh
              ? "开始八字起名"
              : params.locale === "ja"
                ? "八字名付けを開始"
                : params.locale === "ko"
                  ? "팔자 작명 시작"
                  : "Start BaZi Naming"}
          </h2>
          <p className="opacity-90">
            {isZh
              ? "输入宝宝的出生时间，智能分析八字并生成吉祥名字"
              : params.locale === "ja"
                ? "赤ちゃんの出生時間を入力し、八字を分析して縁起の良い名前を生成"
                : params.locale === "ko"
                  ? "아기의 출생 시간을 입력하고 팔자를 분석하여 길상한 이름 생성"
                  : "Enter birth time for BaZi analysis and auspicious name generation"}
          </p>
        </Link>
      </div>
    </div>
  );
}
