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
  if (!password) return { score: 0, text: "No password", color: "text-slate-400" };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score, text: "Weak", color: "text-red-500" };
  if (score <= 4) return { score, text: "Medium", color: "text-yellow-500" };
  return { score, text: "Strong", color: "text-green-500" };
}

export default function PasswordGeneratorPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    const safeLength = Math.min(Math.max(length, 4), 128);
    setPassword(generatePassword(safeLength, options));
    setLength(safeLength);
    setCopied(false);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password');
    }
  }

  const strength = getPasswordStrength(password);

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Utilities"
      title="Password Generator"
      description="Generate strong, secure passwords with customizable options. All passwords are generated locally in your browser - nothing is sent to our servers."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Generator Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Generator Options
            </h2>
            
            {/* Password Length */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password Length: {length} characters
              </label>
              <input
                type="range"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Uppercase (A-Z)</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Lowercase (a-z)</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Numbers (0-9)</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">Symbols (!@#$%^&*)</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-200"
            >
              Generate Password
            </button>
          </div>
        </div>

        {/* Generated Password */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Generated Password
            </h2>
            
            <div className="relative">
              <textarea
                value={password}
                readOnly
                placeholder="Your generated password will appear here..."
                className="w-full h-32 p-4 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono break-all"
              />
              
              {password && (
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors duration-200"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              )}
            </div>

            {/* Password Strength */}
            {password && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password Strength:
                  </span>
                  <span className={`text-sm font-semibold ${strength.color}`}>
                    {strength.text}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(strength.score / 6) * 100}%`,
                      backgroundColor: strength.score <= 2 ? '#ef4444' : strength.score <= 4 ? '#eab308' : '#22c55e'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security Tips */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
              🔒 Security Tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Use at least 12 characters for better security
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Include uppercase, lowercase, numbers, and symbols
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Use a unique password for each account
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Store passwords in a password manager
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
