
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { searchContent, type SearchKind } from "@/lib/search";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string; kind?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "站内搜索 - 中文姓名生成器",
    en: "Site Search - Chinese Name Generator",
    ja: "サイト内検索 - 中国語名前ジェネレーター",
    ko: "사이트 검색 - 중국어 이름 생성기",
  };

  const descriptions = {
    zh: "搜索汉字、诗词与成语内容。",
    en: "Search characters, poetry, and idioms.",
    ja: "漢字・詩・成語を検索します。",
    ko: "한자·시·성어를 검색합니다.",
  };

  return generatePageMetadata({
    locale,
    path: "/search",
    title: titles,
    description: descriptions,
    noindex: true,
    keywords: ["search", "站内搜索", "site search"],
  });
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = (await searchParams) ?? {};
  const q = (sp.q ?? "").trim();
  const rawKind = (sp.kind ?? "all").trim();
  const kind: SearchKind =
    rawKind === "character" || rawKind === "poetry" || rawKind === "idiom"
      ? rawKind
      : "all";

  const kindLabels: Record<SearchKind, string> = {
    all:
      locale === "zh"
        ? "全部"
        : locale === "ja"
          ? "すべて"
          : locale === "ko"
            ? "전체"
            : "All",
    character:
      locale === "zh"
        ? "汉字"
        : locale === "ja"
          ? "漢字"
          : locale === "ko"
            ? "한자"
            : "Characters",
    poetry:
      locale === "zh"
        ? "诗词"
        : locale === "ja"
          ? "詩"
          : locale === "ko"
            ? "시"
            : "Poetry",
    idiom:
      locale === "zh"
        ? "成语"
        : locale === "ja"
          ? "成語"
          : locale === "ko"
            ? "성어"
            : "Idioms",
  };

  const labels = {
    title:
      locale === "zh"
        ? "站内搜索"
        : locale === "ja"
          ? "サイト内検索"
          : locale === "ko"
            ? "사이트 검색"
            : "Site Search",
    subtitle:
      locale === "zh"
        ? "搜索汉字、诗词与成语，并跳转到对应内容页"
        : locale === "ja"
          ? "漢字・詩・成語を検索し、該当ページへ移動します"
          : locale === "ko"
            ? "한자·시·성어를 검색하고 해당 페이지로 이동합니다"
            : "Search characters, poetry, and idioms, then jump to the detail pages",
    placeholder:
      locale === "zh"
        ? "输入关键词（如：明 / 春 / 德）"
        : locale === "ja"
          ? "キーワードを入力（例：明 / 春 / 徳）"
          : locale === "ko"
            ? "키워드 입력(예: 明 / 春 / 德)"
            : "Enter keywords (e.g., 明 / 春 / 德)",
    search:
      locale === "zh"
        ? "搜索"
        : locale === "ja"
          ? "検索"
          : locale === "ko"
            ? "검색"
            : "Search",
    emptyHint:
      locale === "zh"
        ? "请输入关键词开始搜索。"
        : locale === "ja"
          ? "キーワードを入力してください。"
          : locale === "ko"
            ? "키워드를 입력해 주세요."
            : "Enter a query to start searching.",
    noResults:
      locale === "zh"
        ? "暂无结果。"
        : locale === "ja"
          ? "結果がありません。"
          : locale === "ko"
            ? "결과가 없습니다."
            : "No results.",
  } as const;

  const data = searchContent({ query: q, kind, limit: 20 });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {labels.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{labels.subtitle}</p>

        <form className="mt-6 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex-1">
            <input
              name="q"
              defaultValue={q}
              placeholder={labels.placeholder}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              name="kind"
              defaultValue={kind}
              className="h-10 rounded-md border bg-background px-2 text-sm"
            >
              <option value="all">{kindLabels.all}</option>
              <option value="character">{kindLabels.character}</option>
              <option value="poetry">{kindLabels.poetry}</option>
              <option value="idiom">{kindLabels.idiom}</option>
            </select>
            <button className="h-10 rounded-md border px-4 text-sm hover:bg-muted/40">
              {labels.search}
            </button>
          </div>
        </form>

        {!q && data.totals && (
          <div className="mt-6 rounded-xl border p-5 text-muted-foreground">
            <div className="text-sm">
              {locale === "zh"
                ? `收录：汉字 ${data.totals.characters} · 诗词 ${data.totals.poems} · 成语 ${data.totals.idioms}`
                : locale === "ja"
                  ? `収録：漢字 ${data.totals.characters} · 詩 ${data.totals.poems} · 成語 ${data.totals.idioms}`
                  : locale === "ko"
                    ? `수록: 한자 ${data.totals.characters} · 시 ${data.totals.poems} · 성어 ${data.totals.idioms}`
                    : `Catalog: characters ${data.totals.characters} · poems ${data.totals.poems} · idioms ${data.totals.idioms}`}
            </div>
            <div className="mt-2 text-sm">{labels.emptyHint}</div>
          </div>
        )}

        {q && data.results.length === 0 && (
          <div className="mt-6 rounded-xl border p-5 text-muted-foreground">
            {labels.noResults}
          </div>
        )}

        {data.results.length > 0 && (
          <div className="mt-6 grid gap-3">
            {data.results.map((r, idx) => {
              if (r.type === "character") {
                return (
                  <Link
                    key={`${r.type}:${r.char}:${idx}`}
                    href={`/${locale}/explore/etymology?char=${encodeURIComponent(
                      r.char,
                    )}`}
                    className="rounded-xl border bg-white dark:bg-slate-800 p-5 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-baseline gap-3">
                      <div className="text-4xl font-bold">{r.char}</div>
                      <div className="text-sm text-muted-foreground">
                        {r.pinyin} · {r.fiveElement}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {r.meaning}
                    </div>
                  </Link>
                );
              }

              if (r.type === "poetry") {
                return (
                  <Link
                    key={`${r.type}:${r.id}:${idx}`}
                    href={`/${locale}/explore/poetry/${encodeURIComponent(r.id)}`}
                    className="rounded-xl border bg-white dark:bg-slate-800 p-5 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold">{r.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {r.source}
                      </div>
                    </div>
                    <div className="mt-2 text-lg">{r.verse}</div>
                  </Link>
                );
              }

              return (
                <Link
                  key={`${r.type}:${r.idiom}:${idx}`}
                  href={`/${locale}/explore/idioms/${encodeURIComponent(
                    r.idiom,
                  )}`}
                  className="rounded-xl border bg-white dark:bg-slate-800 p-5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-lg font-semibold">{r.idiom}</div>
                    <div className="text-sm text-muted-foreground">
                      {r.pinyin}
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      {r.category}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {r.meaning}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
