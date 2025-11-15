import { getMyPages } from "@/lib/server-auth";
import type { DashboardPage } from "@/lib/api-types";
import Link from "next/link";

export default async function WebsiteBuilderDashboardPage() {
  let pages: DashboardPage[] = [];

  try {
    pages = await getMyPages();
  } catch (e) {
    pages = [];
  }

  const totalPages = pages.length;
  const publishedPages = pages.filter((p) => p.is_published).length;
  const locales = Array.from(new Set(pages.map((p) => p.locale))).sort();
  const totalLocales = locales.length;

  // Simple heuristic: "total usage" = number of pages for now
  const totalUsage = totalPages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-slate-900">
          Website Builder
        </h1>
        <p className="text-sm text-slate-500">
          Manage the pages of your website, choose what&apos;s published, and
          quickly jump into editing.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total pages" value={totalPages} />
        <StatCard title="Published pages" value={publishedPages} />
        <StatCard title="Locales" value={totalLocales} />
        <StatCard title="Total usage" value={totalUsage} />
      </div>

      {/* Filters / actions bar */}
      <FilterBar locales={locales} />

      {/* Pages grid */}
      <PagesGrid pages={pages} />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white px-4 py-3">
      <div className="text-xs font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function FilterBar({ locales }: { locales: string[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-white px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search pages..."
          className="h-9 w-full rounded-lg border bg-slate-50 px-3 text-xs outline-none ring-0 focus:border-slate-300 md:max-w-xs"
        />
        <select className="h-9 rounded-lg border bg-white px-2 text-xs text-slate-600">
          <option>All locales</option>
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {locale.toUpperCase()}
            </option>
          ))}
        </select>
        <select className="h-9 rounded-lg border bg-white px-2 text-xs text-slate-600">
          <option>All status</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50">
          New page
        </button>
      </div>
    </div>
  );
}

function PagesGrid({ pages }: { pages: DashboardPage[] }) {
  if (!pages.length) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed bg-slate-50/60 text-center text-xs text-slate-500">
        No pages yet. Once your site has pages, they will appear here.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {pages.map((page) => (
        <PageCard key={page.id} page={page} />
      ))}
    </div>
  );
}

function PageCard({ page }: { page: DashboardPage }) {
  const statusLabel = page.is_published ? "published" : "draft";
  const statusColor = page.is_published ? "text-emerald-600" : "text-amber-500";

  return (
    <div className="flex flex-col rounded-2xl border bg-white">
      {/* Top: screenshot placeholder + badges */}
      <div className="relative flex h-40 items-center justify-center rounded-t-2xl bg-slate-50">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-[20px] text-slate-400">
          🖼
        </div>
        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-slate-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
          {page.project_name || "Website"}
        </div>
        <div className="absolute right-3 top-3 text-[11px] font-medium capitalize">
          <span className={statusColor}>{statusLabel}</span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-1 px-4 py-3 text-xs">
        <div className="text-sm font-semibold text-slate-900">
          {page.title || page.slug}
        </div>
        <div className="text-[11px] text-slate-500">
          Path: <code className="rounded bg-slate-100 px-1">{page.path}</code>
        </div>
        <div className="text-[11px] text-slate-500">
          Locale:{" "}
          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase">
            {page.locale}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
        <Link
          href={`/dashboard/website/pages/${page.id}`}
          className="flex h-8 flex-1 items-center justify-center rounded-lg bg-blue-600 text-xs font-medium text-white hover:bg-blue-700"
        >
          Edit
        </Link>
        <div className="flex items-center gap-2 text-slate-400">
          <Link
            href={page.path || "#"}
            className={`text-[16px] ${
              !page.path ? "pointer-events-none opacity-40" : ""
            }`}
            title="View live page"
          >
            👁
          </Link>
          {/* Duplicate / delete placeholders for future wiring */}
          <button className="text-[16px]" title="Duplicate">
            ⧉
          </button>
          <button className="text-[16px]" title="Delete">
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}