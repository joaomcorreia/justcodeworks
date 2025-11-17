// [TEMPLAB] Auto Garage Hero Section Component
//
// A hero section designed for automotive repair and service businesses
// with service highlights, contact info, and emergency service emphasis.
// Builds trust and communicates expertise in automotive services.
//
// Expected Fields from Backend:
//   - heading: Main headline (e.g., "Expert Auto Repair Services")
//   - subheading: Supporting text about services or expertise
//   - cta_text: Primary call-to-action (e.g., "Schedule Service")
//   - cta_url: Primary CTA URL or phone link
//   - secondary_cta_text: Secondary CTA (e.g., "Emergency Service")
//   - secondary_cta_url: Secondary CTA URL
//   - background_image: Hero background image URL
//   - phone: Phone number for quick access
//   - hours: Business hours display
//   - emergency_text: Emergency service availability

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

export default function AutoGarageHeroSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'Expert Auto Repair Services';
  const subheading = getFieldValue(fields, 'subheading') || getFieldValue(fields, 'subtitle') || 'Professional automotive repair and maintenance you can trust';
  const ctaText = getFieldValue(fields, 'cta_text') || 'Schedule Service';
  const ctaUrl = getFieldValue(fields, 'cta_url') || '#';
  const secondaryCtaText = getFieldValue(fields, 'secondary_cta_text') || 'Emergency Service';
  const secondaryCtaUrl = getFieldValue(fields, 'secondary_cta_url') || '#';
  const backgroundImage = getFieldValue(fields, 'background_image');
  const phone = getFieldValue(fields, 'phone');
  const hours = getFieldValue(fields, 'hours');
  const emergencyText = getFieldValue(fields, 'emergency_text') || '24/7 Emergency Service Available';

  return (
    <section className="relative min-h-screen flex items-center jcw-bg-background jcw-text-primary overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Light Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            {/* Emergency Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium jcw-bg-accent text-white">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {emergencyText}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {heading}
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl jcw-text-secondary mb-8 max-w-2xl">
              {subheading}
            </p>

            {/* Service Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 jcw-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">ASE Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 jcw-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Free Estimates</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 jcw-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Warranty</span>
              </div>
            </div>
            
            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={ctaUrl}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white jcw-bg-primary hover:opacity-90 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {ctaText}
              </a>
              <a
                href={secondaryCtaUrl}
                className="inline-flex items-center justify-center px-8 py-3 jcw-border-accent text-base font-medium rounded-md jcw-text-accent bg-transparent hover:jcw-bg-accent hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {secondaryCtaText}
              </a>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="jcw-bg-primary bg-opacity-90 backdrop-blur-sm rounded-lg p-6 jcw-border-secondary border text-white">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              {/* Phone */}
              {phone && (
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 jcw-bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Call Us</p>
                    <a href={`tel:${phone}`} className="font-semibold hover:opacity-80 transition-colors text-white">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Hours */}
              {hours && (
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 jcw-bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Hours</p>
                    <p className="font-semibold text-white">{hours}</p>
                  </div>
                </div>
              )}

              {/* Service Area */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 jcw-bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Service Area</p>
                  <p className="font-semibold text-white">Local & Surrounding Areas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 jcw-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
          AutoGarageHero ({section.identifier})
        </div>
      )}
    </section>
  );
}