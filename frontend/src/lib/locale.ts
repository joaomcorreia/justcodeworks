// [LOCALE] helper utilities for locale-aware routing

// [LOCALE] helper
const SUPPORTED_LOCALES = ["en", "pt", "nl", "de", "fr", "es"];

/**
 * Extracts the locale from the current pathname
 * @param pathname - Current pathname (e.g., "/en/login" or "/pt/dashboard")
 * @param fallback - Default locale to use if none found
 * @returns The locale string (e.g., "en", "pt")
 */
export function getLocaleFromPathname(pathname: string, fallback: string = "en"): string {
  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return fallback;
  
  // First segment should be the locale
  const potentialLocale = segments[0];
  
  // Validate it's a known locale
  if (SUPPORTED_LOCALES.includes(potentialLocale)) {
    return potentialLocale;
  }
  
  return fallback;
}

/**
 * Gets the current locale from window.location.pathname
 * Only works on client side
 * @param fallback - Default locale to use
 * @returns The locale string
 */
export function getCurrentLocale(fallback: string = "en"): string {
  if (typeof window === "undefined") return fallback;
  return getLocaleFromPathname(window.location.pathname, fallback);
}