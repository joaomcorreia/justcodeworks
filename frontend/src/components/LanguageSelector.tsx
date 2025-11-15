'use client';

import { useRouter, usePathname } from 'next/navigation';
import { convertPathBetweenLocales, type Locale } from '@/i18n/slugs';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

interface LanguageSelectorProps {
  transparent?: boolean;
}

export default function LanguageSelector({ transparent = false }: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLocale = pathname.split('/')[1] || 'en';
  
  const handleLanguageChange = (newLocale: string) => {
    // Convert the current path to the new locale with proper slug translation
    const newPath = convertPathBetweenLocales(pathname, currentLocale as Locale, newLocale as Locale);
    router.push(newPath);
  };

  const selectStyle = transparent 
    ? { 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderColor: 'rgba(255, 255, 255, 0.3)',
        color: '#ffffff'
      }
    : { 
        backgroundColor: '#ffffff', 
        borderColor: '#d1d5db',
        color: '#111827'
      };

  return (
    <div className="relative">
      <select 
        value={currentLocale} 
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="p-2 border rounded-lg transition-all duration-300 text-sm"
        style={selectStyle}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} style={{ color: '#111827', backgroundColor: '#ffffff' }}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}