"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n";
import { DashboardShellRightSidebar } from "@/components/jcw/dashboard/DashboardShellRightSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  params: { locale: Locale };
}

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load, then check if user is authenticated
    if (!isLoading) {
      if (!isAuthenticated) {
        if (process.env.NODE_ENV === "development") {
          console.warn('[DASHBOARD LAYOUT] Not authenticated (DEV) – showing children anyway');
          // [AUTH] relaxed dev guard
          return;
        }
        console.log('[DASHBOARD LAYOUT] Redirecting to login - not authenticated');
        router.push(`/${params.locale}/login`);
        return;
      }
      console.log('[DASHBOARD LAYOUT] User authenticated, allowing access');
    }
  }, [isAuthenticated, isLoading, router, params.locale]);

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-slate-700 dark:text-slate-300">Checking authentication...</div>
        </div>
      </div>
    );
  }

  // Show login prompt or redirect (production)
  if (!isAuthenticated) {
    if (process.env.NODE_ENV === "development") {
      // [AUTH] relaxed dev guard - show dev banner and children anyway
      return (
        <div className="min-h-screen">
          <div className="bg-red-900/40 text-red-200 text-xs px-3 py-2 border-b border-red-700/50">
            DEV ONLY: Not authenticated – dashboard guard is relaxed.
          </div>
          {children}
        </div>
      );
    }
    // Production: Show login required message instead of blank page
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0h-2m8-6a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Authentication Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Please log in to access your dashboard.
          </p>
          <button
            onClick={() => router.push(`/${params.locale}/login`)}
            className="inline-flex items-center px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // [LOCALE] locale-aware dashboard layout
  return <DashboardShellRightSidebar user={user}>{children}</DashboardShellRightSidebar>;
}