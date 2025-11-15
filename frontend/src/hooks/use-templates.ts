"use client";

import { useEffect, useState } from "react";
import type {
  TemplateDefinition,
  TemplateCategory,
} from "@/config/templates-catalog";
import { templatesCatalog } from "@/config/templates-catalog";
import type { ApiTemplate } from "@/lib/api";
import { fetchTemplatesFromApi } from "@/lib/api";

type UseTemplatesState = {
  templates: TemplateDefinition[];
  loading: boolean;
  error: string | null;
  source: "api" | "fallback";
};

function mapApiTemplateToDefinition(t: ApiTemplate): TemplateDefinition {
  return {
    id: t.slug, // IMPORTANT: keep slug as id so builder still works
    slug: t.slug,
    name: t.name,
    category: t.category as TemplateCategory,
    complexity: t.complexity as any,
    shortDescription: t.short_description,
    longDescription: t.long_description,
    recommendedFor: t.recommended_for,
    sectionsSummary: t.sections_summary ?? [],
    estimatedPages: t.estimated_pages ?? 1,
    hasStore: t.has_store,
    hasBlog: t.has_blog,
    hasBooking: t.has_booking,
    // previewImage can be added to API later; for now leave undefined
    previewImage: undefined,
  };
}

export function useTemplates(): UseTemplatesState {
  const [state, setState] = useState<UseTemplatesState>({
    templates: [],
    loading: true,
    error: null,
    source: "api",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const apiTemplates = await fetchTemplatesFromApi();
        if (cancelled) return;
        const mapped = apiTemplates.map(mapApiTemplateToDefinition);
        setState({
          templates: mapped,
          loading: false,
          error: null,
          source: "api",
        });
      } catch (err: any) {
        console.warn("Failed to load templates from API, using fallback:", err);
        if (cancelled) return;
        setState({
          templates: templatesCatalog,
          loading: false,
          error:
            "Could not load templates from backend. Showing fallback templates.",
          source: "fallback",
        });
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
