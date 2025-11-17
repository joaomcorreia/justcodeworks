// [CONTENT]
import type { SectionContentUpdatePayload } from "@/lib/types/sitePublic";

const API_BASE = "http://localhost:8000/api";

export async function updateSectionContent(
  sectionId: string | number,
  payload: SectionContentUpdatePayload
) {
  // First, get a fresh CSRF token
  await fetch(`${API_BASE}/csrf/`, {
    credentials: "include",
  });

  // Get CSRF token from cookies for session auth
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }

  const res = await fetch(`${API_BASE}/sections/${sectionId}/content/`, {
    method: "PATCH",
    headers,
    credentials: "include", // Important for session cookies
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to update section content: ${res.statusText}`);
  }
  
  return res.json();
}