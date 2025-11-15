"use client";

import { useEffect, useState } from "react";
import {
  defaultPosPageConfig,
  type PosPageConfig,
  type PosSectionId,
} from "@/config/pos-page-sections";

const STORAGE_KEY = "jcw_pos_page_config_v1";

export function loadPosPageConfig(): PosPageConfig {
  if (typeof window === "undefined") return defaultPosPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPosPageConfig;
    const parsed = JSON.parse(raw) as PosPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultPosPageConfig;
    }
    return parsed;
  } catch {
    return defaultPosPageConfig;
  }
}

export function savePosPageConfig(config: PosPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function usePosPageConfig() {
  const [config, setConfig] = useState<PosPageConfig>(defaultPosPageConfig);

  useEffect(() => {
    const loaded = loadPosPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: PosSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: PosPageConfig = {
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
      savePosPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultPosPageConfig);
    savePosPageConfig(defaultPosPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getPosFieldValue(
  config: PosPageConfig,
  sectionId: PosSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
