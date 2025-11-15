"use client";

import { useEffect, useState } from "react";
import {
  defaultSeoPageConfig,
  type SeoPageConfig,
  type SeoSectionId,
} from "@/config/seo-service-sections";

const STORAGE_KEY = "jcw_seo_service_config_v1";

export function loadSeoPageConfig(): SeoPageConfig {
  if (typeof window === "undefined") return defaultSeoPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSeoPageConfig;
    const parsed = JSON.parse(raw) as SeoPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultSeoPageConfig;
    }
    return parsed;
  } catch {
    return defaultSeoPageConfig;
  }
}

export function saveSeoPageConfig(config: SeoPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useSeoPageConfig() {
  const [config, setConfig] = useState<SeoPageConfig>(defaultSeoPageConfig);

  useEffect(() => {
    const loaded = loadSeoPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: SeoSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: SeoPageConfig = {
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
      saveSeoPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultSeoPageConfig);
    saveSeoPageConfig(defaultSeoPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getSeoFieldValue(
  config: SeoPageConfig,
  sectionId: SeoSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
