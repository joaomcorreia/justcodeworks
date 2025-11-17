"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

const navItems = [
  { label: "Overview", href: "/admin", icon: "📊" },
  { label: "Sites", href: "/admin/sites", icon: "🌐" },
  { label: "Templates", href: "/admin/templates", icon: "🎨" },
  { label: "Sections", href: "/admin/sections", icon: "📄" },
  { label: "Email Templates", href: "/admin/email-templates", icon: "📧" },
  { label: "Users", href: "/admin/users", icon: "👥" },
  { label: "Finance", href: "/admin/finance", icon: "💰" },
  { label: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function Layout({ children, params }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth to load, then check if user is authenticated and is staff
    if (!isLoading) {
      if (!isAuthenticated || !user?.isStaff) {
        console.log('[ADMIN LAYOUT] Redirecting to login - authenticated:', isAuthenticated, 'isStaff:', user?.isStaff);
        router.push(`/${params.locale}/login`);
        return;
      }
      console.log('[ADMIN LAYOUT] User authenticated as staff, allowing access');
    }
  }, [isAuthenticated, isLoading, user?.isStaff, router, params.locale]);

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === `/${params.locale}/admin` || pathname === `/${params.locale}/admin/`;
    }
    return pathname.startsWith(`/${params.locale}${href}`);
  };

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated || !user?.isStaff) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:static lg:inset-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-blue-600">
          <Link href={`/${params.locale}/admin`} className="flex items-center space-x-2">
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${params.locale}${item.href}`}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email
                }
              </p>
              <p className="text-xs text-gray-500">
                {user?.isSuperuser ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: header + content */}
      <div className="flex-1 flex flex-col">
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
                  href={`/${params.locale}/logout`}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
                >
                  <span>Logout</span>
                  <span className="text-lg">🚪</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}