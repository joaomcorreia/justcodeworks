"use client";

import { useEffect, useState } from "react";
import type { PageConfig } from "@/types/page-config";
import {
  fetchPageBySlug,
  updatePageSectionField,
  type ApiField,
} from "@/lib/api";
import {
  mapSnapshotToPageConfig,
  applyFieldUpdateToPageConfig,
} from "@/lib/page-config-adapter";

export type PageConfigSource = "backend" | "local";

export type UsePageConfigState = {
  config: PageConfig;
  loading: boolean;
  error: string | null;
  source: PageConfigSource;
  saveField: (sectionId: string, fieldId: string, newValue: string) => Promise<void>;
};

/**
 * Generic hook to load and save page configs.
 *
 * - First tries backend snapshot by slug.
 * - Falls back to localStorage, then defaultConfig.
 * - When source === "backend", saveField will PATCH the backend Field.
 * - When source === "local", saveField only writes to localStorage.
 */
export function usePageConfig(options: {
  pageSlug: string;
  localStorageKey: string;
  defaultConfig: PageConfig;
  locale?: string;
}): UsePageConfigState {
  const { pageSlug, localStorageKey, defaultConfig, locale } = options;

  const [config, setConfig] = useState<PageConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<PageConfigSource>("local");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await fetchPageBySlug(pageSlug, null, locale);
        if (!snapshot) {
          const local = loadFromLocalStorage();
          if (!cancelled) {
            setConfig(local);
            setSource("local");
            setLoading(false);
          }
          return;
        }

        const cfg = mapSnapshotToPageConfig(snapshot);
        if (!cancelled) {
          setConfig(cfg);
          setSource("backend");
          setLoading(false);
        }
      } catch (err: any) {
        console.error(`Failed to load page '${pageSlug}', falling back:`, err);
        if (cancelled) return;
        const local = loadFromLocalStorage();
        setConfig(local);
        setSource("local");
        setError(
          `Could not load page '${pageSlug}' from backend. Using local copy.`,
        );
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSlug, locale]);

  function loadFromLocalStorage(): PageConfig {
    if (typeof window === "undefined") return defaultConfig;
    try {
      const raw = window.localStorage.getItem(localStorageKey);
      if (!raw) return defaultConfig;
      const parsed = JSON.parse(raw) as PageConfig;
      if (!parsed || !Array.isArray(parsed.sections)) {
        return defaultConfig;
      }
      return parsed;
    } catch {
      return defaultConfig;
    }
  }

  function saveToLocalStorage(next: PageConfig) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(localStorageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  async function saveField(
    sectionId: string,
    fieldId: string,
    newValue: string,
  ) {
    setConfig((prev) => {
      const next: PageConfig = {
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.map((f) =>
                  f.id === fieldId ? { ...f, value: newValue } : f,
                ),
              }
            : section,
        ),
      };
      if (source === "local") {
        saveToLocalStorage(next);
      }
      return next;
    });

    if (source !== "backend") {
      return;
    }

    let backendFieldId: number | undefined;
    // read-only traversal to find backendFieldId
    setConfig((prev) => {
      for (const section of prev.sections) {
        if (section.id !== sectionId) continue;
        for (const f of section.fields) {
          if (f.id === fieldId && typeof f.backendFieldId === "number") {
            backendFieldId = f.backendFieldId;
            break;
          }
        }
      }
      return prev;
    });

    if (!backendFieldId) {
      console.warn(
        `No backendFieldId found for page '${pageSlug}', section '${sectionId}', field '${fieldId}'`,
      );
      return;
    }

    try {
      const updatedField: ApiField = await updatePageSectionField(
        backendFieldId,
        newValue,
      );
      setConfig((prev) => applyFieldUpdateToPageConfig(prev, updatedField));
    } catch (err: any) {
      console.error("Failed to persist field to backend", err);
      setError(
        err?.message ??
          `Error while saving '${pageSlug}' changes to the server.`,
      );
    }
  }

  return { config, loading, error, source, saveField };
}