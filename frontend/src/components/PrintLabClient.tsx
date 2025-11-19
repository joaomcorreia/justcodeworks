'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context'; // [AUTH]

interface PrintLabClientProps {
  dict: any;
  locale: string;
}

export default function PrintLabClient({ dict, locale }: PrintLabClientProps) {
  const { isAuthenticated } = useAuth(); // [AUTH]
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveService(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const printingServices = [
    {
      id: 'business-cards',
      title: 'Business Cards',
      subtitle: 'Make Your First Impression Count',
      description: 'Premium business cards with cutting-edge design and high-quality materials',
      icon: '💼',
      gradient: 'from-blue-600 to-purple-600',
      features: ['Premium cardstock', 'UV coating available', 'Same-day printing', 'Free design consultation'],
      price: 'From €29',
      popular: true,
      demoImages: [
        { type: 'Classic', color: 'bg-gradient-to-br from-slate-800 to-slate-900' },
        { type: 'Modern', color: 'bg-gradient-to-br from-blue-500 to-cyan-400' },
        { type: 'Elegant', color: 'bg-gradient-to-br from-purple-500 to-pink-500' }
      ]
    },
    {
      id: 'flyers-brochures',
      title: 'Flyers & Brochures',
      subtitle: 'Captivate Your Audience',
      description: 'Eye-catching marketing materials that drive engagement and conversions',
      icon: '📄',
      gradient: 'from-emerald-600 to-teal-600',
      features: ['Full-color printing', 'Various paper weights', 'Tri-fold options', 'Bulk discounts'],
      price: 'From €15',
      popular: false,
      demoImages: [
        { type: 'A4 Flyer', color: 'bg-gradient-to-br from-emerald-400 to-green-500' },
        { type: 'Tri-fold', color: 'bg-gradient-to-br from-teal-400 to-blue-500' },
        { type: 'Brochure', color: 'bg-gradient-to-br from-cyan-400 to-blue-600' }
      ]
    },
    {
      id: 'apparel',
      title: 'Custom Apparel',
      subtitle: 'Wear Your Brand',
      description: 'High-quality custom clothing and branded merchandise for your business',
      icon: '👕',
      gradient: 'from-orange-600 to-red-600',
      features: ['Premium fabrics', 'Screen printing', 'Embroidery options', 'Size range S-5XL'],
      price: 'From €18',
      popular: false,
      demoImages: [
        { type: 'T-Shirt', color: 'bg-gradient-to-br from-red-400 to-pink-500' },
        { type: 'Hoodie', color: 'bg-gradient-to-br from-orange-400 to-red-500' },
        { type: 'Cap', color: 'bg-gradient-to-br from-yellow-400 to-orange-500' }
      ]
    },
    {
      id: 'promotional',
      title: 'Promotional Items',
      subtitle: 'Brand Recognition That Lasts',
      description: 'Memorable promotional products that keep your brand top-of-mind',
      icon: '🎁',
      gradient: 'from-violet-600 to-purple-600',
      features: ['Custom mugs & bottles', 'Tech accessories', 'Office supplies', 'Gift packaging'],
      price: 'From €8',
      popular: false,
      demoImages: [
        { type: 'Mug', color: 'bg-gradient-to-br from-purple-400 to-violet-500' },
        { type: 'USB Drive', color: 'bg-gradient-to-br from-indigo-400 to-purple-500' },
        { type: 'Notebook', color: 'bg-gradient-to-br from-violet-400 to-pink-500' }
      ]
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers', icon: '😊' },
    { number: '48h', label: 'Average Delivery', icon: '⚡' },
    { number: '99%', label: 'Quality Rating', icon: '⭐' },
    { number: '24/7', label: 'Support Available', icon: '💬' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
              Print Lab
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your brand with <span className="font-bold text-blue-600">premium printing solutions</span> that make lasting impressions
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-purple-700">
                Start Your Project ✨
              </button>
              <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-800 font-bold rounded-2xl shadow-xl hover:bg-white/90 transform hover:scale-105 transition-all duration-300 border border-slate-200">
                View Portfolio 🎨
              </button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform transition-all duration-500 hover:scale-110 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* [AUTH] Edit mode info - only show when authenticated */}
          {isAuthenticated && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-200 mb-12 transform hover:scale-[1.02] transition-all duration-300">
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">🖨️ Print Lab Page Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Page:</strong> Print Lab</p>
                  <p><strong>Slug:</strong> print-lab</p>
                  <p><strong>Template:</strong> jcw-main (redesigned)</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Suppliers:</strong> Freepik.com integration</p>
                  <p className="text-blue-600 font-medium">✅ Published & Enhanced</p>
                </div>
              </div>
            </div>
          )}

          {/* Services Showcase */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-slate-800 dark:text-white">
              Our Premium Services
            </h2>
            <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
              Professional printing solutions designed to elevate your brand
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {printingServices.map((service, index) => (
                <div
                  key={service.id}
                  className={`group relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 hover:scale-[1.02] ${
                    activeService === index ? 'ring-4 ring-blue-400 shadow-blue-500/50' : ''
                  }`}
                  onMouseEnter={() => setActiveService(index)}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-90`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 text-white">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {service.icon}
                      </div>
                      {service.popular && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                          🔥 POPULAR
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-3xl font-black mb-2">{service.title}</h3>
                    <p className="text-xl font-semibold opacity-90 mb-4">{service.subtitle}</p>
                    <p className="opacity-80 mb-6 leading-relaxed">{service.description}</p>
                    
                    {/* Features */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="mr-2">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Demo Images */}
                    <div className="flex gap-3 mb-6">
                      {service.demoImages.map((demo, idx) => (
                        <div
                          key={idx}
                          className={`w-16 h-16 ${demo.color} rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300 flex items-center justify-center text-xs font-bold text-white`}
                        >
                          {demo.type}
                        </div>
                      ))}
                    </div>
                    
                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black">{service.price}</div>
                      <button className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-bold transition-all duration-300 transform hover:scale-105">
                        Get Quote →
                      </button>
                    </div>
                  </div>
                  
                  {/* Hover Effects */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-slate-800 dark:text-white">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-center text-slate-600 dark:text-slate-300 mb-12">
              From concept to delivery in just a few clicks
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Choose', desc: 'Select your product & customize', icon: '🎯', color: 'from-blue-500 to-cyan-400' },
                { step: '2', title: 'Design', desc: 'Upload or create your design', icon: '🎨', color: 'from-purple-500 to-pink-400' },
                { step: '3', title: 'Approve', desc: 'Review & approve your proof', icon: '✅', color: 'from-green-500 to-emerald-400' },
                { step: '4', title: 'Receive', desc: 'Fast delivery to your door', icon: '📦', color: 'from-orange-500 to-red-400' }
              ].map((process, index) => (
                <div 
                  key={index}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${process.color} text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
                >
                  <div className="text-4xl mb-4">{process.icon}</div>
                  <div className="text-2xl font-black mb-2">{process.step}</div>
                  <h3 className="text-xl font-bold mb-2">{process.title}</h3>
                  <p className="opacity-90 text-sm">{process.desc}</p>
                  
                  {/* Step connector */}
                  {index < 3 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-3xl text-slate-400">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to Print Something Amazing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their printing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
                Start Your Project 🚀
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transform hover:scale-105 transition-all duration-300">
                Contact Us 💬
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}