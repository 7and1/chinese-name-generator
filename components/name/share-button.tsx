"use client";

import { useState } from "react";
import {
  Share2,
  Link2,
  Copy,
  Download,
  QrCode,
  Image,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type GeneratedName } from "@/lib/types";
import {
  copyNameInfo,
  getShareableUrl,
  generateQRCodeUrl,
  generateAndDownloadImage,
  nativeShare,
} from "@/lib/utils/share";
import type { ShareData } from "@/lib/types/share";

interface ShareButtonProps {
  name: GeneratedName;
  locale?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "sm" | "default";
  showLabel?: boolean;
  className?: string;
}

type ShareState = "idle" | "copied" | "generating" | "success";

export function ShareButton({
  name,
  locale = "zh",
  variant = "ghost",
  size = "icon",
  showLabel = false,
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ShareState>("idle");
  const [qrUrl, setQrUrl] = useState<string>("");

  const shareUrl = getShareableUrl(name);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const handleCopyInfo = async () => {
    const success = await copyNameInfo(name, locale);
    if (success) {
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const handleNativeShare = async () => {
    const shareData: ShareData = {
      title: name.fullName,
      text: `${name.fullName} (${name.pinyin}) - Score: ${name.score.overall}`,
      url: shareUrl,
    };

    const success = await nativeShare(shareData);
    if (success) {
      setOpen(false);
    }
  };

  const handleDownloadImage = async () => {
    setState("generating");
    const success = await generateAndDownloadImage(name);
    if (success) {
      setState("success");
      setTimeout(() => {
        setState("idle");
        setOpen(false);
      }, 1500);
    } else {
      setState("idle");
    }
  };

  const handleShowQR = () => {
    if (!qrUrl) {
      setQrUrl(generateQRCodeUrl(shareUrl, { size: 200 }));
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

  if (size === "icon") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={variant}
            size="icon"
            className={className}
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Name</DialogTitle>
            <DialogDescription>
              Share {name.fullName} with others
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Native Share for mobile */}
            {typeof navigator !== "undefined" &&
              typeof navigator.share === "function" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleNativeShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share...
                </Button>
              )}

            {/* Copy Link */}
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
              Copy Link
            </Button>

            {/* Copy Info */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleCopyInfo}
            >
              {state === "copied" ? (
                <Check className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              Copy Name Info
            </Button>

            {/* Download Image */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleDownloadImage}
              disabled={state === "generating"}
            >
              {state === "generating" ? (
                <>
                  <Download className="h-4 w-4 mr-2 animate-pulse" />
                  Generating...
                </>
              ) : state === "success" ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Downloaded!
                </>
              ) : (
                <>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image className="h-4 w-4 mr-2" aria-hidden="true" />
                  Download Image
                </>
              )}
            </Button>

            {/* QR Code */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleShowQR}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Show QR Code
            </Button>

            {/* QR Code Display */}
            {qrUrl && (
              <div className="flex flex-col items-center p-4 border rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
                <p className="text-sm text-muted-foreground mt-2">
                  Scan to share on WeChat
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          {showLabel && "Share"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Name</DialogTitle>
          <DialogDescription>
            Share {name.fullName} with others
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {typeof navigator !== "undefined" &&
            typeof navigator.share === "function" && (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleNativeShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share...
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
            Copy Link
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleCopyInfo}
          >
            {state === "copied" ? (
              <Check className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copy Name Info
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleDownloadImage}
            disabled={state === "generating"}
          >
            {state === "generating" ? (
              <>
                <Download className="h-4 w-4 mr-2 animate-pulse" />
                Generating...
              </>
            ) : state === "success" ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Downloaded!
              </>
            ) : (
              <>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="h-4 w-4 mr-2" aria-hidden="true" />
                Download Image
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleShowQR}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Show QR Code
          </Button>

          {qrUrl && (
            <div className="flex flex-col items-center p-4 border rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
              <p className="text-sm text-muted-foreground mt-2">
                Scan to share on WeChat
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
