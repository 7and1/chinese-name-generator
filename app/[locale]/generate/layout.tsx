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
    zh: "生成中文名字",
    en: "Generate Chinese Names",
    ja: "中国語の名前を生成",
    ko: "중국어 이름 생성",
  };

  const descriptionByLocale: Record<string, string> = {
    zh: "输入姓氏与偏好，基于八字、五格、音韵与字义生成多个候选名字，并提供评分与解释。",
    en: "Generate ranked Chinese name candidates with scoring and explanations.",
    ja: "八字・五格・音韻・字義に基づき候補名を生成します。",
    ko: "팔자·오격·음운·자의를 기반으로 후보 이름을 생성합니다.",
  };

  return {
    title: titleByLocale[locale] ?? titleByLocale.zh,
    description: descriptionByLocale[locale] ?? descriptionByLocale.zh,
    alternates: {
      canonical: new URL(`/${locale}/generate`, env.siteUrl).toString(),
    },
  };
}

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
