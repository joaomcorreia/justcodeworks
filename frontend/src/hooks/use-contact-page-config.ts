"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultContactPageConfig } from "@/config/contact-page-config";

const LS_KEY = "jcw_contact_page_config_v1";

export function useContactPageConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "contact",
    localStorageKey: LS_KEY,
    defaultConfig: defaultContactPageConfig,
  });
}