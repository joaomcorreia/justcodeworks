// [TEMPLAB] Restaurant Footer Section Component
//
// A comprehensive footer for restaurant websites with contact info,
// hours, social media links, and navigation. Provides essential
// contact information and helps with site navigation.
//
// Expected Fields from Backend:
//   - restaurant_name: Restaurant name for branding
//   - address: Full restaurant address
//   - phone: Primary phone number
//   - email: Contact email address
//   - hours_weekdays: Weekday operating hours
//   - hours_weekend: Weekend operating hours
//   - social_facebook: Facebook URL
//   - social_instagram: Instagram URL
//   - social_twitter: Twitter URL
//   - copyright_text: Copyright notice
//   - menu_link: Link to menu page
//   - reservations_link: Link to reservations
//   - about_link: Link to about page

import React from 'react';
import type { SectionProps } from '@/templates/core/registry';

// Helper function to get field value by key
function getFieldValue(fields: SectionProps['section']['fields'], key: string): string {
  const field = fields.find(f => f.key === key);
  return field?.value || '';
}

export default function RestaurantFooterSection({ section, mode = 'public' }: SectionProps) {
  const { fields } = section;
  
  // Extract field values
  const restaurantName = getFieldValue(fields, 'restaurant_name') || getFieldValue(fields, 'name') || 'Restaurant Name';
  const address = getFieldValue(fields, 'address');
  const phone = getFieldValue(fields, 'phone');
  const email = getFieldValue(fields, 'email');
  const hoursWeekdays = getFieldValue(fields, 'hours_weekdays');
  const hoursWeekend = getFieldValue(fields, 'hours_weekend');
  const socialFacebook = getFieldValue(fields, 'social_facebook');
  const socialInstagram = getFieldValue(fields, 'social_instagram');
  const socialTwitter = getFieldValue(fields, 'social_twitter');
  const copyrightText = getFieldValue(fields, 'copyright_text') || `© ${new Date().getFullYear()} ${restaurantName}. All rights reserved.`;
  const menuLink = getFieldValue(fields, 'menu_link') || '#menu';
  const reservationsLink = getFieldValue(fields, 'reservations_link') || '#reservations';
  const aboutLink = getFieldValue(fields, 'about_link') || '#about';

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Restaurant Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-amber-400">{restaurantName}</h3>
            <p className="text-gray-300 mb-6">
              Authentic Italian cuisine in the heart of the city. Experience the taste of Italy with every dish.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {socialFacebook && (
                <a 
                  href={socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {socialInstagram && (
                <a 
                  href={socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.295C4.198 14.553 3.5 13.26 3.5 11.8c0-1.460.698-2.753 1.626-3.892.875-.806 2.026-1.296 3.323-1.296 1.297 0 2.448.49 3.323 1.296.928 1.139 1.626 2.432 1.626 3.892 0 1.46-.698 2.753-1.626 3.893-.875.805-2.026 1.295-3.323 1.295zm7.83-9.506c-.384 0-.692-.309-.692-.692 0-.384.308-.692.692-.692.383 0 .692.308.692.692 0 .383-.309.692-.692.692zm-4.262 1.766c-1.41 0-2.551 1.142-2.551 2.551 0 1.41 1.141 2.551 2.551 2.551s2.551-1.141 2.551-2.551c0-1.409-1.141-2.551-2.551-2.551z"/>
                  </svg>
                </a>
              )}
              {socialTwitter && (
                <a 
                  href={socialTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-amber-400">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              {address && (
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{address}</span>
                </div>
              )}
              
              {phone && (
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${phone}`} className="hover:text-amber-400 transition-colors">{phone}</a>
                </div>
              )}
              
              {email && (
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${email}`} className="hover:text-amber-400 transition-colors">{email}</a>
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-amber-400">Hours</h4>
            <div className="space-y-2 text-gray-300">
              {hoursWeekdays && (
                <div>
                  <p className="font-medium">Weekdays</p>
                  <p>{hoursWeekdays}</p>
                </div>
              )}
              {hoursWeekend && (
                <div>
                  <p className="font-medium">Weekend</p>
                  <p>{hoursWeekend}</p>
                </div>
              )}
              <div className="flex items-center space-x-2 mt-4">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-400">Open Now</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-amber-400">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href={menuLink} className="hover:text-amber-400 transition-colors">Our Menu</a>
              </li>
              <li>
                <a href={reservationsLink} className="hover:text-amber-400 transition-colors">Reservations</a>
              </li>
              <li>
                <a href={aboutLink} className="hover:text-amber-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">Contact</a>
              </li>
              <li>
                <a href="#events" className="hover:text-amber-400 transition-colors">Private Events</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">{copyrightText}</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#privacy" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          RestaurantFooter ({section.identifier})
        </div>
      )}
    </footer>
  );
}