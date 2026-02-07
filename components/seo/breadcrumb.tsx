import Link from "next/link";
import { generateBreadcrumbSchema } from "./json-ld";
import { JsonLd } from "./json-ld";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: string;
  className?: string;
}

/**
 * Breadcrumb Navigation Component with Schema.org structured data
 * Provides both visual navigation and SEO benefits
 */
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  // Generate structured data
  const structuredData = generateBreadcrumbSchema(
    items.map((item) => ({
      name: item.name,
      url: item.href.startsWith("http")
        ? item.href
        : `${process.env.NEXT_PUBLIC_SITE_URL || ""}${item.href}`,
    })),
  );

  return (
    <>
      <JsonLd data={structuredData} />

      <nav
        className={`flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 ${className}`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-slate-400" aria-hidden="true">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-slate-900 dark:hover:text-slate-100 hover:underline transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/**
 * Default breadcrumb items for common pages
 */
export function getDefaultBreadcrumbItems(
  locale: string,
  currentPage: {
    name: string;
    path?: string;
  },
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: locale === "zh" ? "首页" : "Home", href: `/${locale}` },
  ];

  if (currentPage.path && currentPage.path !== `/${locale}`) {
    items.push({
      name: currentPage.name,
      href: currentPage.path,
    });
  } else if (items.length === 1 || items[0].href !== `/${locale}`) {
    items.push({ name: currentPage.name, href: `/${locale}` });
  }

  return items;
}
