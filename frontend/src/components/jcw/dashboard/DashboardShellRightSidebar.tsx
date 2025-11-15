"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getLocaleFromPathname } from "@/lib/locale"; // [LOCALE]
import { useProjectInfo } from "@/hooks/use-project-info";
import type { User } from "@/lib/server-auth";

interface DashboardShellRightSidebarProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardShellRightSidebar({ user, children }: DashboardShellRightSidebarProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname, "en"); // [LOCALE]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { projectInfo } = useProjectInfo();
  
  // Use business name from project info, fallback to default
  const businessName = projectInfo?.name || "Your Business";

  // [LOCALE] locale-aware dashboard navigation
  const baseNavItems = [
    { href: `/${locale}/dashboard`, label: "Overview" },
    { href: `/${locale}/dashboard/website`, label: "Website" },
    { href: `/${locale}/dashboard/templates`, label: "Website Template" }, // [TEMPLAB] dashboard nav to template picker
    { href: `/${locale}/dashboard/printing`, label: "Printing" },
    { href: `/${locale}/dashboard/settings`, label: "Settings" },
    { href: `/${locale}/dashboard/bug-report`, label: "Bug report" },
  ];

  // Add Django Preview for staff users only
  const NAV_ITEMS = user?.isStaff 
    ? [...baseNavItems, { href: `/${locale}/dashboard/django-preview`, label: "Django Preview" }]
    : baseNavItems;

  const initials =
    user?.firstName && user?.lastName
      ? (user.firstName[0] + user.lastName[0]).toUpperCase()
      : (user?.email?.[0] || "?").toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Main content area - takes up remaining space */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-2 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {businessName.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm font-semibold">{businessName}</div>
          </div>

          <div className="hidden text-sm font-semibold md:block">
            Dashboard
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 md:hidden"
            >
              Menu
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {initials}
            </div>
          </div>
        </header>

        {/* Content area with right sidebar */}
        <div className="flex flex-1">
          {/* Main content */}
          <main className="flex-1 bg-slate-50 px-4 py-4 dark:bg-slate-900 md:px-6 md:py-6">
            {children}
          </main>

          {/* Right Sidebar - desktop */}
          <aside className="hidden w-72 flex-col border-l border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:flex">
            <div className="mb-6">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Navigation
              </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 text-sm">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative rounded-lg px-3 py-3 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      active 
                        ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/20 dark:text-blue-300" 
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full transition-colors ${
                        active 
                          ? "bg-blue-600 dark:bg-blue-400" 
                          : "bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400 dark:group-hover:bg-slate-500"
                      }`} />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* User info section */}
            <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Signed in as
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user.email}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {initials}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'User'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-4 space-y-2">
              <Link
                href={`/${locale}`}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 block text-center"
              >
                ← Back to Site
              </Link>
              <button
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
                style={{ color: '#ffffff !important' }}
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    // [AUTH] logout redirect with locale
                    const currentPath = window.location.pathname;
                    const locale = currentPath.split('/')[1] || 'en';
                    window.location.href = `/${locale}/login`;
                  }
                }}
              >
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/50" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 w-80 h-full bg-white p-4 dark:bg-slate-800 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  JCW
                </div>
                <div className="text-sm font-semibold">Navigation</div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            
            <nav className="flex flex-col gap-1 text-sm mb-6">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group relative rounded-lg px-3 py-3 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      active 
                        ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/20 dark:text-blue-300" 
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        active 
                          ? "bg-blue-600 dark:bg-blue-400" 
                          : "bg-slate-300 dark:bg-slate-600"
                      }`} />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile user info */}
            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700/50">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Signed in as
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {user.email}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {initials}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'User'}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile quick actions */}
            <div className="mt-4 space-y-2">
              <Link
                href={`/${locale}`}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 block text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                ← Back to Site
              </Link>
              <button
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500"
                style={{ color: '#ffffff !important' }}
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    // [AUTH] logout redirect with locale
                    const currentPath = window.location.pathname;
                    const locale = currentPath.split('/')[1] || 'en';
                    window.location.href = `/${locale}/login`;
                  }
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}