// [TEMPLAB] Restaurant Hero Section Component
//
// A comprehensive hero section for restaurant websites with enhanced features.
// Displays a large background image with restaurant name, tagline,
// call-to-action button, and optional overlay effects.
//
// Expected Fields from Backend:
//   - title: Restaurant name/main headline
//   - tagline: Subtitle/description  
//   - background_image: Hero background image URL
//   - cta_text: Call-to-action button text
//   - cta_link: Call-to-action button link
//   - overlay_opacity: Background overlay opacity (0-100)
//   - text_alignment: Text alignment (center, left, right)

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

export default function RestaurantHeroSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const title = getFieldValue(fields, 'title') || getFieldValue(fields, 'headline') || 'Restaurant Name';
  const tagline = getFieldValue(fields, 'tagline') || getFieldValue(fields, 'subtitle') || 'Delicious dining experience';
  const backgroundImage = getFieldValue(fields, 'background_image') || getFieldValue(fields, 'image');
  const ctaText = getFieldValue(fields, 'cta_text') || 'View Menu';
  const ctaLink = getFieldValue(fields, 'cta_link') || '#menu';

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      )}
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 font-light max-w-2xl mx-auto leading-relaxed">
          {tagline}
        </p>
        
        {/* Call to Action Button */}
        {ctaText && (
          <div className="mt-8">
            {mode === 'dashboard' ? (
              <button 
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-300 shadow-lg"
                onClick={(e) => e.preventDefault()}
              >
                {ctaText}
              </button>
            ) : (
              <a
                href={ctaLink}
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-300 shadow-lg"
              >
                {ctaText}
              </a>
            )}
          </div>
        )}
      </div>
      
      {/* Fallback background for missing image */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700"></div>
      )}
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          RestaurantHero ({section.identifier})
        </div>
      )}
    </section>
  );
}