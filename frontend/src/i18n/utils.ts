import type { Locale } from "./index";

// RTL Languages - Add more as needed
const rtlLanguages = ["ar", "he", "fa", "ur"];

/**
 * Get text direction for a given locale
 */
export function getDirection(locale: string): "ltr" | "rtl" {
  return rtlLanguages.includes(locale) ? "rtl" : "ltr";
}

/**
 * Check if a locale uses RTL
 */
export function isRTL(locale: string): boolean {
  return rtlLanguages.includes(locale);
}

/**
 * Get all supported locales
 */
export const supportedLocales: Locale[] = ["en", "nl", "fr", "de", "es", "it", "pt", "ar"];

/**
 * Get base locales (excluding Arabic which is optional per site)
 */
export const baseLocales: Locale[] = ["en", "nl", "fr", "de", "es", "it", "pt"];

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: string): string {
  const names: Record<string, string> = {
    en: "English",
    nl: "Nederlands", 
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    it: "Italiano",
    pt: "Português",
    ar: "العربية"
  };
  return names[locale] || locale;
}

/**
 * Get locale flag emoji
 */
export function getLocaleFlag(locale: string): string {
  const flags: Record<string, string> = {
    en: "🇬🇧",
    nl: "🇳🇱", 
    fr: "🇫🇷",
    de: "🇩🇪",
    es: "🇪🇸",
    it: "🇮🇹",
    pt: "🇵🇹",
    ar: "🇸🇦"
  };
  return flags[locale] || "🌐";
}

/**
 * Validate if a locale is supported
 */
export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

/**
 * Get fallback locale if provided locale is not supported
 */
export function getFallbackLocale(locale: string): Locale {
  return isValidLocale(locale) ? locale : "en";
}