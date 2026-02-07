/**
 * Share utility functions
 */

import type { GeneratedName } from "@/lib/types";
import type {
  ShareData,
  ShareImageOptions,
  QRCodeOptions,
} from "@/lib/types/share";

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return fallbackCopyToClipboard(text);
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return fallbackCopyToClipboard(text);
  }
}

/**
 * Fallback copy to clipboard for older browsers
 */
function fallbackCopyToClipboard(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-999999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    return successful;
  } catch (error) {
    console.error("Fallback copy failed:", error);
    document.body.removeChild(textarea);
    return false;
  }
}

/**
 * Format name information for sharing
 */
export function formatNameForSharing(
  name: GeneratedName,
  locale: string = "zh",
): string {
  const lines: string[] = [];

  if (locale === "zh") {
    lines.push(`【${name.fullName}】`);
    lines.push(`拼音：${name.pinyin}`);
    lines.push(`评分：${name.score.overall}分 (${name.score.rating})`);
    lines.push(
      `八字：${name.score.baziScore}分 | 五格：${name.score.wugeScore}分`,
    );
    lines.push(
      `音韵：${name.score.phoneticScore}分 | 字义：${name.score.meaningScore}分`,
    );
    lines.push(`寓意：${name.explanation}`);
    if (name.source?.title) {
      lines.push(
        `出处：${name.source.title}${name.source.quote ? ` - ${name.source.quote}` : ""}`,
      );
    }
  } else {
    lines.push(`[${name.fullName}]`);
    lines.push(`Pinyin: ${name.pinyin}`);
    lines.push(`Score: ${name.score.overall} (${name.score.rating})`);
    lines.push(`BaZi: ${name.score.baziScore} | Wuge: ${name.score.wugeScore}`);
    lines.push(
      `Phonetic: ${name.score.phoneticScore} | Meaning: ${name.score.meaningScore}`,
    );
    lines.push(`Explanation: ${name.explanation}`);
    if (name.source?.title) {
      lines.push(
        `Source: ${name.source.title}${name.source.quote ? ` - ${name.source.quote}` : ""}`,
      );
    }
  }

  return lines.join("\n");
}

/**
 * Share using Web Share API if available
 */
export async function nativeShare(shareData: ShareData): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) {
    return false;
  }

  try {
    await navigator.share(shareData);
    return true;
  } catch (error) {
    console.error("Native share failed:", error);
    return false;
  }
}

/**
 * Copy name information to clipboard
 */
export async function copyNameInfo(
  name: GeneratedName,
  locale: string = "zh",
): Promise<boolean> {
  const text = formatNameForSharing(name, locale);
  return copyToClipboard(text);
}

/**
 * Get shareable URL for a name
 */
export function getShareableUrl(
  name: GeneratedName,
  baseUrl: string = "",
): string {
  const url =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const params = new URLSearchParams({
    name: name.fullName,
    pinyin: name.pinyin,
    score: name.score.overall.toString(),
  });
  return `${url}/?${params.toString()}`;
}

/**
 * Generate QR Code for URL (using external API)
 */
export function generateQRCodeUrl(
  url: string,
  options: QRCodeOptions = {},
): string {
  const {
    size = 200,
    margin = 2,
    color = { dark: "000000", light: "ffffff" },
  } = options;

  // Using a reliable QR code API
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/`;
  const params = new URLSearchParams();
  params.append("size", `${size}x${size}`);
  params.append("margin", margin.toString());
  params.append("color", color.dark || "000000");
  params.append("bgcolor", color.light || "ffffff");
  params.append("data", url);

  return `${apiUrl}?${params.toString()}`;
}

/**
 * Download QR Code image
 */
export function downloadQRCode(
  url: string,
  filename: string = "qrcode.png",
): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate a shareable image for a name using Canvas
 */
export async function generateShareImage(
  name: GeneratedName,
  options: ShareImageOptions = {},
): Promise<string | null> {
  const {
    width = 800,
    height = 600,
    backgroundColor = "#f8f9fa",
    textColor = "#1a1a1a",
    accentColor = "#d946ef",
  } = options;

  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Name
  ctx.fillStyle = textColor;
  ctx.font = "bold 48px serif";
  ctx.textAlign = "center";
  ctx.fillText(name.fullName, width / 2, 120);

  // Pinyin
  ctx.fillStyle = "#666666";
  ctx.font = "24px sans-serif";
  ctx.fillText(name.pinyin, width / 2, 160);

  // Score
  ctx.fillStyle = accentColor;
  ctx.font = "bold 36px sans-serif";
  ctx.fillText(`${name.score.overall}分`, width / 2, 220);

  // Divider
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 250);
  ctx.lineTo(width - 100, 250);
  ctx.stroke();

  // Explanation (word wrap)
  ctx.fillStyle = textColor;
  ctx.font = "20px serif";
  ctx.textAlign = "left";
  wrapText(ctx, name.explanation, 80, 300, width - 160, 32);

  // Footer
  ctx.fillStyle = "#999999";
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("中文姓名生成器", width / 2, height - 40);

  return canvas.toDataURL("image/png");
}

/**
 * Helper function to wrap text on canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): void {
  const words = text.split("");
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i];
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

/**
 * Download the generated image
 */
export function downloadShareImage(
  dataUrl: string,
  filename: string = "chinese-name.png",
): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate and download share image
 */
export async function generateAndDownloadImage(
  name: GeneratedName,
  options?: ShareImageOptions,
): Promise<boolean> {
  try {
    const dataUrl = await generateShareImage(name, options);
    if (dataUrl) {
      downloadShareImage(dataUrl);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Failed to generate image:", error);
    return false;
  }
}
