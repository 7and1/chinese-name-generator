
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { IDIOM_DATABASE } from "@/lib/data/idioms";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string; category?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "成语起名 - 寓意美好的成语典故与用字",
    en: "Idioms for Naming - Positive Idioms and Suitable Characters",
    ja: "成語で名付け - 縁起の良い成語と用字",
    ko: "성어로 작명 - 좋은 의미의 성어와 한자",
  };

  const descriptions = {
    zh: "浏览寓意美好的成语典故，按分类筛选并搜索，获取适合起名的用字灵感。",
    en: "Browse and search positive idioms by category and find suitable characters for naming inspiration.",
    ja: "縁起の良い成語をカテゴリ別に閲覧・検索し、名付けに適した用字のヒントを得ます。",
    ko: "좋은 의미의 성어를 카테고리별로 탐색·검색하고 작명에 적합한 한자 영감을 얻습니다.",
  };

  return generatePageMetadata({
    locale,
    path: "/explore/idioms",
    title: titles,
    description: descriptions,
    keywords: ["成语起名", "成语典故", "idioms naming", "四字成语", "用字"],
  });
}

export default async function IdiomsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("explore");

  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();
  const category = (sp.category ?? "").trim();

  const list = IDIOM_DATABASE.filter((i) => {
    if (category && i.category !== category) return false;
    if (!q) return true;
    return i.idiom.includes(q) || i.pinyin.includes(q) || i.meaning.includes(q);
  });

  const categories = Array.from(new Set(IDIOM_DATABASE.map((i) => i.category)));

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("idioms.title")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("idioms.description")}
          </p>
        </div>
        <form className="flex flex-col gap-2 md:flex-row md:items-center">
          <select
            name="category"
            defaultValue={category}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          >
            <option value="">{t("ui.allCategories")}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder={t("idiomsPage.searchPlaceholder")}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm md:w-72"
            />
            <button className="h-9 rounded-md border px-3 text-sm hover:bg-muted/40">
              {t("ui.search")}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 grid gap-4">
        {list.map((i) => (
          <Link
            key={i.idiom}
            href={`/${locale}/explore/idioms/${encodeURIComponent(i.idiom)}`}
            className="rounded-xl border p-5 hover:bg-muted/40"
          >
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-lg font-semibold">{i.idiom}</div>
              <div className="text-sm text-muted-foreground">{i.pinyin}</div>
              <div className="ml-auto text-xs text-muted-foreground">
                {i.category}
              </div>
            </div>
            <div className="mt-2 text-muted-foreground">{i.meaning}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {t("ui.suitableChars")}: {i.suitableChars.join(" ")}
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
