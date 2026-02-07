
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { POETRY_DATABASE } from "@/lib/data/poetry";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const decodedId = decodeURIComponent(id);
  const verse = POETRY_DATABASE.find((p) => p.id === decodedId);

  if (!verse) {
    return generatePageMetadata({
      locale,
      path: `/explore/poetry/${encodeURIComponent(decodedId)}`,
      title: {
        zh: "诗词详情 - 中文姓名生成器",
        en: "Poetry Detail - Chinese Name Generator",
        ja: "詩の詳細 - 中国語名前ジェネレーター",
        ko: "시 상세 - 중국어 이름 생성기",
      },
      description: {
        zh: "诗词详情页",
        en: "Poetry detail page",
        ja: "詩の詳細ページ",
        ko: "시 상세 페이지",
      },
      noindex: true,
    });
  }

  const titleSuffix = {
    zh: "诗词起名灵感",
    en: "Poetry Naming Inspiration",
    ja: "詩から名付け",
    ko: "시로 작명 영감",
  };

  const descFallback = verse.translation || verse.verse;

  return generatePageMetadata({
    locale,
    path: `/explore/poetry/${encodeURIComponent(verse.id)}`,
    title: {
      zh: `${verse.title} - ${titleSuffix.zh}`,
      en: `${verse.title} - ${titleSuffix.en}`,
      ja: `${verse.title} - ${titleSuffix.ja}`,
      ko: `${verse.title} - ${titleSuffix.ko}`,
    },
    description: {
      zh: verse.verse,
      en: descFallback,
      ja: descFallback,
      ko: descFallback,
    },
    ogType: "article",
    keywords: [verse.title, verse.source, "诗词起名", "poetry naming"],
  });
}

export default async function PoetryDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("explore");

  const verse = POETRY_DATABASE.find((p) => p.id === decodeURIComponent(id));
  if (!verse) notFound();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          <Link href={`/${locale}/explore/poetry`} className="hover:underline">
            {t("poetry.title")}
          </Link>{" "}
          / {verse.source}
        </div>
        <h1 className="text-3xl font-bold">{verse.title}</h1>
        {verse.author && (
          <div className="text-muted-foreground">{verse.author}</div>
        )}
      </div>

      <div className="mt-8 rounded-xl border p-6">
        <div className="text-2xl leading-relaxed">{verse.verse}</div>
        <div className="mt-4 text-muted-foreground">{verse.translation}</div>
        <div className="mt-6 text-sm text-muted-foreground">
          {t("ui.suitableChars")}: {verse.suitableChars.join(" ")}
        </div>
      </div>

      <div className="mt-8">
        <Link
          href={`/${locale}/generate?source=poetry`}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted/40"
        >
          {t("poetryPage.generateCta")}
        </Link>
      </div>
    </div>
  );
}
