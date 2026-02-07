
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { FIVE_ELEMENTS, FIVE_ELEMENT_INFO } from "@/lib/data/elements";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "五行起名 - 金木水火土用字与起名指南",
    en: "Five Elements Naming - Characters and Guides for Metal/Wood/Water/Fire/Earth",
    ja: "五行の名付け - 金木水火土の漢字と名付けガイド",
    ko: "오행 작명 - 금목수화토 한자와 작명 가이드",
  };

  const descriptions = {
    zh: "按五行（金木水火土）查看适合起名的汉字与起名建议，理解五行性格特征与相生相克搭配。",
    en: "Browse naming characters and suggestions by the Five Elements (Metal, Wood, Water, Fire, Earth), including compatibility guidance.",
    ja: "五行（金木水火土）別に名付けに適した漢字とアドバイスを閲覧し、相生相克の組み合わせを理解します。",
    ko: "오행(금목수화토)별로 작명에 적합한 한자와 제안을 살펴보고 상생상극 조합을 이해합니다.",
  };

  return generatePageMetadata({
    locale,
    path: "/elements",
    title: titles,
    description: descriptions,
    keywords: [
      "五行起名",
      "five elements naming",
      "金木水火土",
      "Metal Wood Water Fire Earth",
      "起名用字",
      "characters for naming",
    ],
  });
}

export default async function ElementsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isZh = locale === "zh";

  const heading = isZh
    ? "五行起名"
    : locale === "ja"
      ? "五行の名付け"
      : locale === "ko"
        ? "오행 작명"
        : "Five Elements Naming";

  const subtitle = isZh
    ? "按金木水火土浏览用字、特性与相生相克搭配建议"
    : locale === "ja"
      ? "金木水火土の用字・特性・相生相克の組み合わせを確認"
      : locale === "ko"
        ? "금목수화토 용자·특성·상생상극 조합 제안"
        : "Browse characters, traits, and compatibility by Metal/Wood/Water/Fire/Earth";

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
          {heading}
        </h1>
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FIVE_ELEMENTS.map((element) => {
          const info = FIVE_ELEMENT_INFO[element];
          const localizedDescription =
            info.description[locale as keyof typeof info.description] ||
            info.description.zh;

          const localizedName = isZh
            ? `${element}行`
            : locale === "ja"
              ? `${info.ja}行`
              : locale === "ko"
                ? `${info.ko}행`
                : `${info.en} Element`;

          const compatibleLabel = isZh
            ? "相生"
            : locale === "ja"
              ? "相生"
              : locale === "ko"
                ? "상생"
                : "Compatible";

          const avoidLabel = isZh
            ? "相克"
            : locale === "ja"
              ? "相剋"
              : locale === "ko"
                ? "상극"
                : "Avoid";

          return (
            <Link
              key={element}
              href={`/${locale}/elements/${element}`}
              className="group block rounded-xl border bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${info.color}`} />
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-14 w-14 rounded-xl ${info.bgColor} ${info.textColor} flex items-center justify-center text-3xl font-bold`}
                  >
                    {element}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {localizedName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {info.en}
                    </div>
                  </div>
                  <div className="ml-auto text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    <svg
                      className="w-5 h-5"
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

                <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                  {localizedDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md border px-2 py-1 text-muted-foreground">
                    {compatibleLabel}: {info.compatibleElements.join(" ")}
                  </span>
                  <span className="rounded-md border px-2 py-1 text-muted-foreground">
                    {avoidLabel}: {info.incompatibleElements.join(" ")}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
