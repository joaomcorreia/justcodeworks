'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getLocalizedSlug } from '@/i18n/slugs';
import { useAuth } from '@/contexts/auth-context'; // [AUTH] login link added
import { useLoginModal } from '@/contexts/login-modal-context';
import LanguageSelector from './LanguageSelector';
import UserSidebar from './UserSidebar';

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
  const { openLoginModal } = useLoginModal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      key: 'home',
      label: dict.nav?.home || dict.nav?.websites || 'Home',
      href: '/',
    },
    {
      key: 'websites',
      label: dict.nav?.websites || 'Websites',
      href: '/websites',
    },
    {
      key: 'pos-systems',
      label: dict.nav?.pos || 'POS Systems',
      href: `/${getLocalizedSlug('pos-systems', locale as any) || 'pos-systems'}`,
    },
    {
      key: 'services',
      label: dict.nav?.services || 'Services',
      href: `/${getLocalizedSlug('services', locale as any) || 'services'}`,
    },
    {
      key: 'help-center',
      label: dict.nav?.helpCenter || 'Help Center',
      href: `/${getLocalizedSlug('help-center', locale as any) || 'help-center'}`,
    },
    {
      key: 'print-lab',
      label: dict.nav?.printing || 'Print Lab',
      href: `/${getLocalizedSlug('print-lab', locale as any) || 'print-lab'}`,
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
    <>
      
      <nav className={`${navClasses} transition-all duration-300 sticky top-0 z-50`}>
        {/* Animated bottom border with gradient */}
      <div 
        className={`absolute -bottom-px left-0 w-full transition-all duration-700 ease-in-out ${
          isScrolled ? 'opacity-100 transform translate-y-0 h-1.5' : 'opacity-0 transform translate-y-2 h-0'
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(90deg, #1e3a8a 0%, #3730a3 20%, #7c3aed 40%, #a855f7 60%, #c084fc 80%, #1e3a8a 100%)'
            : 'linear-gradient(90deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #a855f7 75%, #c084fc 100%)',
          backgroundSize: isScrolled ? '200% 100%' : '100% 100%',
          animation: isScrolled ? 'gradientShift 3s ease-in-out infinite' : 'none',
          boxShadow: isScrolled ? '0 4px 20px rgba(124, 58, 237, 0.6), 0 8px 32px rgba(168, 85, 247, 0.4)' : 'none'
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
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
            {navItems.map((item) => {
              const href = item.href || '/';
              const fullHref = `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
              return (
                <Link
                  key={item.key}
                  href={fullHref}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:opacity-80"
                  style={linkStyle}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Login/User Menu and Language Selector */}
          <div className="flex items-center space-x-4">
            {/* [AUTH] login modal trigger */}
            <div className="flex items-center space-x-2">
              {!isAuthenticated ? (
                <button
                  onClick={openLoginModal}
                  className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
                  style={linkStyle}
                >
                  Login
                </button>
              ) : (
                user?.isStaff || user?.isSuperuser ? (
                  <a
                    href="http://localhost:8000/admin/"
                    className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
                    style={linkStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Admin
                  </a>
                ) : (
                  <Link
                    href={`/${locale}/dashboard`}
                    className="text-sm font-medium transition-colors duration-300 hover:opacity-80"
                    style={linkStyle}
                  >
                    Dashboard
                  </Link>
                )
              )}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md transition-colors duration-300"
                style={{
                  backgroundColor: transparent ? 'rgba(255, 255, 255, 0.1)' : '#f3f4f6',
                  color: transparent ? '#ffffff' : '#374151'
                }}
                title={isAuthenticated ? "Account & Support" : "Contact & Support"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <LanguageSelector transparent={transparent} isMainSite={true} />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const href = item.href || '/';
              const fullHref = `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
              return (
                <Link
                  key={`mobile-${item.key}`}
                  href={fullHref}
                  className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 hover:opacity-80"
                  style={linkStyle}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* User Sidebar */}
      <UserSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
        dict={dict}
      />
    </nav>
    </>
  );
};

export default MainNavigationClient;