export default function DashboardPrintingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Printing & business cards
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Here you'll choose templates for business cards and other print materials, all synced with your website's design.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">Business Card</span>
          </div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Business Cards</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Professional cards with your branding
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">Letterhead</span>
          </div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Letterhead</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Branded letterhead templates
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">Flyer</span>
          </div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Flyers</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Marketing flyers and brochures
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400">Banner</span>
          </div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Banners</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Large format printing options
          </p>
        </div>
      </div>
    </div>
  );
}