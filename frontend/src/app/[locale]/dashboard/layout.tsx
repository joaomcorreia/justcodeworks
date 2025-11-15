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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show nothing while redirecting (production only)
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
    return null;
  }

  // [LOCALE] locale-aware dashboard layout
  return <DashboardShellRightSidebar user={user}>{children}</DashboardShellRightSidebar>;
}