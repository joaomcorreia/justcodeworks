// [TEMPLAB] Default Template Renderer
// 
// Default/fallback renderer for sites that don't match specific templates.
// Provides clean, minimal styling that works for any business type.
// Used for jcw-main and unknown template keys.

import React from 'react';
import SectionRenderer from '@/templates/SectionRenderer';
import type { SiteProjectPublic } from '@/lib/types/sitePublic';

interface DefaultRendererProps {
  site: SiteProjectPublic;
}

export default function DefaultRenderer({ site }: DefaultRendererProps) {
  // Get all sections from all pages, sorted by page order then section order
  const allSections = site.pages
    ?.flatMap(page => page.sections || [])
    .sort((a, b) => a.order - b.order) || [];

  return (
    <div className="default-site">
      {/* [TEMPLAB] Default/neutral styles wrapper */}
      <div className="default-theme">
        {allSections.map(section => (
          <SectionRenderer key={section.identifier} section={section} />
        ))}
      </div>
      
      {/* Default/neutral global styles */}
      <style jsx global>{`
        .default-site {
          /* Default color palette - neutral and professional */
          --default-primary: #2563eb; /* blue-600 */
          --default-secondary: #1d4ed8; /* blue-700 */
          --default-accent: #3b82f6; /* blue-500 */
          --default-neutral: #6b7280; /* gray-500 */
          --default-dark: #111827; /* gray-900 */
          --default-light: #f9fafb; /* gray-50 */
          
          /* Default typography */
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: var(--default-dark);
        }
        
        /* Default hero styling */
        .default-theme .hero-section {
          background: linear-gradient(135deg, #111827 0%, #374151 100%);
          color: white;
        }
        
        .default-theme .hero-overlay {
          background: rgba(0, 0, 0, 0.3);
        }
        
        /* Default content sections */
        .default-theme .content-section {
          background: white;
          padding: 4rem 0;
        }
        
        .default-theme .content-section:nth-child(even) {
          background: var(--default-light);
        }
        
        /* Default button styling */
        .default-theme .btn-primary {
          background: var(--default-primary);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .default-theme .btn-primary:hover {
          background: var(--default-secondary);
          transform: translateY(-1px);
        }
        
        .default-theme .btn-secondary {
          background: transparent;
          color: var(--default-primary);
          border: 2px solid var(--default-primary);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .default-theme .btn-secondary:hover {
          background: var(--default-primary);
          color: white;
        }
        
        /* Default section spacing */
        .default-theme .section-spacing {
          padding: 3rem 0;
        }
        
        /* Default card styling */
        .default-theme .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 2rem;
          transition: all 0.2s ease;
        }
        
        .default-theme .card:hover {
          border-color: var(--default-primary);
          box-shadow: 0 4px 15px rgba(37, 99, 235, 0.1);
        }
        
        /* Default footer styling */
        .default-theme .footer-section {
          background: var(--default-dark);
          color: var(--default-light);
        }
        
        .default-theme .footer-section a {
          color: var(--default-accent);
        }
        
        .default-theme .footer-section a:hover {
          color: white;
        }
        
        /* Default text styling */
        .default-theme .text-accent {
          color: var(--default-primary);
        }
        
        .default-theme .text-muted {
          color: var(--default-neutral);
        }
        
        /* Default responsive spacing */
        @media (max-width: 768px) {
          .default-theme .section-spacing {
            padding: 2rem 0;
          }
          
          .default-theme .card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}