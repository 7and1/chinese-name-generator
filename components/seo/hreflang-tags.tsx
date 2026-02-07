import { generateHreflangLinks } from "@/lib/seo/hreflang";

interface HreflangTagsProps {
  path: string;
}

/**
 * Component to render hreflang link tags in <head>
 * Usage: <HreflangTags path="/generate" />
 */
export function HreflangTags({ path }: HreflangTagsProps) {
  const links = generateHreflangLinks(path);

  return (
    <>
      {links.map((link) => (
        <link
          key={link.hrefLang}
          rel="alternate"
          hrefLang={link.hrefLang}
          href={link.href}
        />
      ))}
    </>
  );
}
