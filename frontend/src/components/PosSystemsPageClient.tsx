'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context'; // [AUTH]

interface PosSystemsPageClientProps {
  dict: any;
}

export default function PosSystemsPageClient({ dict }: PosSystemsPageClientProps) {
  const { isAuthenticated } = useAuth(); // [AUTH]
  
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
    <div>
      {/* [JCW] POS Systems hero section */}
      <div className="bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">
            Modern POS Systems
          </h1>
          <p className="text-lg mb-6 text-blue-700">
            Streamline your business operations with powerful, easy-to-use point-of-sale systems that grow with you.
          </p>
          
          {/* [AUTH] Edit mode info - only show when authenticated */}
          {isAuthenticated && (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border mb-8">
              <h3 className="text-lg font-semibold mb-4">💳 POS Systems Page Info</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Page:</strong> POS Systems</p>
                <p><strong>Slug:</strong> pos-systems</p>
                <p><strong>Template:</strong> jcw-main (no slider)</p>
                <p><strong>Features:</strong> Payment processing, Inventory, Analytics, Customer management</p>
                <p className="text-blue-600 font-medium">✅ Published</p> {/* [UI] Blue accent */}
              </div>
            </div>
          )}

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