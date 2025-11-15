"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultServicesPageConfig } from "@/config/services-page-config";
import type { PageConfig } from "@/types/page-config";

const SERVICES_LS_KEY = "jcw_services_page_config_v1";

export function useServicesPageConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "services",
    localStorageKey: SERVICES_LS_KEY,
    defaultConfig: defaultServicesPageConfig,
  });
}

export function getServicesFieldValue(
  config: PageConfig,
  sectionId: string,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}