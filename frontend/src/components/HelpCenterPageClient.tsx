'use client';

import React from 'react';

interface HelpCenterPageClientProps {
  dict: any;
}

export default function HelpCenterPageClient({ dict }: HelpCenterPageClientProps) {
  
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
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-10 left-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-10 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 left-10 w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-40 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Help & Support
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
              Help & Support
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Get the help you need with our comprehensive support resources and expert assistance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Browse Help Articles →
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Categories Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How can we help?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find answers, get support, and learn how to make the most of our platform.
            </p>
          </div>

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