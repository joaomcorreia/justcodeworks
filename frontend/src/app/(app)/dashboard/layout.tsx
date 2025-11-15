import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/server-auth";
import { DashboardShellRightSidebar } from "@/components/jcw/dashboard/DashboardShellRightSidebar";

export default async function DashboardLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  const user = await getCurrentUser();

  if (!user) {
    // [AUTH] Redirect to login with default locale
    redirect("/en/login");
  }

  return <DashboardShellRightSidebar user={user}>{children}</DashboardShellRightSidebar>;
}