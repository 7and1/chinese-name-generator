import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "./locale-switcher";
import { MobileNav } from "./mobile-nav";

export default async function SiteHeader({ locale }: { locale: string }) {
  const c = await getTranslations("common");

  const isZh = locale === "zh";
  const navLabels = {
    surnames: isZh
      ? "姓氏"
      : locale === "ja"
        ? "姓氏"
        : locale === "ko"
          ? "성씨"
          : "Surnames",
    elements: isZh
      ? "五行"
      : locale === "ja"
        ? "五行"
        : locale === "ko"
          ? "오행"
          : "Elements",
    guide: isZh
      ? "起名指南"
      : locale === "ja"
        ? "ガイド"
        : locale === "ko"
          ? "가이드"
          : "Guide",
  } as const;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <MobileNav locale={locale} />
          <Link
            href={`/${locale}`}
            className="font-bold text-lg md:text-xl flex items-center gap-2"
          >
            <span className="hidden sm:inline">{c("appName")}</span>
            <span className="sm:hidden">{c("appName")}</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 text-sm">
            <Link
              href={`/${locale}/generate`}
              className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {c("generate")}
            </Link>
            <Link
              href={`/${locale}/analyze`}
              className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {c("analyze")}
            </Link>
            <Link
              href={`/${locale}/explore`}
              className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {c("explore")}
            </Link>
            <Link
              href={`/${locale}/surnames`}
              className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {navLabels.surnames}
            </Link>
            <Link
              href={`/${locale}/elements`}
              className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {navLabels.elements}
            </Link>
            <Link
              href={`/${locale}/guide`}
              className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {navLabels.guide}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
