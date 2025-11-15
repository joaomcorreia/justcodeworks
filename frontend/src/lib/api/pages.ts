// [SEO]
import type { PageSeoUpdatePayload } from "@/lib/types/sitePublic";

const API_BASE = "http://localhost:8000/api";

export async function updatePageSeo(
  pageId: string | number,
  payload: PageSeoUpdatePayload,
  accessToken?: string | null
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}/pages/${pageId}/seo/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update page SEO: ${res.statusText}`);
  }
  
  return res.json();
}