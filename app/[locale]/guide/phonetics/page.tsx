
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
    zh: "音韵起名指南 - 声调搭配与谐音分析起名方法",
    en: "Phonetic Naming Guide - Tone Patterns and Homophone Analysis",
    ja: "音韻名付けガイド - 声調と同音異義語の分析",
    ko: "음운 작명 가이드 - 성조와 동음이의어 분석",
  };

  const descriptions = {
    zh: "详解音韵起名方法，包括四声搭配、音韵美感、不良谐音避免，教你起一个朗朗上口的好名字。",
    en: "Complete guide to phonetic naming: learn about tone patterns, aesthetic sounds, and avoiding negative homophones.",
    ja: "音韻名付けガイド。四声の組み合わせ、音韻の美しさ、不快な同音異義語の回避を詳しく解説。",
    ko: "음운 작명 가이드. 사성의 조합, 음운의 아름다움, 부정적인 동음이의어 회피를 상세히 설명.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.zh,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.zh,
      url: new URL(`/${locale}/guide/phonetics`, env.siteUrl).toString(),
    },
    alternates: {
      canonical: new URL(`/${locale}/guide/phonetics`, env.siteUrl).toString(),
    },
  };
}

const TONES = [
  {
    tone: 1,
    name: "阴平",
    mark: "ˉ",
    example: "妈",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    tone: 2,
    name: "阳平",
    mark: "ˊ",
    example: "麻",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  {
    tone: 3,
    name: "上声",
    mark: "ˇ",
    example: "马",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  {
    tone: 4,
    name: "去声",
    mark: "ˋ",
    example: "骂",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
];

const GOOD_PATTERNS = [
  {
    pattern: "1-2-1",
    zh: "阴平-阳平-阴平",
    en: "Level-Rising-Level",
    example: "张天阳",
    reason: { zh: "起伏有致，响亮悦耳", en: "Rhythmic and pleasant" },
  },
  {
    pattern: "1-3-4",
    zh: "阴平-上声-去声",
    en: "Level-Falling-Falling",
    example: "孙小美",
    reason: { zh: "抑扬顿挫，活泼明快", en: "Varied and lively" },
  },
  {
    pattern: "2-1-4",
    zh: "阳平-阴平-去声",
    en: "Rising-Level-Falling",
    example: "李思远",
    reason: { zh: "开合有度，优雅大方", en: "Balanced and elegant" },
  },
  {
    pattern: "3-2-1",
    zh: "上声-阳平-阴平",
    en: "Falling-Rising-Level",
    example: "马天翔",
    reason: { zh: "沉稳有力，气势恢宏", en: "Steady and powerful" },
  },
];

const BAD_HOMOPHONES = [
  {
    name: "魏生津",
    bad: "卫生巾",
    reason: { zh: "女性用品谐音", en: "Feminine product homophone" },
  },
  {
    name: "杜子腾",
    bad: "肚子疼",
    reason: { zh: "身体不适谐音", en: "Physical discomfort homophone" },
  },
  {
    name: "范统",
    bad: "饭桶",
    reason: { zh: "贬义谐音", en: "Derogatory homophone" },
  },
  {
    name: "吴仁耀",
    bad: "无人要",
    reason: { zh: "贬义谐音", en: "Derogatory homophone" },
  },
];

export default async function PhoneticsGuidePage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const isZh = params.locale === "zh";

  return (
    <div className="container mx-auto px-4 py-12">
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
            {isZh ? "音韵起名" : "Phonetics"}
          </li>
        </ol>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">音</div>
          <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            {isZh
              ? "音韵起名指南"
              : params.locale === "ja"
                ? "音韻名付けガイド"
                : params.locale === "ko"
                  ? "음운 작명 가이드"
                  : "Phonetic Naming Guide"}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {isZh
              ? "掌握声调搭配规律，避免不良谐音，起一个朗朗上口的好名字"
              : params.locale === "ja"
                ? "声調のルールを掌握し、不快な同音異義語を避け、響きの良い名前を"
                : params.locale === "ko"
                  ? "성조 규칙을 익히고 부정적인 동음이의어를 피해好听한 이름을"
                  : "Master tone patterns and avoid negative homophones for a pleasant-sounding name"}
          </p>
        </div>

        {/* Four Tones */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            {isZh
              ? "四声介绍"
              : params.locale === "ja"
                ? "四声の紹介"
                : params.locale === "ko"
                  ? "사성 소개"
                  : "The Four Tones"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isZh
              ? "汉语有四个声调，每个汉字都有其特定的声调。好的名字应该注意声调的搭配，避免单调重复。"
              : "Chinese has four tones, and each character has a specific tone. A good name should pay attention to tone combinations and avoid monotony."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TONES.map((t) => (
              <div
                key={t.tone}
                className={`p-4 rounded-lg text-center ${t.color}`}
              >
                <div className="text-3xl font-bold mb-2">{t.mark}</div>
                <div className="font-semibold mb-1">{t.name}</div>
                <div className="text-sm">
                  {isZh ? `第${t.tone}声` : `Tone ${t.tone}`}
                </div>
                <div className="text-xs mt-2 opacity-75">例：{t.example}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Good Patterns */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            {isZh
              ? "推荐声调组合"
              : params.locale === "ja"
                ? "推奨声調の組み合わせ"
                : params.locale === "ko"
                  ? "권장 성조 조합"
                  : "Recommended Tone Patterns"}
          </h2>
          <div className="space-y-4">
            {GOOD_PATTERNS.map((pattern, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
                    {pattern.example}
                  </div>
                  <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">
                    {pattern.pattern}
                  </div>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {pattern.reason[
                    params.locale as keyof typeof pattern.reason
                  ] || pattern.reason.zh}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bad Homophones */}
        <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            {isZh
              ? "避免不良谐音"
              : params.locale === "ja"
                ? "不快な同音異義語を避ける"
                : params.locale === "ko"
                  ? "부정적인 동음이의어 피하기"
                  : "Avoid Negative Homophones"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isZh
              ? "起名时要特别注意避免与贬义词或尴尬词汇谐音，以免给孩子带来不必要的困扰。"
              : "Pay special attention to avoid homophones with derogatory or awkward meanings that could cause unnecessary discomfort."}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {BAD_HOMOPHONES.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {item.name}
                  </div>
                  <div className="text-slate-400">→</div>
                  <div className="text-lg text-slate-600 dark:text-slate-400">
                    {item.bad}
                  </div>
                </div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-500">
                  {item.reason[params.locale as keyof typeof item.reason] ||
                    item.reason.zh}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
            {isZh
              ? "音韵起名技巧"
              : params.locale === "ja"
                ? "音韻名付けのコツ"
                : params.locale === "ko"
                  ? "음운 작명 팁"
                  : "Phonetic Naming Tips"}
          </h2>
          <div className="space-y-4">
            {[
              {
                title: {
                  zh: "声调起伏",
                  en: "Tone Variation",
                  ja: "声調の変化",
                  ko: "성조 변화",
                },
                desc: {
                  zh: "名字的声调应该有起伏，避免全平或全降",
                  en: "Names should have tone variation, avoid all level or all falling tones",
                  ja: "名前の声調には変化を持たせ、全て平声や降下調を避ける",
                  ko: "이름의 성조는 변화가 있어야 하며 전부 평성이나 내려가는 성조를 피함",
                },
              },
              {
                title: {
                  zh: "开口音结尾",
                  en: "End with Open Sound",
                  ja: "開口音で終わる",
                  ko: "개구음으로 끝내기",
                },
                desc: {
                  zh: "名字以开口音结尾更加响亮",
                  en: "Names ending with open sounds sound more resonant",
                  ja: "名前を開口音で終わるとより響きが良い",
                  ko: "이름을 개구음으로 끝내면 더욱 울림이 좋음",
                },
              },
              {
                title: {
                  zh: "避免绕口",
                  en: "Avoid Tongue Twisters",
                  ja: "早口言葉を避ける",
                  ko: "사자성어 피하기",
                },
                desc: {
                  zh: "避免声母韵母相同或相近，造成拗口",
                  en: "Avoid same or similar initials/finals that cause difficulty in pronunciation",
                  ja: "同じまたは類似した声母・韻母を避け、発音を難しくしない",
                  ko: "같거나 유사한 초성・중성을 피해 발음을 어렵게 하지 않음",
                },
              },
            ].map((tip, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                    {tip.title[params.locale as keyof typeof tip.title] ||
                      tip.title.zh}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {tip.desc[params.locale as keyof typeof tip.desc] ||
                      tip.desc.zh}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Link
          href={`/${params.locale}/generate`}
          className="block bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-lg text-white text-center hover:opacity-95 transition-opacity"
        >
          <h2 className="text-2xl font-bold mb-2">
            {isZh
              ? "开始音韵起名"
              : params.locale === "ja"
                ? "音韻名付けを開始"
                : params.locale === "ko"
                  ? "음운 작명 시작"
                  : "Start Phonetic Naming"}
          </h2>
          <p className="opacity-90">
            {isZh
              ? "使用智能音韵分析，生成朗朗上口的好名字"
              : params.locale === "ja"
                ? "スマート音韻分析で、響きの良い名前を生成"
                : params.locale === "ko"
                  ? "스마트 음운 분석으로 좋게 들리는 이름 생성"
                  : "Use smart phonetic analysis to generate pleasant-sounding names"}
          </p>
        </Link>
      </div>
    </div>
  );
}
