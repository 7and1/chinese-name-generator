import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { env } from "@/lib/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titleByLocale: Record<string, string> = {
    zh: "姓名测评分析",
    en: "Analyze a Chinese Name",
    ja: "中国語の姓名分析",
    ko: "중국어 이름 분석",
  };

  const descriptionByLocale: Record<string, string> = {
    zh: "输入完整姓名与可选出生信息，获得八字、五格、音韵、字义等维度的评分与解析。",
    en: "Analyze a Chinese name across BaZi, Wuge, phonetics, and meaning.",
    ja: "姓名を八字・五格・音韻・字義の観点で分析します。",
    ko: "이름을 팔자·오격·음운·자의 관점에서 분석합니다.",
  };

  return {
    title: titleByLocale[locale] ?? titleByLocale.zh,
    description: descriptionByLocale[locale] ?? descriptionByLocale.zh,
    alternates: {
      canonical: new URL(`/${locale}/analyze`, env.siteUrl).toString(),
    },
  };
}

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
