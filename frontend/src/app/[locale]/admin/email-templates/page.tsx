// [ADMIN]
export default async function AdminEmailTemplatesPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Email Templates</h1>
        <p className="text-slate-500 text-sm">
          Create and manage email template designs for various purposes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">Welcome Emails</h2>
          <p className="text-sm text-slate-500 mb-3">
            Templates for new user welcome messages.
          </p>
          <p className="text-sm text-slate-700">3 templates available</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">Newsletters</h2>
          <p className="text-sm text-slate-500 mb-3">
            Newsletter and promotional email designs.
          </p>
          <p className="text-sm text-slate-700">5 templates available</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">Transactional</h2>
          <p className="text-sm text-slate-500 mb-3">
            Order confirmations, receipts, and notifications.
          </p>
          <p className="text-sm text-slate-700">7 templates available</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">Marketing</h2>
          <p className="text-sm text-slate-500 mb-3">
            Promotional campaigns and announcements.
          </p>
          <p className="text-sm text-slate-700">4 templates available</p>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-medium mb-2">System</h2>
          <p className="text-sm text-slate-500 mb-3">
            Password resets, account verification emails.
          </p>
          <p className="text-sm text-slate-700">6 templates available</p>
        </div>

        <div className="rounded-xl border border-dashed border-slate-300 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-slate-400 text-2xl mb-2">+</div>
            <div className="text-sm text-slate-500">Create New Template</div>
          </div>
        </div>
      </div>
    </div>
  );
}