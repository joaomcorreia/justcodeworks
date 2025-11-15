'use client';

import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  locale: string;
}

export default function HeroSection({ locale }: HeroSectionProps) {
  return (
    <div className="relative h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ color: '#ffffff' }}>
            {locale === 'pt' ? (
              <>
                Criamos <span style={{ color: '#fbbf24' }}>Websites</span><br />
                e <span style={{ color: '#fbbf24' }}>Sistemas</span> Profissionais
              </>
            ) : (
              <>
                We Create Professional<br />
                <span style={{ color: '#fbbf24' }}>Websites</span> & <span style={{ color: '#fbbf24' }}>Systems</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: '#f1f5f9' }}>
            {locale === 'pt' 
              ? 'Soluções digitais completas para o seu negócio. Desde websites modernos a sistemas POS avançados.'
              : 'Complete digital solutions for your business. From modern websites to advanced POS systems.'
            }
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${locale}/websites`}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              {locale === 'pt' ? 'Ver Websites' : 'View Websites'}
            </Link>
            <Link
              href={`/${locale}/${locale === 'pt' ? 'sistemas-tpv' : 'pos-systems'}`}
              className="bg-transparent border-2 border-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:bg-white hover:text-gray-900"
              style={{ color: '#ffffff' }}
            >
              {locale === 'pt' ? 'Sistemas TPV' : 'POS Systems'}
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
                {locale === 'pt' ? 'Rápido & Moderno' : 'Fast & Modern'}
              </h3>
              <p className="text-sm" style={{ color: '#e2e8f0' }}>
                {locale === 'pt' 
                  ? 'Tecnologias de última geração para máxima performance'
                  : 'Latest technologies for maximum performance'
                }
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">💼</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
                {locale === 'pt' ? 'Soluções Completas' : 'Complete Solutions'}
              </h3>
              <p className="text-sm" style={{ color: '#e2e8f0' }}>
                {locale === 'pt' 
                  ? 'De websites a sistemas POS, cobrimos todas as suas necessidades'
                  : 'From websites to POS systems, we cover all your needs'
                }
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#ffffff' }}>
                {locale === 'pt' ? 'Focado no Cliente' : 'Client Focused'}
              </h3>
              <p className="text-sm" style={{ color: '#e2e8f0' }}>
                {locale === 'pt' 
                  ? 'Cada projeto é personalizado às suas necessidades específicas'
                  : 'Every project is tailored to your specific needs'
                }
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
  );
}