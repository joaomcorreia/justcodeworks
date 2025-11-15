// URL slug translations for different locales
export const slugTranslations = {
  'pos-systems': {
    en: 'pos-systems',
    pt: 'sistemas-tpv',
    nl: 'kassasystemen',
    fr: 'systemes-caisse',
    de: 'kassensysteme',
    es: 'sistemas-tpv'
  },
  websites: {
    en: 'websites', 
    pt: 'websites',
    nl: 'websites',
    fr: 'sites-web',
    de: 'websites',
    es: 'sitios-web'
  },
  services: {
    en: 'services',
    pt: 'servicos',
    nl: 'diensten', 
    fr: 'services',
    de: 'dienstleistungen',
    es: 'servicios'
  },
  'help-center': {
    en: 'help-center',
    pt: 'centro-ajuda',
    nl: 'hulpcentrum',
    fr: 'centre-aide',
    de: 'hilfezentrum', 
    es: 'centro-ayuda'
  },
  'print-lab': {
    en: 'print-lab',
    pt: 'print-lab',
    nl: 'print-lab',
    fr: 'print-lab',
    de: 'print-lab',
    es: 'print-lab'
  }
} as const;

// Type for supported locales
export type Locale = 'en' | 'pt' | 'nl' | 'fr' | 'de' | 'es';
export type SlugKey = keyof typeof slugTranslations;

// Helper function to get localized slug
export function getLocalizedSlug(englishSlug: SlugKey, locale: Locale): string {
  return slugTranslations[englishSlug]?.[locale] || englishSlug;
}

// Helper function to get English slug from localized slug
export function getEnglishSlug(localizedSlug: string, locale: Locale): SlugKey | null {
  for (const [englishSlug, translations] of Object.entries(slugTranslations)) {
    if (translations[locale] === localizedSlug) {
      return englishSlug as SlugKey;
    }
  }
  return null;
}

// Helper function to convert path between locales
export function convertPathBetweenLocales(path: string, fromLocale: Locale, toLocale: Locale): string {
  // Remove leading/trailing slashes and split path
  const segments = path.replace(/^\/|\/$/g, '').split('/');
  
  // Skip if path starts with locale (remove it)
  if (segments[0] === fromLocale) {
    segments.shift();
  }
  
  // Convert each segment if it matches a translatable slug
  const convertedSegments = segments.map(segment => {
    const englishSlug = getEnglishSlug(segment, fromLocale);
    if (englishSlug) {
      return getLocalizedSlug(englishSlug, toLocale);
    }
    return segment;
  });
  
  // Return new path with target locale
  return `/${toLocale}${convertedSegments.length > 0 ? `/${convertedSegments.join('/')}` : ''}`;
}