export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Settings
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Manage your account settings, preferences, and general configurations.
      </p>

      <div className="grid gap-6">
        {/* Profile Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Profile</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Update your personal information and preferences.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Display Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500"
                placeholder="Your display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-500"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* Language & Region */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Language & Region</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Choose your preferred language and regional settings.
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Language
              </label>
              <select className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                <option value="pt">Portuguese (PT)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Timezone
              </label>
              <select className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                <option value="Europe/Lisbon">Europe/Lisbon</option>
                <option value="Europe/London">Europe/London</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notifications</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Configure how you receive notifications.
          </p>
          <div className="mt-4 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                defaultChecked
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                Email notifications for project updates
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                defaultChecked
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                Marketing and promotional emails
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                SMS notifications
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}