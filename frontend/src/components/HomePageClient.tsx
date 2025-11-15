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
                <h3 className="text-lg font-semibold mb-4">📄 Homepage Admin Panel</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Template:</strong> jcw-main</p>
                  <p><strong>Sections:</strong> Hero, Features, Print, POS, AI Tools, CTA, Testimonials, FAQ</p>
                  <p><strong>Status:</strong> <span className="text-blue-600 font-medium">✅ Published</span></p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border">
                <h3 className="text-lg font-semibold mb-4">🌍 Language Testing</h3>
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Websites Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Websites that work as hard as you do
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional websites built for your industry. Choose from our collection of proven templates designed to convert visitors into customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">For shops</h3>
              <p className="text-gray-600 text-sm mb-4">Perfect for retail, boutiques, and local stores</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                See templates
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">For cafés</h3>
              <p className="text-gray-600 text-sm mb-4">Restaurants, cafés, and food businesses</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                See templates
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">For business</h3>
              <p className="text-gray-600 text-sm mb-4">Professional services and B2B companies</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                See templates
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">For creators</h3>
              <p className="text-gray-600 text-sm mb-4">Artists, photographers, and creative professionals</p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                See templates
              </button>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Start building for free
            </button>
          </div>
        </div>
      </section>

      {/* Print Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your brand, beautifully printed
            </h2>
            <p className="text-lg text-gray-600">
              From business cards to banners - we handle the printing so you can focus on your business
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📇</div>
                    <div className="text-sm font-medium">Business Cards</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <div className="text-sm font-medium">Flyers</div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">👕</div>
                    <div className="text-sm font-medium">T-Shirts</div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">☕</div>
                    <div className="text-sm font-medium">Mugs</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Fast delivery across EU</div>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>🇩🇪 Germany</span>
                    <span>🇫🇷 France</span>
                    <span>🇪🇸 Spain</span>
                    <span>🇮🇹 Italy</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Professional quality, delivered fast</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Premium materials and finishes</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Fast 2-5 day delivery across Europe</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Easy online ordering and approval</li>
                </ul>
              </div>
              
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Start designing
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
              Modern POS systems that grow with you
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
                    <h3 className="font-semibold">Accept all payments</h3>
                    <p className="text-sm text-gray-600">Cards, contactless, mobile payments</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Track everything</h3>
                    <p className="text-sm text-gray-600">Sales, inventory, customer data</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-lg">🔄</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Sync with your website</h3>
                    <p className="text-sm text-gray-600">Orders, inventory, customer data</p>
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
                  <div className="text-sm text-gray-400 mb-2">Point of Sale Terminal</div>
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
                    Complete Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MagicAI Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              MagicAI Tools
            </h2>
            <p className="text-lg text-gray-600">
              AI-powered tools to help you create, write, and design faster than ever
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="font-semibold mb-2">AI Writer</h3>
              <p className="text-sm text-gray-600 mb-4">Create content for your website in seconds</p>
              <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">500+ templates</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Design Studio</h3>
              <p className="text-sm text-gray-600 mb-4">Generate logos, banners, and graphics</p>
              <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">AI powered</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="font-semibold mb-2">Photo Editor</h3>
              <p className="text-sm text-gray-600 mb-4">Enhance and edit photos automatically</p>
              <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">One-click</div>
            </div>

            <div className="bg-white rounded-lg p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold mb-2">Chat Assistant</h3>
              <p className="text-sm text-gray-600 mb-4">24/7 customer support on your website</p>
              <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">Smart replies</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start your online journey today — your AI assistant will handle the hard work
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of businesses that trust our platform to grow their online presence
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Start for free
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Watch demo
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
              <blockquote className="text-lg text-gray-700 mb-6">
                "JustCodeWorks helped us launch our online store in just two days. The templates are beautiful and the AI tools saved us hours of work. Highly recommended!"
              </blockquote>
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-600">Founder, Local Boutique</div>
              
              <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-gray-500">
                <div>⭐ 4.9/5</div>
                <div>📈 2,000+ reviews</div>
                <div>🚀 50,000+ sites built</div>
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
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">How quickly can I get online?</h3>
              <p className="text-gray-600">With our AI-powered tools and pre-built templates, you can have a professional website live in as little as 2 minutes. More complex customizations may take a few hours.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">Do I need technical skills?</h3>
              <p className="text-gray-600">Not at all! Our platform is designed for everyone. The AI assistant guides you through each step, and our drag-and-drop editor makes customization simple.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">What's included in the free plan?</h3>
              <p className="text-gray-600">The free plan includes website building tools, basic templates, and limited AI credits. You can upgrade anytime to unlock premium features and remove branding.</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold mb-2">Can I use my own domain?</h3>
              <p className="text-gray-600">Yes! You can connect your existing domain or purchase a new one directly through our platform. Custom domains are available on paid plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Insights Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest insights
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-blue-100"></div>
              <div className="p-6">
                <div className="text-sm text-blue-600 mb-2">BUSINESS TIPS</div>
                <h3 className="font-semibold mb-2">How to create a profitable online store in 2024</h3>
                <p className="text-gray-600 text-sm mb-4">Essential strategies for e-commerce success, from product selection to marketing automation.</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">Read more →</button>
              </div>
            </article>

            <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-green-100"></div>
              <div className="p-6">
                <div className="text-sm text-green-600 mb-2">DESIGN</div>
                <h3 className="font-semibold mb-2">Website design trends that convert visitors to customers</h3>
                <p className="text-gray-600 text-sm mb-4">Latest design principles that increase conversion rates and improve user experience.</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">Read more →</button>
              </div>
            </article>

            <article className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-purple-100"></div>
              <div className="p-6">
                <div className="text-sm text-purple-600 mb-2">AI TOOLS</div>
                <h3 className="font-semibold mb-2">5 ways AI can boost your small business productivity</h3>
                <p className="text-gray-600 text-sm mb-4">Practical applications of artificial intelligence for small business owners and entrepreneurs.</p>
                <button className="text-blue-600 text-sm font-medium hover:underline">Read more →</button>
              </div>
            </article>
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              View all insights
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer dict={dict} />
    </div>
  );
}