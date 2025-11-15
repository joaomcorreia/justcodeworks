"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/lib/server-auth";

interface AdminShellProps {
  children: React.ReactNode;
  user: User;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/admin", icon: "📊" },
  { label: "Website Templates", href: "/admin/templates/website", icon: "🎨" },
  { label: "Email Templates", href: "/admin/templates/email", icon: "📧" },
];

export function AdminShell({ children, user }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActivePath = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    // [AUTH] Clear auth cookie and redirect to admin login
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "jcw_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "jcw_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    if (typeof window !== "undefined") {
      localStorage.removeItem("jcw_access_token");
      localStorage.removeItem("jcw_user");
      localStorage.removeItem("jcw_refresh_token");
    }
    // Admin logout should go to admin login (no locale needed for admin)
    window.location.href = "/admin/login";
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
            <h1 className="text-xl font-semibold">JCW Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-blue-700"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActivePath(item.href)
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.isSuperuser ? "Super Admin" : user.isStaff ? "Admin" : "User"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Right column */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Header */}
        <header className="border-b bg-white px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                ☰
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {navItems.find((item) => isActivePath(item.href))?.label || "Admin"}
              </h2>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName || user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 bg-slate-50 px-4 py-4 md:px-6 md:py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white px-4 py-3 md:px-6 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <p>&copy; 2024 JustCodeWorks. All rights reserved.</p>
            <p>
              Admin Dashboard v1.0 | User: {user.email}
            </p>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}