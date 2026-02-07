
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { POETRY_DATABASE } from "@/lib/data/poetry";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "诗词起名 - 精选名句与用字灵感",
    en: "Poetry Naming - Curated Verses for Name Inspiration",
    ja: "詩から名付け - 名付けに適した詩句",
    ko: "시로 작명 - 네이밍에 적합한 시구",
  };

  const descriptions = {
    zh: "浏览《诗经》《楚辞》《唐诗》《宋词》等经典诗词名句，筛选适合起名的用字，并一键生成名字。",
    en: "Browse curated verses and find suitable characters for naming, then generate names inspired by poetry.",
    ja: "名付けに適した詩句を閲覧し、用字のヒントを得て詩から着想した名前を生成します。",
    ko: "작명에 적합한 시구를 살펴보고 추천 한자를 확인한 뒤 시에서 영감 받은 이름을 생성합니다.",
  };

  return generatePageMetadata({
    locale,
    path: "/explore/poetry",
    title: titles,
    description: descriptions,
    keywords: ["诗词起名", "诗经", "楚辞", "唐诗", "宋词", "poetry naming"],
  });
}

export default async function PoetryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("explore");

  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();

  const list = q
    ? POETRY_DATABASE.filter(
        (p) =>
          p.title.includes(q) ||
          p.verse.includes(q) ||
          p.keywords.some((k: string) => k.includes(q)),
      )
    : POETRY_DATABASE;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("poetry.title")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("poetry.description")}
          </p>
        </div>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder={t("poetryPage.searchPlaceholder")}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm md:w-80"
          />
          <button className="h-9 rounded-md border px-3 text-sm hover:bg-muted/40">
            {t("ui.search")}
          </button>
        </form>
      </div>

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
