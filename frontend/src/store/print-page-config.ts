"use client";

import { useEffect, useState } from "react";
import {
  defaultPrintPageConfig,
  type PrintPageConfig,
  type PrintSectionId,
} from "@/config/print-page-sections";

const STORAGE_KEY = "jcw_print_page_config_v1";

export function loadPrintPageConfig(): PrintPageConfig {
  if (typeof window === "undefined") return defaultPrintPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPrintPageConfig;
    const parsed = JSON.parse(raw) as PrintPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultPrintPageConfig;
    }
    return parsed;
  } catch {
    return defaultPrintPageConfig;
  }
}

export function savePrintPageConfig(config: PrintPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function usePrintPageConfig() {
  const [config, setConfig] = useState<PrintPageConfig>(
    defaultPrintPageConfig,
  );

  useEffect(() => {
    const loaded = loadPrintPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: PrintSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: PrintPageConfig = {
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
      savePrintPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultPrintPageConfig);
    savePrintPageConfig(defaultPrintPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getPrintFieldValue(
  config: PrintPageConfig,
  sectionId: PrintSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
