
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "关于我们 - 中文姓名生成器",
    en: "About Us - Chinese Name Generator",
    ja: "私たちについて - 中国語名前ジェネレーター",
    ko: "소개 - 중국어 이름 생성기",
  };

  const descriptions = {
    zh: "了解我们的使命和服务，将传统文化与现代科技相结合的起名平台。",
    en: "Learn about our mission and services—a naming platform combining traditional culture with modern technology.",
    ja: "私たちの使命とサービスについて学ぶ——伝統文化と最新テクノロジーを組み合わせた命名プラットフォーム。",
    ko: "우리의 미션과 서비스에 대해 알아보세요——전통 문화와 최신 기술을 결합한 네이밍 플랫폼.",
  };

  return generatePageMetadata({
    locale,
    path: "/about",
    title: titles,
    description: descriptions,
    keywords: [
      "about",
      "mission",
      "Chinese naming",
      "关于我们",
      "私たちについて",
      "소개",
    ],
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");
  const c = await getTranslations("common");

  // Generate organization structured data
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: c("appName"),
    description: t("mission.description"),
    url: "https://github.com/chinese-name-gen/chinese-name",
    sameAs: ["https://github.com/chinese-name-gen/chinese-name"],
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Organization Schema */}
      <JsonLd data={orgSchema} />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-8">
        <Breadcrumb
          locale={locale}
          items={[
            { name: c("home"), href: `/${locale}` },
            { name: t("title"), href: `/${locale}/about` },
          ]}
        />
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* What We Do */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("whatWeDo.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("whatWeDo.description")}
          </p>
        </div>
      </div>

      {/* What We Don't Do */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="rounded-xl border bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">
            {t("whatWeDontDo.title")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("whatWeDontDo.description")}
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {t("features.title")}
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border bg-white dark:bg-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-2 text-slate-700 dark:text-slate-300">
              BaZi
            </div>
            <p className="text-sm text-muted-foreground">
              {t("features.bazi")}
            </p>
          </div>
          <div className="rounded-xl border bg-white dark:bg-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Wuge
            </div>
            <p className="text-sm text-muted-foreground">
              {t("features.wuge")}
            </p>
          </div>
          <div className="rounded-xl border bg-white dark:bg-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-2 text-slate-700 dark:text-slate-300">
              {t("features.poetry").substring(0, 20)}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("features.poetry")}
            </p>
          </div>
          <div className="rounded-xl border bg-white dark:bg-slate-800 p-5 shadow-sm">
            <div className="font-semibold mb-2 text-slate-700 dark:text-slate-300">
              {t("features.phonetics").substring(0, 20)}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("features.phonetics")}
            </p>
          </div>
        </div>
      </div>

      {/* Technology */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {t("technology.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white dark:bg-slate-800 p-5 shadow-sm text-center">
            <div className="text-2xl mb-2">opensource</div>
            <p className="text-sm text-muted-foreground">
              {t("technology.opensource")}
            </p>
          </div>
          <div className="rounded-xl border bg-white dark:bg-slate-800 p-5 shadow-sm text-center">
            <div className="text-2xl mb-2">data</div>
            <p className="text-sm text-muted-foreground">
              {t("technology.data")}
            </p>
          </div>
          <div className="rounded-xl border bg-white dark:bg-slate-800 p-5 shadow-sm text-center">
            <div className="text-2xl mb-2">AI</div>
            <p className="text-sm text-muted-foreground">
              {t("technology.ai")}
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="rounded-xl border bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-sm text-white">
          <h2 className="text-xl font-bold mb-3">{t("mission.title")}</h2>
          <p className="opacity-90 leading-relaxed">
            {t("mission.description")}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto">
        <a
          href={`/${locale}/generate`}
          className="block rounded-xl border-2 border-blue-600 bg-blue-50 dark:bg-slate-800 p-6 text-center hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
        >
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {c("startNaming")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {locale === "zh"
              ? "立即体验智能起名服务"
              : "Try our smart naming service now"}
          </p>
        </a>
      </div>
    </div>
  );
}
