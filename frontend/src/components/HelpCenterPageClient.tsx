'use client';

import { useAuth } from '@/contexts/auth-context'; // [AUTH]

interface HelpCenterPageClientProps {
  dict: any;
}

export default function HelpCenterPageClient({ dict }: HelpCenterPageClientProps) {
  const { isAuthenticated } = useAuth(); // [AUTH]
  
  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'New to our platform? Start here',
      icon: '🚀',
      details: 'Step-by-step guides to help you get up and running quickly.',
      popular: true,
    },
    {
      id: 'website-help',
      title: 'Website Help',
      description: 'Learn how to manage your website',
      icon: '🌐',
      details: 'Tutorials on content management, design customization, and publishing.',
      popular: false,
    },
    {
      id: 'technical-support',
      title: 'Technical Support',
      description: 'Troubleshooting and technical assistance',
      icon: '🛠️',
      details: 'Common issues, error resolutions, and advanced configurations.',
      popular: false,
    },
    {
      id: 'billing-account',
      title: 'Billing & Account',
      description: 'Account management and billing questions',
      icon: '💳',
      details: 'Subscription management, payment methods, and account settings.',
      popular: false,
    },
  ];

  return (
    <div>
      {/* [JCW] Help Center hero section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">
            Help Center
          </h1>
          <p className="text-lg mb-6 text-blue-700">
            Find answers, get support, and learn how to make the most of our platform.
          </p>
          
          {/* [AUTH] Edit mode info - only show when authenticated */}
          {isAuthenticated && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border mb-8">
              <h3 className="text-lg font-semibold mb-4">📚 Help Center Page Info</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Page:</strong> Help Center</p>
                <p><strong>Slug:</strong> help-center</p>
                <p><strong>Template:</strong> jcw-main (no slider)</p>
                <p><strong>Features:</strong> Getting started, Website help, Technical support, Billing</p>
                <p className="text-blue-600 font-medium">✅ Published</p> {/* [UI] Blue accent */}
              </div>
            </div>
          )}

          {/* [JCW] Help categories grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {helpCategories.map((category) => (
              <div 
                key={category.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  {category.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-blue-900 mb-3">{category.title}</h3>
                <p className="text-blue-700 mb-4 font-medium">{category.description}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                  {category.details}
                </p>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Browse Articles
                  </button>
                  <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    Ask Question
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* [JCW] Search & Contact section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Search section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔍</span>
                </div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">Search Knowledge Base</h2>
                <p className="text-blue-700 text-sm">Find answers quickly with our search</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Contact section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">Still Need Help?</h2>
                <p className="text-blue-700 text-sm">Get in touch with our support team</p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Support
                </button>
                <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                  Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* [JCW] Popular articles section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Popular Help Articles</h2>
              <p className="text-blue-700">Most viewed articles this week</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-blue-900 mb-1">How to Create Your First Website</h3>
                <p className="text-sm text-blue-600">Step-by-step guide for beginners</p>
              </div>
              
              <div className="text-center p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-blue-900 mb-1">Customizing Your Design</h3>
                <p className="text-sm text-blue-600">Make your site uniquely yours</p>
              </div>
              
              <div className="text-center p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                <h3 className="font-semibold text-blue-900 mb-1">Domain & Hosting Setup</h3>
                <p className="text-sm text-blue-600">Connect your custom domain</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}