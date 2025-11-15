"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultOnlineShopsConfig } from "@/config/online-shops-config";
import type { PageConfig } from "@/types/page-config";

const LS_KEY = "jcw_online_shops_config_v1";

export function useOnlineShopsConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "websites-online-shops",
    localStorageKey: LS_KEY,
    defaultConfig: defaultOnlineShopsConfig,
  });
}

export function getOnlineShopsFieldValue(
  config: PageConfig,
  sectionId: string,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}