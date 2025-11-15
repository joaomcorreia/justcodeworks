"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultMultiPageWebsitesConfig } from "@/config/multi-page-websites-config";
import type { PageConfig } from "@/types/page-config";

const LS_KEY = "jcw_multipage_websites_config_v1";

export function useMultiPageWebsitesConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "websites-multi-page",
    localStorageKey: LS_KEY,
    defaultConfig: defaultMultiPageWebsitesConfig,
  });
}

export function getMultiPageFieldValue(
  config: PageConfig,
  sectionId: string,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}