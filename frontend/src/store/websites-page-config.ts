"use client";

import { useEffect, useState } from "react";
import {
  defaultWebsitesPageConfig,
  type WebsitesPageConfig,
  type WebsitesSectionId,
} from "@/config/websites-page-sections";

const STORAGE_KEY = "jcw_websites_page_config_v1";

export function loadWebsitesPageConfig(): WebsitesPageConfig {
  if (typeof window === "undefined") return defaultWebsitesPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultWebsitesPageConfig;
    const parsed = JSON.parse(raw) as WebsitesPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultWebsitesPageConfig;
    }
    return parsed;
  } catch {
    return defaultWebsitesPageConfig;
  }
}

export function saveWebsitesPageConfig(config: WebsitesPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useWebsitesPageConfig() {
  const [config, setConfig] = useState<WebsitesPageConfig>(
    defaultWebsitesPageConfig,
  );

  useEffect(() => {
    const loaded = loadWebsitesPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: WebsitesSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: WebsitesPageConfig = {
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
      saveWebsitesPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultWebsitesPageConfig);
    saveWebsitesPageConfig(defaultWebsitesPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getWebsitesFieldValue(
  config: WebsitesPageConfig,
  sectionId: WebsitesSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
