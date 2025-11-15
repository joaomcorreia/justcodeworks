"use client";

import { useEffect, useState } from "react";
import {
  defaultServicesPageConfig,
  type ServicesPageConfig,
  type ServicesSectionId,
} from "@/config/services-page-sections";

const STORAGE_KEY = "jcw_services_page_config_v1";

export function loadServicesPageConfig(): ServicesPageConfig {
  if (typeof window === "undefined") return defaultServicesPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultServicesPageConfig;
    const parsed = JSON.parse(raw) as ServicesPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultServicesPageConfig;
    }
    return parsed;
  } catch {
    return defaultServicesPageConfig;
  }
}

export function saveServicesPageConfig(config: ServicesPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useServicesPageConfig() {
  const [config, setConfig] = useState<ServicesPageConfig>(
    defaultServicesPageConfig,
  );

  useEffect(() => {
    const loaded = loadServicesPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: ServicesSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: ServicesPageConfig = {
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
      saveServicesPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultServicesPageConfig);
    saveServicesPageConfig(defaultServicesPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getServicesFieldValue(
  config: ServicesPageConfig,
  sectionId: ServicesSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
