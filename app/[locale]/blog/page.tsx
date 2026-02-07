
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles = {
    zh: "起名知识博客 - 中文起名技巧与传统文化",
    en: "Naming Blog - Chinese Naming Tips and Traditional Culture",
    ja: "名付けブログ - 中国語名付けのコツと伝統文化",
    ko: "작명 블로그 - 중국어 이름 짓는 팁과 전통 문화",
  };

  const descriptions = {
    zh: "分享中文起名技巧、八字五行知识、姓氏文化、诗词典故等起名相关文章，助您为宝宝起一个吉祥美好的名字。",
    en: "Sharing Chinese naming tips, BaZi and Five Elements knowledge, surname culture, and poetry-inspired naming articles.",
    ja: "中国語名付けのコツ、八字五行の知識、姓氏文化、詩詞に基づく名付けなどの記事を共有。",
    ko: "중국어 이름 짓는 팁, 팔자 오행 지식, 성씨 문화, 시사 기반 작명 등의 아티클 공유.",
  };

  return generatePageMetadata({
    locale,
    path: "/blog",
    title: titles,
    description: descriptions,
    keywords: [
      "blog",
      "naming tips",
      "BaZi",
      "Five Elements",
      "Chinese culture",
      "surname culture",
      "博客",
      "起名技巧",
      "八字五行",
      "姓氏文化",
    ],
  });
}

const BLOG_POSTS = [
  {
    slug: "how-to-choose-chinese-baby-name",
    title: {
      zh: "如何给宝宝起一个好名字？",
      en: "How to Choose a Good Chinese Baby Name?",
    },
    excerpt: {
      zh: "从八字分析、五行搭配、五格剖象到音韵美感，全面解析中文起名的要点和方法。",
      en: "A comprehensive guide to Chinese naming: from BaZi analysis and Five Elements to phonetic harmony.",
    },
    date: "2024-01-15",
    category: "起名技巧",
  },
  {
    slug: "five-elements-naming-guide",
    title: {
      zh: "五行起名：金木水火土的奥秘",
      en: "Five Elements Naming: The Secrets of Metal, Wood, Water, Fire, Earth",
    },
    excerpt: {
      zh: "详解五行相生相克原理，教你如何根据宝宝八字选择合适的五行汉字。",
      en: "Understanding Five Elements relationships and selecting characters based on your baby's BaZi.",
    },
    date: "2024-01-20",
    category: "五行起名",
  },
  {
    slug: "chinese-surname-culture",
    title: {
      zh: "中国姓氏文化：百家姓背后的故事",
      en: "Chinese Surname Culture: Stories Behind the Hundred Family Surnames",
    },
    excerpt: {
      zh: "探索中国姓氏的起源、分布和历史文化意义，了解您的姓氏背后的故事。",
      en: "Explore the origins, distribution, and cultural significance of Chinese surnames.",
    },
    date: "2024-01-25",
    category: "姓氏文化",
  },
  {
    slug: "poetry-inspired-names",
    title: {
      zh: "诗词起名：从诗经楚辞中寻找灵感",
      en: "Poetry-Inspired Names: Finding Inspiration from Classic Chinese Poetry",
    },
    excerpt: {
      zh: "《诗经》《楚辞》《唐诗》《宋词》中蕴含着丰富的起名素材，教你如何从中汲取灵感。",
      en: "Discover naming inspiration from the Book of Songs, Chu Ci, Tang Poetry, and Song Lyrics.",
    },
    date: "2024-02-01",
    category: "诗词起名",
  },
  {
    slug: "wuge-numerology-explained",
    title: {
      zh: "五格剖象详解：天格人格地格外格总格",
      en: "Understanding Wuge Numerology: Heaven, Human, Earth, Outer, and Total Grids",
    },
    excerpt: {
      zh: "深入解析五格剖象姓名学，包括五格的计算方法和81数理吉凶解释。",
      en: "An in-depth look at Wuge numerology including calculation methods and 81 numerology meanings.",
    },
    date: "2024-02-10",
    category: "五格剖象",
  },
  {
    slug: "boy-vs-girl-naming",
    title: {
      zh: "男孩女孩起名有何不同？",
      en: "Differences Between Naming Boys and Girls in Chinese Culture",
    },
    excerpt: {
      zh: "男宝宝和女宝宝起名各有侧重，从用字选择到寓意表达都有不同的讲究。",
      en: "Different considerations for naming boys and girls, from character selection to meaning expression.",
    },
    date: "2024-02-15",
    category: "起名技巧",
  },
  {
    slug: "avoiding-bad-homophones",
    title: {
      zh: "起名避坑：如何避免不良谐音",
      en: "Naming Pitfalls: How to Avoid Negative Homophones",
    },
    excerpt: {
      zh: "起名时一定要检查谐音，避免与贬义词或尴尬词汇谐音造成不必要的困扰。",
      en: "Always check homophones when naming to avoid awkward or negative associations.",
    },
    date: "2024-02-20",
    category: "音韵起名",
  },
  {
    slug: "meaningful-characters",
    title: {
      zh: "起名用字：这些寓意美好的汉字值得收藏",
      en: "Naming Characters: Beautiful Characters with Auspicious Meanings",
    },
    excerpt: {
      zh: "精选100个寓意美好、适合起名的汉字，附详细解释和五行属性。",
      en: "A curated list of 100 beautiful characters with auspicious meanings for naming.",
    },
    date: "2024-02-25",
    category: "用字选择",
  },
  {
    slug: "bazi-calculator-guide",
    title: {
      zh: "八字起名计算器：如何分析宝宝的五行喜忌",
      en: "BaZi Calculator: How to Analyze Your Baby's Five Elements",
    },
    excerpt: {
      zh: "手把手教您计算宝宝八字，分析五行强弱，确定喜用神和忌神。",
      en: "Step-by-step guide to calculating BaZi and determining favorable and unfavorable elements.",
    },
    date: "2024-03-01",
    category: "八字起名",
  },
  {
    slug: "modern-vs-traditional-naming",
    title: {
      zh: "传统起名vs现代起名：哪种更适合你的宝宝？",
      en: "Traditional vs Modern Naming: Which Approach Suits Your Baby?",
    },
    excerpt: {
      zh: "对比分析传统起名方法和现代起名趋势，帮助您做出最佳选择。",
      en: "Comparing traditional naming methods with modern trends to help you make the best choice.",
    },
    date: "2024-03-10",
    category: "起名趋势",
  },
];

