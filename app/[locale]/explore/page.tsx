
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "文化探索 - 诗词成语汉字起名灵感库",
    en: "Explore Chinese Culture - Poetry, Idioms, Characters for Naming",
    ja: "文化探索 - 詩・成語・漢字で命名のヒント",
    ko: "문화 탐색 - 시·성어·한자 작명 영감",
  };

  const descriptions = {
    zh: "浏览诗词、成语与汉字信息，为起名寻找灵感，并一键跳转到起名生成器。",
    en: "Browse poetry, idioms, and character information for naming inspiration, then jump to the generator.",
    ja: "詩・成語・漢字情報を閲覧し、名付けのヒントを得て生成ツールへ移動します。",
    ko: "시·성어·한자 정보를 탐색해 작명 영감을 얻고 생성 도구로 이동합니다.",
  };

  return generatePageMetadata({
    locale,
    path: "/explore",
    title: titles,
    description: descriptions,
    keywords: [
      "文化探索",
      "诗词起名",
      "成语起名",
      "汉字",
      "naming inspiration",
    ],
  });
}

export default async function ExplorePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("explore");

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
        {t("title")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          href={`/${locale}/explore/poetry`}
          className="rounded-xl border bg-white dark:bg-slate-800 p-5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t("poetry.title")}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t("poetry.description")}
          </div>
        </Link>

        <Link
          href={`/${locale}/explore/classics`}
          className="rounded-xl border bg-white dark:bg-slate-800 p-5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t("classics.title")}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t("classics.description")}
          </div>
        </Link>

        <Link
          href={`/${locale}/explore/idioms`}
          className="rounded-xl border bg-white dark:bg-slate-800 p-5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t("idioms.title")}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t("idioms.description")}
          </div>
        </Link>

        <Link
          href={`/${locale}/explore/etymology`}
          className="rounded-xl border bg-white dark:bg-slate-800 p-5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors md:col-span-3"
        >
          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {t("characters.title")}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {t("characters.description")}
          </div>
        </Link>
      </div>
    </div>
  );
}
