"use client";

import { useEffect, useState } from "react";
import {
  defaultHelpPageConfig,
  type HelpPageConfig,
  type HelpSectionId,
} from "@/config/help-page-sections";

const STORAGE_KEY = "jcw_help_page_config_v1";

export function loadHelpPageConfig(): HelpPageConfig {
  if (typeof window === "undefined") return defaultHelpPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHelpPageConfig;
    const parsed = JSON.parse(raw) as HelpPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultHelpPageConfig;
    }
    return parsed;
  } catch {
    return defaultHelpPageConfig;
  }
}

export function saveHelpPageConfig(config: HelpPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useHelpPageConfig() {
  const [config, setConfig] = useState<HelpPageConfig>(
    defaultHelpPageConfig,
  );

  useEffect(() => {
    const loaded = loadHelpPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: HelpSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: HelpPageConfig = {
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
      saveHelpPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultHelpPageConfig);
    saveHelpPageConfig(defaultHelpPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getHelpFieldValue(
  config: HelpPageConfig,
  sectionId: HelpSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
