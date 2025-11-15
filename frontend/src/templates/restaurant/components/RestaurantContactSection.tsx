// [TEMPLAB] Restaurant Contact Section Component
//
// A contact section providing restaurant location, hours, phone, and email
// with optional reservation form or call-to-action buttons. Essential for
// customer communication and booking.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "Contact Us" or "Visit Us Today")
//   - subtitle: Optional section description
//   - address: Restaurant address
//   - phone: Phone number
//   - email: Email address
//   - hours_weekdays: Weekday hours (e.g., "Mon-Fri: 11am-10pm")
//   - hours_weekend: Weekend hours (e.g., "Sat-Sun: 10am-11pm")
//   - cta_text: Call-to-action button text (e.g., "Make Reservation")
//   - cta_url: Call-to-action button URL or phone link
//   - secondary_cta_text: Secondary CTA text (e.g., "Call Now")
//   - secondary_cta_url: Secondary CTA URL

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

export default function RestaurantContactSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'Contact Us';
  const subtitle = getFieldValue(fields, 'subtitle') || getFieldValue(fields, 'description') || '';
  const address = getFieldValue(fields, 'address');
  const phone = getFieldValue(fields, 'phone');
  const email = getFieldValue(fields, 'email');
  const hoursWeekdays = getFieldValue(fields, 'hours_weekdays');
  const hoursWeekend = getFieldValue(fields, 'hours_weekend');
  const ctaText = getFieldValue(fields, 'cta_text') || 'Make Reservation';
  const ctaUrl = getFieldValue(fields, 'cta_url') || '#';
  const secondaryCtaText = getFieldValue(fields, 'secondary_cta_text') || 'Call Now';
  const secondaryCtaUrl = getFieldValue(fields, 'secondary_cta_url') || (phone ? `tel:${phone}` : '#');

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Address */}
            {address && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">{address}</p>
                </div>
              </div>
            )}

            {/* Phone */}
            {phone && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a href={`tel:${phone}`} className="text-amber-600 hover:text-amber-700 transition-colors">
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {email && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a href={`mailto:${email}`} className="text-amber-600 hover:text-amber-700 transition-colors">
                    {email}
                  </a>
                </div>
              </div>
            )}

            {/* Hours */}
            {(hoursWeekdays || hoursWeekend) && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                  <div className="text-gray-600 space-y-1">
                    {hoursWeekdays && <p>{hoursWeekdays}</p>}
                    {hoursWeekend && <p>{hoursWeekend}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Call-to-Action Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Dine?
            </h3>
            <p className="text-gray-600 mb-6">
              Experience exceptional cuisine in a warm, welcoming atmosphere. 
              Book your table today or call us for immediate seating.
            </p>
            
            <div className="space-y-4">
              {/* Primary CTA */}
              <a
                href={ctaUrl}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {ctaText}
              </a>
              
              {/* Secondary CTA */}
              <a
                href={secondaryCtaUrl}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-amber-600 text-base font-medium rounded-md text-amber-600 bg-white hover:bg-amber-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {secondaryCtaText}
              </a>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        {address && (
          <div className="mt-12">
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-medium">Interactive Map</p>
                <p className="text-sm">Map integration can be added here</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          RestaurantContact ({section.identifier})
        </div>
      )}
    </section>
  );
}