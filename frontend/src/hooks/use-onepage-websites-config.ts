"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultOnePageWebsitesConfig } from "@/config/one-page-websites-config";
import type { PageConfig } from "@/types/page-config";

const LS_KEY = "jcw_onepage_websites_config_v1";

export function useOnePageWebsitesConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "websites-one-page",
    localStorageKey: LS_KEY,
    defaultConfig: defaultOnePageWebsitesConfig,
  });
}

export function getOnePageFieldValue(
  config: PageConfig,
  sectionId: string,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}