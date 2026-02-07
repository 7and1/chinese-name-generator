import { env } from "@/lib/env";

export interface HreflangUrl {
  locale: string;
  url: string;
}

/**
 * Generate alternate URLs for all supported locales
 */
export function getAlternateUrls(path: string): Record<string, string> {
  const locales = ["zh", "en", "ja", "ko"];
  const alternates: Record<string, string> = {};

  locales.forEach((locale) => {
    alternates[locale] = new URL(`/${locale}${path}`, env.siteUrl).toString();
  });

  return alternates;
}

/**
 * Generate hreflang tags for a page
 * Includes x-default for SEO best practices
 */
export function generateHreflangTags(
  path: string,
  currentLocale: string,
): HreflangUrl[] {
  const locales = ["zh", "en", "ja", "ko"];
  const tags: HreflangUrl[] = [];

  locales.forEach((locale) => {
    tags.push({
      locale,
      url: new URL(`/${locale}${path}`, env.siteUrl).toString(),
    });
  });

  // Add x-default (typically points to English or most generic version)
  tags.push({
    locale: "x-default",
    url: new URL(`/en${path}`, env.siteUrl).toString(),
  });

  return tags;
}

/**
 * Generate hreflang link tags for <head>
 */
export function generateHreflangLinks(
  path: string,
): Array<{ rel: string; hrefLang: string; href: string }> {
  const tags = generateHreflangTags(path, "en");
  const links: Array<{ rel: string; hrefLang: string; href: string }> = [];

  tags.forEach((tag) => {
    links.push({
      rel: "alternate",
      hrefLang: tag.locale,
      href: tag.url,
    });
  });

  return links;
}
