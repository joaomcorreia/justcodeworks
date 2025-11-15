"use client";

import { useEffect, useState } from "react";
import {
  defaultCustomPageConfig,
  type CustomPageConfig,
  type CustomSectionId,
} from "@/config/custom-website-sections";

const STORAGE_KEY = "jcw_custom_website_page_config_v1";

export function loadCustomPageConfig(): CustomPageConfig {
  if (typeof window === "undefined") return defaultCustomPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCustomPageConfig;
    const parsed = JSON.parse(raw) as CustomPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultCustomPageConfig;
    }
    return parsed;
  } catch {
    return defaultCustomPageConfig;
  }
}

export function saveCustomPageConfig(config: CustomPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useCustomPageConfig() {
  const [config, setConfig] = useState<CustomPageConfig>(
    defaultCustomPageConfig,
  );

  useEffect(() => {
    const loaded = loadCustomPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: CustomSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: CustomPageConfig = {
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
      saveCustomPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultCustomPageConfig);
    saveCustomPageConfig(defaultCustomPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getCustomFieldValue(
  config: CustomPageConfig,
  sectionId: CustomSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
