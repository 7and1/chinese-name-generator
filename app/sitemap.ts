import { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { POETRY_DATABASE } from "@/lib/data/poetry";
import { IDIOM_DATABASE } from "@/lib/data/idioms";
import { CHINESE_SURNAMES } from "@/lib/data/surnames";
import { SAMPLE_CHARACTERS } from "@/lib/data/characters";
import { getSitemapDate } from "@/lib/seo/metadata";

// Blog articles with their publish dates
const BLOG_ARTICLES = [
  { slug: "how-to-choose-chinese-baby-name", date: "2024-01-15" },
  { slug: "five-elements-naming-guide", date: "2024-01-20" },
  { slug: "chinese-surname-culture", date: "2024-01-25" },
  { slug: "poetry-inspired-names", date: "2024-02-01" },
  { slug: "wuge-numerology-explained", date: "2024-02-10" },
  { slug: "boy-vs-girl-naming", date: "2024-02-15" },
  { slug: "avoiding-bad-homophones", date: "2024-02-20" },
  { slug: "meaningful-characters", date: "2024-02-25" },
  { slug: "bazi-calculator-guide", date: "2024-03-01" },
  { slug: "modern-vs-traditional-naming", date: "2024-03-10" },
];

// Static page definitions with their priorities and change frequencies
const STATIC_PAGES = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/generate", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/analyze", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/explore", priority: 0.7, changeFrequency: "weekly" as const },
  {
    path: "/explore/poetry",
    priority: 0.7,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/explore/classics",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/explore/idioms",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/explore/etymology",
    priority: 0.6,
    changeFrequency: "monthly" as const,
  },
  { path: "/surnames", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/elements", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/guide", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/guide/bazi", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/guide/wuge", priority: 0.7, changeFrequency: "monthly" as const },
  {
    path: "/guide/phonetics",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["zh", "en", "ja", "ko"];
  const sitemap: MetadataRoute.Sitemap = [];

  // Generate sitemap entries for all locale/page combinations
  locales.forEach((locale) => {
    // Static pages
    STATIC_PAGES.forEach((page) => {
      const url = new URL(`/${locale}${page.path}`, env.siteUrl).toString();

      sitemap.push({
        url,
        lastModified: getSitemapDate(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              new URL(`/${l}${page.path}`, env.siteUrl).toString(),
            ]),
          ),
        },
      });
    });

    // Surname detail pages (top 500 for SEO)
    // Use a consistent lastmod date for surname pages
    const surnameLastMod = getSitemapDate(new Date("2024-01-01"));
    CHINESE_SURNAMES.slice(0, 500).forEach((surname) => {
      sitemap.push({
        url: new URL(
          `/${locale}/surnames/${surname.surname}`,
          env.siteUrl,
        ).toString(),
        lastModified: surnameLastMod,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              new URL(
                `/${l}/surnames/${surname.surname}`,
                env.siteUrl,
              ).toString(),
            ]),
          ),
        },
      });
    });

    // Element detail pages
    ["金", "木", "水", "火", "土"].forEach((element) => {
      sitemap.push({
        url: new URL(`/${locale}/elements/${element}`, env.siteUrl).toString(),
        lastModified: getSitemapDate(new Date("2024-01-15")),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              new URL(`/${l}/elements/${element}`, env.siteUrl).toString(),
            ]),
          ),
        },
      });
    });

    // Blog articles with their actual publish dates
    BLOG_ARTICLES.forEach((article) => {
      sitemap.push({
        url: new URL(`/${locale}/blog/${article.slug}`, env.siteUrl).toString(),
        lastModified: getSitemapDate(new Date(article.date)),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              new URL(`/${l}/blog/${article.slug}`, env.siteUrl).toString(),
            ]),
          ),
        },
      });
    });

    // Poetry detail pages (expanded for SEO)
    const poetryLastMod = getSitemapDate(new Date("2024-01-10"));
    POETRY_DATABASE.slice(0, 500).forEach((p) => {
      sitemap.push({
        url: new URL(
          `/${locale}/explore/poetry/${encodeURIComponent(p.id)}`,
          env.siteUrl,
        ).toString(),
        lastModified: poetryLastMod,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              new URL(
                `/${l}/explore/poetry/${encodeURIComponent(p.id)}`,
                env.siteUrl,
              ).toString(),
            ]),
          ),
        },
      });
    });

    // Idiom detail pages (expanded for SEO)
    const idiomLastMod = getSitemapDate(new Date("2024-01-05"));
    IDIOM_DATABASE.slice(0, 200).forEach((i) => {
      sitemap.push({
        url: new URL(
          `/${locale}/explore/idioms/${encodeURIComponent(i.idiom)}`,
          env.siteUrl,
        ).toString(),
        lastModified: idiomLastMod,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              new URL(
                `/${l}/explore/idioms/${encodeURIComponent(i.idiom)}`,
                env.siteUrl,
              ).toString(),
            ]),
          ),
        },
      });
    });

    // Character detail pages (top 1000 for SEO)
    const characterLastMod = getSitemapDate(new Date("2024-01-08"));
    SAMPLE_CHARACTERS.slice(0, 1000).forEach((char) => {
      sitemap.push({
        url: new URL(
          `/${locale}/characters/${char.char}`,
          env.siteUrl,
        ).toString(),
        lastModified: characterLastMod,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              new URL(`/${l}/characters/${char.char}`, env.siteUrl).toString(),
            ]),
          ),
        },
      });
    });
  });

  return sitemap;
}
