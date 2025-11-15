// [TEMPLAB] Auto Garage Quote Form Section Component
//
// A comprehensive quote request form for automotive services with
// vehicle information capture and service selection. Enables efficient
// lead generation and service estimation workflow.
//
// Expected Fields from Backend:
//   - heading: Section title (e.g., "Get Your Free Quote")
//   - subtitle: Section description about quote process
//   - form_title: Form heading text
//   - form_description: Form description or instructions
//   - submit_text: Submit button text
//   - phone_number: Display phone number for alternative contact
//   - email: Display email for alternative contact
//   - response_time: Expected response time text

import React, { useState } from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

export default function AutoGarageQuoteFormSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    mileage: '',
    serviceType: '',
    description: '',
    preferredContact: 'phone'
  });

  // Extract field values
  const heading = getFieldValue(fields, 'heading') || getFieldValue(fields, 'title') || 'Get Your Free Quote';
  const subtitle = getFieldValue(fields, 'subtitle') || getFieldValue(fields, 'description') || 'Tell us about your vehicle and service needs. We\'ll provide a detailed quote within 24 hours.';
  const formTitle = getFieldValue(fields, 'form_title') || 'Request Service Quote';
  const formDescription = getFieldValue(fields, 'form_description') || 'Fill out the form below and we\'ll get back to you with a personalized quote.';
  const submitText = getFieldValue(fields, 'submit_text') || 'Get My Quote';
  const phoneNumber = getFieldValue(fields, 'phone_number') || '(555) 123-4567';
  const email = getFieldValue(fields, 'email') || 'info@autogarage.com';
  const responseTime = getFieldValue(fields, 'response_time') || 'We typically respond within 2-4 hours during business hours';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to the backend
    console.log('Form submitted:', formData);
    alert('Thank you! We\'ll send you a quote within 24 hours.');
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Quote Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {formTitle}
              </h3>
              <p className="text-gray-600 mb-6">
                {formDescription}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Vehicle Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700 mb-1">
                        Year *
                      </label>
                      <input
                        type="number"
                        id="vehicleYear"
                        name="vehicleYear"
                        required
                        min="1990"
                        max="2024"
                        value={formData.vehicleYear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-1">
                        Make *
                      </label>
                      <input
                        type="text"
                        id="vehicleMake"
                        name="vehicleMake"
                        required
                        value={formData.vehicleMake}
                        onChange={handleInputChange}
                        placeholder="e.g., Toyota, Honda, Ford"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-1">
                        Model *
                      </label>
                      <input
                        type="text"
                        id="vehicleModel"
                        name="vehicleModel"
                        required
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        placeholder="e.g., Camry, Civic, F-150"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-1">
                      Mileage
                    </label>
                    <input
                      type="number"
                      id="mileage"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      placeholder="Current odometer reading"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Service Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Service Needed</h4>
                  
                  <div className="mb-6">
                    <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                      Type of Service *
                    </label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a service</option>
                      <option value="oil-change">Oil Change & Filter</option>
                      <option value="brake-service">Brake Service</option>
                      <option value="tire-service">Tire Service</option>
                      <option value="engine-diagnostics">Engine Diagnostics</option>
                      <option value="transmission">Transmission Service</option>
                      <option value="ac-service">A/C Service</option>
                      <option value="general-repair">General Repair</option>
                      <option value="maintenance">Routine Maintenance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description of Issue or Service Needed
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please describe any symptoms, noises, or specific concerns..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>

                {/* Preferred Contact Method */}
                <div className="border-t border-gray-200 pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Contact Method
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="phone"
                        checked={formData.preferredContact === 'phone'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Phone Call</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="preferredContact"
                        value="email"
                        checked={formData.preferredContact === 'email'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Email</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  {submitText}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-blue-600 text-white rounded-lg p-8 sticky top-8">
              <h3 className="text-xl font-bold mb-6">Need Immediate Help?</h3>
              
              {/* Phone */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="font-medium">Call Us</span>
                </div>
                <a href={`tel:${phoneNumber}`} className="text-blue-100 hover:text-white text-lg">
                  {phoneNumber}
                </a>
              </div>

              {/* Email */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">Email Us</span>
                </div>
                <a href={`mailto:${email}`} className="text-blue-100 hover:text-white">
                  {email}
                </a>
              </div>

              {/* Response Time */}
              <div className="border-t border-blue-500 pt-6">
                <p className="text-blue-100 text-sm">
                  {responseTime}
                </p>
              </div>

              {/* Emergency Note */}
              <div className="mt-6 p-4 bg-red-500 bg-opacity-20 rounded-lg border border-red-400">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-medium text-red-200">Emergency Service</span>
                </div>
                <p className="text-red-100 text-sm">
                  For roadside emergencies, call our 24/7 hotline for immediate assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          AutoGarageQuoteForm ({section.identifier})
        </div>
      )}
    </section>
  );
}