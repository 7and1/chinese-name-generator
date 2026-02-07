
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import { CHINESE_SURNAMES, getSurnamesByInitial } from "@/lib/data/surnames";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "中国姓氏大全 - 百家姓查询与姓氏起源介绍",
    en: "Chinese Surnames List - Hundred Family Surnames & Origins",
    ja: "中国の姓氏リスト - 百家姓と由来",
    ko: "중국 성씨 목록 - 백가성과 기원",
  };

  const descriptions = {
    zh: "收录中国前100大姓，按拼音字母索引，详细介绍每个姓氏的起源、历史名人、地区分布和起名建议。",
    en: "Complete list of top 100 Chinese surnames with origins, famous people, regional distribution, and naming suggestions.",
    ja: "中国の上位100姓のリスト。由来、有名人、地域分布、名付けのアドバイスを詳しく紹介。",
    ko: "중국 상위 100개 성씨 목록. 기원, 유명인, 지역 분포, 작명 제안을 상세히 소개.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.zh,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.zh,
      url: new URL(`/${locale}/surnames`, env.siteUrl).toString(),
    },
    alternates: {
      canonical: new URL(`/${locale}/surnames`, env.siteUrl).toString(),
    },
  };
}

export default async function SurnamesPage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const groupedSurnames = getSurnamesByInitial();
  const initials = Object.keys(groupedSurnames).sort();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Chinese Surnames List",
            description:
              "Complete list of Chinese surnames with origins and meanings",
            url: new URL(`/${params.locale}/surnames`, env.siteUrl).toString(),
            about: {
              "@type": "Thing",
              name: "Chinese Surnames",
              description: "Traditional Chinese family names and their origins",
            },
          }),
        }}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {params.locale === "zh"
            ? "中国姓氏大全"
            : params.locale === "ja"
              ? "中国の姓氏リスト"
              : params.locale === "ko"
                ? "중국 성씨 목록"
                : "Chinese Surnames List"}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {params.locale === "zh"
            ? "收录中国前100大姓，探索姓氏文化的深厚底蕴"
            : params.locale === "ja"
              ? "中国の上位100姓を収録、姓氏文化の奥深さを探求"
              : params.locale === "ko"
                ? "중국 상위 100개 성씨 수록, 성씨 문화의 깊이 탐색"
                : "Top 100 Chinese surnames with origins, meanings, and cultural significance"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {CHINESE_SURNAMES.slice(0, 4).map((surname) => (
          <Link
            key={surname.surname}
            href={`/${params.locale}/surnames/${surname.surname}`}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
          >
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {surname.surname}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              #{surname.ranking}
            </div>
          </Link>
        ))}
      </div>

      {/* Alphabetical Navigation */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {initials.map((initial) => (
            <a
              key={initial}
              href={`#${initial}`}
              className="px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              {initial}
            </a>
          ))}
        </div>
      </div>

      {/* Surnames by Initial */}
      <div className="max-w-4xl mx-auto space-y-8">
        {initials.map((initial) => (
          <div key={initial} id={initial} className="scroll-mt-20">
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100 border-b pb-2">
              {initial}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {groupedSurnames[initial].map((surname) => (
                <Link
                  key={surname.surname}
                  href={`/${params.locale}/surnames/${surname.surname}`}
                  className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow hover:shadow-md transition-shadow hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <div className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    {surname.surname}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {surname.pinyin}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    #{surname.ranking}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SEO Content Section */}
      <div className="max-w-4xl mx-auto mt-16 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          {params.locale === "zh"
            ? "关于中国姓氏"
            : params.locale === "ja"
              ? "中国の姓氏について"
              : params.locale === "ko"
                ? "중국 성씨에 대하여"
                : "About Chinese Surnames"}
        </h2>

        <div className="prose dark:prose-invert max-w-none">
          {params.locale === "zh" ? (
            <>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                中国姓氏是中华文化的重要组成部分，承载着悠久的历史和深厚的文化底蕴。
                据《百家姓》记载，中国有超过500个姓氏，其中前100大姓覆盖了全国人口的85%以上。
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
                姓氏起源
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                中国姓氏的起源多种多样，主要包括：以国为氏（如齐、鲁、秦）、以邑为氏（如苏、崔）、
                以官为氏（如司马、司徒）、以技艺为氏（如陶、巫）、以排行或次第为氏（如孟、仲、叔、季）等。
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
                五大姓氏
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                李、王、张、刘、陈是中国五大姓氏，人口均超过5000万。其中李姓人口约1亿，
                是中国第一大姓，王姓和张紧随其后。
              </p>
            </>
          ) : params.locale === "ja" ? (
            <>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                中国の姓氏は中華文化の重要な構成要素であり、長い歴史と深い文化的背景を担っています。
                『百家姓』によると、中国には500以上の姓氏があり、上位100姓で全国人口の85%以上をカバーしています。
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
                姓氏の由来
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                中国の姓氏の由来は多種多様であり、主に国名（斉・魯・秦など）、地名（蘇・崔など）、
                官職名（司馬・司徒など）、職業（陶・巫など）、出生順（孟・仲・叔・季など）などが挙げられます。
              </p>
            </>
          ) : params.locale === "ko" ? (
            <>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                중국의 성씨는 중화 문화의 중요한 구성 요소로, 긴 역사와 깊은
                문화적 배경을 지니고 있습니다. 『백가성』에 따르면 중국에는
                500개 이상의 성씨가 있으며, 상위 100개 성씨가 전체 인구의 85%
                이상을 차지합니다.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
                성씨의 기원
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                중국 성씨의 기원은 다양하며, 주로 국명(제·노·진 등), 지명(소·최
                등), 관직명(사마·사도 등), 직업(도·무 등), 출생 순서(맹·중·숙·계
                등) 등이 있습니다.
              </p>
            </>
          ) : (
            <>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Chinese surnames are an integral part of Chinese culture,
                carrying a long history and profound cultural significance.
                According to the &quot;Hundred Family Surnames&quot;
                (Baijiaxing), there are over 500 Chinese surnames, with the top
                100 covering more than 85% of the population.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
                Origins of Chinese Surnames
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Chinese surnames have diverse origins, including: from state
                names (Qi, Lu, Qin), from location names (Su, Cui), from
                official titles (Sima, Situ), from professions (Tao, Wu), and
                from birth order (Meng, Zhong, Shu, Ji), among others.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-800 dark:text-slate-200">
                The Five Great Surnames
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Li, Wang, Zhang, Liu, and Chen are the five most common Chinese
                surnames, each with over 50 million people. Li is the most
                common with about 100 million people, followed closely by Wang
                and Zhang.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Related Links */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
          {params.locale === "zh"
            ? "相关链接"
            : params.locale === "ja"
              ? "関連リンク"
              : params.locale === "ko"
                ? "관련 링크"
                : "Related Links"}
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/${params.locale}/elements`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {params.locale === "zh"
              ? "五行起名"
              : params.locale === "ja"
                ? "五行の名付け"
                : params.locale === "ko"
                  ? "오행 작명"
                  : "Five Elements Naming"}
          </Link>
          <Link
            href={`/${params.locale}/guide`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {params.locale === "zh"
              ? "起名指南"
              : params.locale === "ja"
                ? "名付けガイド"
                : params.locale === "ko"
                  ? "작명 가이드"
                  : "Naming Guide"}
          </Link>
          <Link
            href={`/${params.locale}/generate`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {params.locale === "zh"
              ? "生成名字"
              : params.locale === "ja"
                ? "名前を生成"
                : params.locale === "ko"
                  ? "이름 생성"
                  : "Generate Names"}
          </Link>
        </div>
      </div>
    </div>
  );
}
