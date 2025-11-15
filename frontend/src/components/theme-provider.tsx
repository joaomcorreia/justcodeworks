"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("jcw_theme") as Theme | null;
    if (stored === "dark" || stored === "light") {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      setThemeState("dark");
      applyTheme("dark");
    }
  }, []);

  function applyTheme(next: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("jcw-theme-dark", "jcw-theme-light");
    root.classList.add(next === "dark" ? "jcw-theme-dark" : "jcw-theme-light");
  }

  function setTheme(next: Theme) {
    setThemeState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("jcw_theme", next);
    }
    applyTheme(next);
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
