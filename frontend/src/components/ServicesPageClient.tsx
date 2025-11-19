'use client';

import React, { useState, useEffect } from 'react';

interface ServicesPageClientProps {
  dict: any;
}

export default function ServicesPageClient({ dict }: ServicesPageClientProps) {
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveService(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      id: 'website-development',
      title: 'Website Development',
      subtitle: 'From Concept to Launch',
      description: 'Custom websites built with cutting-edge technology',
      icon: '🚀',
      gradient: 'from-blue-600 to-cyan-500',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile First'],
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
      price: 'From €2,500',
      deliveryTime: '2-4 weeks',
      popular: true,
      stats: { projects: '150+', satisfaction: '99%' }
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      subtitle: 'Grow Your Online Presence',
      description: 'Comprehensive marketing strategies that drive results',
      icon: '📈',
      gradient: 'from-purple-600 to-pink-500',
      features: ['SEO Strategy', 'Social Media', 'PPC Campaigns', 'Analytics'],
      technologies: ['Google Ads', 'Facebook', 'Instagram', 'Analytics'],
      price: 'From €800/month',
      deliveryTime: 'Ongoing',
      popular: false,
      stats: { clients: '85+', growth: '340%' }
    },
    {
      id: 'business-consulting',
      title: 'Business Consulting',
      subtitle: 'Strategic Growth Solutions',
      description: 'Expert guidance to transform your business operations',
      icon: '🎯',
      gradient: 'from-emerald-600 to-teal-500',
      features: ['Process Optimization', 'Digital Transformation', 'Team Training', 'Growth Strategy'],
      technologies: ['CRM', 'Analytics', 'Automation', 'Integration'],
      price: 'From €150/hour',
      deliveryTime: '1-12 weeks',
      popular: false,
      stats: { businesses: '120+', efficiency: '85%' }
    },
    {
      id: 'maintenance-support',
      title: 'Maintenance & Support',
      subtitle: 'Keep Everything Running',
      description: 'Reliable ongoing support for your digital assets',
      icon: '🛡️',
      gradient: 'from-orange-600 to-red-500',
      features: ['24/7 Monitoring', 'Security Updates', 'Performance Optimization', 'Backup Management'],
      technologies: ['CloudFlare', 'AWS', 'Security', 'Monitoring'],
      price: 'From €299/month',
      deliveryTime: '24/7',
      popular: false,
      stats: { uptime: '99.9%', response: '< 1hr' }
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      role: 'CEO',
      content: 'Exceptional service that transformed our online presence. The team delivered beyond expectations.',
      rating: 5,
      avatar: 'bg-gradient-to-br from-blue-400 to-purple-500',
      service: 'Website Development'
    },
    {
      name: 'Miguel Santos',
      company: 'Local Bistro',
      role: 'Owner',
      content: 'Our digital marketing results increased by 300%. Professional and results-driven approach.',
      rating: 5,
      avatar: 'bg-gradient-to-br from-green-400 to-teal-500',
      service: 'Digital Marketing'
    },
    {
      name: 'Emma Clarke',
      company: 'Design Studio',
      role: 'Creative Director',
      content: 'The consulting sessions helped streamline our processes and boost team productivity significantly.',
      rating: 5,
      avatar: 'bg-gradient-to-br from-pink-400 to-rose-500',
      service: 'Business Consulting'
    }
  ];

  const processSteps = [
    { step: '01', title: 'Discovery', desc: 'We analyze your needs and objectives', icon: '🔍', color: 'from-blue-500 to-cyan-400' },
    { step: '02', title: 'Strategy', desc: 'Custom solution planning and design', icon: '📋', color: 'from-purple-500 to-pink-400' },
    { step: '03', title: 'Development', desc: 'Building with attention to detail', icon: '⚙️', color: 'from-green-500 to-emerald-400' },
    { step: '04', title: 'Launch', desc: 'Delivery and ongoing support', icon: '🎉', color: 'from-orange-500 to-red-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-sm border border-blue-200/50 text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              Professional Digital Services
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight animate-gradient-x">
              Expert Solutions
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Comprehensive digital services to <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">accelerate your success</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                Start Your Project ✨
              </button>
              <button className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-white font-bold rounded-2xl shadow-xl hover:bg-white/90 dark:hover:bg-slate-700/90 transform hover:scale-105 transition-all duration-300 border border-slate-200 dark:border-slate-600">
                View Portfolio 📊
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '500+', label: 'Projects Delivered', icon: '🚀' },
                { number: '98%', label: 'Client Satisfaction', icon: '⭐' },
                { number: '24/7', label: 'Support Available', icon: '🛡️' },
                { number: '5+', label: 'Years Experience', icon: '🏆' }
              ].map((stat, index) => (
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
        </div>

        {/* Services Showcase */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive solutions designed to elevate your digital presence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`group relative overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-700 hover:scale-[1.02] cursor-pointer ${
                  activeService === index ? 'ring-4 ring-blue-400/50 shadow-blue-500/30' : ''
                }`}
                onMouseEnter={() => setActiveService(index)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-90`}></div>
                
                {/* Content */}
                <div className="relative z-10 p-8 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <div className="text-right">
                      {service.popular && (
                        <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-2 block animate-pulse">
                          🔥 POPULAR
                        </span>
                      )}
                      <div className="text-sm opacity-75">{service.deliveryTime}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black mb-2">{service.title}</h3>
                  <p className="text-xl font-semibold opacity-90 mb-4">{service.subtitle}</p>
                  <p className="opacity-80 mb-6 leading-relaxed">{service.description}</p>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="mr-2 text-yellow-300">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm">
                      {Object.entries(service.stats).map(([key, value]) => (
                        <div key={key} className="opacity-90">
                          <span className="font-bold">{value}</span> {key}
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black">{service.price}</div>
                      <div className="text-sm opacity-75">Starting price</div>
                    </div>
                  </div>
                  
                  <button className="w-full py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 border border-white/30">
                    Get Started →
                  </button>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>

          {/* Process Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-slate-800 dark:text-white">
              Our Process
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`relative p-8 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <div className="text-sm font-bold opacity-75 mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="opacity-90 text-sm leading-relaxed">{step.desc}</p>
                  
                  {/* Connection Line */}
                  {index < processSteps.length - 1 && (
                    <div className={`hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-3xl transition-all duration-300 ${
                      hoveredFeature === index ? 'text-white scale-110' : 'text-slate-400'
                    }`}>
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-slate-800 dark:text-white">
              Client Success Stories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 ${testimonial.avatar} rounded-full flex items-center justify-center text-white font-bold mr-4`}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-300">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-slate-700 dark:text-slate-300 mb-4 italic">"{testimonial.content}"</p>
                  
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Service: {testimonial.service}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-800 dark:via-blue-800 dark:to-purple-800 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join hundreds of successful businesses who trust us with their digital growth
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300">
                  Start Your Project 🚀
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-2xl hover:bg-white/10 transform hover:scale-105 transition-all duration-300">
                  Schedule Consultation 📞
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
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