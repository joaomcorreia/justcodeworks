"use client";

import { useEffect, useState } from "react";
import {
  defaultUtilitiesPageConfig,
  type UtilitiesPageConfig,
  type UtilitiesSectionId,
} from "@/config/utilities-page-sections";

const STORAGE_KEY = "jcw_utilities_page_config_v1";

export function loadUtilitiesPageConfig(): UtilitiesPageConfig {
  if (typeof window === "undefined") return defaultUtilitiesPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultUtilitiesPageConfig;
    const parsed = JSON.parse(raw) as UtilitiesPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultUtilitiesPageConfig;
    }
    return parsed;
  } catch {
    return defaultUtilitiesPageConfig;
  }
}

export function saveUtilitiesPageConfig(config: UtilitiesPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

export function useUtilitiesPageConfig() {
  const [config, setConfig] = useState<UtilitiesPageConfig>(
    defaultUtilitiesPageConfig,
  );

  useEffect(() => {
    const loaded = loadUtilitiesPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: UtilitiesSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: UtilitiesPageConfig = {
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
      saveUtilitiesPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultUtilitiesPageConfig);
    saveUtilitiesPageConfig(defaultUtilitiesPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getUtilitiesFieldValue(
  config: UtilitiesPageConfig,
  sectionId: UtilitiesSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
