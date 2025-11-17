"use client";

import type { Locale } from "@/i18n";
import { useAdminProjects } from "@/hooks/use-admin-projects";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useMemo } from "react";

export default function JcwAdminPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const {
    projects,
    loadingProjects,
    projectsError,
    selectedProjectId,
    setSelectedProjectId,
    pages,
    loadingPages,
    pagesError,
  } = useAdminProjects();

  // Move all hooks to the top before any conditional logic
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  // Move all functions to the top as well
  function buildEditorUrl(path: string): string {
    // Ensure the path has a leading slash
    const cleanedPath = path.startsWith("/") ? path : `/${path}`;
    // Home page is usually "/" and we prefix with locale
    if (cleanedPath === "/") {
      return `/${locale}?edit=1`;
    }
    return `/${locale}${cleanedPath}?edit=1`;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-slate-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-xl font-semibold text-slate-50 mb-2">Authentication Required</h1>
          <p className="text-sm text-slate-400 mb-6">You need to log in to access the JCW Admin.</p>
          <Link
            href={`/${locale}/login`}
            className="inline-block rounded-full bg-yellow-400 px-6 py-2 text-sm font-semibold text-slate-900 hover:bg-yellow-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-semibold text-slate-50">
              JCW Admin
            </h1>
            <p className="text-[11px] text-slate-400">
              Projects &amp; pages overview. Click "Open in editor" to edit content
              in-place.
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              Logged in as: {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/jcw-admin/bugs`}
              className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-yellow-400 hover:text-yellow-300"
            >
              Bug reports
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.push(`/${locale}`);
              }}
              className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-red-400 hover:text-red-300"
            >
              Logout
            </button>
            <Link
              href={`/${locale}`}
              className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-yellow-400 hover:text-yellow-300"
            >
              ← Back to site
            </Link>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          {/* Projects list */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Projects
            </h2>

            {loadingProjects && (
              <p className="text-[11px] text-slate-400">Loading projects…</p>
            )}

            {projectsError && (
              <p className="mb-2 text-[11px] text-red-400">{projectsError}</p>
            )}

            {!loadingProjects && projects.length === 0 && (
              <p className="text-[11px] text-slate-500">
                No projects yet. Create one via the website builder first.
              </p>
            )}

            <ul className="mt-1 space-y-2">
              {projects.map((project) => {
                const isActive = project.id === selectedProjectId;
                return (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                      className={[
                        "w-full rounded-xl border px-3 py-2 text-left text-[11px]",
                        isActive
                          ? "border-yellow-400 bg-yellow-400/10 text-yellow-100"
                          : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{project.name}</span>
                        {project.is_active && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 text-[10px] text-slate-400">
                        {project.business_type || "No business type set"}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Goal:{" "}
                        {project.primary_goal || "Not specified"} · Locale:{" "}
                        {project.primary_locale}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Pages for selected project */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Pages
              </h2>
              {selectedProject && (
                <span className="text-[10px] text-slate-400">
                  Project:{" "}
                  <span className="font-semibold text-slate-200">
                    {selectedProject.name}
                  </span>
                </span>
              )}
            </div>

            {!selectedProject && (
              <p className="text-[11px] text-slate-500">
                Select a project on the left to see its pages.
              </p>
            )}

            {selectedProject && loadingPages && (
              <p className="text-[11px] text-slate-400">
                Loading pages for this project…
              </p>
            )}

            {pagesError && (
              <p className="mb-2 text-[11px] text-red-400">{pagesError}</p>
            )}

            {selectedProject && !loadingPages && pages.length === 0 && (
              <p className="text-[11px] text-slate-500">
                This project has no pages yet. You can create them via Django admin
                for now.
              </p>
            )}

            <div className="mt-1 space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-2"
                >
                  <div className="text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-50">
                        {page.title || page.slug}
                      </span>
                      {page.is_published ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                          Published
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Slug: <span className="font-mono">{page.slug}</span> · Path:{" "}
                      <span className="font-mono">{page.path}</span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      ID: <span className="font-mono">{page.id}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-[10px]">
                    <Link
                      href={buildEditorUrl(page.path)}
                      className="rounded-full border border-yellow-400 px-3 py-1 text-[10px] font-semibold text-yellow-200 hover:bg-yellow-400 hover:text-slate-950"
                    >
                      Open in editor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <p className="mt-4 text-[10px] text-slate-500">
          Note: authentication and per-user access control will be added later. For
          now, this dashboard is meant for local development / internal use.
        </p>
      </div>
    </div>
  );
}