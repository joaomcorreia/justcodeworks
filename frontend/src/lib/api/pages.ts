// [SEO]
import type { PageSeoUpdatePayload } from "@/lib/types/sitePublic";

const API_BASE = "http://localhost:8000/api";

export async function updatePageSeo(
  pageId: string | number,
  payload: PageSeoUpdatePayload
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

  const res = await fetch(`${API_BASE}/pages/${pageId}/seo/`, {
    method: "PATCH",
    headers,
    credentials: "include", // Important for session cookies
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('SEO API Error:', {
      status: res.status,
      statusText: res.statusText,
      responseText: errorText,
      url: `${API_BASE}/pages/${pageId}/seo/`,
      payload: payload,
      headers: headers
    });
    throw new Error(`Failed to update page SEO: ${res.statusText} - ${errorText}`);
  }
  
  return res.json();
}