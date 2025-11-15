"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultWebsitesPageConfig } from "@/config/websites-page-config";
import type { PageConfig } from "@/types/page-config";

const WEBSITES_LS_KEY = "jcw_websites_page_config_v1";

export function useWebsitesPageConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "websites",
    localStorageKey: WEBSITES_LS_KEY,
    defaultConfig: defaultWebsitesPageConfig,
  });
}

export function getWebsitesFieldValue(
  config: PageConfig,
  sectionId: string,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}