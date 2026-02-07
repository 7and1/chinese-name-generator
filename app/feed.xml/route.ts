import { env } from "@/lib/env";


const BLOG_ARTICLES = [
  {
    slug: "how-to-choose-chinese-baby-name",
    date: "2024-01-15",
    title: {
      zh: "如何为宝宝选择一个好名字",
      en: "How to Choose a Chinese Baby Name",
    },
    description: {
      zh: "详细指南：结合传统文化和现代审美，为您的宝宝起一个吉祥美好的中文名字。",
      en: "A comprehensive guide to choosing an auspicious Chinese name for your baby, combining traditional culture with modern aesthetics.",
    },
  },
  {
    slug: "five-elements-naming-guide",
    date: "2024-01-20",
    title: {
      zh: "五行起名完全指南",
      en: "Complete Guide to Five Elements Naming",
    },
    description: {
      zh: "深入了解五行理论在起名中的应用，学习如何根据八字五行选择合适的名字。",
      en: "Deep dive into the application of Five Elements theory in naming, learn how to choose suitable names based on BaZi.",
    },
  },
  {
    slug: "chinese-surname-culture",
    date: "2024-01-25",
    title: {
      zh: "中国姓氏文化探源",
      en: "Exploring Chinese Surname Culture",
    },
    description: {
      zh: "探索中国姓氏的起源、发展和文化内涵，了解百家姓背后的历史故事。",
      en: "Explore the origins, development, and cultural significance of Chinese surnames.",
    },
  },
  {
    slug: "poetry-inspired-names",
    date: "2024-02-01",
    title: {
      zh: "诗词取名：从古典诗词中寻找灵感",
      en: "Poetry-Inspired Names: Finding Inspiration in Classical Poetry",
    },
    description: {
      zh: "如何从唐诗宋词中提取优美的名字，让孩子的名字充满文化底蕴。",
      en: "How to extract beautiful names from Tang and Song poetry, giving your child a culturally rich name.",
    },
  },
  {
    slug: "wuge-numerology-explained",
    date: "2024-02-10",
    title: {
      zh: "五格数理详解",
      en: "Wuge Numerology Explained",
    },
    description: {
      zh: "全面解析五格数理的计算方法和吉凶判断，帮助您选择数理吉祥的名字。",
      en: "Comprehensive analysis of Wuge numerology calculation methods and fortune interpretation.",
    },
  },
  {
    slug: "boy-vs-girl-naming",
    date: "2024-02-15",
    title: {
      zh: "男孩女孩起名的区别与技巧",
      en: "Naming Differences and Tips for Boys vs Girls",
    },
    description: {
      zh: "了解男孩和女孩起名的不同考量，掌握性别特色的起名技巧。",
      en: "Understand the different considerations for naming boys and girls.",
    },
  },
  {
    slug: "avoiding-bad-homophones",
    date: "2024-02-20",
    title: {
      zh: "起名避讳：如何避免谐音问题",
      en: "Naming Taboos: How to Avoid Homophone Issues",
    },
    description: {
      zh: "详解起名中的谐音禁忌，帮助您避免尴尬的名字发音。",
      en: "Detailed explanation of homophone taboos in naming to help you avoid awkward pronunciations.",
    },
  },
  {
    slug: "meaningful-characters",
    date: "2024-02-25",
    title: {
      zh: "寓意美好的常用起名汉字",
      en: "Meaningful Characters Commonly Used in Names",
    },
    description: {
      zh: "精选100个寓意美好的起名常用字，附带详细解释和搭配建议。",
      en: "A selection of 100 meaningful characters commonly used in names with detailed explanations.",
    },
  },
  {
    slug: "bazi-calculator-guide",
    date: "2024-03-01",
    title: {
      zh: "八字计算器使用指南",
      en: "BaZi Calculator User Guide",
    },
    description: {
      zh: "学习如何使用八字计算器分析命理，为起名提供科学依据。",
      en: "Learn how to use the BaZi calculator to analyze destiny and provide a scientific basis for naming.",
    },
  },
  {
    slug: "modern-vs-traditional-naming",
    date: "2024-03-10",
    title: {
      zh: "现代起名与传统起名的平衡",
      en: "Balancing Modern and Traditional Naming",
    },
    description: {
      zh: "如何在保持传统文化的同时，让名字符合现代审美和实用需求。",
      en: "How to maintain traditional culture while making names meet modern aesthetics and practical needs.",
    },
  },
];

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateRssFeed(locale: "zh" | "en"): string {
  const siteUrl = env.siteUrl.toString().replace(/\/$/, "");
  const feedTitle =
    locale === "zh" ? "中文姓名生成器 - 博客" : "Chinese Name Generator - Blog";
  const feedDescription =
    locale === "zh"
      ? "专业的中文姓名生成与分析工具博客，分享起名知识和技巧。"
      : "Professional Chinese name generator blog, sharing naming knowledge and tips.";

  const items = BLOG_ARTICLES.map((article) => {
    const title = article.title[locale];
    const description = article.description[locale];
    const link = `${siteUrl}/${locale}/blog/${article.slug}`;
    const pubDate = new Date(article.date).toUTCString();

    return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${siteUrl}/${locale}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml?locale=${locale}" rel="self" type="application/rss+xml"/>
    <generator>Chinese Name Generator</generator>
${items}
  </channel>
</rss>`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "en" ? "en" : "zh";

  const feed = generateRssFeed(locale);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
