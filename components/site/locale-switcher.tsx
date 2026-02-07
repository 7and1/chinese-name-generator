"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

const LOCALES = ["zh", "en", "ja", "ko"] as const;

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const maybeLocale = parts[0];
    return (LOCALES as readonly string[]).includes(maybeLocale)
      ? maybeLocale
      : "zh";
  }, [pathname]);

  const go = (nextLocale: string) => {
    const parts = pathname.split("/").filter(Boolean);
    if ((LOCALES as readonly string[]).includes(parts[0])) {
      parts[0] = nextLocale;
    } else {
      parts.unshift(nextLocale);
    }
    const nextPath = `/${parts.join("/")}`;
    router.push(nextPath);
  };

  return (
    <select
      value={currentLocale}
      onChange={(e) => go(e.target.value)}
      className="h-9 rounded-md border bg-background px-2 text-sm"
      aria-label="Language"
    >
      <option value="zh">中文</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="ko">한국어</option>
    </select>
  );
}
