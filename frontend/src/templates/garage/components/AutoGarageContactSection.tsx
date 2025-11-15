// [TEMPLAB] Auto Garage Contact Section Component
//
// A contact section designed for automotive service businesses with
// location information, service hours, and emergency contact options.
// Focused on automotive business needs and customer convenience.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "Contact Our Shop")
//   - subtitle: Section description
//   - address: Garage physical address
//   - phone: Primary phone number
//   - emergency_phone: After-hours emergency number
//   - email: Business email address
//   - hours_weekdays: Weekday operating hours
//   - hours_weekend: Weekend operating hours
//   - services_offered: Brief service description
//   - cta_text: Primary call-to-action text
//   - cta_url: Primary CTA URL

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

export default function AutoGarageContactSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'Contact Our Shop';
  const subtitle = getFieldValue(fields, 'subtitle') || getFieldValue(fields, 'description') || 'Get in touch for automotive service, repairs, or emergency assistance.';
  const address = getFieldValue(fields, 'address');
  const phone = getFieldValue(fields, 'phone');
  const emergencyPhone = getFieldValue(fields, 'emergency_phone');
  const email = getFieldValue(fields, 'email');
  const hoursWeekdays = getFieldValue(fields, 'hours_weekdays');
  const hoursWeekend = getFieldValue(fields, 'hours_weekend');
  const servicesOffered = getFieldValue(fields, 'services_offered');
  const ctaText = getFieldValue(fields, 'cta_text') || 'Call Now';
  const ctaUrl = getFieldValue(fields, 'cta_url') || (phone ? `tel:${phone}` : '#');

  return (
    <section className="py-16 md:py-24 bg-gray-100">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
            
            <div className="space-y-6">
              {/* Address */}
              {address && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Our Location</h4>
                    <p className="text-gray-600">{address}</p>
                    <button className="text-blue-600 hover:text-blue-800 text-sm mt-1">
                      Get Directions →
                    </button>
                  </div>
                </div>
              )}

              {/* Phone */}
              {phone && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-800 text-lg font-medium">
                      {phone}
                    </a>
                    <p className="text-gray-500 text-sm">Main service line</p>
                  </div>
                </div>
              )}

              {/* Emergency Phone */}
              {emergencyPhone && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Emergency Service</h4>
                    <a href={`tel:${emergencyPhone}`} className="text-red-600 hover:text-red-800 text-lg font-medium">
                      {emergencyPhone}
                    </a>
                    <p className="text-gray-500 text-sm">24/7 roadside assistance</p>
                  </div>
                </div>
              )}

              {/* Email */}
              {email && (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-800">
                      {email}
                    </a>
                    <p className="text-gray-500 text-sm">Send us a message</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hours & Services */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Hours & Services</h3>
            
            {/* Operating Hours */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Operating Hours
              </h4>
              <div className="space-y-2 text-gray-600">
                {hoursWeekdays && <p><span className="font-medium">Weekdays:</span> {hoursWeekdays}</p>}
                {hoursWeekend && <p><span className="font-medium">Weekends:</span> {hoursWeekend}</p>}
                <p className="text-sm text-gray-500">Emergency services available 24/7</p>
              </div>
            </div>

            {/* Services */}
            {servicesOffered && (
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Our Services
                </h4>
                <p className="text-gray-600">{servicesOffered}</p>
              </div>
            )}

            {/* Call-to-Action */}
            <div className="text-center">
              <a
                href={ctaUrl}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {ctaText}
              </a>
              <p className="mt-3 text-sm text-gray-500">
                Call now for immediate assistance or to schedule service
              </p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        {address && (
          <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-medium text-lg">Interactive Map</p>
                <p className="text-sm">Find us easily with integrated mapping</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          AutoGarageContact ({section.identifier})
        </div>
      )}
    </section>
  );
}