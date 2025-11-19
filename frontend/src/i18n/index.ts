import type { Dictionary } from "./base-en";

// Available locales - add new languages here
export const SUPPORTED_LOCALES = [
  'en', 'fr', 'de', 'ar', 'es', 'it', 'pt', 'nl'
  // Future languages can be added here: 'zh', 'ja', 'ko', 'ru', etc.
] as const;

export type Locale = typeof SUPPORTED_LOCALES[number];

// Dynamic dictionary loading
const getDictionaryImport = (locale: string) => {
  switch (locale) {
    case 'en': return import("./locales/en").then((m) => m.default);
    case 'fr': return import("./locales/fr").then((m) => m.default);
    case 'de': return import("./locales/de").then((m) => m.default);
    case 'ar': return import("./locales/ar").then((m) => m.default);
    case 'es': return import("./locales/es").then((m) => m.default);
    case 'it': return import("./locales/it").then((m) => m.default);
    case 'pt': return import("./locales/pt").then((m) => m.default);
    case 'nl': return import("./locales/nl").then((m) => m.default);
    default: return import("./locales/en").then((m) => m.default);
  }
};

export type { Dictionary };

export async function getDictionary(locale: string): Promise<Dictionary> {
  // Check if locale is supported
  const supportedLocale = SUPPORTED_LOCALES.includes(locale as Locale) ? locale : "en";
  
  try {
    return await getDictionaryImport(supportedLocale);
  } catch (error) {
    console.warn(`Failed to load dictionary for locale "${locale}", falling back to English`, error);
    return await getDictionaryImport("en");
  }
}
