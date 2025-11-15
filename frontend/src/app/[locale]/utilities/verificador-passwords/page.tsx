"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import { UtilityPageShell } from "@/components/utility-page-shell";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/MainNavigation";

function checkPasswordStrength(password: string) {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Use pelo menos 8 caracteres");
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Misture letras maiúsculas e minúsculas");
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Inclua números");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Adicione caracteres especiais (!@#$%^&*)");
  }

  let strength = "Fraca";
  let strengthColor = "text-red-500 dark:text-red-400";

  if (score >= 4) {
    strength = "Forte";
    strengthColor = "text-green-500 dark:text-green-400";
  } else if (score >= 3) {
    strength = "Média";
    strengthColor = "text-yellow-500 dark:text-yellow-400";
  }

  return { strength, strengthColor, feedback };
}

export default function PasswordCheckerPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const result = password ? checkPasswordStrength(password) : null;

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Ferramentas"
      title="Verificador de Passwords"
      description="Verifique se uma password parece fraca ou forte (verificações básicas apenas). Esta ferramenta executa inteiramente no seu browser e não envia dados para lugar nenhum."
    >
      <div className="space-y-4 text-sm">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Introduza a password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-20 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-yellow-500 dark:focus:border-yellow-400"
              placeholder="Digite ou cole uma password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-slate-200 dark:bg-slate-800 px-2 py-1 text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Força:</span>
              <span className={`text-xs font-semibold ${result.strengthColor}`}>
                {result.strength}
              </span>
            </div>

            {result.feedback.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                  Sugestões para melhorar:
                </p>
                <ul className="space-y-1">
                  {result.feedback.map((item, index) => (
                    <li key={index} className="flex items-start gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <span className="text-yellow-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          )}
        </div>
      </UtilityPageShell>
      <Footer />
    </>
  );
}