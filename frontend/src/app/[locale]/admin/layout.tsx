"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function Layout({ children, params }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

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

  return <AdminLayout locale={params.locale} user={user as any}>{children}</AdminLayout>;
}