
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd, generateFAQPageSchema } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "常见问题 - 中文姓名生成器FAQ",
    en: "FAQ - Chinese Name Generator Questions",
    ja: "FAQ - 中国語名前ジェネレーターについて",
    ko: "FAQ - 중국어 이름 생성기 질문",
  };

  const descriptions = {
    zh: "关于中文起名、八字分析、五格数理的常见问题解答。了解如何使用我们的工具为宝宝起一个好名字。",
    en: "Frequently asked questions about Chinese naming, BaZi analysis, and Wuge numerology. Learn how to use our tool to find the perfect name.",
    ja: "中国語名付け、八字分析、五格数理に関するよくある質問。完璧な名前を見つけるためのツールの使い方を学ぶ。",
    ko: "중국어 이름 짓기, 팔자 분석, 오격 수리에 대한 자주 묻는 질문. 완벽한 이름을 찾는 방법을 알아보세요.",
  };

  return generatePageMetadata({
    locale,
    path: "/faq",
    title: titles,
    description: descriptions,
    keywords: [
      "FAQ",
      "questions",
      "help",
      "BaZi",
      "Wuge",
      "Chinese naming",
      "常见问题",
    ],
  });
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faq");
  const c = await getTranslations("common");

  const isZh = locale === "zh";

  const questions = t.raw("questions") as Array<{
    question: string;
    answer: string;
  }>;

  // Generate FAQ structured data
  const faqSchema = generateFAQPageSchema(
    questions.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return (
    <div className="container mx-auto px-4 py-10">
      {/* FAQ Schema */}
      <JsonLd data={faqSchema} />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-8">
        <Breadcrumb
          locale={locale}
          items={[
            { name: c("home"), href: `/${locale}` },
            { name: "FAQ", href: `/${locale}/faq` },
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

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto grid gap-4">
        {questions.map((item, idx) => (
          <article
            key={idx}
            className="rounded-xl border bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
              {item.question}
            </h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {item.answer}
            </p>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-center">
        <h2 className="text-2xl font-bold mb-3">
          {isZh ? "还有疑问？" : "Still have questions?"}
        </h2>
        <p className="mb-6 opacity-90">
          {isZh
            ? "尝试使用我们的起名工具，探索更多起名可能性"
            : "Try our naming tool to explore more naming possibilities"}
        </p>
        <a
          href={`/${locale}/generate`}
          className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
        >
          {c("startNaming")}
        </a>
      </div>
    </div>
  );
}
