import { NextRequest, NextResponse } from "next/server";

// Inline slug translations for middleware (can't import from src/ in middleware)
const slugTranslations = {
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
  }
} as const;

type Locale = 'en' | 'pt' | 'nl' | 'fr' | 'de' | 'es';

// Helper function to get English slug from localized slug
function getEnglishSlug(localizedSlug: string, locale: Locale): string | null {
  for (const [englishSlug, translations] of Object.entries(slugTranslations)) {
    if (translations[locale] === localizedSlug) {
      return englishSlug;
    }
  }
  return null;
}

const PUBLIC_FILE = /\.(.*)$/;
const LOCALES = ["en", "nl", "fr", "de", "es", "pt"] as const;
const DEFAULT_LOCALE = "en";

function isProtectedRoute(pathname: string): boolean {
  // [AUTH] middleware guard - Check for builder routes and dashboard routes
  return (
    pathname.includes('/builder') ||
    pathname.startsWith('/(app)/dashboard') ||
    pathname.includes('/dashboard')
  );
}

function hasAuthToken(request: NextRequest): boolean {
  // Check for the JWT access token cookie
  const token = request.cookies.get("jcw_access_token")?.value;
  return !!token;
}

function getPreferredLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language") || "";
  const first = header.split(",")[0]?.trim().toLowerCase() || "";
  const short = first.slice(0, 2);

  if (LOCALES.includes(short as (typeof LOCALES)[number])) {
    return short;
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[MIDDLEWARE DEBUG] Processing: ${pathname}`);

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    PUBLIC_FILE.test(pathname)
  ) {
    console.log(`[MIDDLEWARE DEBUG] Skipping static/api route: ${pathname}`);
    return;
  }

  // Check for protected routes and redirect to login if no auth token
  if (isProtectedRoute(pathname) && !hasAuthToken(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const pathLocale = pathname.split("/")[1];
  console.log(`[Middleware] pathLocale: ${pathLocale}, LOCALES includes: ${LOCALES.includes(pathLocale as (typeof LOCALES)[number])}`);
  
  if (LOCALES.includes(pathLocale as (typeof LOCALES)[number])) {
    // Handle localized slug translation
    const pathSegments = pathname.split("/");
    console.log(`[Middleware] pathSegments: ${JSON.stringify(pathSegments)}`);
    
    if (pathSegments.length >= 3) {
      const locale = pathSegments[1] as Locale;
      const slug = pathSegments[2];
      console.log(`[Middleware] Processing locale: ${locale}, slug: ${slug}`);
      
      // Check if this is a localized slug that needs to be converted to English
      const englishSlug = getEnglishSlug(slug, locale);
      console.log(`[Middleware] English slug for '${slug}' in '${locale}': ${englishSlug}`);
      
      if (englishSlug && englishSlug !== slug) {
        // Rewrite the URL to use the English slug internally
        const url = request.nextUrl.clone();
        const remainingPath = pathSegments.slice(3).length > 0 ? `/${pathSegments.slice(3).join('/')}` : '';
        url.pathname = `/${locale}/${englishSlug}${remainingPath}`;
        console.log(`[Middleware] Rewriting ${pathname} -> ${url.pathname}`);
        return NextResponse.rewrite(url);
      }
    }
    return;
  }

  const locale = getPreferredLocale(request);

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next).*)"],
};

// Force reload
