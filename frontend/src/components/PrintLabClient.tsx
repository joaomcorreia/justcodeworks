'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context'; // [AUTH]

interface PrintLabClientProps {
  dict: any;
  locale: string;
}

export default function PrintLabClient({ dict, locale }: PrintLabClientProps) {
  const { isAuthenticated } = useAuth(); // [AUTH]
  
  const printingSections = [
    {
      id: 'business-cards',
      title: 'Business Cards',
      description: 'Make a strong first impression with professional business cards',
      icon: '💼',
      details: 'Classic or modern designs with your logo, colors and contact details, ready to hand out to new customers.',
      popular: true,
    },
    {
      id: 'flyers-trifolds',
      title: 'Flyers & Trifolds',
      description: 'Promote your services with eye-catching marketing materials',
      icon: '📄',
      details: 'Perfect for events, promotions, and showcasing your services with professional fold designs.',
      popular: false,
    },
    {
      id: 'clothing',
      title: 'Clothing & Apparel',
      description: 'Custom t-shirts, caps, and branded clothing',
      icon: '👕',
      details: 'Build brand recognition with custom apparel including t-shirts, hoodies, caps, and uniforms.',
      popular: false,
    },
    {
      id: 'gifts-mugs',
      title: 'Gifts & Mugs',
      description: 'Personalized gifts and promotional items',
      icon: '☕',
      details: 'Custom mugs, keychains, and promotional gifts perfect for client appreciation and marketing.',
      popular: false,
    },
  ];

  return (
    <div>
      {/* [JCW] Print Lab hero section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">Print Lab</h1>
          <p className="text-lg mb-6 text-blue-700">
            Professional printing services for your business. High-quality materials, 
            fast delivery, and competitive prices. Connect with trusted suppliers like Freepik.com.
          </p>
          
          {/* [AUTH] Edit mode info - only show when authenticated */}
          {isAuthenticated && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border mb-8">
              <h3 className="text-lg font-semibold mb-4">🖨️ Print Lab Page Info</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Page:</strong> Print Lab</p>
                <p><strong>Slug:</strong> print-lab</p>
                <p><strong>Template:</strong> jcw-main (no slider)</p>
                <p><strong>Suppliers:</strong> Freepik.com integration planned</p>
                <p className="text-blue-600 font-medium">✅ Published</p> {/* [UI] Blue accent */}
              </div>
            </div>
          )}

          {/* [JCW] Print Lab sections grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {printingSections.map((section) => (
              <div 
                key={section.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl mb-4">{section.icon}</div>
                  {section.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-blue-900 mb-3">{section.title}</h3>
                <p className="text-blue-700 mb-4 font-medium">{section.description}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                  {section.details}
                </p>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Browse {section.title}
                  </button>
                  <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* [JCW] Supplier integration section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Professional Suppliers</h2>
              <p className="text-blue-700">Connected with trusted printing partners for quality results</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Premium Designs</h3>
                <p className="text-sm text-blue-600">Access to professional templates from Freepik</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Fast Turnaround</h3>
                <p className="text-sm text-blue-600">Quick production and delivery times</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Quality Guarantee</h3>
                <p className="text-sm text-blue-600">Professional materials and printing standards</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Start Your Project →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}