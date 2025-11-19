'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import LanguageSelector from '@/components/LanguageSelector';
import Footer from '@/components/Footer';
import { useProjectInfo } from '@/hooks/use-project-info';
import { getLocalizedSlug, type Locale } from '@/i18n/slugs';
import { useAuth } from '@/contexts/auth-context'; // [AUTH]

export default function HomePageClient({ dict }: { dict: any }) {
  const params = useParams();
  const locale = params.locale as string;
  const { projectInfo, loading } = useProjectInfo();
  const { isAuthenticated } = useAuth(); // [AUTH]
  
  return (
    <div className="min-h-screen">
      {/* Skip the header with slider - that will be handled separately */}
      
      {/* [AUTH] Edit mode info - only show when authenticated */}
      {isAuthenticated && (
        <div className="bg-gray-50 dark:bg-gray-900 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold mb-4">{dict.pages.home.systemOverview.title}</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>{dict.pages.home.systemOverview.template}:</strong> {dict.pages.home.systemOverview.templateName}</p>
                  <p><strong>{dict.pages.home.systemOverview.sections}:</strong> {dict.pages.home.systemOverview.sectionsList}</p>
                  <p><strong>{dict.pages.home.systemOverview.status}:</strong> <span className="text-blue-600 font-medium">{dict.pages.home.systemOverview.statusActive}</span></p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">{dict.pages.home.systemOverview.description}</p>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold mb-4">{dict.pages.home.multiLanguageSupport.title}</h3>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600 dark:text-gray-300">{dict.pages.home.multiLanguageSupport.description}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{dict.pages.home.multiLanguageSupport.languages}</p>
                  <p className="text-gray-600 dark:text-gray-300">{dict.pages.home.multiLanguageSupport.testInstructions}</p>
                  <div className="mt-4">
                    <LanguageSelector isMainSite={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">🚀</span>
              {dict.websites.badge}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {dict.websites.title}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {dict.websites.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                {dict.nav.start}
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                {dict.hero.ctaSecondary}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Websites Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {dict.sections.solutionsTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From simple landing pages to complex e-commerce platforms, we have the right solution for your business needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🏪</span>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                    POPULAR
                  </span>
                  <h3 className="text-xl font-bold mb-3">{dict.websites.onePage.badge}</h3>
                </div>
                <p className="text-gray-600 mb-6 line-height-relaxed">{dict.websites.onePage.desc}</p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Fast setup</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Mobile optimized</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> SEO ready</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg">
                  {dict.websites.onePage.link}
                </button>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-2">
                    PROFESSIONAL
                  </span>
                  <h3 className="text-xl font-bold mb-3">{dict.websites.multiPage.badge}</h3>
                </div>
                <p className="text-gray-600 mb-6 line-height-relaxed">{dict.websites.multiPage.desc}</p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Multiple pages</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Advanced features</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Custom design</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-800 transition-all duration-300 shadow-md hover:shadow-lg">
                  {dict.websites.multiPage.link}
                </button>
              </div>
            </div>

            <div className="group relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">💼</span>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mb-2">
                    ADVANCED
                  </span>
                  <h3 className="text-xl font-bold mb-3">{dict.websites.ecommerce.badge}</h3>
                </div>
                <p className="text-gray-600 mb-6 line-height-relaxed">{dict.websites.ecommerce.desc}</p>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Payment processing</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Inventory management</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Analytics dashboard</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-800 transition-all duration-300 shadow-md hover:shadow-lg">
                  {dict.websites.ecommerce.link}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              {dict.nav.start}
            </button>
          </div>
        </div>
      </section>

      {/* Print Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23e5e7eb%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20d%3D%22M20%200v20L0%200z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">🎨</span>
              Professional Printing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {dict.sections.printingTitle}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              High-quality printing solutions that make your brand stand out. From business cards to large format prints.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📇</div>
                    <div className="text-sm font-medium">{dict.sections.printingCards[0].label}</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <div className="text-sm font-medium">{dict.previewPrintText}</div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">👕</div>
                    <div className="text-sm font-medium">{dict.sections.printingCards[2].label}</div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">☕</div>
                    <div className="text-sm font-medium">{dict.nav.printing}</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">{dict.footer.services.websites} & {dict.nav.printing}</div>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>🇩🇪 Duitsland</span>
                    <span>🇫🇷 Frankrijk</span>
                    <span>🇪🇸 Spanje</span>
                    <span>🇮🇹 Italië</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{dict.sections.printingCards[0].title}</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {dict.footer.services.websites} kwaliteit</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {dict.sections.printingCards[1].highlight}</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {dict.footer.services.consulting}</li>
                </ul>
              </div>
              
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                {dict.nav.start}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* POS Systems Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {dict.sections.posTitle}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{dict.sections.posCards[0].title}</h3>
                    <p className="text-sm text-gray-600">{dict.sections.posCards[0].description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{dict.sections.posCards[1].title}</h3>
                    <p className="text-sm text-gray-600">{dict.sections.posCards[1].description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{dict.sections.posCards[2].title}</h3>
                    <p className="text-sm text-gray-600">{dict.sections.posCards[2].description}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-900 text-white rounded-lg p-8 relative">
                <div className="absolute top-4 right-4">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="text-sm text-gray-400 mb-2">{dict.sections.posCards[0].label}</div>
                  <div className="text-2xl font-bold mb-6">€127.50</div>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span>Cappuccino</span>
                      <span>€3.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Croissant</span>
                      <span>€2.20</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-600 pt-2">
                      <span>Total</span>
                      <span>€5.70</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6">
                    {dict.sections.posCards[0].highlight}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MagicAI Tools Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-purple-50 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%239333ea%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M10%200L20%2010L10%2020L0%2010z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">✨</span>
              AI-Powered Tools
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {dict.sections.aiTitle}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Harness the power of artificial intelligence to create stunning content, generate ideas, and automate your workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl p-8 text-center border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">✍️</span>
                </div>
                <h3 className="text-lg font-bold mb-3">{dict.sections.aiCards[0].title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-height-relaxed">{dict.sections.aiCards[0].description}</p>
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">{dict.sections.aiCards[0].highlight}</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 text-center border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-lg font-bold mb-3">{dict.sections.aiCards[1].title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-height-relaxed">{dict.sections.aiCards[1].description}</p>
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">{dict.sections.aiCards[1].highlight}</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 text-center border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">📸</span>
                </div>
                <h3 className="text-lg font-bold mb-3">{dict.sections.aiCards[2].title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-height-relaxed">{dict.sections.aiCards[2].description}</p>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">{dict.sections.aiCards[2].highlight}</div>
              </div>
            </div>

            <div className="group bg-white rounded-2xl p-8 text-center border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-lg font-bold mb-3">{dict.footer.support.help}</h3>
                <p className="text-sm text-gray-600 mb-4 line-height-relaxed">{dict.footer.support.contact}</p>
                <div className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">{dict.footer.support.community}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M30%2030c0-11.046-8.954-20-20-20s-20%208.954-20%2020%208.954%2020%2020%2020%2020-8.954%2020-20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center text-white">
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
              <span className="mr-2">🚀</span>
              Ready to get started?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {dict.hero.assistantTitle}
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
              {dict.hero.subtitle}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-2xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-1">
              <span className="flex items-center">
                {dict.nav.start}
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button className="group border-2 border-white/50 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white hover:text-purple-600 transition-all duration-300 backdrop-blur-sm">
              {dict.hero.ctaSecondary}
            </button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-white/80">Websites Built</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">4.9★</div>
              <div className="text-white/80">Customer Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-6">
              <span className="mr-2">⭐</span>
              Customer Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                {dict.footer.company.testimonials}
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about their experience with Just Code Works.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-12 text-center border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%234f46e5%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%2220%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                    ))}
                  </div>
                </div>
                <blockquote className="text-xl md:text-2xl text-gray-800 mb-8 font-medium leading-relaxed">
                  "{dict.hero.assistantText}"
                </blockquote>
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">{dict.footer.company.team?.charAt(0) || 'JC'}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{dict.footer.company.team}</div>
                    <div className="text-sm text-gray-600">{dict.footer.company.about}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
                    <div className="text-2xl font-bold text-blue-600 mb-1">4.9⭐</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
                    <div className="text-2xl font-bold text-green-600 mb-1">2,000+</div>
                    <div className="text-sm text-gray-600">Happy Customers</div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
                    <div className="text-2xl font-bold text-purple-600 mb-1">50K+</div>
                    <div className="text-sm text-gray-600">Sites Created</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {dict.footer.support.faq}
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">{dict.hero.ctaPrimary}</h3>
              <p className="text-gray-600">{dict.hero.note}</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">{dict.sections.aiTitle}</h3>
              <p className="text-gray-600">{dict.sections.aiText}</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">{dict.pricing.title}</h3>
              <p className="text-gray-600">{dict.pricing.subtitle}</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">{dict.websitePromise.exploreTitle}</h3>
              <p className="text-gray-600">{dict.websitePromise.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Insights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {dict.footer.company.news}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-blue-100"></div>
              <div className="p-6">
                <div className="text-sm text-blue-600 mb-2">{dict.websites.badge}</div>
                <h3 className="font-semibold mb-2">{dict.websites.ecommerce.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{dict.websites.ecommerce.desc}</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">{dict.websites.ecommerce.link}</button>
              </div>
            </article>

            <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-green-100"></div>
              <div className="p-6">
                <div className="text-sm text-green-600 mb-2">{dict.footer.services.websites}</div>
                <h3 className="font-semibold mb-2">{dict.websites.multiPage.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{dict.websites.multiPage.desc}</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">{dict.websites.multiPage.link}</button>
              </div>
            </article>

            <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-purple-100"></div>
              <div className="p-6">
                <div className="text-sm text-purple-600 mb-2">{dict.nav.aiTools}</div>
                <h3 className="font-semibold mb-2">{dict.sections.aiCards[0].title}</h3>
                <p className="text-gray-600 text-sm mb-4">{dict.sections.aiCards[0].description}</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">{dict.sections.aiCards[0].highlight}</button>
              </div>
            </article>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {dict.footer.company.news}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer dict={dict} />
    </div>
  );
}