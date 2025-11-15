"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n";

const LOCALES: Locale[] = ["en", "nl", "fr", "de", "es", "pt"];

const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands", 
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  pt: "Português"
};

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const pathname = usePathname() || "/";

  const segments = pathname.split("/"); // ["", "en", "rest", "of", "path"]

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to allow moving between button and dropdown
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Current language button */}
      <button
        className="flex items-center gap-1 rounded-full border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentLocale.toUpperCase()}
        <svg
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 pt-2">
          <div className="min-w-[160px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-xl">
          <div className="p-2">
            {LOCALES.map((locale) => {
              const updated = [...segments];

              if (updated.length > 1) {
                // Replace existing locale segment
                updated[1] = locale;
              } else {
                // Just in case, ensure we have a locale
                updated.push(locale);
              }

              const href = updated.join("/") || "/";
              const isActive = locale === currentLocale;

              return (
                <Link
                  key={locale}
                  href={href}
                  className={[
                    "block rounded px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-yellow-600 dark:hover:text-yellow-400",
                  ].join(" ")}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span>{LOCALE_NAMES[locale]}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">{locale}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
