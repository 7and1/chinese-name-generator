
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "隐私政策 - 中文姓名生成器",
    en: "Privacy Policy - Chinese Name Generator",
    ja: "プライバシーポリシー - 中国語名前ジェネレーター",
    ko: "개인정보 처리방침 - 중국어 이름 생성기",
  };

  const descriptions = {
    zh: "我们如何处理您的信息。了解我们的数据收集、使用和保护政策。",
    en: "How we handle your information. Learn about our data collection, usage, and protection policies.",
    ja: "情報の取り扱いについて。データ収集、使用、保護ポリシーを学ぶ。",
    ko: "정보 처리 방법. 데이터 수집, 사용, 보호 정책을 알아보세요.",
  };

  return generatePageMetadata({
    locale,
    path: "/privacy",
    title: titles,
    description: descriptions,
    keywords: [
      "privacy",
      "data",
      "GDPR",
      "隐私政策",
      "プライバシー",
      "개인정보",
    ],
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");
  const c = await getTranslations("common");

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-8">
        <Breadcrumb
          locale={locale}
          items={[
            { name: c("home"), href: `/${locale}` },
            { name: t("title"), href: `/${locale}/privacy` },
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
            {t("dataProcessing.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("dataProcessing.description")}
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("logs.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("logs.description")}
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("cookies.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("cookies.description")}
          </p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("thirdParty.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("thirdParty.description")}
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

        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("contact.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("contact.description")}
          </p>
        </div>
      </div>
    </div>
  );
}
