
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { POETRY_DATABASE } from "@/lib/data/poetry";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "经典名句 - 诗经楚辞起名灵感",
    en: "Classics - Naming Inspiration from the Book of Songs and Chu Ci",
    ja: "古典名句 - 詩経・楚辞の命名ヒント",
    ko: "고전 명구 - 시경·초사 작명 영감",
  };

  const descriptions = {
    zh: "精选《诗经》《楚辞》名句，提供适合起名的用字与诗句出处。",
    en: "Selected verses from the Book of Songs and Chu Ci with characters suitable for naming.",
    ja: "『詩経』『楚辞』の名句を厳選し、名付けに適した用字を紹介します。",
    ko: "『시경』『초사』의 명구를 선별해 작명에 적합한 한자를 제공합니다.",
  };

  return generatePageMetadata({
    locale,
    path: "/explore/classics",
    title: titles,
    description: descriptions,
    keywords: ["诗经", "楚辞", "经典起名", "classics naming", "Book of Songs"],
  });
}

export default async function ClassicsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("explore");

  const list = POETRY_DATABASE.filter(
    (p) => p.source === "诗经" || p.source === "楚辞",
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">{t("classics.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("classicsPage.subtitle")}</p>

      <div className="mt-8 grid gap-4">
        {list.map((p) => (
          <Link
            key={p.id}
            href={`/${locale}/explore/poetry/${encodeURIComponent(p.id)}`}
            className="rounded-xl border p-5 hover:bg-muted/40"
          >
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-muted-foreground">
                {p.source}
                {p.author ? ` · ${p.author}` : ""}
              </div>
            </div>
            <div className="mt-2 text-lg">{p.verse}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {t("ui.suitableChars")}: {p.suitableChars.join(" ")}
            </div>
          </Link>
        ))}
        {list.length === 0 && (
          <div className="rounded-xl border p-5 text-muted-foreground">
            {t("ui.noResults")}
          </div>
        )}
      </div>
    </div>
  );
}
