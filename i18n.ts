import { getRequestConfig } from "next-intl/server";

// Supported locales
export const locales = ["zh", "en", "ja", "ko"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid, fallback to 'zh' if not
  const validLocale: string = locales.includes(locale as Locale)
    ? (locale as string)
    : "zh";

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
