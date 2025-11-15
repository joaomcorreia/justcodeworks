// [ADMIN]
export default async function AdminSettingsPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">System Settings</h1>
        <p className="text-slate-500 text-sm">
          Configure system-wide settings and platform preferences.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">General Settings</h2>
          <p className="text-sm text-slate-500 mb-3">
            Platform name, description, and basic configuration.
          </p>
          <div className="space-y-2 text-sm text-slate-700">
            <div>• Site name and branding</div>
            <div>• Default language and timezone</div>
            <div>• Contact information</div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">Authentication</h2>
          <p className="text-sm text-slate-500 mb-3">
            Login settings, session management, and security.
          </p>
          <div className="space-y-2 text-sm text-slate-700">
            <div>• Session timeout settings</div>
            <div>• Password requirements</div>
            <div>• Two-factor authentication</div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">Email Configuration</h2>
          <p className="text-sm text-slate-500 mb-3">
            SMTP settings and email delivery configuration.
          </p>
          <div className="space-y-2 text-sm text-slate-700">
            <div>• SMTP server configuration</div>
            <div>• Default sender settings</div>
            <div>• Email queue management</div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">API & Integrations</h2>
          <p className="text-sm text-slate-500 mb-3">
            API keys, webhooks, and third-party integrations.
          </p>
          <div className="space-y-2 text-sm text-slate-700">
            <div>• API rate limiting</div>
            <div>• Webhook endpoints</div>
            <div>• External service keys</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h2 className="font-medium mb-2">System Information</h2>
        <div className="grid gap-4 md:grid-cols-4 mt-4">
          <div>
            <div className="text-xs text-slate-500">Version</div>
            <div className="font-medium">v2.1.0</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Environment</div>
            <div className="font-medium">Development</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Database</div>
            <div className="font-medium">SQLite</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Uptime</div>
            <div className="font-medium">2h 34m</div>
          </div>
        </div>
      </div>
    </div>
  );
}