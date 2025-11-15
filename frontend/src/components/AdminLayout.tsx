'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
  locale: string;
  user: {
    email: string;
    isStaff: boolean;
    isSuperuser: boolean;
    firstName?: string;
    lastName?: string;
  };
}

const adminNavItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: '📊',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: '👥',
  },
  {
    name: 'Templates',
    href: '/admin/templates',
    icon: '🎨',
  },
  {
    name: 'Email Templates',
    href: '/admin/email-templates',
    icon: '📧',
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: '⚙️',
  },
  {
    name: 'Logs',
    href: '/admin/logs',
    icon: '📝',
  },
];

export default function AdminLayout({ children, locale, user }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === `/${locale}/admin` || pathname === `/${locale}/admin/`;
    }
    return pathname.startsWith(`/${locale}${href}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static lg:inset-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-blue-600">
          <Link href={`/${locale}/admin`} className="flex items-center space-x-2">
            <span className="text-2xl">⚡</span>
            <span className="text-lg font-bold text-white">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {adminNavItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={`/${locale}${item.href}`}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info in Sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.firstName?.[0] || user.email[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user.email
                }
              </p>
              <p className="text-xs text-gray-500">
                {user.isSuperuser ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <span className="text-xl">☰</span>
            </button>

            {/* Header Title */}
            <div className="flex-1 min-w-0 lg:ml-0">
              <h1 className="text-lg font-semibold text-gray-900">
                JustCodeWorks Administration
              </h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="text-gray-500 hover:text-gray-700">
                <span className="text-lg">🔔</span>
              </button>
              
              {/* Quick Actions */}
              <button className="text-gray-500 hover:text-gray-700">
                <span className="text-lg">⚙️</span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <Link
                  href={`/${locale}/logout`}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
                >
                  <span>Logout</span>
                  <span className="text-lg">🚪</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>

        {/* Admin Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Admin Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  ⚡ JustCodeWorks Admin
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Administration Panel v1.0
                </p>
                <p className="text-xs text-gray-500">
                  Logged in as: {user.email}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Quick Actions
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link href={`/${locale}/admin/users`} className="text-sm text-gray-600 hover:text-blue-600">
                      Manage Users
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}/admin/templates`} className="text-sm text-gray-600 hover:text-blue-600">
                      Template Editor
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}/admin/settings`} className="text-sm text-gray-600 hover:text-blue-600">
                      System Settings
                    </Link>
                  </li>
                </ul>
              </div>

              {/* System Status */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  System Status
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-gray-600">All Systems Operational</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-gray-600">Server: Online</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                © {new Date().getFullYear()} JustCodeWorks Administration Panel. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}