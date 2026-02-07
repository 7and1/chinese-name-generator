import { ImageResponse } from "next/og";
import { locales } from "@/i18n";
import type { Locale } from "@/i18n";


export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : "zh";

  const titleByLocale: Record<string, string> = {
    zh: "中文姓名生成器",
    en: "Chinese Name Generator",
    ja: "中国語名前ジェネレーター",
    ko: "중국어 이름 생성기",
  };

  const subtitleByLocale: Record<string, string> = {
    zh: "基于八字、五格、音韵与诗词典故",
    en: "BaZi, Wuge, phonetics, and classical poetry",
    ja: "八字・五格・音韻・古典詩",
    ko: "팔자·오격·음운·고전 시",
  };

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 64,
        background: "linear-gradient(135deg, rgb(37 99 235), rgb(147 51 234))",
        color: "white",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>
        {titleByLocale[safeLocale] ?? titleByLocale.zh}
      </div>
      <div style={{ marginTop: 18, fontSize: 30, opacity: 0.92 }}>
        {subtitleByLocale[safeLocale] ?? subtitleByLocale.zh}
      </div>
      <div
        style={{
          marginTop: 34,
          display: "flex",
          gap: 12,
          fontSize: 20,
          opacity: 0.9,
        }}
      >
        {["BaZi", "Wuge", "Poetry", "Phonetics"].map((t) => (
          <div
            key={t}
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
