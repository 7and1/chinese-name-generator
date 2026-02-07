
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getCharacter } from "@/lib/data/characters";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ char?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "汉字查询 - 笔画部首五行字义",
    en: "Character Lookup - Strokes, Radicals, Five Elements, Meanings",
    ja: "漢字検索 - 画数・部首・五行・意味",
    ko: "한자 조회 - 획수·부수·오행·의미",
  };

  const descriptions = {
    zh: "查询汉字的拼音、笔画、部首、五行属性与字义，用于起名选字参考。",
    en: "Look up pinyin, stroke counts, radicals, five elements, and meanings for naming character selection.",
    ja: "名付けの用字選びの参考として、漢字の読み・画数・部首・五行・意味を調べます。",
    ko: "작명용 한자 선택을 위해 한자의 병음, 획수, 부수, 오행, 의미를 조회합니다.",
  };

  return generatePageMetadata({
    locale,
    path: "/explore/etymology",
    title: titles,
    description: descriptions,
    keywords: [
      "汉字查询",
      "笔画",
      "部首",
      "五行",
      "起名用字",
      "character lookup",
    ],
  });
}

export default async function EtymologyPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("explore");
  const kangxiLabel =
    locale === "zh"
      ? "康熙"
      : locale === "ja"
        ? "康熙"
        : locale === "ko"
          ? "강희"
          : "Kangxi";

  const sp = (await searchParams) ?? {};
  const char = (sp.char ?? "").trim().slice(0, 1);
  const info = char ? getCharacter(char) : undefined;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold">{t("characters.title")}</h1>
      <p className="mt-2 text-muted-foreground">
        {t("characters.description")}
      </p>

      <form className="mt-6 flex gap-2">
        <input
          name="char"
          defaultValue={char}
          placeholder={t("etymologyPage.placeholder")}
          className="h-9 w-56 rounded-md border bg-background px-3 text-sm"
        />
        <button className="h-9 rounded-md border px-3 text-sm hover:bg-muted/40">
          {t("ui.lookup")}
        </button>
      </form>

      {!char && (
        <div className="mt-8 rounded-xl border p-5 text-muted-foreground">
          {t("etymologyPage.emptyState")}
        </div>
      )}

      {char && !info && (
        <div className="mt-8 rounded-xl border p-5 text-muted-foreground">
          {t("etymologyPage.notFound")}
        </div>
      )}

      {info && (
        <div className="mt-8 rounded-xl border p-6">
          <div className="flex items-baseline gap-3">
            <div className="text-6xl font-bold">{info.char}</div>
            <div className="text-lg text-muted-foreground">{info.pinyin}</div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">
                {t("etymologyPage.meaning")}
              </div>
              <div className="mt-1">{info.meaning}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">
                {t("etymologyPage.fiveElement")}
              </div>
              <div className="mt-1">{info.fiveElement}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">
                {t("etymologyPage.radical")}
              </div>
              <div className="mt-1">{info.radical}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">
                {t("etymologyPage.strokes")}
              </div>
              <div className="mt-1">
                {info.strokeCount} ({kangxiLabel}: {info.kangxiStrokeCount})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
