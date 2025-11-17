'use client';

// [JCW] Updated HeroSection with new slider system and fallback support
import React, { useState } from 'react';
import Link from 'next/link';
import Step0OnboardingModal from './Step0OnboardingModal';
import HomepageSliderContainer from './HomepageSliderContainer';

interface HeroSectionProps {
  locale: string;
  dict: any;
}

export default function HeroSection({ locale, dict }: HeroSectionProps) {
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
  const [selectedIntent, setSelectedIntent] = useState<'website' | 'prints' | 'pos'>('website')

  const openOnboardingModal = (intent: 'website' | 'prints' | 'pos') => {
    setSelectedIntent(intent)
    setIsOnboardingModalOpen(true)
  }

  const handleOnboardingSuccess = () => {
    // Redirect to dashboard with the correct section
    window.location.href = `/${locale}/dashboard?section=${selectedIntent}`
  }

  return (
    <>
      {/* New Slider System with Particle Effects */}
      <HomepageSliderContainer
        sliderSlug="hq-homepage-hero"
        className="h-screen"
        fallbackGradient="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
      />
      
      {/* Legacy Fallback (hidden by default, can be shown if slider fails) */}
      <div className="hidden relative h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ color: '#ffffff' }}>
              {dict.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: '#f1f5f9' }}>
              {dict.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => openOnboardingModal('website')}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                {dict.hero.ctaPrimary}
              </button>
              <button
                onClick={() => openOnboardingModal('pos')}
                className="bg-transparent border-2 border-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-white hover:text-gray-900"
                style={{ color: '#ffffff' }}
              >
                {dict.nav.pos}
              </button>
              <button
                onClick={() => openOnboardingModal('prints')}
                className="bg-transparent border-2 border-yellow-400 text-yellow-400 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900"
              >
                {dict.nav.printing}
              </button>
            </div>

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl mb-3">🚀</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
                  {dict.websites.onePage.title}
                </h3>
                <p className="text-sm" style={{ color: '#e2e8f0' }}>
                  {dict.websites.onePage.desc}
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">💼</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
                  {dict.websites.multiPage.title}
                </h3>
                <p className="text-sm" style={{ color: '#e2e8f0' }}>
                  {dict.websites.multiPage.desc}
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
                  {dict.websites.ecommerce.title}
                </h3>
                <p className="text-sm" style={{ color: '#e2e8f0' }}>
                  {dict.websites.ecommerce.desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ color: '#ffffff' }}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Step 0 Onboarding Modal */}
      <Step0OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        intent={selectedIntent}
        locale={locale}
        onSuccess={handleOnboardingSuccess}
      />
    </>
  );
}