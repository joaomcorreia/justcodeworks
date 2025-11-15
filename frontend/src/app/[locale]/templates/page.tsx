import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n";
import { getCurrentUser } from "@/lib/server-auth";

export default async function TemplatesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const t = await getDictionary(locale);
  // [JCW] auth guard added - builder links gated by auth
  const user = await getCurrentUser();

  return (
    <div className="bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            {t.templates.badge}
          </p>
          <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            {t.templates.title}
          </h1>
          <p className="mb-2 text-sm text-slate-300">{t.templates.subtitle}</p>
          <p className="text-xs text-slate-500">{t.templates.note}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
            <Link
              href={`/${locale}`}
              className="text-slate-300 hover:text-yellow-300"
            >
              ← {t.templates.buttons.backHome}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
          <div className="grid gap-4 md:grid-cols-3">
            {t.templates.list.map((tpl: any) => (
              <div
                key={tpl.id}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-5"
              >
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {tpl.type}
                </div>
                <h2 className="mb-1 text-sm font-semibold text-slate-50">
                  {tpl.name}
                </h2>
                <p className="mb-3 text-xs text-slate-300">{tpl.bestFor}</p>

                {/* Simple "fake preview" block */}
                <div className="mb-3 h-28 rounded-lg border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-2 text-[10px] text-slate-400">
                  <div className="mb-1 flex h-4 items-center gap-1 rounded border border-slate-800 bg-slate-900 px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="ml-2 truncate">example-template.justcodeworks.eu</span>
                  </div>
                  <div className="flex h-[calc(100%-1rem)] flex-col gap-1">
                    <div className="h-5 rounded bg-slate-800/70" />
                    <div className="grid flex-1 grid-cols-3 gap-1">
                      <div className="rounded bg-slate-900/80 border border-slate-800" />
                      <div className="rounded bg-slate-900/80 border border-slate-800" />
                      <div className="rounded bg-slate-900/80 border border-slate-800" />
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-2 pt-2 text-[11px] text-slate-400">
                  <span>{tpl.complexity}</span>
                  <span>{tpl.highlight}</span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {user ? (
                    <Link
                      href={`/${locale}/builder?template=${encodeURIComponent(
                        tpl.id,
                      )}`}
                      className="rounded-full bg-yellow-400 px-4 py-1.5 text-[11px] font-semibold text-slate-900 shadow hover:bg-yellow-300"
                    >
                      {t.templates.buttons.useTemplate}
                    </Link>
                  ) : (
                    <Link
                      href={`/${locale}/login`}
                      className="rounded-full bg-slate-600 px-4 py-1.5 text-[11px] font-semibold text-slate-100 shadow hover:bg-slate-500"
                    >
                      Login to Use Template
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            {user ? (
              <Link
                href={`/${locale}/builder`}
                className="text-xs font-medium text-slate-300 hover:text-yellow-300"
              >
                {t.templates.buttons.goToBuilder} →
              </Link>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="text-xs font-medium text-slate-400 hover:text-slate-300"
              >
                Login to Access Builder →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
