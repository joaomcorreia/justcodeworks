"use client";

import { usePageConfig, type UsePageConfigState } from "./use-page-config";
import { defaultPosPageConfig } from "@/config/pos-page-config";

const LS_KEY = "jcw_pos_page_config_v1";

export function usePosPageConfig(): UsePageConfigState {
  return usePageConfig({
    pageSlug: "pos-systems",
    localStorageKey: LS_KEY,
    defaultConfig: defaultPosPageConfig,
  });
}