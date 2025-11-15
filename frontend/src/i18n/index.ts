import type { Dictionary } from "./base-en";

const dictionaries = {
  en: () => import("./locales/en").then((m) => m.default),
  nl: () => import("./locales/nl").then((m) => m.default),
  fr: () => import("./locales/fr").then((m) => m.default),
  de: () => import("./locales/de").then((m) => m.default),
  es: () => import("./locales/es").then((m) => m.default),
  pt: () => import("./locales/pt").then((m) => m.default),
};

export type { Dictionary };
export type Locale = keyof typeof dictionaries;

export async function getDictionary(locale: string): Promise<Dictionary> {
  const key = (Object.keys(dictionaries).includes(locale)
    ? locale
    : "en") as Locale;
  return dictionaries[key]();
}
