"use client";

import type { UsePageConfigState } from "./use-page-config";
import { usePageConfig } from "./use-page-config";
import { defaultHomepageConfig } from "@/config/homepage-sections";
import type { HomepageConfig, HomepageSectionId } from "@/config/homepage-sections";
import { useState } from "react";

const HOMEPAGE_LS_KEY = "jcw_homepage_config_v1";

export type UseHomepageConfigState = {
  config: HomepageConfig;
  ready: boolean;
  loading: boolean;
  error: string | null;
  source: "backend" | "local";
  updateField: (
    sectionId: HomepageSectionId,
    fieldId: string,
    value: string,
  ) => Promise<void>;
  toggleHeroParticles: (enabled: boolean) => void;
  resetConfig: () => void;
};

export function useHomepageConfig(locale?: string): UseHomepageConfigState {
  const { config: genericConfig, loading, error, source, saveField } = usePageConfig({
    pageSlug: "home",
    localStorageKey: HOMEPAGE_LS_KEY,
    defaultConfig: defaultHomepageConfig,
    locale,
  });

  // Cast the generic config back to HomepageConfig
  const config = genericConfig as HomepageConfig;
  const ready = !loading;

  async function updateField(
    sectionId: HomepageSectionId,
    fieldId: string,
    value: string,
  ) {
    await saveField(sectionId, fieldId, value);
  }

  function toggleHeroParticles(enabled: boolean) {
    // For now, just update localStorage - this could be enhanced to use backend later
    if (typeof window !== "undefined") {
      const updatedConfig: HomepageConfig = {
        ...config,
        heroSettings: { enabled },
      };
      try {
        window.localStorage.setItem(HOMEPAGE_LS_KEY, JSON.stringify(updatedConfig));
      } catch {
        // ignore
      }
    }
  }

  function resetConfig() {
    // For now, just update localStorage - this could be enhanced to use backend later
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(HOMEPAGE_LS_KEY, JSON.stringify(defaultHomepageConfig));
        window.location.reload(); // Simple way to reload with default config
      } catch {
        // ignore
      }
    }
  }

  return {
    config,
    ready,
    loading,
    error,
    source,
    updateField,
    toggleHeroParticles,
    resetConfig,
  };
}

export function getFieldValue(
  config: HomepageConfig,
  sectionId: HomepageSectionId,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}