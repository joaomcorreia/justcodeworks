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
      setError("JSON inválido – por favor verifique a sintaxe.");
      setOutput(null);
    }
  }

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Ferramentas"
      title="Leitor JSON"
      description="Cole JSON para verificar rapidamente se é válido e visualizá-lo numa disposição legível e formatada."
    >
      <div className="grid gap-6 md:grid-cols-2 text-sm">
        <div className="space-y-3">
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Entrada JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-yellow-500 dark:focus:border-yellow-400"
            placeholder='{"exemplo": "dados"}'
          />
          <button
            type="button"
            onClick={formatJson}
            className="rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-semibold text-slate-900 shadow hover:bg-yellow-300"
          >
            Formatar JSON
          </button>
        </div>

        <div className="space-y-3">
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Resultado formatado
          </label>
          <div className="min-h-[200px] rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3">
            {error ? (
              <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
            ) : output ? (
              <pre className="whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-300">
                {output}
              </pre>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                O JSON formatado aparecerá aqui...
              </p>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Esta é uma ferramenta apenas para frontend. No futuro, pode integrar-se com
            ficheiros de projeto ou logs no seu painel de controlo.
          </p>
          </div>
        </div>
      </UtilityPageShell>
      <Footer />
    </>
  );
}