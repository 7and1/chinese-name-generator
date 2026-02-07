import { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/private/",
          "/admin/",
          "/static/",
          "/_error",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/", "/admin/"],
      },
      // Crawl-delay for less aggressive crawling
      {
        userAgent: "*",
        crawlDelay: 1,
      },
    ],
    sitemap: new URL("/sitemap.xml", env.siteUrl).toString(),
    host: env.siteUrl.toString(),
  };
}
