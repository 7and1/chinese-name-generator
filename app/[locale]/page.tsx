
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const t = await getTranslations("home");
  const c = await getTranslations("common");

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {c("appName")}
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4">
            {t("hero.title")}
          </p>

          <p className="text-lg text-slate-500 dark:text-slate-400 mb-12">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              href={`/${params.locale}/generate`}
              className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {c("generate")}
            </Link>
            <Link
              href={`/${params.locale}/analyze`}
              className="inline-block px-8 py-4 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 text-lg font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-lg hover:shadow-xl border-2 border-blue-600 dark:border-blue-400"
            >
              {c("analyze")}
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.raw("hero.features").map((feature: string, idx: number) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
              >
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-slate-100">
          {t("sectionTitle")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* BaZi */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🔮</div>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              {t("features.bazi.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t("features.bazi.description")}
            </p>
          </div>

          {/* Wuge */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📐</div>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              {t("features.wuge.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t("features.wuge.description")}
            </p>
          </div>

          {/* Poetry */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              {t("features.poetry.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t("features.poetry.description")}
            </p>
          </div>

          {/* Phonetics */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎵</div>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">
              {t("features.phonetics.title")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t("features.phonetics.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 dark:bg-blue-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">57+</div>
              <div className="text-lg opacity-90">{t("stats.dataSources")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">71亿+</div>
              <div className="text-lg opacity-90">
                {t("stats.classicTexts")}
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">{t("stats.openSource")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
