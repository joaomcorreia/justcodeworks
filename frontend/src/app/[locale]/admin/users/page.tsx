// [ADMIN]
export default async function AdminUsersPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-semibold mb-1">User Management</h1>
        <p className="text-slate-500 text-sm">
          Manage user accounts, permissions, and access levels.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">All Users</h2>
          <p className="text-sm text-slate-500 mb-3">
            View and manage all registered users.
          </p>
          <p className="text-sm text-slate-700">User list coming soon...</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">Staff Members</h2>
          <p className="text-sm text-slate-500 mb-3">
            Manage staff accounts and permissions.
          </p>
          <p className="text-sm text-slate-700">Staff management coming soon...</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">User Activity</h2>
          <p className="text-sm text-slate-500 mb-3">
            Monitor user activity and sessions.
          </p>
          <p className="text-sm text-slate-700">Activity logs coming soon...</p>
        </div>
      </div>
    </div>
  );
}