"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  locale: string;
}

interface NavItem {
  href: string;
  labelKey: string;
}

export function MobileNav({ locale }: MobileNavProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isZh = locale === "zh";
  const navItems: NavItem[] = [
    { href: `/${locale}/generate`, labelKey: "generate" },
    { href: `/${locale}/analyze`, labelKey: "analyze" },
    { href: `/${locale}/explore`, labelKey: "explore" },
    {
      href: `/${locale}/surnames`,
      labelKey: isZh
        ? "surnames"
        : locale === "ja"
          ? "surnames.ja"
          : locale === "ko"
            ? "surnames.ko"
            : "surnames.en",
    },
    {
      href: `/${locale}/elements`,
      labelKey: isZh
        ? "elements"
        : locale === "ja"
          ? "elements.ja"
          : locale === "ko"
            ? "elements.ko"
            : "elements.en",
    },
    {
      href: `/${locale}/guide`,
      labelKey: isZh
        ? "guide"
        : locale === "ja"
          ? "guide.ja"
          : locale === "ko"
            ? "guide.ko"
            : "guide.en",
    },
  ];

  const getLabel = (item: NavItem) => {
    if (item.labelKey.startsWith("surnames.")) {
      const suffix = item.labelKey.split(".")[1];
      const labels = {
        ja: "姓氏",
        ko: "성씨",
        en: "Surnames",
      };
      return labels[suffix as keyof typeof labels] || "Surnames";
    }
    if (item.labelKey.startsWith("elements.")) {
      const suffix = item.labelKey.split(".")[1];
      const labels = {
        ja: "五行",
        ko: "오행",
        en: "Elements",
      };
      return labels[suffix as keyof typeof labels] || "Elements";
    }
    if (item.labelKey.startsWith("guide.")) {
      const suffix = item.labelKey.split(".")[1];
      const labels = {
        ja: "ガイド",
        ko: "가이드",
        en: "Guide",
      };
      return labels[suffix as keyof typeof labels] || "Guide";
    }
    return t(`common.${item.labelKey}`);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{t("appName")}</SheetTitle>
          <SheetDescription>Navigate through the app</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {getLabel(item)}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
