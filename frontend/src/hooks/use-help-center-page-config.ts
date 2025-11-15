"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultHelpCenterPageConfig } from "@/config/help-center-page-config";

const LS_KEY = "jcw_help_center_page_config_v1";

export function useHelpCenterPageConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "help-center",
    localStorageKey: LS_KEY,
    defaultConfig: defaultHelpCenterPageConfig,
  });
}