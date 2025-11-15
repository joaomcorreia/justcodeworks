"use client";

import { useEffect, useState } from "react";
import {
  defaultHomepageConfig,
  type HomepageConfig,
  type HomepageSectionId,
  type TextBlock,
} from "@/config/homepage-sections";
import {
  fetchPageBySlug,
  updatePageSectionField,
  type ApiField,
} from "@/lib/api";
import {
  mapSnapshotToHomepageConfig,
  applyFieldUpdateToHomepageConfig,
} from "@/lib/page-config-adapter";

const STORAGE_KEY = "jcw_homepage_config_v1";

export function loadHomepageConfig(): HomepageConfig {
  if (typeof window === "undefined") return defaultHomepageConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHomepageConfig;
    const parsed = JSON.parse(raw) as HomepageConfig;
    if (!parsed || !Array.isArray(parsed.sections)) {
      return defaultHomepageConfig;
    }
    if (!parsed.heroSettings) {
      parsed.heroSettings = defaultHomepageConfig.heroSettings;
    }
    return parsed;
  } catch {
    return defaultHomepageConfig;
  }
}

export function saveHomepageConfig(config: HomepageConfig) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

type UseHomepageConfigState = {
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
  const [config, setConfig] = useState<HomepageConfig>(defaultHomepageConfig);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"backend" | "local">("local");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await fetchPageBySlug("home", null, locale);
        if (!snapshot) {
          // Fallback: try localStorage
          const local = loadHomepageConfig();
          if (!cancelled) {
            setConfig(local);
            setSource("local");
            setLoading(false);
            setReady(true);
          }
          return;
        }

        const cfg = mapSnapshotToHomepageConfig(snapshot);
        if (!cancelled) {
          setConfig(cfg);
          setSource("backend");
          setLoading(false);
          setReady(true);
        }
      } catch (err: any) {
        console.error("Failed to load homepage snapshot, falling back:", err);
        if (cancelled) return;
        const local = loadHomepageConfig();
        setConfig(local);
        setSource("local");
        setError("Could not load homepage from backend. Using local copy.");
        setLoading(false);
        setReady(true);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  async function updateField(
    sectionId: HomepageSectionId,
    fieldId: string,
    value: string,
  ) {
    // Update UI immediately (optimistic update)
    setConfig((prev) => {
      const next: HomepageConfig = {
        sections: prev.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            fields: section.fields.map((f) =>
              f.id === fieldId ? { ...f, value } : f,
            ),
          };
        }),
        heroSettings: prev.heroSettings,
      };
      // If we're in local mode, keep writing to LS
      if (source === "local") {
        saveHomepageConfig(next);
      }
      return next;
    });

    if (source !== "backend") {
      // No backend page yet – local-only mode
      return;
    }

    // Find the backend field id
    let backendFieldId: number | undefined;
    for (const section of config.sections) {
      if (section.id !== sectionId) continue;
      for (const f of section.fields) {
        if (f.id === fieldId && typeof f.backendFieldId === "number") {
          backendFieldId = f.backendFieldId;
          break;
        }
      }
    }

    if (!backendFieldId) {
      console.warn("No backendFieldId for", sectionId, fieldId);
      return;
    }

    try {
      const updatedField: ApiField = await updatePageSectionField(
        backendFieldId,
        value,
      );
      // Apply canonical value from backend
      setConfig((prev) => applyFieldUpdateToHomepageConfig(prev, updatedField));
    } catch (err: any) {
      console.error("Failed to persist field to backend", err);
      setError(
        err?.message ?? "Error while saving homepage changes to the server.",
      );
      // Optionally: re-load snapshot or revert; for now, we keep optimistic UI.
    }
  }

  function toggleHeroParticles(enabled: boolean) {
    setConfig((prev) => {
      const next: HomepageConfig = {
        ...prev,
        heroSettings: { enabled },
      };
      saveHomepageConfig(next);
      return next;
    });
  }

  function resetConfig() {
    setConfig(defaultHomepageConfig);
    saveHomepageConfig(defaultHomepageConfig);
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
