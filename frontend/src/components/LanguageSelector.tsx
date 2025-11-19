'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { convertPathBetweenLocales, type Locale } from '@/i18n/slugs';
import { baseLocales } from '@/i18n/utils';

// Base languages available to all sites
const baseLanguages = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
];

// Arabic language (conditionally available)
const arabicLanguage = { code: 'ar', name: 'العربية' };

interface LanguageSelectorProps {
  transparent?: boolean;
  enableArabic?: boolean; // For tenant sites - controls whether Arabic is available
  isMainSite?: boolean;   // For main JCW site - always shows Arabic
}

export default function LanguageSelector({ 
  transparent = false, 
  enableArabic = false, 
  isMainSite = false 
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLocale = pathname.split('/')[1] || 'en';
  
  // Determine which languages to show
  const availableLanguages = [...baseLanguages];
  
  // Add Arabic if this is the main site or if explicitly enabled for tenant site
  if (isMainSite || enableArabic) {
    availableLanguages.push(arabicLanguage);
  }
  
  const currentLanguage = availableLanguages.find(lang => lang.code === currentLocale);
  
  const handleLanguageChange = (newLocale: string) => {
    // Convert the current path to the new locale with proper slug translation
    const newPath = convertPathBetweenLocales(pathname, currentLocale as Locale, newLocale as Locale);
    router.push(newPath);
    setIsOpen(false);
  };

  const buttonStyle = transparent 
    ? 'bg-white/10 border-white/30 text-white hover:bg-white/20' 
    : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50';

  const dropdownStyle = transparent
    ? 'bg-white/95 backdrop-blur-sm border-white/20'
    : 'bg-white border-gray-200';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 border rounded-lg transition-all duration-300 text-sm font-medium uppercase tracking-wide min-w-[50px] flex items-center justify-center ${buttonStyle}`}
        title={currentLanguage?.name}
      >
        {currentLocale}
        <svg
          className={`ml-1 h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className={`absolute top-full right-0 mt-1 z-20 min-w-[120px] rounded-lg border shadow-lg ${dropdownStyle}`}>
            <div className="py-1">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    lang.code === currentLocale
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={lang.name}
                >
                  <span className="font-medium uppercase tracking-wide">{lang.code}</span>
                  <span className="ml-2 text-gray-500 text-xs">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}