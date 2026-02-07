import { ImageResponse } from "next/og";
import { locales } from "@/i18n";
import type { Locale } from "@/i18n";


export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default async function TwitterImage({
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

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 64,
        background: "linear-gradient(135deg, rgb(15 23 42), rgb(2 132 199))",
        color: "white",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.05 }}>
          {titleByLocale[safeLocale] ?? titleByLocale.zh}
        </div>
        <div style={{ marginTop: 14, fontSize: 26, opacity: 0.9 }}>
          Name generation & analysis
        </div>
      </div>
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          fontWeight: 800,
        }}
      >
        名
      </div>
    </div>,
    size,
  );
}
