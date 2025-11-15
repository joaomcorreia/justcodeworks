'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getLocalizedSlug } from '@/i18n/slugs';
import { useAuth } from '@/contexts/auth-context'; // [AUTH] login link added
import LanguageSelector from './LanguageSelector';

interface NavItem {
  key: string;
  label: Record<string, string>;
  href: string;
  external?: boolean;
}

interface MainNavigationClientProps {
  dict: any;
  locale: string;
  transparent?: boolean;
}

const MainNavigationClient: React.FC<MainNavigationClientProps> = ({ dict, locale, transparent = false }) => {
  const { isAuthenticated, user } = useAuth(); // [AUTH] login link added

  const navItems: NavItem[] = [
    {
      key: 'home',
      label: {
        en: 'Home',
        pt: 'Início',
        nl: 'Home',
        fr: 'Accueil',
        de: 'Startseite',
        es: 'Inicio',
      },
      href: '/',
    },
    {
      key: 'websites',
      label: {
        en: 'Websites',
        pt: 'Websites',
        nl: 'Websites',
        fr: 'Sites Web',
        de: 'Websites',
        es: 'Sitios Web',
      },
      href: '/websites',
    },
    {
      key: 'pos-systems',
      label: {
        en: 'POS Systems',
        pt: 'Sistemas TPV',
        nl: 'Kassasystemen',
        fr: 'Systèmes de Caisse',
        de: 'Kassensysteme',
        es: 'Sistemas TPV',
      },
      href: `/${getLocalizedSlug('pos-systems', locale as any)}`,
    },
    {
      key: 'services',
      label: {
        en: 'Services',
        pt: 'Serviços',
        nl: 'Diensten',
        fr: 'Services',
        de: 'Dienstleistungen',
        es: 'Servicios',
      },
      href: `/${getLocalizedSlug('services', locale as any)}`,
    },
    {
      key: 'help-center',
      label: {
        en: 'Help Center',
        pt: 'Centro de Ajuda',
        nl: 'Hulpcentrum',
        fr: 'Centre d\'Aide',
        de: 'Hilfezentrum',
        es: 'Centro de Ayuda',
      },
      href: `/${getLocalizedSlug('help-center', locale as any)}`,
    },
    {
      key: 'print-lab',
      label: {
        en: 'Print Lab',
        pt: 'Print Lab',
        nl: 'Print Lab',
        fr: 'Print Lab',
        de: 'Print Lab',
        es: 'Print Lab',
      },
      href: `/${getLocalizedSlug('print-lab', locale as any)}`,
    },
  ];

  const navClasses = transparent 
    ? "bg-transparent border-transparent" 
    : "bg-white shadow-sm border-b";

  const logoStyle = transparent 
    ? { color: '#ffffff' }
    : { color: '#111827' };

  const linkStyle = transparent 
    ? { color: '#ffffff' }
    : { color: '#4b5563' };

  const linkHoverStyle = transparent 
    ? { color: '#e5e7eb' }
    : { color: '#111827' };

  return (
    <nav className={`${navClasses} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href={`/${locale}`} 
              className="text-xl font-bold transition-colors duration-300"
              style={logoStyle}
            >
              JustCodeWorks
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}${item.href.startsWith('/') ? item.href : `/${item.href}`}`}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:opacity-80"
                style={linkStyle}
              >
                {item.label[locale] || item.label.en}
              </Link>
            ))}
          </div>

          {/* Login/User Menu and Language Selector */}
          <div className="flex items-center space-x-4">
            {/* [AUTH] login link added */}
            {!isAuthenticated ? (
              <Link
                href={`/${locale}/login`}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 bg-blue-600 text-white hover:bg-blue-700"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm" style={linkStyle}>
                  Welcome, {user?.firstName || user?.email}
                </span>
                <Link
                  href={`/${locale}/dashboard`}
                  className="px-3 py-1 rounded-md text-xs font-medium transition-colors duration-300"
                  style={{
                    backgroundColor: transparent ? 'rgba(255, 255, 255, 0.2)' : '#dbeafe',
                    color: transparent ? '#ffffff' : '#1e40af',
                    border: transparent ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #3b82f6'
                  }}
                >
                  {user?.isStaff ? 'Back to Admin' : 'Dashboard'}
                </Link>
              </div>
            )}
            <LanguageSelector transparent={transparent} />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={`mobile-${item.key}`}
                href={`/${locale}${item.href.startsWith('/') ? item.href : `/${item.href}`}`}
                className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:opacity-80"
                style={linkStyle}
              >
                {item.label[locale] || item.label.en}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigationClient;