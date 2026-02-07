/**
 * Types for share functionality
 */

export type SharePlatform = "wechat" | "link" | "copy" | "image";

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

export interface ShareImageOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}
