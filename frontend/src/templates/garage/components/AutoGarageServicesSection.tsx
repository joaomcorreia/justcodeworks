// [TEMPLAB] Auto Garage Services Section Component
//
// A comprehensive services section showcasing automotive repair and
// maintenance services with icons, descriptions, and pricing options.
// Demonstrates expertise across different vehicle service categories.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "Our Services")
//   - subtitle: Section description about service offerings
//   - service_1_name: First service name
//   - service_1_description: First service description
//   - service_1_price: First service starting price
//   - service_1_icon: First service icon name
//   - service_2_name: Second service name
//   - service_2_description: Second service description
//   - service_2_price: Second service starting price
//   - service_2_icon: Second service icon name
//   - service_3_name: Third service name
//   - service_3_description: Third service description
//   - service_3_price: Third service starting price
//   - service_3_icon: Third service icon name
//   - service_4_name: Fourth service name
//   - service_4_description: Fourth service description
//   - service_4_price: Fourth service starting price
//   - service_4_icon: Fourth service icon name
//   - service_5_name: Fifth service name
//   - service_5_description: Fifth service description
//   - service_5_price: Fifth service starting price
//   - service_5_icon: Fifth service icon name
//   - service_6_name: Sixth service name
//   - service_6_description: Sixth service description
//   - service_6_price: Sixth service starting price
//   - service_6_icon: Sixth service icon name
//   - cta_text: Call-to-action button text
//   - cta_url: Call-to-action URL

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

// Icon component for services
function ServiceIcon({ iconName }: { iconName: string }) {
  const icons: Record<string, JSX.Element> = {
    oil: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    brake: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
      </svg>
    ),
    tire: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    engine: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    transmission: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
      </svg>
    ),
    ac: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    default: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };
  
  return icons[iconName] || icons.default;
}

export default function AutoGarageServicesSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'Our Services';
  const subtitle = getFieldValue(fields, 'subtitle') || getFieldValue(fields, 'description') || 'Professional automotive repair and maintenance services for all makes and models.';
  const ctaText = getFieldValue(fields, 'cta_text') || 'Schedule Service';
  const ctaUrl = getFieldValue(fields, 'cta_url') || '#';

  // Extract services (up to 6)
  const services = [
    {
      name: getFieldValue(fields, 'service_1_name') || 'Oil Change & Filter',
      description: getFieldValue(fields, 'service_1_description') || 'Regular oil changes to keep your engine running smoothly',
      price: getFieldValue(fields, 'service_1_price') || 'Starting at $49',
      icon: getFieldValue(fields, 'service_1_icon') || 'oil'
    },
    {
      name: getFieldValue(fields, 'service_2_name') || 'Brake Service',
      description: getFieldValue(fields, 'service_2_description') || 'Complete brake inspection, pad replacement, and system repair',
      price: getFieldValue(fields, 'service_2_price') || 'Starting at $89',
      icon: getFieldValue(fields, 'service_2_icon') || 'brake'
    },
    {
      name: getFieldValue(fields, 'service_3_name') || 'Tire Services',
      description: getFieldValue(fields, 'service_3_description') || 'Tire rotation, balancing, alignment, and replacement',
      price: getFieldValue(fields, 'service_3_price') || 'Starting at $25',
      icon: getFieldValue(fields, 'service_3_icon') || 'tire'
    },
    {
      name: getFieldValue(fields, 'service_4_name') || 'Engine Diagnostics',
      description: getFieldValue(fields, 'service_4_description') || 'Comprehensive engine analysis and performance testing',
      price: getFieldValue(fields, 'service_4_price') || 'Starting at $125',
      icon: getFieldValue(fields, 'service_4_icon') || 'engine'
    },
    {
      name: getFieldValue(fields, 'service_5_name') || 'Transmission Service',
      description: getFieldValue(fields, 'service_5_description') || 'Transmission fluid change and system maintenance',
      price: getFieldValue(fields, 'service_5_price') || 'Starting at $149',
      icon: getFieldValue(fields, 'service_5_icon') || 'transmission'
    },
    {
      name: getFieldValue(fields, 'service_6_name') || 'A/C Service',
      description: getFieldValue(fields, 'service_6_description') || 'Air conditioning repair and refrigerant recharge',
      price: getFieldValue(fields, 'service_6_price') || 'Starting at $79',
      icon: getFieldValue(fields, 'service_6_icon') || 'ac'
    }
  ].filter(service => service.name && service.description);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              {/* Service Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-blue-600">
                  <ServiceIcon iconName={service.icon} />
                </div>
              </div>
              
              {/* Service Info */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-4 flex-grow">
                {service.description}
              </p>
              
              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  {service.price}
                </span>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Service Categories */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            We Service All Vehicle Types
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Sedans</h4>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">SUVs</h4>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Trucks</h4>
            </div>
            
            <div className="p-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900">Hybrids</h4>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="text-center">
          <a
            href={ctaUrl}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {ctaText}
          </a>
          
          <p className="mt-4 text-gray-600">
            Call us today for a free estimate on any service
          </p>
        </div>

        {/* Warranty & Quality Assurance */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <svg className="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h4 className="font-semibold text-gray-900 mb-1">12-Month Warranty</h4>
            <p className="text-sm text-gray-600">All repairs backed by comprehensive warranty</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <svg className="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <h4 className="font-semibold text-gray-900 mb-1">Quality Parts</h4>
            <p className="text-sm text-gray-600">OEM and premium aftermarket parts only</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <svg className="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h4 className="font-semibold text-gray-900 mb-1">ASE Certified</h4>
            <p className="text-sm text-gray-600">Experienced and certified technicians</p>
          </div>
        </div>
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          AutoGarageServices ({section.identifier})
        </div>
      )}
    </section>
  );
}