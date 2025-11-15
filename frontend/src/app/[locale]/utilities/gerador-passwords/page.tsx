"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import { UtilityPageShell } from "@/components/utility-page-shell";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/MainNavigation";

function generatePassword(length: number, options: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}) {
  let chars = "";
  if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.numbers) chars += "0123456789";
  if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (!chars) return "";

  let result = "";
  const max = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * max)];
  }
  return result;
}

function getPasswordStrength(password: string): { score: number; text: string; color: string } {
  if (!password) return { score: 0, text: "Sem password", color: "text-slate-400" };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score, text: "Fraca", color: "text-red-500" };
  if (score <= 4) return { score, text: "Média", color: "text-yellow-500" };
  return { score, text: "Forte", color: "text-green-500" };
}

export default function PasswordGeneratorPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    const newPassword = generatePassword(length, options);
    setPassword(newPassword);
    setCopied(false);
  }

  async function copyToClipboard() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar password');
    }
  }

  const strength = getPasswordStrength(password);

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Ferramentas"
      title="Gerador de Passwords"
      description="Gere passwords fortes e seguras com opções personalizáveis. Todas as passwords são geradas localmente no seu browser - nada é enviado para os nossos servidores."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Generator Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Configurações
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Comprimento: {length} caracteres
                </label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Incluir caracteres:
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.uppercase}
                    onChange={(e) => setOptions(prev => ({ ...prev, uppercase: e.target.checked }))}
                    className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-500 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Letras maiúsculas (A-Z)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.lowercase}
                    onChange={(e) => setOptions(prev => ({ ...prev, lowercase: e.target.checked }))}
                    className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-500 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Letras minúsculas (a-z)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.numbers}
                    onChange={(e) => setOptions(prev => ({ ...prev, numbers: e.target.checked }))}
                    className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-500 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Números (0-9)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.symbols}
                    onChange={(e) => setOptions(prev => ({ ...prev, symbols: e.target.checked }))}
                    className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-500 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Símbolos (!@#$%^&*)</span>
                </label>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!Object.values(options).some(Boolean)}
                className="w-full rounded-lg bg-yellow-500 px-4 py-3 font-semibold text-slate-900 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Gerar Password
              </button>
            </div>
          </div>
        </div>

        {/* Generated Password Display */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Password Gerada
            </h2>
            
            {password ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-4">
                  <code className="break-all text-sm font-mono text-slate-800 dark:text-slate-200">
                    {password}
                  </code>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Força:</span>
                    <span className={`text-sm font-semibold ${strength.color}`}>
                      {strength.text}
                    </span>
                  </div>
                  
                  <button
                    onClick={copyToClipboard}
                    className="rounded-md bg-slate-200 dark:bg-slate-700 px-3 py-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Clique em "Gerar Password" para criar uma nova password segura.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 p-6">
            <h3 className="mb-3 text-md font-semibold text-slate-900 dark:text-slate-50">
              Dicas de Segurança
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Use passwords diferentes para cada conta</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Passwords mais longas são geralmente mais seguras</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Considere usar um gestor de passwords</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                <span>Active a autenticação de dois fatores quando possível</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </UtilityPageShell>
      <Footer />
    </>
  );
}