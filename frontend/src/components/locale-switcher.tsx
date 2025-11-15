"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

const SUPPORTED_LOCALES = ["en", "pt"] as const;

export function LocaleSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params.locale as string;

  return (
    <div className="flex items-center gap-2 text-sm">
      {SUPPORTED_LOCALES.map((locale) => {
        // Build new pathname by replacing the first segment (currentLocale) with new locale
        const pathSegments = pathname.split('/');
        pathSegments[1] = locale; // Replace the locale segment
        const newPath = pathSegments.join('/');
        
        const isActive = locale === currentLocale;
        
        return (
          <Link
            key={locale}
            href={newPath}
            className={`
              px-3 py-1 rounded border text-xs font-medium
              ${isActive 
                ? 'border-yellow-400 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400'
                : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-500'
              }
            `}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}