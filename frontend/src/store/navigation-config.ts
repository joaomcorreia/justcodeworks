"use client";

import { useEffect, useState } from "react";
import {
  defaultNavigationConfig,
  type NavigationConfig,
} from "@/config/navigation";

const STORAGE_KEY = "jcw_navigation_config_v1";

export function loadNavigationConfig(): NavigationConfig {
  if (typeof window === "undefined") return defaultNavigationConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultNavigationConfig;
    const parsed = JSON.parse(raw) as NavigationConfig;
    if (!parsed || !Array.isArray(parsed.mainNav)) {
      return defaultNavigationConfig;
    }
    return parsed;
  } catch {
    return defaultNavigationConfig;
  }
}

export function saveNavigationConfig(config: NavigationConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useNavigationConfig() {
  const [config, setConfig] = useState<NavigationConfig>(
    defaultNavigationConfig,
  );

  useEffect(() => {
    const loaded = loadNavigationConfig();
    setConfig(loaded);
  }, []);

  function updateConfig(updater: (prev: NavigationConfig) => NavigationConfig) {
    setConfig((prev) => {
      const next = updater(prev);
      saveNavigationConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultNavigationConfig);
    saveNavigationConfig(defaultNavigationConfig);
  }

  return { config, updateConfig, resetConfig };
}
