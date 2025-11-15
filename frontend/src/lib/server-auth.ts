import { cookies } from "next/headers";
import type { DashboardPage, DashboardTemplate } from "./api-types";

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isStaff?: boolean;
  isSuperuser?: boolean;
};

const API_BASE = "http://localhost:8000/api";

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get Django session cookies
    const cookieStore = cookies();
    const sessionId = cookieStore.get("sessionid")?.value;
    const csrfToken = cookieStore.get("csrftoken")?.value;
    
    console.log('[SERVER AUTH DEBUG] Available cookies:', Array.from(cookieStore.getAll().map(c => `${c.name}=${c.value}`)));
    console.log('[SERVER AUTH DEBUG] Session ID:', sessionId ? 'YES' : 'NO');
    console.log('[SERVER AUTH DEBUG] CSRF Token:', csrfToken ? 'YES' : 'NO');
    
    // If no session cookie, user is not authenticated
    if (!sessionId) {
      console.log('[SERVER AUTH DEBUG] No session ID found, returning null');
      return null;
    }

    // Forward session cookies to Django backend
    const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

    console.log('[SERVER AUTH DEBUG] Making request to Django with cookies:', cookieHeader);
    
    const response = await fetch(`${API_BASE}/auth/me/`, {
      method: "GET",
      headers: {
        "Cookie": cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh user data
    });

    console.log('[SERVER AUTH DEBUG] Django response status:', response.status);

    if (!response.ok) {
      console.log('[SERVER AUTH DEBUG] Django response not OK, returning null');
      return null;
    }

    const data = await response.json();
    
    // Handle both authenticated and non-authenticated responses
    if (!data.authenticated || !data.user) {
      return null;
    }

    const userData = data.user;
    return {
      id: userData.id?.toString() || userData.pk?.toString(),
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      isStaff: userData.is_staff,
      isSuperuser: userData.is_superuser,
    };
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function getMyPages(params?: {
  project_slug?: string;
  locale?: string;
}): Promise<DashboardPage[]> {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("sessionid")?.value;
    const csrfToken = cookieStore.get("csrftoken")?.value;
    
    if (!sessionId) {
      return [];
    }

    const query = new URLSearchParams();
    if (params?.project_slug) query.set("project_slug", params.project_slug);
    if (params?.locale) query.set("locale", params.locale);

    const url = `${API_BASE}/pages/my/${
      query.toString() ? `?${query.toString()}` : ""
    }`;

    const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Cookie": cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh data
    });

    if (!response.ok) {
      console.error(`Failed to fetch pages: ${response.status}`);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return [];
  }
}

export async function getTenantDashboardTemplate(): Promise<DashboardTemplate | null> {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("sessionid")?.value;
    const csrfToken = cookieStore.get("csrftoken")?.value;
    
    if (!sessionId) {
      return null;
    }

    const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

    const response = await fetch(`${API_BASE}/dashboard/template/`, {
      method: "GET",
      headers: {
        "Cookie": cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Always fetch fresh template data
    });

    if (!response.ok) {
      console.error(`Failed to fetch dashboard template: ${response.status}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch dashboard template:", error);
    return null;
  }
}