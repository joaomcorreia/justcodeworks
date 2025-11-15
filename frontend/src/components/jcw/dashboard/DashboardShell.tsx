"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context"; // [AUTH]
import { getLocaleFromPathname } from "@/lib/locale"; // [LOCALE]
import { useProjectInfo } from "@/hooks/use-project-info";
import type { User } from "@/lib/server-auth";

interface DashboardShellProps {
  user: User;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname, "en"); // [LOCALE]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth(); // [AUTH]
  const { projectInfo } = useProjectInfo();
  
  // Use business name from project info, fallback to default
  const businessName = projectInfo?.name || "Your Business";

  // [LOCALE] locale-aware dashboard navigation
  const NAV_ITEMS = [
    { href: `/${locale}/dashboard`, label: "Overview" },
    { href: `/${locale}/dashboard/website`, label: "Website" },
    { href: `/${locale}/dashboard/printing`, label: "Printing" },
    { href: `/${locale}/dashboard/settings`, label: "Settings" },
    { href: `/${locale}/dashboard/bug-report`, label: "Bug report" },
  ];

  const initials =
    user?.firstName && user?.lastName
      ? (user.firstName[0] + user.lastName[0]).toUpperCase()
      : (user?.email?.[0] || "?").toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Sidebar - desktop */}
      <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800 md:flex">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {businessName.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm font-semibold">{businessName}</div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                  active 
                    ? "bg-slate-100 text-slate-900 font-medium dark:bg-slate-700 dark:text-slate-100" 
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <div>Logged in as</div>
          <div className="font-medium truncate mb-3">{user.email}</div>
          {/* [AUTH] logout button */}
          <button
            onClick={logout}
            className="w-full text-left text-xs px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
            style={{ color: '#dc2626 !important' }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-2 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Menu
            </button>
            <span className="text-sm font-semibold">{businessName}</span>
          </div>

          <div className="hidden text-sm font-semibold md:block">
            Dashboard
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-slate-50 px-4 py-4 dark:bg-slate-900 md:px-6 md:py-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-slate-900/50" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 h-full bg-white p-4 dark:bg-slate-800">
            <div className="mb-4 flex items-center justify-between">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {businessName.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm font-semibold">{businessName}</div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            
            <nav className="flex flex-col gap-1 text-sm">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 ${
                      active 
                        ? "bg-slate-100 text-slate-900 font-medium dark:bg-slate-700 dark:text-slate-100" 
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <div>Logged in as</div>
              <div className="font-medium truncate mb-3">{user.email}</div>
              {/* [AUTH] logout button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
                style={{ color: '#dc2626 !important' }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}