'use client';

import React from 'react';
import Link from 'next/link';

interface PosSystemsPageClientProps {
  dict: any;
}

export default function PosSystemsPageClient({ dict }: PosSystemsPageClientProps) {
  
  const posFeatures = [
    {
      id: 'payment-processing',
      title: 'Payment Processing',
      description: 'Accept all payment methods with ease',
      icon: '💳',
      details: 'Credit cards, debit cards, contactless payments, and mobile wallets all in one system.',
      popular: true,
    },
    {
      id: 'inventory-management',
      title: 'Inventory Management',
      description: 'Track stock levels in real-time',
      icon: '📊',
      details: 'Monitor inventory, set alerts for low stock, and manage suppliers efficiently.',
      popular: false,
    },
    {
      id: 'sales-analytics',
      title: 'Sales Analytics',
      description: 'Understand your business performance',
      icon: '📈',
      details: 'Detailed reports on sales trends, popular items, and customer behavior.',
      popular: false,
    },
    {
      id: 'customer-management',
      title: 'Customer Management',
      description: 'Build stronger customer relationships',
      icon: '👥',
      details: 'Customer profiles, purchase history, and loyalty program integration.',
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
              POS Systems
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
              Modern POS Systems
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Streamline your business operations with powerful, easy-to-use point-of-sale systems that grow with you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Get Started →
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POS Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful POS Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to run your business efficiently, from payments to inventory management.
            </p>
          </div>
          
          {/* [JCW] POS features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {posFeatures.map((feature) => (
              <div 
                key={feature.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  {feature.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-blue-900 mb-3">{feature.title}</h3>
                <p className="text-blue-700 mb-4 font-medium">{feature.description}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                  {feature.details}
                </p>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                  <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                    Request Demo
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* [JCW] POS integration section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-blue-100 mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Complete Business Solution</h2>
              <p className="text-blue-700">Integrated tools for modern businesses</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Easy Integration</h3>
                <p className="text-sm text-blue-600">Works with your existing tools and workflows</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">☁️</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Cloud-Based</h3>
                <p className="text-sm text-blue-600">Access your data from anywhere, anytime</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-1">Secure & Reliable</h3>
                <p className="text-sm text-blue-600">Bank-level security for all transactions</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Get Your POS System →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}