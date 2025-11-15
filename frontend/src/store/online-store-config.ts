"use client";

import { useEffect, useState } from "react";
import {
  defaultStorePageConfig,
  type StorePageConfig,
  type StoreSectionId,
} from "@/config/online-store-sections";

const STORAGE_KEY = "jcw_store_page_config_v1";

export function loadStorePageConfig(): StorePageConfig {
  if (typeof window === "undefined") return defaultStorePageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStorePageConfig;
    const parsed = JSON.parse(raw) as StorePageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultStorePageConfig;
    }
    return parsed;
  } catch {
    return defaultStorePageConfig;
  }
}

export function saveStorePageConfig(config: StorePageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useStorePageConfig() {
  const [config, setConfig] = useState<StorePageConfig>(
    defaultStorePageConfig,
  );

  useEffect(() => {
    const loaded = loadStorePageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: StoreSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: StorePageConfig = {
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
      saveStorePageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultStorePageConfig);
    saveStorePageConfig(defaultStorePageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getStoreFieldValue(
  config: StorePageConfig,
  sectionId: StoreSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
