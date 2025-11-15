"use client";

import { useEffect, useState } from "react";
import {
  defaultMultiPagePageConfig,
  type MultiPagePageConfig,
  type MultiPageSectionId,
} from "@/config/multipage-website-sections";

const STORAGE_KEY = "jcw_multipage_website_config_v1";

export function loadMultiPagePageConfig(): MultiPagePageConfig {
  if (typeof window === "undefined") return defaultMultiPagePageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultMultiPagePageConfig;
    const parsed = JSON.parse(raw) as MultiPagePageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultMultiPagePageConfig;
    }
    return parsed;
  } catch {
    return defaultMultiPagePageConfig;
  }
}

export function saveMultiPagePageConfig(config: MultiPagePageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useMultiPagePageConfig() {
  const [config, setConfig] = useState<MultiPagePageConfig>(
    defaultMultiPagePageConfig,
  );

  useEffect(() => {
    const loaded = loadMultiPagePageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: MultiPageSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: MultiPagePageConfig = {
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
      saveMultiPagePageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultMultiPagePageConfig);
    saveMultiPagePageConfig(defaultMultiPagePageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getMultiPageFieldValue(
  config: MultiPagePageConfig,
  sectionId: MultiPageSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
