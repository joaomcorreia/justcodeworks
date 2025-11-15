import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server-auth";
import { AdminShell } from "@/components/jcw/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const user = await getCurrentUser();
  
  if (!user) {
    // [AUTH] Redirect to login if not authenticated
    redirect("/en/login");
  }

  // Check if user has admin permissions
  if (!user.isStaff && !user.isSuperuser) {
    // [AUTH] Redirect to main dashboard if user doesn't have admin permissions
    redirect("/en/dashboard");
  }

  return (
    <AdminShell user={user}>
      {children}
    </AdminShell>
  );
}