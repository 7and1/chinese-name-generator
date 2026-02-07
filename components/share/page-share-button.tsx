"use client";

import { useState } from "react";
import { Share2, Link2, Check, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PageShareButtonProps {
  url: string;
  title: string;
  description?: string;
  locale?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "sm" | "default";
  className?: string;
}

type ShareState = "idle" | "copied";

export function PageShareButton({
  url,
  title,
  description,
  locale = "zh",
  variant = "outline",
  size = "sm",
  className,
}: PageShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ShareState>("idle");
  const [qrUrl, setQrUrl] = useState<string>("");

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const handleShowQR = () => {
    if (!qrUrl) {
      setQrUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`,
      );
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        });
        setOpen(false);
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return fallbackCopy(text);
      }
    }
    return fallbackCopy(text);
  };

  const fallbackCopy = (text: string): boolean => {
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
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  };

  const hasNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          {locale === "zh" ? "分享" : "Share"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {locale === "zh" ? "分享页面" : "Share Page"}
          </DialogTitle>
          <DialogDescription>
            {locale === "zh"
              ? "分享这个页面给您的朋友"
              : "Share this page with your friends"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {hasNativeShare && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleNativeShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              {locale === "zh" ? "系统分享..." : "System Share..."}
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCopyLink}
          >
            {state === "copied" ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Link2 className="h-4 w-4 mr-2" />
            )}
            {locale === "zh" ? "复制链接" : "Copy Link"}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShowQR}
          >
            <QrCode className="h-4 w-4 mr-2" />
            {locale === "zh" ? "显示二维码" : "Show QR Code"}
          </Button>

          {qrUrl && (
            <div className="flex flex-col items-center p-4 border rounded-lg">
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-48 h-48"
                loading="lazy"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {locale === "zh" ? "扫码分享" : "Scan to share"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
