// [TEMPLAB] Restaurant About Section Component
//
// An enhanced about section for restaurant websites featuring flexible
// layout with text content and image. Tells the restaurant's story,
// history, or chef's background with improved styling.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "About Us", "Our Story")
//   - content: Main text content/description
//   - image: Image to display alongside content
//   - image_alt: Alt text for the image
//   - layout: Layout style (side-by-side, stacked)
//   - background_color: Background color option

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

export default function RestaurantAboutSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'About Us';
  const content = getFieldValue(fields, 'content') || getFieldValue(fields, 'description') || 'Welcome to our restaurant where we serve delicious, authentic cuisine made with fresh ingredients and traditional recipes passed down through generations.';
  const image = getFieldValue(fields, 'image');
  const imageAlt = getFieldValue(fields, 'image_alt') || 'About our restaurant';

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {heading}
            </h2>
            
            <div className="prose prose-lg text-gray-600 leading-relaxed">
              {content.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-4">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
            
            {/* Optional decorative element */}
            <div className="mt-8">
              <div className="w-16 h-1 bg-amber-600"></div>
            </div>
          </div>
          
          {/* Image */}
          <div className="order-1 lg:order-2">
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt={imageAlt}
                  className="w-full h-96 md:h-[500px] object-cover rounded-lg shadow-lg"
                  loading="lazy"
                />
                {/* Optional overlay for styling */}
                <div className="absolute inset-0 rounded-lg shadow-inner"></div>
              </div>
            ) : (
              /* Placeholder for missing image */
              <div className="w-full h-96 md:h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Image placeholder</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          RestaurantAbout ({section.identifier})
        </div>
      )}
    </section>
  );
}