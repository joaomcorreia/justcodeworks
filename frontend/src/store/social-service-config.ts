"use client";

import { useEffect, useState } from "react";
import {
  defaultSocialPageConfig,
  type SocialPageConfig,
  type SocialSectionId,
} from "@/config/social-service-sections";

const STORAGE_KEY = "jcw_social_service_config_v1";

export function loadSocialPageConfig(): SocialPageConfig {
  if (typeof window === "undefined") return defaultSocialPageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSocialPageConfig;
    const parsed = JSON.parse(raw) as SocialPageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultSocialPageConfig;
    }
    return parsed;
  } catch {
    return defaultSocialPageConfig;
  }
}

export function saveSocialPageConfig(config: SocialPageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export function useSocialPageConfig() {
  const [config, setConfig] = useState<SocialPageConfig>(
    defaultSocialPageConfig,
  );

  useEffect(() => {
    const loaded = loadSocialPageConfig();
    setConfig(loaded);
  }, []);

  function updateField(
    sectionId: SocialSectionId,
    fieldId: string,
    value: string,
  ) {
    setConfig((prev) => {
      const next: SocialPageConfig = {
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
      saveSocialPageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultSocialPageConfig);
    saveSocialPageConfig(defaultSocialPageConfig);
  }

  return { config, updateField, resetConfig };
}

export function getSocialFieldValue(
  config: SocialPageConfig,
  sectionId: SocialSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}
