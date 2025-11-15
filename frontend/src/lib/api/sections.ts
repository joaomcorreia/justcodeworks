// [CONTENT]
import type { SectionContentUpdatePayload } from "@/lib/types/sitePublic";

const API_BASE = "http://localhost:8000/api";

export async function updateSectionContent(
  sectionId: string | number,
  payload: SectionContentUpdatePayload,
  accessToken?: string | null
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}/sections/${sectionId}/content/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update section content: ${res.statusText}`);
  }
  
  return res.json();
}