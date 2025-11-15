// [TEMPLAB] Restaurant Menu Highlight Section Component
//
// A featured menu section displaying 2-3 columns of signature dishes
// with name, description, and price. Perfect for showcasing restaurant
// specialties and encouraging orders.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "Featured Menu", "Chef's Specials")
//   - subtitle: Optional section description
//   - dish_1_name: First dish name
//   - dish_1_description: First dish description
//   - dish_1_price: First dish price
//   - dish_2_name: Second dish name
//   - dish_2_description: Second dish description
//   - dish_2_price: Second dish price
//   - dish_3_name: Third dish name
//   - dish_3_description: Third dish description
//   - dish_3_price: Third dish price
//   - cta_text: Call-to-action button text
//   - cta_link: Call-to-action button link

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

export default function RestaurantMenuHighlightSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'Featured Menu';
  const subtitle = getFieldValue(fields, 'subtitle') || getFieldValue(fields, 'description') || '';
  const ctaText = getFieldValue(fields, 'cta_text') || 'View Full Menu';
  const ctaLink = getFieldValue(fields, 'cta_link') || '#menu';

  // Extract dishes
  const dishes = [
    {
      name: getFieldValue(fields, 'dish_1_name'),
      description: getFieldValue(fields, 'dish_1_description'),
      price: getFieldValue(fields, 'dish_1_price')
    },
    {
      name: getFieldValue(fields, 'dish_2_name'),
      description: getFieldValue(fields, 'dish_2_description'),
      price: getFieldValue(fields, 'dish_2_price')
    },
    {
      name: getFieldValue(fields, 'dish_3_name'),
      description: getFieldValue(fields, 'dish_3_description'),
      price: getFieldValue(fields, 'dish_3_price')
    }
  ].filter(dish => dish.name); // Only include dishes with names

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Menu Items Grid */}
        {dishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {dishes.map((dish, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {dish.name}
                    </h3>
                    {dish.price && (
                      <span className="text-xl font-bold text-amber-600 ml-2">
                        {dish.price}
                      </span>
                    )}
                  </div>
                  {dish.description && (
                    <p className="text-gray-600 leading-relaxed">
                      {dish.description}
                    </p>
                  )}
                </div>
                
                {/* Decorative bottom border */}
                <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Placeholder for empty menu */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {ctaText && (
          <div className="text-center">
            {mode === 'dashboard' ? (
              <button 
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-lg"
                onClick={(e) => e.preventDefault()}
              >
                {ctaText}
              </button>
            ) : (
              <a
                href={ctaLink}
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-lg"
              >
                {ctaText}
              </a>
            )}
          </div>
        )}
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          RestaurantMenuHighlight ({section.identifier})
        </div>
      )}
    </section>
  );
}