// [TEMPLAB] Restaurant Testimonials Section Component
//
// A testimonials section displaying customer reviews in card format
// with quotes, customer names, and ratings. Builds trust and social proof
// for restaurant visitors.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "What Our Customers Say")
//   - subtitle: Optional section description
//   - testimonial_1_text: First testimonial quote
//   - testimonial_1_name: First customer name
//   - testimonial_1_rating: First rating (1-5)
//   - testimonial_2_text: Second testimonial quote
//   - testimonial_2_name: Second customer name
//   - testimonial_2_rating: Second rating (1-5)
//   - testimonial_3_text: Third testimonial quote
//   - testimonial_3_name: Third customer name
//   - testimonial_3_rating: Third rating (1-5)

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function RestaurantTestimonialsSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'What Our Customers Say';
  const subtitle = getFieldValue(fields, 'subtitle') || getFieldValue(fields, 'description') || '';

  // Extract testimonials
  const testimonials = [
    {
      text: getFieldValue(fields, 'testimonial_1_text'),
      name: getFieldValue(fields, 'testimonial_1_name'),
      rating: parseInt(getFieldValue(fields, 'testimonial_1_rating')) || 5
    },
    {
      text: getFieldValue(fields, 'testimonial_2_text'),
      name: getFieldValue(fields, 'testimonial_2_name'),
      rating: parseInt(getFieldValue(fields, 'testimonial_2_rating')) || 5
    },
    {
      text: getFieldValue(fields, 'testimonial_3_text'),
      name: getFieldValue(fields, 'testimonial_3_name'),
      rating: parseInt(getFieldValue(fields, 'testimonial_3_rating')) || 5
    }
  ].filter(testimonial => testimonial.text); // Only include testimonials with text

  return (
    <section className="py-16 md:py-24 bg-white">
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

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Quote Icon */}
                <div className="mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                
                {/* Testimonial Text */}
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                
                {/* Customer Info */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                    </div>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Placeholder for empty testimonials */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 shadow-lg">
                <div className="animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-5 h-5 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          RestaurantTestimonials ({section.identifier})
        </div>
      )}
    </section>
  );
}