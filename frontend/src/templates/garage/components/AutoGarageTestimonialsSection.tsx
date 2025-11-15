// [TEMPLAB] Auto Garage Testimonials Section Component
//
// A testimonials section displaying customer reviews with emphasis on
// automotive service quality, reliability, and customer satisfaction.
// Builds trust through social proof specific to automotive services.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "What Our Customers Say")
//   - subtitle: Optional section description
//   - testimonial_1_text: First testimonial quote
//   - testimonial_1_name: First customer name
//   - testimonial_1_service: First customer's service type
//   - testimonial_1_rating: First rating (1-5)
//   - testimonial_2_text: Second testimonial quote
//   - testimonial_2_name: Second customer name
//   - testimonial_2_service: Second customer's service type
//   - testimonial_2_rating: Second rating (1-5)
//   - testimonial_3_text: Third testimonial quote
//   - testimonial_3_name: Third customer name
//   - testimonial_3_service: Third customer's service type
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

export default function AutoGarageTestimonialsSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'What Our Customers Say';
  const subtitle = getFieldValue(fields, 'subtitle') || getFieldValue(fields, 'description') || 'Read what our satisfied customers have to say about our automotive services.';

  // Extract testimonials
  const testimonials = [
    {
      text: getFieldValue(fields, 'testimonial_1_text') || 'Outstanding service! They diagnosed my transmission problem quickly and fixed it at a fair price. The team was professional and kept me informed throughout the process.',
      name: getFieldValue(fields, 'testimonial_1_name') || 'Sarah Johnson',
      service: getFieldValue(fields, 'testimonial_1_service') || 'Transmission Repair',
      rating: parseInt(getFieldValue(fields, 'testimonial_1_rating')) || 5
    },
    {
      text: getFieldValue(fields, 'testimonial_2_text') || 'I\'ve been bringing my car here for years. They always provide honest assessments and quality work. My car runs better than ever after their engine service.',
      name: getFieldValue(fields, 'testimonial_2_name') || 'Mike Rodriguez',
      service: getFieldValue(fields, 'testimonial_2_service') || 'Engine Service',
      rating: parseInt(getFieldValue(fields, 'testimonial_2_rating')) || 5
    },
    {
      text: getFieldValue(fields, 'testimonial_3_text') || 'Fast, reliable, and affordable. They got me back on the road the same day with new brakes. Excellent customer service and no surprises on the bill.',
      name: getFieldValue(fields, 'testimonial_3_name') || 'Jennifer Chen',
      service: getFieldValue(fields, 'testimonial_3_service') || 'Brake Replacement',
      rating: parseInt(getFieldValue(fields, 'testimonial_3_rating')) || 5
    }
  ].filter(testimonial => testimonial.text);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Quote Icon */}
              <div className="mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              
              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-6 italic">
                "{testimonial.text}"
              </blockquote>
              
              {/* Customer Info */}
              <div className="border-t border-blue-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {testimonial.service}
                    </p>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Years in Business */}
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <p className="text-gray-600 font-medium">Years in Business</p>
            </div>
            
            {/* Satisfied Customers */}
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <p className="text-gray-600 font-medium">Happy Customers</p>
            </div>
            
            {/* Vehicles Serviced */}
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <p className="text-gray-600 font-medium">Vehicles Serviced</p>
            </div>
            
            {/* Customer Rating */}
            <div>
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-blue-600 mr-2">4.9</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 font-medium">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Review Platforms */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Find us on:</p>
          <div className="flex justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="text-gray-600 font-medium">Google Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">Y</span>
              </div>
              <span className="text-gray-600 font-medium">Yelp</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-800 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">FB</span>
              </div>
              <span className="text-gray-600 font-medium">Facebook</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Experience the Difference Yourself
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of satisfied customers who trust us with their vehicles.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Schedule Your Service Today
          </a>
        </div>
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          AutoGarageTestimonials ({section.identifier})
        </div>
      )}
    </section>
  );
}