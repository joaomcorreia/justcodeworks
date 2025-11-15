'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context'; // [AUTH]

interface WebsitesPageClientProps {
  dict: any;
}

export default function WebsitesPageClient({ dict }: WebsitesPageClientProps) {
  const { isAuthenticated } = useAuth(); // [AUTH]
  
  const websiteTypes = [
    {
      id: 'one-page',
      title: 'One-Page Websites',
      description: 'Perfect for simple local businesses',
      icon: '🌐',
      details: 'Ideal if you have a few services and want everything on one clean, scrollable page.',
      popular: true,
    },
    {
      id: 'multi-page',
      title: 'Multi-Page Websites',
      description: 'Grow with dedicated pages for each service',
      icon: '🏢',
      details: 'Great for companies that want separate pages for services, projects, team, blog and more.',
      popular: false,
    },
    {
      id: 'online-shops',
      title: 'Online Stores',
      description: 'Sell your products with a simple store',
      icon: '🛒',
      details: 'For businesses ready to take online payments and manage orders without complex systems.',
      popular: false,
    },
    {
      id: 'custom',
      title: 'Custom Websites',
      description: 'Tailored solutions for unique needs',
      icon: '🎨',
      details: 'Fully customized websites with advanced features and integrations specific to your business.',
      popular: false,
    },
  ];

  return (
    <div>
      {/* [JCW] Websites hero section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">
            {dict.websites?.title || 'Websites that work as hard as you do'}
          </h1>
          <p className="text-lg mb-6 text-blue-700">
            {dict.websites?.subtitle || 'Choose the type of website that fits your business today – and upgrade later as you grow.'}
          </p>
          
          {/* [AUTH] Edit mode info - only show when authenticated */}
          {isAuthenticated && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border mb-8">
              <h3 className="text-lg font-semibold mb-4">💻 Websites Page Info</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Page:</strong> Websites</p>
                <p><strong>Slug:</strong> websites</p>
                <p><strong>Template:</strong> jcw-main (no slider)</p>
                <p><strong>Features:</strong> One-page, Multi-page, Online stores, Custom sites</p>
                <p className="text-blue-600 font-medium">✅ Published</p> {/* [UI] Blue accent */}
              </div>
            </div>
          )}

          {/* [JCW] Website types grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {websiteTypes.map((type) => (
              <div 
                key={type.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl mb-4">{type.icon}</div>
                  {type.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-blue-900 mb-3">{type.title}</h3>
                <p className="text-blue-700 mb-4 font-medium">{type.description}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                  {type.details}
                </p>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    View Examples
                  </button>
                  <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* [JCW] Website builder features */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Modern Website Builder</h2>
              <p className="text-blue-700">Everything you need to build professional websites</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Mobile-First</h3>
                <p className="text-sm text-blue-600">Responsive design that works on all devices</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">SEO Optimized</h3>
                <p className="text-sm text-blue-600">Built-in SEO features to help you rank</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Fast Loading</h3>
                <p className="text-sm text-blue-600">Optimized performance and speed</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Start Building Your Website →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}