"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultCustomWebsitesConfig } from "@/config/custom-websites-config";
import type { PageConfig } from "@/types/page-config";

const LS_KEY = "jcw_custom_websites_config_v1";

export function useCustomWebsitesConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "websites-custom",
    localStorageKey: LS_KEY,
    defaultConfig: defaultCustomWebsitesConfig,
  });
}

export function getCustomWebsitesFieldValue(
  config: PageConfig,
  sectionId: string,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}