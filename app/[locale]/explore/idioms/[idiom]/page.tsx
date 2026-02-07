
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { IDIOM_DATABASE, type Idiom } from "@/lib/data/idioms";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string; idiom: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, idiom } = await params;
  setRequestLocale(locale);

  const idiomText = decodeURIComponent(idiom);
  const data = IDIOM_DATABASE.find((i) => i.idiom === idiomText);

  if (!data) {
    return generatePageMetadata({
      locale,
      path: `/explore/idioms/${encodeURIComponent(idiomText)}`,
      title: {
        zh: "成语详情 - 中文姓名生成器",
        en: "Idiom Detail - Chinese Name Generator",
        ja: "成語の詳細 - 中国語名前ジェネレーター",
        ko: "성어 상세 - 중국어 이름 생성기",
      },
      description: {
        zh: "成语详情页",
        en: "Idiom detail page",
        ja: "成語の詳細ページ",
        ko: "성어 상세 페이지",
      },
      noindex: true,
    });
  }

  const titleSuffix = {
    zh: "成语起名灵感",
    en: "Idiom Naming Inspiration",
    ja: "成語で名付け",
    ko: "성어로 작명 영감",
  };

  return generatePageMetadata({
    locale,
    path: `/explore/idioms/${encodeURIComponent(data.idiom)}`,
    title: {
      zh: `${data.idiom} - ${titleSuffix.zh}`,
      en: `${data.idiom} - ${titleSuffix.en}`,
      ja: `${data.idiom} - ${titleSuffix.ja}`,
      ko: `${data.idiom} - ${titleSuffix.ko}`,
    },
    description: {
      zh: data.meaning,
      en: data.meaning,
      ja: data.meaning,
      ko: data.meaning,
    },
    ogType: "article",
    keywords: [data.idiom, data.pinyin, data.category, "成语起名", "idioms"],
  });
}

export default async function IdiomDetailPage({ params }: Props) {
  const { locale, idiom } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("explore");

  const idiomText = decodeURIComponent(idiom);
  const data = IDIOM_DATABASE.find((i) => i.idiom === idiomText);
  if (!data) notFound();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-sm text-muted-foreground">
        <Link href={`/${locale}/explore/idioms`} className="hover:underline">
          {t("idioms.title")}
        </Link>{" "}
        / {data.category}
      </div>

      <h1 className="mt-2 text-3xl font-bold">{data.idiom}</h1>
      <div className="mt-1 text-muted-foreground">{data.pinyin}</div>

      <div className="mt-8 rounded-xl border p-6">
        <div className="text-lg">{data.meaning}</div>
        {"origin" in data && (data as Idiom & { origin: string }).origin && (
          <div className="mt-4 text-sm text-muted-foreground">
            {t("ui.origin")}: {(data as Idiom & { origin: string }).origin}
          </div>
        )}
        {"example" in data && (data as Idiom & { example: string }).example && (
          <div className="mt-2 text-sm text-muted-foreground">
            {t("ui.example")}: {(data as Idiom & { example: string }).example}
          </div>
        )}
        <div className="mt-6 text-sm text-muted-foreground">
          {t("ui.suitableChars")}: {data.suitableChars.join(" ")}
        </div>
      </div>

      <div className="mt-8">
        <Link
          href={`/${locale}/generate?source=idioms`}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted/40"
        >
          {t("idiomsPage.generateCta")}
        </Link>
      </div>
    </div>
  );
}
