// [TEMPLAB] Auto Garage Diagnostics Section Component
//
// A diagnostics section showcasing advanced diagnostic equipment and
// capabilities. Builds trust through technology demonstration and
// transparent diagnostic processes.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "Advanced Diagnostic Services")
//   - subtitle: Section description about diagnostic capabilities
//   - diagnostic_1_name: First diagnostic service name
//   - diagnostic_1_description: First diagnostic service description
//   - diagnostic_1_icon: First diagnostic service icon name
//   - diagnostic_2_name: Second diagnostic service name
//   - diagnostic_2_description: Second diagnostic service description
//   - diagnostic_2_icon: Second diagnostic service icon name
//   - diagnostic_3_name: Third diagnostic service name
//   - diagnostic_3_description: Third diagnostic service description
//   - diagnostic_3_icon: Third diagnostic service icon name
//   - diagnostic_4_name: Fourth diagnostic service name
//   - diagnostic_4_description: Fourth diagnostic service description
//   - diagnostic_4_icon: Fourth diagnostic service icon name
//   - cta_text: Call-to-action button text
//   - cta_url: Call-to-action URL

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

// Icon component for diagnostic services
function DiagnosticIcon({ iconName }: { iconName: string }) {
  const icons: Record<string, JSX.Element> = {
    computer: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    engine: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    transmission: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    electrical: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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

export default function AutoGarageDiagnosticsSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'Advanced Diagnostic Services';
  const subtitle = getFieldValue(fields, 'subtitle') || getFieldValue(fields, 'description') || 'State-of-the-art diagnostic equipment to pinpoint issues accurately and efficiently.';
  const ctaText = getFieldValue(fields, 'cta_text') || 'Schedule Diagnostic';
  const ctaUrl = getFieldValue(fields, 'cta_url') || '#';

  // Extract diagnostic services
  const diagnostics = [
    {
      name: getFieldValue(fields, 'diagnostic_1_name') || 'Computer Diagnostics',
      description: getFieldValue(fields, 'diagnostic_1_description') || 'Advanced OBD-II scanning and computer system analysis',
      icon: getFieldValue(fields, 'diagnostic_1_icon') || 'computer'
    },
    {
      name: getFieldValue(fields, 'diagnostic_2_name') || 'Engine Analysis',
      description: getFieldValue(fields, 'diagnostic_2_description') || 'Comprehensive engine performance and efficiency testing',
      icon: getFieldValue(fields, 'diagnostic_2_icon') || 'engine'
    },
    {
      name: getFieldValue(fields, 'diagnostic_3_name') || 'Transmission Diagnostics',
      description: getFieldValue(fields, 'diagnostic_3_description') || 'Automatic and manual transmission system evaluation',
      icon: getFieldValue(fields, 'diagnostic_3_icon') || 'transmission'
    },
    {
      name: getFieldValue(fields, 'diagnostic_4_name') || 'Electrical System Testing',
      description: getFieldValue(fields, 'diagnostic_4_description') || 'Complete electrical system and component analysis',
      icon: getFieldValue(fields, 'diagnostic_4_icon') || 'electrical'
    }
  ].filter(diagnostic => diagnostic.name && diagnostic.description);

  return (
    <section className="py-16 md:py-24 bg-white">
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

        {/* Diagnostic Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {diagnostics.map((diagnostic, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                <div className="text-blue-600 group-hover:text-white transition-colors duration-300">
                  <DiagnosticIcon iconName={diagnostic.icon} />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {diagnostic.name}
              </h3>
              <p className="text-gray-600">
                {diagnostic.description}
              </p>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-gray-50 rounded-lg p-8 md:p-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Our Diagnostic Process
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Initial Assessment</h4>
              <p className="text-gray-600">
                We listen to your concerns and perform a visual inspection to understand the symptoms.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Advanced Testing</h4>
              <p className="text-gray-600">
                Using state-of-the-art diagnostic equipment to identify the root cause of issues.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Detailed Report</h4>
              <p className="text-gray-600">
                Receive a comprehensive report with findings and recommended solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="text-center mt-12">
          <a
            href={ctaUrl}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {ctaText}
          </a>
        </div>

        {/* Features Banner */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-semibold text-gray-900 mb-1">Fast Results</h4>
            <p className="text-sm text-gray-600">Most diagnostics completed within 1-2 hours</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h4 className="font-semibold text-gray-900 mb-1">Accurate Testing</h4>
            <p className="text-sm text-gray-600">Latest diagnostic technology and certified technicians</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-blue-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h4 className="font-semibold text-gray-900 mb-1">Fair Pricing</h4>
            <p className="text-sm text-gray-600">Transparent diagnostic fees with no hidden costs</p>
          </div>
        </div>
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          AutoGarageDiagnostics ({section.identifier})
        </div>
      )}
    </section>
  );
}