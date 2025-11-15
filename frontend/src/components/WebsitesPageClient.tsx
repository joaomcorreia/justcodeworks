'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context'; // [AUTH]

interface WebsitesPageClientProps {
  dict: any;
}

export default function WebsitesPageClient({ dict }: WebsitesPageClientProps) {
  const { isAuthenticated } = useAuth(); // [AUTH]
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const websiteTypes = [
    {
      id: 'one-page',
      title: dict.websites?.onePage?.title || 'Perfect for simple local businesses',
      description: dict.websites?.onePage?.badge || 'One-page websites',
      icon: '🌐',
      details: dict.websites?.onePage?.desc || 'Ideal if you have a few services and want everything on one clean, scrollable page.',
      popular: true,
      price: '€29',
      period: '/mês',
      features: dict.websites?.onePage?.bullets || [
        'Up to 6 services on one page',
        'Contact / WhatsApp / call buttons',
        'Optimized for mobile visitors'
      ],
      demoUrl: '/sites/marys-restaurant',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'multi-page',
      title: dict.websites?.multiPage?.title || 'Grow with dedicated pages for each service',
      description: dict.websites?.multiPage?.badge || 'Multi-page websites',
      icon: '🏢',
      details: dict.websites?.multiPage?.desc || 'Great for companies that want separate pages for services, projects, team, blog and more.',
      popular: false,
      price: '€49',
      period: '/mês',
      features: dict.websites?.multiPage?.bullets || [
        'Service pages that can rank on Google',
        'Blog / news sections for updates',
        'Structured contact & quote forms'
      ],
      demoUrl: '/sites/just-code-works',
      gradient: 'from-purple-500 to-pink-400'
    },
    {
      id: 'online-shops',
      title: dict.websites?.ecommerce?.title || 'Sell your products with a simple store',
      description: dict.websites?.ecommerce?.badge || 'Online stores',
      icon: '🛒',
      details: dict.websites?.ecommerce?.desc || 'For businesses ready to take online payments and manage orders without complex systems.',
      popular: false,
      price: '€79',
      period: '/mês',
      features: dict.websites?.ecommerce?.bullets || [
        'Product catalogue and categories',
        'Simple checkout and payment options',
        'Order notifications and basic reports'
      ],
      demoUrl: '/templates',
      gradient: 'from-green-500 to-emerald-400'
    },
    {
      id: 'custom',
      title: 'Tailored solutions for unique needs',
      description: 'Custom websites',
      icon: '🎨',
      details: 'Fully customized websites with advanced features and integrations specific to your business.',
      popular: false,
      price: 'Personalizado',
      period: '',
      features: [
        'Custom design and functionality',
        'Advanced integrations',
        'Dedicated support and maintenance'
      ],
      demoUrl: '/sites/oficina-paulo-calibra',
      gradient: 'from-orange-500 to-red-400'
    },
  ];

  const builderFeatures = [
    {
      icon: '🚀',
      title: 'Launch in Minutes',
      description: 'Get your website online in under 10 minutes with our guided setup',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      textColor: 'text-blue-900'
    },
    {
      icon: '📱',
      title: 'Mobile-First Design',
      description: 'All websites are optimized for smartphones, tablets, and desktops',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100', 
      textColor: 'text-green-900'
    },
    {
      icon: '🔍',
      title: 'SEO Ready',
      description: 'Built-in SEO optimization to help customers find you on Google',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      textColor: 'text-purple-900'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized performance ensures your site loads in under 2 seconds',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      textColor: 'text-yellow-900'
    },
    {
      icon: '🛡️',
      title: 'Secure & Reliable',
      description: 'SSL certificates, backups, and 99.9% uptime guarantee included',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
      textColor: 'text-red-900'
    },
    {
      icon: '🎨',
      title: 'Easy Customization',
      description: 'Change colors, fonts, and layout without any coding skills',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      textColor: 'text-indigo-900'
    }
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
          {/* [AUTH] Edit mode info - only show when authenticated */}
          {isAuthenticated && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-12 text-white">
              <h3 className="text-lg font-semibold mb-4">💻 Websites Page Info</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p><strong>Page:</strong> Websites</p>
                <p><strong>Slug:</strong> websites</p>
                <p><strong>Template:</strong> jcw-main (redesigned)</p>
                <p><strong>Features:</strong> One-page, Multi-page, Online stores, Custom sites</p>
                <p className="text-blue-300 font-medium">✅ Published</p>
              </div>
            </div>
          )}

          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {dict.websites?.badge || 'Website Builder'}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
              {dict.websites?.title || 'Websites that work as hard as you do'}
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {dict.websites?.subtitle || 'Choose the type of website that fits your business today – and upgrade later as you grow.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
                {dict.hero?.ctaPrimary || 'Start in 2 minutes'} →
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                {dict.hero?.ctaSecondary || 'View demo website'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Website Types Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Website Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From simple landing pages to full e-commerce stores, we have the perfect solution for your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {websiteTypes.map((type, index) => (
              <div 
                key={type.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(type.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                  
                  {/* Popular badge */}
                  {type.popular && (
                    <div className="absolute -top-3 -right-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        ⭐ Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`text-6xl transform transition-transform duration-300 ${hoveredCard === type.id ? 'scale-110 rotate-12' : ''}`}>
                        {type.icon}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                        {type.description}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      {type.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {type.details}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline mb-6">
                      <span className="text-3xl font-bold text-gray-900">{type.price}</span>
                      <span className="text-gray-600 ml-1">{type.period}</span>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {type.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <Link href={type.demoUrl} target="_blank">
                        <button className={`w-full px-6 py-3 bg-gradient-to-r ${type.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                          View Live Demo
                        </button>
                      </Link>
                      <button className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors border border-gray-200">
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed Online
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our website builder comes packed with professional features that help your business grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {builderFeatures.map((feature, index) => (
              <div 
                key={index}
                className={`${feature.bgColor} rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold ${feature.textColor} mb-3`}>
                  {feature.title}
                </h3>
                <p className={`${feature.textColor} opacity-80 leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Launch Your Website?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust Just Code Works for their online presence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Start Building Now →
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              Talk to an Expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}