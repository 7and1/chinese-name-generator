import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titleByLocale: Record<string, string> = {
    zh: "文化探索",
    en: "Explore Chinese Culture",
    ja: "文化探索",
    ko: "문화 탐색",
  };

  const descriptionByLocale: Record<string, string> = {
    zh: "浏览诗词典故、成语与汉字信息，为起名寻找灵感。",
    en: "Browse poetry, idioms, and character info for naming inspiration.",
    ja: "詩・成語・漢字情報から命名のヒントを探します。",
    ko: "시·성어·한자 정보를 탐색해 작명 영감을 얻습니다.",
  };

  return {
    title: titleByLocale[locale] ?? titleByLocale.zh,
    description: descriptionByLocale[locale] ?? descriptionByLocale.zh,
  };
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
