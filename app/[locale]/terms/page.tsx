
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "服务条款 - 中文姓名生成器",
    en: "Terms of Service - Chinese Name Generator",
    ja: "利用規約 - 中国語名前ジェネレーター",
    ko: "이용약관 - 중국어 이름 생성기",
  };

  const descriptions = {
    zh: "使用本服务的条款和条件。了解我们的使用规则和责任限制。",
    en: "Terms and conditions for using this service. Learn about our usage rules and liability limitations.",
    ja: "このサービスを使用するための条項と条件。使用規則と責任制限を学ぶ。",
    ko: "이 서비스 사용에 대한 약관. 사용 규칙과 책임 제한을 알아보세요.",
  };

  return generatePageMetadata({
    locale,
    path: "/terms",
    title: titles,
    description: descriptions,
    keywords: ["terms", "legal", "TOS", "服务条款", "利用規約", "이용약관"],
  });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("terms");
  const c = await getTranslations("common");

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-8">
        <Breadcrumb
          locale={locale}
          items={[
            { name: c("home"), href: `/${locale}` },
            { name: t("title"), href: `/${locale}/terms` },
          ]}
        />
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-4 text-sm text-muted-foreground">
          {locale === "zh"
            ? "最后更新：2024年1月"
            : locale === "ja"
              ? "最終更新：2024年1月"
              : locale === "ko"
                ? "마지막 업데이트: 2024년 1월"
                : "Last updated: January 2024"}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto grid gap-6">
        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("noGuarantees.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("noGuarantees.description")}
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("acceptableUse.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("acceptableUse.description")}
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("intellectualProperty.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("intellectualProperty.description")}
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("limitationOfLiability.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("limitationOfLiability.description")}
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("governingLaw.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("governingLaw.description")}
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("changes.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("changes.description")}
          </p>
        </div>
      </div>
    </div>
  );
}
