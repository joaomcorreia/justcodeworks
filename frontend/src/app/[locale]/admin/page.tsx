import { getCurrentUser } from "@/lib/server-auth";
import Link from "next/link";

export default async function AdminOverviewPage({
  params,
}: {
  params: { locale: string };
}) {
  const user = await getCurrentUser();
  const { locale } = params;

  return (
    <div className="space-y-3">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to the JustCodeWorks administration panel. Here you can manage all aspects of your system.
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-xl">🎨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Website Templates</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-xl">📧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Email Templates</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projects</p>
              <p className="text-2xl font-semibold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* [ADMIN] Navigation Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Sections</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href={`/${locale}/admin/users`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">👥</span>
              <span className="font-medium">Users</span>
            </div>
            <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
          </Link>

          <Link
            href={`/${locale}/admin/templates`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">🎨</span>
              <span className="font-medium">Templates</span>
            </div>
            <p className="text-sm text-gray-600">Website and email template library</p>
          </Link>

          <Link
            href={`/${locale}/admin/email-templates`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">📧</span>
              <span className="font-medium">Email Templates</span>
            </div>
            <p className="text-sm text-gray-600">Email designs and layouts</p>
          </Link>

          <Link
            href={`/${locale}/admin/settings`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">⚙️</span>
              <span className="font-medium">Settings</span>
            </div>
            <p className="text-sm text-gray-600">System configuration and preferences</p>
          </Link>
        </div>
      </div>

      {/* [ADMIN] Django Admin Link */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Administration</h3>
        <p className="text-gray-600 mb-4">
          For low-level data management and advanced configuration, access the Django admin interface.
        </p>
        <a
          href="http://127.0.0.1:8000/admin/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span className="mr-2">🔧</span>
          Open Django Admin
          <span className="ml-2">↗</span>
        </a>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    New website template created: "Modern Portfolio"
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    Email template updated: "Welcome Email"
                  </p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    User dashboard template modified
                  </p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    New user registered: john@example.com
                  </p>
                  <p className="text-xs text-gray-500">8 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Server</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cache System</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Background Jobs</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  2 Pending
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Info (only show for superusers) */}
      {user?.isSuperuser && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Administrator Information</h4>
          <div className="text-sm text-blue-800">
            <p>Logged in as: {user.email}</p>
            <p>Permission Level: {user.isSuperuser ? "Super Administrator" : "Administrator"}</p>
            <p>Access Level: Full System Access</p>
          </div>
        </div>
      )}
    </div>
  );
}