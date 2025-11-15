"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import { UtilityPageShell } from "@/components/utility-page-shell";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/MainNavigation";

export default function JsonReaderPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const [input, setInput] = useState('{"hello": "world"}');
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function formatJson() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError("Invalid JSON – please check your syntax.");
      setOutput(null);
    }
  }

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Utilities"
      title="JSON Reader"
      description="Paste JSON to quickly check if it's valid and view it in a readable, formatted layout."
    >
        <div className="grid gap-6 md:grid-cols-2 text-sm">
          <div className="space-y-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              JSON input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-yellow-500 dark:focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={formatJson}
              className="rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-semibold text-slate-900 shadow hover:bg-yellow-300"
            >
              Format JSON
            </button>
            {error && (
              <p className="text-[11px] text-red-500 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Formatted output
            </label>
            <pre className="min-h-[200px] w-full overflow-auto rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/70 p-3 text-[11px] text-slate-800 dark:text-slate-200">
              {output || "// Formatted JSON will appear here"}
            </pre>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              This is a frontend-only helper. In the future, it may integrate with
              project files or logs in your dashboard.
            </p>
          </div>
        </div>
      </UtilityPageShell>
      <Footer />
    </>
  );
}
