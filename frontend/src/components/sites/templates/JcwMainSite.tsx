"use client";

import type { SiteProjectPublic } from "@/lib/types/sitePublic";

type Props = {
  project: SiteProjectPublic;
};

export default function JcwMainSite({ project }: Props) {
  const siteName = project.name ?? "Just Code Works";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Simple JCW header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {/* Simple logo placeholder */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400" />
            <span className="font-semibold">{siteName}</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-6xl px-4 py-16 lg:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Websites & marketing that even grandma can launch.
            </h1>
            <p className="text-lg text-slate-300 mb-6">
              Just Code Works helps non-technical users build a website, order print materials,
              and get online fast with guided flows and smart templates.
            </p>
            <div className="flex gap-3">
              <a
                href="#pricing"
                className="inline-flex items-center px-5 py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-sm font-medium transition-colors"
              >
                View plans
              </a>
              <a
                href="#features"
                className="inline-flex items-center px-5 py-3 rounded-md border border-slate-600 text-sm font-medium text-slate-100 hover:bg-slate-800 transition-colors"
              >
                How it works
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed online</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              From website creation to print marketing materials, we've got you covered with tools designed for real people.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Launch</h3>
              <p className="text-slate-300">
                Get your website online in minutes, not weeks. Our smart templates adapt to your business type.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
              <p className="text-slate-300">
                Professional templates that work perfectly on all devices. No design skills required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
              <p className="text-slate-300">
                Built-in SEO, analytics, and marketing tools to help you reach more customers online.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-300">
              Choose the plan that works for your business. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <div className="text-3xl font-bold mb-4">$29<span className="text-lg text-slate-400">/mo</span></div>
              <ul className="space-y-2 text-slate-300 mb-6">
                <li>✓ 1 Website</li>
                <li>✓ Professional Templates</li>
                <li>✓ Basic SEO Tools</li>
                <li>✓ Email Support</li>
              </ul>
              <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                Get Started
              </button>
            </div>
            
            <div className="bg-blue-600/10 border border-blue-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <div className="text-3xl font-bold mb-4">$79<span className="text-lg text-slate-400">/mo</span></div>
              <ul className="space-y-2 text-slate-300 mb-6">
                <li>✓ 5 Websites</li>
                <li>✓ Premium Templates</li>
                <li>✓ Advanced SEO</li>
                <li>✓ Priority Support</li>
                <li>✓ Print Materials</li>
              </ul>
              <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors">
                Get Started
              </button>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-4">$199<span className="text-lg text-slate-400">/mo</span></div>
              <ul className="space-y-2 text-slate-300 mb-6">
                <li>✓ Unlimited Websites</li>
                <li>✓ Custom Development</li>
                <li>✓ White-label Options</li>
                <li>✓ Dedicated Support</li>
                <li>✓ Full Marketing Suite</li>
              </ul>
              <button className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-slate-300">
              Join thousands of businesses who trust Just Code Works for their online presence.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-slate-800 border border-slate-600 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors">
                Get Started
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 {siteName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}