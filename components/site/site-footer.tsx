import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SiteFooter({ locale }: { locale: string }) {
  const c = await getTranslations("common");

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-semibold">{c("appName")}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {c("tagline")}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
            <Link
              href={`/${locale}/faq`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-6 md:mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Chinese Name Generator. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
