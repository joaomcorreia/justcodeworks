'use client';

import { useAuth } from '@/contexts/auth-context'; // [AUTH]

interface ServicesPageClientProps {
  dict: any;
}

export default function ServicesPageClient({ dict }: ServicesPageClientProps) {
  const { isAuthenticated } = useAuth(); // [AUTH]
  
  const services = [
    {
      id: 'website-maintenance',
      title: 'Website Maintenance',
      description: 'Keep your website running smoothly',
      icon: '🛠️',
      details: 'Regular updates, security patches, backups, and performance optimization.',
      popular: true,
    },
    {
      id: 'seo-optimization',
      title: 'SEO Optimization',
      description: 'Improve your search engine rankings',
      icon: '🔍',
      details: 'Keyword research, content optimization, and technical SEO improvements.',
      popular: false,
    },
    {
      id: 'business-consulting',
      title: 'Business Consulting',
      description: 'Strategic guidance for growth',
      icon: '📊',
      details: 'Digital transformation, process optimization, and technology planning.',
      popular: false,
    },
    {
      id: 'custom-development',
      title: 'Custom Development',
      description: 'Tailored solutions for unique needs',
      icon: '💻',
      details: 'Custom web applications, integrations, and specialized functionality.',
      popular: false,
    },
  ];

  return (
    <div>
      {/* [JCW] Services hero section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">
            Professional Services
          </h1>
          <p className="text-lg mb-6 text-blue-700">
            Expert support and consulting to help your business thrive online.
          </p>
          
          {/* [AUTH] Edit mode info - only show when authenticated */}
          {isAuthenticated && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border mb-8">
              <h3 className="text-lg font-semibold mb-4">🛠️ Services Page Info</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Page:</strong> Services</p>
                <p><strong>Slug:</strong> services</p>
                <p><strong>Template:</strong> jcw-main (no slider)</p>
                <p><strong>Features:</strong> Maintenance, SEO, Consulting, Custom development</p>
                <p className="text-blue-600 font-medium">✅ Published</p> {/* [UI] Blue accent */}
              </div>
            </div>
          )}

          {/* [JCW] Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  {service.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-blue-900 mb-3">{service.title}</h3>
                <p className="text-blue-700 mb-4 font-medium">{service.description}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                  {service.details}
                </p>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                  <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* [JCW] Support section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Expert Support When You Need It</h2>
              <p className="text-blue-700">Professional services to keep your business running</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">24/7 Support</h3>
                <p className="text-sm text-blue-600">Round-the-clock assistance when you need it</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Expert Team</h3>
                <p className="text-sm text-blue-600">Experienced professionals at your service</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Fast Response</h3>
                <p className="text-sm text-blue-600">Quick turnaround on all requests</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Contact Our Team →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}