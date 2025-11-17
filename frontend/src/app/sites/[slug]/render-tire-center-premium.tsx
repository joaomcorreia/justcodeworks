// [TEMPLAB] Tire Center Premium Template Renderer
// 
// Modern, premium design specifically for tire centers with gradient styling,
// sophisticated typography, and professional automotive branding.

import React from 'react';
import { sectionRegistry } from '@/templates/sections/registry';
// Note: Using standard Footer instead of TireCenterPremiumFooter
import type { SiteProjectPublic } from '@/lib/types/sitePublic';

interface TireCenterPremiumRendererProps {
  site: SiteProjectPublic;
}

export default function TireCenterPremiumRenderer({ site }: TireCenterPremiumRendererProps) {
  // Get sections from the home page only
  const homePage = site.pages?.find(page => page.slug === 'home');
  const sections = homePage?.sections?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="tire-center-premium-site bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 min-h-screen">
      {/* [TEMPLAB] Premium tire center styling wrapper */}
      <div className="tire-premium-theme">
        {/* Navigation Bar */}
        <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">{site.name}</h1>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</a>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Sections with enhanced styling */}
        {sections.map((section, index) => {
          const Component = sectionRegistry[section.identifier];
          
          // Apply different background styles to alternate sections
          const sectionBg = index % 2 === 0 
            ? "bg-gradient-to-r from-transparent to-blue-900/10" 
            : "bg-gradient-to-l from-transparent to-orange-900/10";
            
          return (
            <div key={section.identifier} className={`relative ${sectionBg}`}>
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30"></div>
              
              {Component ? (
                <div className="relative z-10">
                  <Component section={section} />
                </div>
              ) : (
                <div className="p-6 bg-red-900/20 text-red-300 border border-red-500/30 backdrop-blur-sm">
                  <div className="max-w-7xl mx-auto">
                    Missing component for section: <strong>{section.identifier}</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Premium Footer */}
        {/* Note: Using basic footer instead of premium footer */}
        <div className="bg-gray-900 text-white p-8 text-center">
          <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}