export default async function BlogPage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const isZh = params.locale === "zh";

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-8">
        <Breadcrumb
          locale={params.locale}
          items={[
            { name: isZh ? "首页" : "Home", href: `/${params.locale}` },
            { name: isZh ? "博客" : "Blog", href: `/${params.locale}/blog` },
          ]}
        />
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: isZh ? "中文起名博客" : "Chinese Naming Blog",
            description: isZh
              ? "起名技巧与传统文化文章"
              : "Naming tips and traditional culture articles",
            url: new URL(`/${params.locale}/blog`, env.siteUrl).toString(),
            blogPost: BLOG_POSTS.map((post) => ({
              "@type": "BlogPosting",
              headline:
                post.title[params.locale as keyof typeof post.title] ||
                post.title.zh,
              url: new URL(
                `/${params.locale}/blog/${post.slug}`,
                env.siteUrl,
              ).toString(),
              datePublished: post.date,
            })),
          }),
        }}
      />

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {isZh
            ? "起名知识博客"
            : params.locale === "ja"
              ? "名付けブログ"
              : params.locale === "ko"
                ? "작명 블로그"
                : "Naming Blog"}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isZh
            ? "探索中文起名的艺术与科学，为您的宝宝寻找最完美的名字"
            : params.locale === "ja"
              ? "中国語名付けの芸術と科学を探求し、赤ちゃんに完璧な名前を"
              : params.locale === "ko"
                ? "중국어 이름 짓기의 예술과 과학을 탐구하고 아기에게 완벽한 이름을"
                : "Explore the art and science of Chinese naming for the perfect baby name"}
        </p>
      </div>

      {/* Featured Post */}
      <div className="max-w-4xl mx-auto mb-12">
        <Link
          href={`/${params.locale}/blog/${BLOG_POSTS[0].slug}`}
          className="block group"
        >
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
            <div className="p-8 text-white">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                {BLOG_POSTS[0].category}
              </span>
              <h2 className="text-3xl font-bold mb-4 group-hover:underline">
                {(() => {
                  const post = BLOG_POSTS[0];
                  return (
                    post.title[params.locale as keyof typeof post.title] ||
                    post.title.zh
                  );
                })()}
              </h2>
              <p className="opacity-90 mb-4">
                {(() => {
                  const post = BLOG_POSTS[0];
                  return (
                    post.excerpt[params.locale as keyof typeof post.excerpt] ||
                    post.excerpt.zh
                  );
                })()}
              </p>
              <div className="text-sm opacity-75">{BLOG_POSTS[0].date}</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/${params.locale}/blog/${post.slug}`}
              className="block bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {post.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100 line-clamp-2">
                  {post.title[params.locale as keyof typeof post.title] ||
                    post.title.zh}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {post.excerpt[params.locale as keyof typeof post.excerpt] ||
                    post.excerpt.zh}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
          {isZh
            ? "分类"
            : params.locale === "ja"
              ? "カテゴリー"
              : params.locale === "ko"
                ? "카테고리"
                : "Categories"}
        </h2>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(BLOG_POSTS.map((p) => p.category))).map(
            (category) => (
              <span
                key={category}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {category}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
