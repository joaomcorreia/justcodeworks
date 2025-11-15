"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale } from "@/i18n";
import { ReactNode } from "react";

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  category?: string;
}

interface UtilitiesSidebarLayoutProps {
  locale: Locale;
  children: ReactNode;
  title: string;
  description?: string;
  currentPageId: string;
}

const utilitiesNavigation: SidebarItem[] = [
  {
    id: "password-tools",
    label: "Password Tools",
    href: "/utilities/password-tools",
    icon: "🔐",
    category: "Security"
  },
  {
    id: "password-generator",
    label: "Password Generator",
    href: "/utilities/password-generator",
    icon: "🎲",
    category: "Security"
  },
  {
    id: "password-checker",
    label: "Password Checker", 
    href: "/utilities/password-checker",
    icon: "🛡️",
    category: "Security"
  },
  {
    id: "json-reader",
    label: "JSON Reader",
    href: "/utilities/json-reader",
    icon: "📄",
    category: "Development"
  },
  {
    id: "qr-code-generator",
    label: "QR Code Generator",
    href: "/utilities/qr-code-generator",
    icon: "📱",
    category: "Tools"
  },
  {
    id: "image-resizer",
    label: "Image Resizer",
    href: "/utilities/image-resizer",
    icon: "🖼️",
    category: "Media"
  },
  {
    id: "image-cropper",
    label: "Image Cropper",
    href: "/utilities/image-cropper",
    icon: "✂️",
    category: "Media"
  },
  {
    id: "my-site-status",
    label: "Site Status Checker",
    href: "/utilities/my-site-status",
    icon: "🌐",
    category: "Monitoring"
  }
];

const servicesNavigation: SidebarItem[] = [
  {
    id: "services-overview",
    label: "All Services",
    href: "/services",
    icon: "🏢",
    category: "Overview"
  },
  {
    id: "seo",
    label: "SEO Services",
    href: "/services/search-engine-optimization",
    icon: "📈",
    category: "Marketing"
  },
  {
    id: "social-media",
    label: "Social Media",
    href: "/services/social-media",
    icon: "📱",
    category: "Marketing"
  },
  {
    id: "website-upgrades",
    label: "Website Upgrades",
    href: "/services/website-upgrades", 
    icon: "⚡",
    category: "Development"
  }
];

export function UtilitiesSidebarLayout({ locale, children, title, description, currentPageId }: UtilitiesSidebarLayoutProps) {
  const pathname = usePathname();
  const isUtilities = pathname.includes('/utilities');
  const navigation = isUtilities ? utilitiesNavigation : servicesNavigation;
  
  // Group navigation items by category
  const groupedNavigation = navigation.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  const isActive = (href: string) => {
    if (href === `/${isUtilities ? 'utilities' : 'services'}`) {
      return pathname === `/${locale}${href}`;
    }
    return pathname.includes(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="flex">
        {/* Fixed Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-80 border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-xl pt-20">
          <div className="flex h-full flex-col overflow-y-auto px-6 py-8">
            {/* Sidebar Header */}
            <div className="mb-8">
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isUtilities ? '🛠️ Utilities & Tools' : '🏢 Services'}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {isUtilities ? 'Free online tools and utilities' : 'Professional web services'}
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-6">
              {Object.entries(groupedNavigation).map(([category, items]) => (
                <div key={category}>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {category}
                  </h3>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={`/${locale}${item.href}`}
                          className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            isActive(item.href)
                              ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                          }`}
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                          {isActive(item.href) && (
                            <span className="ml-auto text-blue-500">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  💡 Need Help?
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Visit our help center for guides and tutorials.
                </p>
                <Link
                  href={`/${locale}/help-center`}
                  className="mt-2 inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Help Center →
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pl-80">
          <div className="px-8 py-8">
            {/* Page Header */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
              {description && (
                <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
                  {description}
                </p>
              )}
            </div>

            {/* Page Content */}
            <div className="max-w-5xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}