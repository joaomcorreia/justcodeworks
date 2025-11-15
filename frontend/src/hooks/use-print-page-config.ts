"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultPrintPageConfig } from "@/config/print-page-config";
import type { PageConfig } from "@/types/page-config";

const LS_KEY = "jcw_print_page_config_v1";

export function usePrintPageConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "print",
    localStorageKey: LS_KEY,
    defaultConfig: defaultPrintPageConfig,
  });
}

export function getPrintFieldValue(
  config: PageConfig,
  sectionId: string,
  fieldId: string,
): string | undefined {
  const section = config.sections.find((s) => s.id === sectionId);
  if (!section) return undefined;
  const field = section.fields.find((f) => f.id === fieldId);
  return field?.value;
}