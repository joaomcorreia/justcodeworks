'use client';

import React, { useState, useEffect } from 'react';
import { getDictionary } from '@/i18n';
import MainNavigationClient from './MainNavigationClient';

interface HeroNavigationProps {
  locale: string;
}

export default function HeroNavigation({ locale }: HeroNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dict, setDict] = useState<any>(null);

  useEffect(() => {
    const loadDict = async () => {
      const dictionary = await getDictionary(locale);
      setDict(dictionary);
    };
    loadDict();
  }, [locale]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!dict) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
      <MainNavigationClient dict={dict} locale={locale} transparent={!isScrolled} />
    </div>
  );
}