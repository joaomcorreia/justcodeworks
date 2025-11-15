"use client";

import { useEffect, useState } from "react";
import {
  defaultContactPageConfig,
  type ContactPageConfig,
  type ContactSectionId,
} from "@/config/contact-page-sections";

const STORAGE_KEY = "jcw_contact_page_config_v1";

export function loadContactPageConfig(): ContactPageConfig {
  if (typeof window === "undefined") return defaultContactPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContactPageConfig;
    const parsed = JSON.parse(raw) as ContactPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultContactPageConfig;
    }
    return parsed;
  } catch {
    return defaultContactPageConfig;
  }
}

export function saveContactPageConfig(config: ContactPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

export function useContactPageConfig() {
  const [config, setConfig] = useState<ContactPageConfig>(
    defaultContactPageConfig,
  );

  useEffect(() => {
    const loaded = loadContactPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: ContactSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: ContactPageConfig = {
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
      saveContactPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultContactPageConfig);
    saveContactPageConfig(defaultContactPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getContactFieldValue(
  config: ContactPageConfig,
  sectionId: ContactSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
