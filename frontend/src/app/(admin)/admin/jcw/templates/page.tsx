"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import {
  fetchTemplateLabSiteTemplates,
  fetchTemplateLabInternalTemplates,
  type ApiSiteTemplateSummary,
  type ApiTemplateSummary,
} from "@/lib/api";

type TabKey = "user" | "internal";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="animate-pulse text-sm tracking-wide uppercase">
        Loading Template Lab…
      </div>
    </div>
  );
}

function TemplateCard(props: { 
  title: string; 
  slug: string; 
  description?: string; 
  extra?: string;
  usage?: number;
  type?: "site" | "template";
}) {
  const { title, slug, description, extra, usage, type } = props;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/40">
      <div>
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-wide text-slate-400">Template</div>
          {type === "site" && usage !== undefined && (
            <div className="text-xs text-slate-500">
              Used: {usage}x
            </div>
          )}
        </div>
        <div className="mt-1 text-base font-semibold text-slate-50">{title}</div>
        <div className="mt-1 text-[11px] text-slate-500 break-all">
          <span className="text-slate-400">Slug:</span> {slug}
        </div>
        {description && (
          <p className="mt-2 text-xs text-slate-400 line-clamp-3">{description}</p>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        {extra && <span className="rounded-full bg-slate-800/80 px-2 py-0.5">{extra}</span>}
        <span className="text-slate-600"># [TEMPLAB]</span>
      </div>
    </div>
  );
}

// [TEMPLAB]
export default function TemplateLabPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>("user");
  const [userTemplates, setUserTemplates] = useState<ApiSiteTemplateSummary[]>([]);
  const [internalTemplates, setInternalTemplates] = useState<ApiTemplateSummary[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Auth / staff check
  useEffect(() => {
    if (userLoading) return;

    // Not logged in at all
    if (!user) {
      router.push("/en/login");
      return;
    }

    // Logged in but not staff → normal dashboard
    if (!user.isStaff) {
      router.push("/en/dashboard/");
      return;
    }
  }, [user, userLoading, router]);

  // Fetch templates when user is confirmed staff
  useEffect(() => {
    if (userLoading) return;
    if (!user || !user.isStaff) return;

    async function fetchTemplates() {
      try {
        setIsLoadingData(true);
        setError(null);

        const [siteRes, internalRes] = await Promise.all([
          fetchTemplateLabSiteTemplates(),
          fetchTemplateLabInternalTemplates(),
        ]);

        setUserTemplates(siteRes || []);
        setInternalTemplates(internalRes || []);
      } catch (err: any) {
        console.error("Failed to load Template Lab data", err);
        setError("Failed to load templates. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchTemplates();
  }, [user, userLoading]);

  if (userLoading || (!user && !error)) {
    return <LoadingScreen />;
  }

  // If user exists but is not staff, the redirect effect will handle it; we still show loading screen briefly.
  if (user && !user.isStaff) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">Template Lab</h1>
            <p className="text-sm text-slate-400">
              Visual overview of all JCW templates — user-facing and internal.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">
              Staff access
            </span>
            {user?.email && (
              <span className="rounded-full border border-slate-700 px-3 py-1 text-slate-300">
                {user.email}
              </span>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-4 flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("user")}
            className={`rounded-full px-3 py-1 ${
              activeTab === "user"
                ? "bg-slate-100 text-slate-900"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            User Templates ({userTemplates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("internal")}
            className={`rounded-full px-3 py-1 ${
              activeTab === "internal"
                ? "bg-slate-100 text-slate-900"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Internal Templates ({internalTemplates.length})
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/60 bg-rose-950/40 px-4 py-3 text-xs text-rose-100">
            {error}
          </div>
        )}

        {/* Content */}
        {isLoadingData ? (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            Loading templates…
          </div>
        ) : (
          <section className="flex-1">
            {activeTab === "user" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userTemplates.length === 0 && (
                  <div className="text-xs text-slate-500">
                    No user-facing templates found yet.
                  </div>
                )}
                {userTemplates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    title={tpl.name}
                    slug={tpl.key}
                    description={tpl.description}
                    usage={tpl.usage_count}
                    type="site"
                    extra={
                      tpl.is_default_for_tenants
                        ? "Default"
                        : tpl.is_active
                        ? "Active"
                        : tpl.status === "published"
                        ? "Published"
                        : tpl.status
                    }
                  />
                ))}
              </div>
            )}

            {activeTab === "internal" && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {internalTemplates.length === 0 && (
                  <div className="text-xs text-slate-500">
                    No internal templates found yet.
                  </div>
                )}
                {internalTemplates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    title={tpl.name}
                    slug={tpl.slug}
                    description={tpl.short_description}
                    type="template"
                    extra={`${tpl.complexity} • ${tpl.category}`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Footer hint */}
        <footer className="mt-6 border-t border-slate-800 pt-3 text-[11px] text-slate-500">
          Phase 1 of Template Lab – next steps: connect "Assign to SiteProject"
          using the existing set-template API. # [TEMPLAB]
        </footer>
      </div>
    </main>
  );
}