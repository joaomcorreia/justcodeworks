import { useEffect, useState } from "react";
import { fetchPageBySlug, type ApiPageSnapshot } from "@/lib/api";

export function usePageSnapshot(slug: string, locale?: string) {
  const [snapshot, setSnapshot] = useState<ApiPageSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPageBySlug(slug, null, locale);
        if (!cancelled) {
          setSnapshot(data);
          setLoading(false);
        }
      } catch (err: any) {
        console.error(`Failed to load page snapshot '${slug}':`, err);
        if (!cancelled) {
          setError(`Could not load page '${slug}' snapshot`);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  return { snapshot, loading, error };
}