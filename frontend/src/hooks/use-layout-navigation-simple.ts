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
  console.log("[SIMPLE VERSION] useLayoutNavigation called with locale:", locale);
  
  const [headerItems, setHeaderItems] = useState<ApiNavigationItem[]>([]);
  const [footerColumns, setFooterColumns] = useState<Record<number, ApiNavigationItem[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[SIMPLE VERSION] useEffect started!");
    
    if (!locale) {
      console.log("[SIMPLE VERSION] No locale, skipping");
      setLoading(false);
      return;
    }

    console.log("[SIMPLE VERSION] Loading navigation for locale:", locale);
    setLoading(true);
    setError(null);

    async function loadData() {
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

        console.log("[SIMPLE VERSION] Data loaded:", { header, footerAll });

        setHeaderItems(header);

        // Group footer items by column
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
        console.error("[SIMPLE VERSION] Error loading navigation:", err);
        setError(err?.message ?? "Failed to load navigation");
        setLoading(false);
      }
    }

    loadData();
  }, [locale]);

  return { headerItems, footerColumns, loading, error };
}