import { getTenantDashboardTemplate } from "@/lib/server-auth";
import { DashboardBlocksRenderer } from "@/components/jcw/dashboard/DashboardBlocksRenderer";

export default async function DashboardOverviewPage() {
  let template = null;

  try {
    template = await getTenantDashboardTemplate();
  } catch (e) {
    // swallow error, we'll show a fallback below
    template = null;
  }

  if (!template) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Website overview
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          We couldn&apos;t load your dashboard configuration. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {template.name || "Website overview"}
        </h1>
        {template.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {template.description}
          </p>
        )}
      </div>

      <DashboardBlocksRenderer template={template} />
    </div>
  );
}