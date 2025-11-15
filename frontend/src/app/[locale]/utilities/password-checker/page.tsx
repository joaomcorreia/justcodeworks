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
    feedback.push("Use at least 8 characters");
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Mix uppercase and lowercase letters");
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Include numbers");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Add special characters (!@#$%^&*)");
  }

  let strength = "Weak";
  let strengthColor = "text-red-500 dark:text-red-400";

  if (score >= 4) {
    strength = "Strong";
    strengthColor = "text-green-500 dark:text-green-400";
  } else if (score >= 3) {
    strength = "Medium";
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
      label="Utilities"
      title="Password Checker"
      description="Check if a password looks weak or strong (basic checks only). This tool runs entirely in your browser and does not send data anywhere."
    >
        <div className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Enter password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 pr-20 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-yellow-500 dark:focus:border-yellow-400"
                placeholder="Type or paste a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-slate-200 dark:bg-slate-800 px-2 py-1 text-[10px] text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {result && (
            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/70 p-4 text-xs">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Strength:</span>
                <span className={`font-bold ${result.strengthColor}`}>
                  {result.strength}
                </span>
              </div>
              {result.feedback.length > 0 && (
                <div className="space-y-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Suggestions:</div>
                  <ul className="list-inside list-disc space-y-0.5 text-slate-700 dark:text-slate-300">
                    {result.feedback.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-3 text-[11px] text-slate-600 dark:text-slate-400">
                Note: This is a basic strength check. For real security, use a proper
                password manager and enable two-factor authentication.
              </p>
            </div>
          )}
        </div>
      </UtilityPageShell>
      <Footer />
    </>
  );
}
