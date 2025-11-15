"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import type { Locale } from "@/i18n";
import { getLocaleFromPathname } from "@/lib/locale"; // [LOCALE]
import PasswordField from "@/components/forms/PasswordField"; // [JCW] PasswordField wired into login

interface LoginFormProps {
  locale: Locale;
  labels: {
    emailLabel: string;
    passwordLabel: string;
    button: string;
    loginError?: string;
  };
}

export function LoginForm({ locale, labels }: LoginFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname, locale); // [LOCALE]
  const { login, isLoading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // [AUTH] login handler - calls backend session login
      const userData = await login(email, password);
      
      // [ADMIN] staff/user redirect logic
      const isStaff = userData?.isStaff || userData?.isSuperuser;
      
      if (isStaff) {
        // [ADMIN] staff redirect - go to Next.js admin dashboard with locale
        router.push(`/${currentLocale}/admin`);
      } else {
        // [AUTH] user redirect - dashboard needs locale
        router.push(`/${currentLocale}/dashboard`);
      }
    } catch (err: any) {
      // [AUTH] login error - show clear message, don't clear username
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      // Keep username filled, only clear password on error
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      {error && (
        <div className="mb-4 rounded-lg border border-red-600 bg-red-900/20 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">
          Username
        </label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          placeholder="Enter your username"
          className="w-full rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-yellow-400 disabled:opacity-50"
        />
      </div>

      {/* [JCW] PasswordField wired into login */}
      <PasswordField
        name="password"
        label={labels.passwordLabel}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging in..." : labels.button}
      </button>

      <div className="mt-4 rounded-lg border border-blue-600 bg-blue-900/20 px-3 py-2 text-xs text-blue-300">
        <strong>Test credentials:</strong><br />
        Admin : <strong>admin</strong> | Password: <strong>admin123</strong><br />
        Admin: <strong>Joao</strong> | Password: <strong>joao123</strong><br />
        User: <strong>User1</strong> | Password: <strong>3934Ibanez</strong>
      </div>
    </form>
  );
}