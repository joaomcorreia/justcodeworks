'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LanguageSelector from './LanguageSelector';

interface TenantLanguageSelectorProps {
  siteSlug: string;
  transparent?: boolean;
}

interface SiteProject {
  enable_arabic_language: boolean;
}

/**
 * Language selector for tenant sites that respects the site's Arabic language setting
 */
export default function TenantLanguageSelector({ 
  siteSlug, 
  transparent = false 
}: TenantLanguageSelectorProps) {
  const [enableArabic, setEnableArabic] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        // Fetch the site's settings from the public API
        const response = await fetch(`http://localhost:8000/api/sites/${siteSlug}/`);
        if (response.ok) {
          const data: SiteProject = await response.json();
          setEnableArabic(data.enable_arabic_language);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, [siteSlug]);

  if (loading) {
    return (
      <div className="px-3 py-2 text-sm text-gray-500 animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <LanguageSelector 
      transparent={transparent} 
      enableArabic={enableArabic} 
      isMainSite={false} 
    />
  );
}