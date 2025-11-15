"use client";

import { useEffect, useState } from "react";
import {
  defaultOnePagePageConfig,
  type OnePagePageConfig,
  type OnePageSectionId,
} from "@/config/onepage-website-sections";

const STORAGE_KEY = "jcw_onepage_website_config_v1";

export function loadOnePagePageConfig(): OnePagePageConfig {
  if (typeof window === "undefined") return defaultOnePagePageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultOnePagePageConfig;
    const parsed = JSON.parse(raw) as OnePagePageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultOnePagePageConfig;
    }
    return parsed;
  } catch {
    return defaultOnePagePageConfig;
  }
}

export function saveOnePagePageConfig(config: OnePagePageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useOnePagePageConfig() {
  const [config, setConfig] = useState<OnePagePageConfig>(
    defaultOnePagePageConfig,
  );

  useEffect(() => {
    const loaded = loadOnePagePageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: OnePageSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: OnePagePageConfig = {
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
      saveOnePagePageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultOnePagePageConfig);
    saveOnePagePageConfig(defaultOnePagePageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getOnePageFieldValue(
  config: OnePagePageConfig,
  sectionId: OnePageSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
