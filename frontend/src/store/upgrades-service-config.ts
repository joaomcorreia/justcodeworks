"use client";

import { useEffect, useState } from "react";
import {
  defaultUpgradesPageConfig,
  type UpgradesPageConfig,
  type UpgradesSectionId,
} from "@/config/upgrades-service-sections";

const STORAGE_KEY = "jcw_upgrades_service_config_v1";

export function loadUpgradesPageConfig(): UpgradesPageConfig {
  if (typeof window === "undefined") return defaultUpgradesPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUpgradesPageConfig;
    const parsed = JSON.parse(raw) as UpgradesPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultUpgradesPageConfig;
    }
    return parsed;
  } catch {
    return defaultUpgradesPageConfig;
  }
}

export function saveUpgradesPageConfig(config: UpgradesPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useUpgradesPageConfig() {
  const [config, setConfig] = useState<UpgradesPageConfig>(
    defaultUpgradesPageConfig,
  );

  useEffect(() => {
    const loaded = loadUpgradesPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: UpgradesSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: UpgradesPageConfig = {
        sections: prev.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            fields: section.fields.map((f) =>
              f.id === fieldId ? { ...f, value } : f,
            ),
          };
        }),
      };
      saveUpgradesPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultUpgradesPageConfig);
    saveUpgradesPageConfig(defaultUpgradesPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getUpgradesFieldValue(
  config: UpgradesPageConfig,
  sectionId: UpgradesSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
