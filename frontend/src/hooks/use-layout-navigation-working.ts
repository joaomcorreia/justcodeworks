"use client";

import { useState, useCallback } from "react";
import type { ApiNavigationItem } from "@/lib/api";

const DEFAULT_PROJECT_ID = "69870a64-4913-4d52-9b35-4d1dfa33632a";

export type LayoutNavState = {
  headerItems: ApiNavigationItem[];
  footerColumns: Record<number, ApiNavigationItem[]>;
  loading: boolean;
  error: string | null;
  loadNavigation: () => void;
};

export function useLayoutNavigation(locale?: string): LayoutNavState {
  console.log("[WORKING VERSION] useLayoutNavigation called with locale:", locale);
  
  const [headerItems, setHeaderItems] = useState<ApiNavigationItem[]>([]);
  const [footerColumns, setFooterColumns] = useState<Record<number, ApiNavigationItem[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadNavigation = useCallback(async () => {
    if (!locale || typeof window === 'undefined') {
      console.log("[WORKING VERSION] Skipping - no locale or server-side");
      return;
    }

    console.log("[WORKING VERSION] Loading navigation data for locale:", locale);
    setLoading(true);
    setError(null);

    try {
      // Load header navigation
      console.log("[WORKING VERSION] Fetching header items...");
      const headerResponse = await fetch(`http://127.0.0.1:8000/api/navigation/?project=${DEFAULT_PROJECT_ID}&location=header&locale=${locale}`);
      const headerData = await headerResponse.json();
      console.log("[WORKING VERSION] Header data:", headerData);

      // Load footer navigation  
      console.log("[WORKING VERSION] Fetching footer items...");
      const footerResponse = await fetch(`http://127.0.0.1:8000/api/navigation/?project=${DEFAULT_PROJECT_ID}&location=footer&locale=${locale}`);
      const footerData = await footerResponse.json();
      console.log("[WORKING VERSION] Footer data:", footerData);

      // Set header items
      setHeaderItems(headerData);

      // Group footer items by column
      const grouped: Record<number, ApiNavigationItem[]> = {};
      for (const item of footerData) {
        const col = item.column ?? 1;
        if (!grouped[col]) grouped[col] = [];
        grouped[col].push(item);
      }

      // Sort items within each column by order
      Object.keys(grouped).forEach((key) => {
        grouped[Number(key)] = grouped[Number(key)].sort(
          (a, b) => a.order - b.order,
        );
      });

      setFooterColumns(grouped);
      console.log("[WORKING VERSION] Navigation loaded successfully:", { 
        headerCount: headerData.length,
        footerColumns: Object.keys(grouped).length 
      });
      
      setLoading(false);
    } catch (err: any) {
      console.error("[WORKING VERSION] Error loading navigation:", err);
      setError(err?.message ?? "Failed to load navigation");
      setLoading(false);
    }
  }, [locale]);

  return { headerItems, footerColumns, loading, error, loadNavigation };
}