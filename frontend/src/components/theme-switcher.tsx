"use client";

import { useTheme } from "./theme-provider";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500"
      aria-label="Toggle theme"
    >
      <span className="hidden sm:inline">
        {theme === "dark" ? "Dark" : "Light"} mode
      </span>
      <span className="sm:hidden">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
