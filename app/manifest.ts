import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chinese Name Generator - AI-Powered Naming Tool",
    short_name: "Chinese Name",
    description:
      "Professional Chinese name generator and analyzer. Integrating Zhou Yi BaZi, Wuge numerology, phonetics, and classical poetry.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    categories: ["lifestyle", "education", "utilities"],
    lang: "zh",
    dir: "ltr",
    id: env.siteUrl.toString(),
  };
}
