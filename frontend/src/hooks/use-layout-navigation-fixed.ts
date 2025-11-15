"use client";

import { useEffect, useState } from "react";
import { fetchNavigationItems, type ApiNavigationItem } from "@/lib/api";

const DEFAULT_PROJECT_ID = "69870a64-4913-4d52-9b35-4d1dfa33632a";

export type LayoutNavState = {
  headerItems: ApiNavigationItem[];
  footerColumns: Record<number, ApiNavigationItem[]>;
  loading: boolean;
  error: string | null;
};

export function useLayoutNavigation(locale?: string): LayoutNavState {
  console.log("[FIXED FILE] useLayoutNavigation Hook called, locale:", locale);
  
  const [headerItems, setHeaderItems] = useState<ApiNavigationItem[]>([]);
  const [footerColumns, setFooterColumns] = useState<Record<number, ApiNavigationItem[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("[useLayoutNavigation] About to create useEffect");

  useEffect(() => {
    console.log("[SIMPLE TEST] useEffect runs!");
  });

  useEffect(() => {
    console.log("[useLayoutNavigation] EFFECT STARTED!", { locale, DEFAULT_PROJECT_ID });
    
    if (typeof window === 'undefined') {
      console.log("[useLayoutNavigation] Server-side, skipping");
      return;
    }
    
    if (!locale || typeof locale !== 'string' || locale.length < 2) {
      console.log("[useLayoutNavigation] Invalid locale, skipping:", locale);
      setLoading(false);
      return;
    }
    
    if (!DEFAULT_PROJECT_ID) {
      console.log("[useLayoutNavigation] No default project ID configured");
      setLoading(false);
      setError("Default project ID is not configured.");
      return;
    }

    let cancelled = false;

    async function loadNavigation() {
      console.log("[useLayoutNavigation] Loading navigation data...");
      setLoading(true);
      setError(null);

      try {
        const header = await fetchNavigationItems({
          projectId: DEFAULT_PROJECT_ID,
          location: "header",
          locale,
        });
        
        const footerAll = await fetchNavigationItems({
          projectId: DEFAULT_PROJECT_ID,
          location: "footer", 
          locale,
        });

        if (cancelled) return;

        setHeaderItems(header);

        const grouped: Record<number, ApiNavigationItem[]> = {};
        for (const item of footerAll) {
          const col = item.column ?? 1;
          if (!grouped[col]) grouped[col] = [];
          grouped[col].push(item);
        }

        Object.keys(grouped).forEach((key) => {
          grouped[Number(key)] = grouped[Number(key)].sort(
            (a, b) => a.order - b.order,
          );
        });

        setFooterColumns(grouped);
        setLoading(false);
      } catch (err: any) {
        if (cancelled) return;
        console.error("Failed to load layout navigation", err);
        setError(err?.message ?? "Could not load navigation from backend.");
        setLoading(false);
      }
    }

    loadNavigation();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return { headerItems, footerColumns, loading, error };
}