"use client";

// [RMOD]
import { useEffect, useState } from "react";
import type { SiteProjectPublic } from "@/lib/types/sitePublic";

const API_BASE = "http://127.0.0.1:8000/api";

export function useSitePublic(slug: string) {
  const [data, setData] = useState<SiteProjectPublic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/sites/${slug}/public/`);
        
        if (!response.ok) {
          throw new Error(`Failed to load site: ${response.status}`);
        }
        
        const siteData = await response.json();
        
        if (!isMounted) return;
        setData(siteData);
      } catch (err: any) {
        console.error("Failed to load site public data", err);
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load site");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  return { data, loading, error };
}