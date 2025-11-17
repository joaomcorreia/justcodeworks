import type { DashboardPage, DashboardTemplate, AdminSiteTemplate, AdminSiteTemplateDetail, TemplateSectionData, TemplateBranding, AdminQuoteRequest, SiteProject } from "./api-types";

const API_BASE = "http://localhost:8000/api";

const DEFAULT_PROJECT_ID =
  process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID ?? null;

// Utility to get CSRF token
async function getCSRFToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/csrf/`, {
      credentials: "include",
    });
    if (res.ok) {
      // Token should now be in cookies
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
      return csrfToken || null;
    }
  } catch (e) {
    console.warn("Failed to get CSRF token:", e);
  }
  return null;
}

export type ApiTemplate = {
  id: string; // UUID from Django
  slug: string;
  name: string;
  category: string;
  complexity: string;
  short_description: string;
  long_description: string;
  recommended_for: string;
  sections_summary: string[];
  estimated_pages: number;
  has_store: boolean;
  has_blog: boolean;
  has_booking: boolean;
};

// [TEMPLAB] Template Lab types for admin interface
export type ApiSiteTemplateSummary = {
  id: number;
  name: string; 
  key: string;
  description?: string;
  category?: string;
  status?: string;
  is_active?: boolean;
  is_default_for_tenants?: boolean;
  usage_count?: number;
  sections_count?: number;
};

export type ApiTemplateSummary = {
  id: string;
  name: string;
  slug: string; 
  short_description?: string;
  category?: string;
  complexity?: string;
  estimated_pages?: number;
  has_store?: boolean;
  has_blog?: boolean; 
  has_booking?: boolean;
};

// [TEMPLAB] template fetch wiring - SiteTemplate model types
export type ApiSiteTemplate = {
  id: number;
  key: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: string;
  usage_count: number;
  version: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiSiteProject = {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  primary_goal: string | null;
  primary_locale: string;
  additional_locales: string[];
  primary_color: string | null;
  notes: string;
  is_active: boolean;
  template: ApiTemplate | null;
  template_key: string;
  template_name: string;
  created_at: string;
  updated_at: string;
  // Style and theming fields
  default_theme: "dark" | "light";
  allow_theme_toggle: boolean;
  accent_color: string | null;
  header_background_mode: string;
  hero_particles_enabled: boolean;
  hero_particles_density: number;
  hero_particles_speed: number;
  hero_particles_size: number;
};

export type HeroAnimationMode =
  | "none"
  | "fade-up"
  | "slide-left"
  | "typewriter";

export interface HeroSlide {
  id: number;
  order: number;
  is_active: boolean;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  primary_button_label: string;
  primary_button_url: string;
  secondary_button_label: string;
  secondary_button_url: string;
  image_url: string;
  animation_mode: HeroAnimationMode;
}

export type CreateSiteProjectInput = {
  name: string;
  slug: string;
  templateSlug: string | null;
  businessType: string;
  primaryGoal: string | null;
  primaryLocale: string;
  additionalLocales: string[];
  primaryColor: string;
  notes: string;
};

// [ONBOARDING] Step 0 Multi-Intent Onboarding Types
export type Step0OnboardingInput = {
  entry_intent: 'website' | 'prints' | 'pos';
  business_name: string;
  business_type?: string;
  primary_country?: string;
  primary_language?: string;
  brand_primary_color?: string;
  brand_secondary_color?: string;
  preferred_theme_mode?: 'light' | 'dark' | 'auto';
  primary_goal?: string;
  onboarding_notes?: string;
};

export type Step0OnboardingResponse = {
  success: boolean;
  project?: ApiSiteProject;
  redirect_url?: string;
  errors?: Record<string, string[]>;
};

/**
 * Fetch all templates from the backend.
 */
// Legacy function for old Template model (keep for compatibility)
export async function fetchTemplatesFromApi(): Promise<ApiTemplate[]> {
  const res = await fetch(`${API_BASE}/templates/`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch templates (${res.status})`);
  }

  const data = (await res.json()) as ApiTemplate[];
  return data;
}

// [TEMPLAB] template fetch wiring - new SiteTemplate fetch with session auth
export async function fetchSiteTemplatesFromApi(useSessionAuth = true): Promise<ApiSiteTemplate[]> {
  const fetchOptions: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (useSessionAuth) {
    fetchOptions.credentials = "include"; // Use session cookies
  }

  const res = await fetch(`${API_BASE}/templates/`, fetchOptions);

  if (!res.ok) {
    throw new Error(`Failed to fetch templates (${res.status})`);
  }

  const data = (await res.json()) as ApiSiteTemplate[];
  return data;
}

/**
 * Helper to slugify a site name into a backend slug.
 * Simple version, can be improved later.
 */
export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 150) || "jcw-project";
}

/**
 * Create a SiteProject in the backend.
 * It:
 * - Resolves templateSlug -> template_id (UUID) using /templates/
 * - Sends builder fields to /projects/
 */
export async function createSiteProject(
  input: CreateSiteProjectInput,
): Promise<ApiSiteProject> {
  const {
    name,
    slug,
    templateSlug,
    businessType,
    primaryGoal,
    primaryLocale,
    additionalLocales,
    primaryColor,
    notes,
  } = input;

  let template_id: string | null = null;

  if (templateSlug) {
    try {
      const templates = await fetchTemplatesFromApi();
      const match = templates.find((t) => t.slug === templateSlug);
      if (match) {
        template_id = match.id;
      }
    } catch (err) {
      // If templates cannot be loaded, we keep template_id as null.
      console.warn("Could not resolve templateSlug to backend template id:", err);
    }
  }

  const payload: any = {
    name,
    slug,
    template_id: template_id ?? undefined,
    business_type: businessType,
    primary_goal: primaryGoal,
    primary_locale: primaryLocale,
    additional_locales: additionalLocales,
    primary_color: primaryColor,
    notes,
    is_active: true,
  };

  const res = await fetch(`${API_BASE}/projects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `Failed to create project (${res.status})`;
    try {
      const data = await res.json();
      if (data && typeof data === "object") {
        message += `: ${JSON.stringify(data)}`;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const data = (await res.json()) as ApiSiteProject;
  return data;
}

/**
 * Fetch all projects from the backend.
 */
export async function fetchProjects(
  accessToken?: string | null,
): Promise<ApiSiteProject[]> {
  const headers: HeadersInit = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}/projects/`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch projects (${res.status})`);
  }

  const data = (await res.json()) as ApiSiteProject[];
  return data;
}

/**
 * Fetch a specific project by ID.
 */
export async function fetchProjectById(
  projectId: string,
  accessToken?: string | null,
): Promise<ApiSiteProject> {
  const headers: HeadersInit = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}/projects/${projectId}/`, {
    method: "GET",
    headers: {
      ...headers,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch project ${projectId} (${res.status})`);
  }

  const data = (await res.json()) as ApiSiteProject;
  return data;
}

/**
 * Fetch pages for a specific project.
 */
export async function fetchPagesForProject(
  projectId: string,
  accessToken?: string | null,
): Promise<ApiPage[]> {
  const headers: HeadersInit = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(
    `${API_BASE}/pages/?project=${encodeURIComponent(projectId)}`,
    {
      method: "GET",
      headers,
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch pages (${res.status})`);
  }

  const data = (await res.json()) as ApiPage[];
  return data;
}

// Page & Snapshot API Types
export type ApiPage = {
  id: number;
  project: string;
  slug: string;
  path: string;
  title: string;
  locale: string;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ApiField = {
  id: number;
  key: string;
  label: string;
  value: string;
};

export type ApiSection = {
  id: number;
  identifier: string;
  internal_name: string;
  order: number;
  fields: ApiField[];
};

export type ApiPageSnapshot = {
  id: number;
  project: string;
  slug: string;
  path: string;
  title: string;
  order: number;
  is_published: boolean;
  locale: string;
  sections: ApiSection[];
  hero_slides: HeroSlide[];
};

/**
 * Fetch a page by slug for a given project, then return its snapshot.
 * Returns null if page doesn't exist or API fails.
 */
export async function fetchPageBySlug(
  slug: string,
  projectId?: string | null,
  locale?: string,
): Promise<ApiPageSnapshot | null> {
  const project = projectId ?? DEFAULT_PROJECT_ID;
  if (!project) {
    console.warn("No projectId configured for fetchPageBySlug");
    return null;
  }

  try {
    // First, find the page id
    let url = `${API_BASE}/pages/?project=${encodeURIComponent(
      project,
    )}&slug=${encodeURIComponent(slug)}`;
    
    if (locale) {
      url += `&locale=${encodeURIComponent(locale)}`;
    }
    
    const listRes = await fetch(url, {
      method: "GET",
    });

    if (!listRes.ok) {
      console.error("Failed to list pages", listRes.status);
      return null;
    }

    const listData = (await listRes.json()) as any[];
    if (!Array.isArray(listData) || listData.length === 0) {
      return null;
    }

    const pageId = listData[0].id;

    // Fetch the snapshot
    const snapRes = await fetch(`${API_BASE}/pages/${pageId}/snapshot/`, {
      method: "GET",
    });

    if (!snapRes.ok) {
      console.error("Failed to fetch page snapshot", snapRes.status);
      return null;
    }

    const snapshot = (await snapRes.json()) as ApiPageSnapshot;
    return snapshot;
  } catch (err) {
    console.error("Error fetching page by slug:", err);
    return null;
  }
}

/**
 * Update a single field value on the backend.
 */
export async function updatePageSectionField(
  fieldId: number,
  value: string,
): Promise<ApiField> {
  const res = await fetch(`${API_BASE}/fields/${fieldId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });

  if (!res.ok) {
    let message = `Failed to update field (${res.status})`;
    try {
      const data = await res.json();
      message += `: ${JSON.stringify(data)}`;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await res.json()) as ApiField;
  return data;
}

// Bug Report Types and Functions
export type BugReportPayload = {
  project?: string | null;
  pagePath?: string;
  pageSlug?: string;
  userEmail?: string;
  userName?: string;
  summary: string;
  description?: string;
  locale?: string;
  extraMeta?: Record<string, any>;
  screenshotDataUrl?: string; // data URL string
};

export async function createBugReport(
  payload: BugReportPayload,
): Promise<void> {
  const body: any = {
    project: payload.project ?? null,
    page_path: payload.pagePath ?? "",
    page_slug: payload.pageSlug ?? "",
    user_email: payload.userEmail ?? "",
    user_name: payload.userName ?? "",
    summary: payload.summary,
    description: payload.description ?? "",
    locale: payload.locale ?? "",
    extra_meta: payload.extraMeta ?? {},
    screenshot_data_url: payload.screenshotDataUrl ?? "",
  };

  console.log("Submitting bug report:", body);

  const res = await fetch(`${API_BASE}/bug-reports/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log("Bug report response status:", res.status);

  if (!res.ok) {
    let message = `Failed to create bug report (${res.status})`;
    try {
      const data = await res.json();
      console.error("Bug report error response:", data);
      message += `: ${JSON.stringify(data)}`;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  console.log("Bug report created successfully");
}

// Bug Report Admin Types and Functions
export type BugReportStatus =
  | "new"
  | "triaged"
  | "in_progress"
  | "resolved"
  | "closed";

export type ApiBugScreenshot = {
  id: string;
  image: string; // URL from Django media
  description: string;
  created_at: string;
};

export type ApiBugReport = {
  id: string;
  project: string | null;
  page_path: string;
  page_slug: string;
  user_email: string;
  user_name: string;
  summary: string;
  description: string;
  status: BugReportStatus;
  user_agent: string;
  locale: string;
  extra_meta: Record<string, any>;
  screenshots: ApiBugScreenshot[];
  created_at: string;
  updated_at: string;
};

export async function fetchBugReports(
  params?: {
    projectId?: string;
    status?: BugReportStatus;
  },
  accessToken?: string | null,
): Promise<ApiBugReport[]> {
  const query = new URLSearchParams();
  if (params?.projectId) {
    query.set("project", params.projectId);
  }
  if (params?.status) {
    query.set("status", params.status);
  }

  const qs = query.toString();
  const url = `${API_BASE}/bug-reports/${qs ? `?${qs}` : ""}`;

  const headers: HeadersInit = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch bug reports (${res.status})`);
  }

  const data = (await res.json()) as ApiBugReport[];
  return data;
}

export async function fetchBugReport(
  id: string,
  accessToken?: string | null,
): Promise<ApiBugReport> {
  const headers: HeadersInit = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}/bug-reports/${id}/`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch bug report (${res.status})`);
  }

  const data = (await res.json()) as ApiBugReport;
  return data;
}

export async function updateBugReportStatus(
  id: string,
  status: BugReportStatus,
  accessToken?: string | null,
): Promise<ApiBugReport> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}/bug-reports/${id}/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    let message = `Failed to update bug report (${res.status})`;
    try {
      const data = await res.json();
      message += `: ${JSON.stringify(data)}`;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = (await res.json()) as ApiBugReport;
  return data;
}

// Navigation API Types and Functions
export type ApiNavigationItem = {
  id: number;
  project: string;
  parent: number | null;
  location: "header" | "footer";
  column: number | null;
  label: string;
  page: number | null;
  page_slug: string | null;
  page_path: string | null;
  url: string;
  is_external: boolean;
  order: number;
};

export async function fetchNavigationItems(params: {
  projectId: string;
  location: "header" | "footer";
  column?: number;
  locale?: string;
}): Promise<ApiNavigationItem[]> {
  const query = new URLSearchParams();
  query.set("project", params.projectId);
  query.set("location", params.location);
  if (typeof params.column === "number") {
    query.set("column", String(params.column));
  }
  if (params.locale) {
    query.set("locale", params.locale);
  }

  const url = `${API_BASE}/navigation/?${query.toString()}`;
  console.log("[fetchNavigationItems] Making request to:", url);
  
  const res = await fetch(url, {
    method: "GET",
  });

  console.log("[fetchNavigationItems] Response status:", res.status);

  if (!res.ok) {
    console.error("[fetchNavigationItems] Request failed:", res.status, res.statusText);
    throw new Error(`Failed to fetch navigation items (${res.status}): ${res.statusText}`);
  }

  const data = (await res.json()) as ApiNavigationItem[];
  console.log("[fetchNavigationItems] Parsed data:", data);
  return data;
}

export async function fetchMyPages(
  accessToken?: string | null,
  params?: {
    project_slug?: string;
    locale?: string;
  }
): Promise<DashboardPage[]> {
  const query = new URLSearchParams();
  if (params?.project_slug) query.set("project_slug", params.project_slug);
  if (params?.locale) query.set("locale", params.locale);

  const url = `${API_BASE}/pages/my/${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to load pages (${res.status})`);
  }

  return res.json();
}

export async function fetchTenantDashboardTemplate(
  accessToken?: string | null
): Promise<DashboardTemplate> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}/dashboard/template/`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    throw new Error(`Failed to load dashboard template (${res.status})`);
  }

  return res.json();
}

export async function fetchAdminSiteTemplates(params?: {
  type?: string;
  status?: string;
}): Promise<AdminSiteTemplate[]> {
  const query = new URLSearchParams();
  if (params?.type) query.set("type", params.type);
  if (params?.status) query.set("status", params.status);

  const url = `${API_BASE}/admin/templates/${query.toString() ? `?${query.toString()}` : ""}`;
  console.log("🌐 Fetching:", url);
  
  // First, ensure we have a CSRF token
  let csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
    
  if (!csrfToken) {
    console.log("🔄 Getting CSRF token...");
    const newToken = await getCSRFToken();
    if (newToken) {
      csrfToken = newToken;
    }
  }
    
  console.log("🔐 CSRF token:", csrfToken ? "Found" : "Not found");
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers,
  });

  console.log("📊 Response status:", res.status);
  console.log("📋 Response headers:", Object.fromEntries(res.headers.entries()));

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ API Error:", res.status, errorText);
    throw new Error(`Failed to load admin templates (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  console.log("📦 Response data:", data);
  return data;
}

export async function fetchAdminSiteTemplateDetail(
  templateId: number
): Promise<AdminSiteTemplateDetail> {
  const res = await fetch(`${API_BASE}/admin/templates/${templateId}/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load template detail");
  }

  return res.json();
}

export async function fetchAdminSiteTemplateDetailByKey(
  templateKey: string
): Promise<AdminSiteTemplateDetail> {
  const res = await fetch(`${API_BASE}/admin/templates/key/${templateKey}/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load template detail for key: ${templateKey}`);
  }

  return res.json();
}

export async function fetchTemplateSections(
  templateId: number
): Promise<TemplateSectionData[]> {
  const res = await fetch(`${API_BASE}/admin/templates/${templateId}/sections/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load template sections");
  }

  return res.json();
}

export async function fetchTemplateBranding(
  templateId: number
): Promise<TemplateBranding> {
  const res = await fetch(`${API_BASE}/admin/templates/${templateId}/branding/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load template branding");
  }

  return res.json();
}

export async function updateTemplateBranding(
  templateId: number,
  branding: Partial<TemplateBranding>
): Promise<TemplateBranding> {
  const res = await fetch(`${API_BASE}/admin/templates/${templateId}/branding/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(branding),
  });

  if (!res.ok) {
    throw new Error("Failed to update template branding");
  }

  return res.json();
}

// [TEMPLAB] template assign fetch wiring - centralized API helpers with session auth
export async function fetchProjectByIdWithSession(projectId: string): Promise<ApiSiteProject> {
  const res = await fetch(`${API_BASE}/projects/${projectId}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Use session cookies
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch project ${projectId} (${res.status})`);
  }

  return res.json();
}

// [TEMPLAB] Template Lab admin API helpers
export async function fetchTemplateLabSiteTemplates(): Promise<ApiSiteTemplateSummary[]> {
  const res = await fetch(`${API_BASE}/admin/templates/site/`, {
    credentials: "include", // Use session cookies for staff auth
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch site templates (${res.status})`);
  }

  return res.json();
}

export async function fetchTemplateLabInternalTemplates(): Promise<ApiTemplateSummary[]> {
  const res = await fetch(`${API_BASE}/admin/templates/internal/`, {
    credentials: "include", // Use session cookies for staff auth
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch internal templates (${res.status})`);
  }

  return res.json();
}

export async function assignTemplateToProject(projectId: string, templateId: number): Promise<any> {
  // [TEMPLAB] template assign fetch wiring - ensure CSRF token for session auth
  const csrfToken = await getCSRFToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }
  
  const res = await fetch(`${API_BASE}/projects/${projectId}/set-template/`, {
    method: "POST",
    headers,
    credentials: "include", // Use session cookies
    body: JSON.stringify({ template_id: templateId }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Failed to assign template (${res.status}): ${errorText}`);
  }

  return res.json();
}


// [GARAGE-FORM] Admin Quote Requests API Functions
export async function fetchAdminQuoteRequests(params?: {
  site_slug?: string;
  locale?: string;
}): Promise<AdminQuoteRequest[]> {
  const query = new URLSearchParams();
  if (params?.site_slug && params.site_slug !== 'all') {
    query.set("site_slug", params.site_slug);
  }
  if (params?.locale && params.locale !== 'all') {
    query.set("locale", params.locale);
  }

  const url = `${API_BASE}/admin/quote-requests/${query.toString() ? `?${query.toString()}` : ""}`;
  console.log("🌐 Fetching quote requests:", url);
  
  // Get CSRF token
  let csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
    
  if (!csrfToken) {
    console.log("🔄 Getting CSRF token...");
    const newToken = await getCSRFToken();
    if (newToken) {
      csrfToken = newToken;
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers,
  });

  console.log("📊 Quote requests response status:", res.status);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Quote requests API Error:", res.status, errorText);
    throw new Error(`Failed to load quote requests (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  console.log("📦 Quote requests data:", data);
  return data;
}

export async function fetchAdminQuoteRequestDetail(
  quoteId: number
): Promise<AdminQuoteRequest> {
  const url = `${API_BASE}/admin/quote-requests/${quoteId}/`;
  console.log("🌐 Fetching quote request detail:", url);
  
  // Get CSRF token
  let csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
    
  if (!csrfToken) {
    const newToken = await getCSRFToken();
    if (newToken) {
      csrfToken = newToken;
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Quote request detail API Error:", res.status, errorText);
    throw new Error(`Failed to load quote request detail (${res.status}): ${errorText}`);
  }

  return res.json();
}

// [TEMPLAB] Template Preview - Sample Site Mapping
export async function fetchTemplateSampleSite(templateKey: string): Promise<{template_key: string, sample_site_slug: string}> {
  const url = `${API_BASE}/admin/templates/${templateKey}/sample-site/`;
  console.log("🌐 Fetching template sample site:", url);
  
  // Get CSRF token
  let csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
    
  if (!csrfToken) {
    const newToken = await getCSRFToken();
    if (newToken) {
      csrfToken = newToken;
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Template sample site API Error:", res.status, errorText);
    throw new Error(`Failed to load template sample site (${res.status}): ${errorText}`);
  }

  return res.json();
}

// Helper function to fetch site projects for filter dropdown
export async function fetchSiteProjects(): Promise<SiteProject[]> {
  const url = `${API_BASE}/admin/site-projects/`;
  console.log("🌐 Fetching site projects:", url);
  
  // Get CSRF token
  let csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
    
  if (!csrfToken) {
    const newToken = await getCSRFToken();
    if (newToken) {
      csrfToken = newToken;
    }
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Site projects API Error:", res.status, errorText);
    throw new Error(`Failed to load site projects (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.map((project: any) => ({
    id: project.id,
    name: project.name,
    slug: project.slug
  }));
}

// [TEMPLAB] Fetch public site data for template preview
export async function fetchSitePublic(siteSlug: string, locale: string = 'en'): Promise<any> {
  const url = `${API_BASE}/sites/${siteSlug}/public/?locale=${locale}`;
  console.log("🌐 Fetching site public data:", url);
  
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Site public API Error:", res.status, errorText);
    throw new Error(`Failed to load site public data (${res.status}): ${errorText}`);
  }

  return res.json();
}

// [ONBOARDING] Step 0 Multi-Intent Onboarding Submission
export async function submitStep0Onboarding(
  data: Step0OnboardingInput, 
  useSessionAuth = true
): Promise<Step0OnboardingResponse> {
  const url = `${API_BASE}/onboarding/step-0/`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (useSessionAuth) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
  }
  
  // Add CSRF token if available
  const csrfToken = await getCSRFToken();
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorResponse = await res.json().catch(() => ({}));
    console.error("❌ Step 0 Onboarding Error:", res.status, errorResponse);
    
    // Return error structure that matches our expected response type
    return {
      success: false,
      errors: errorResponse.errors || { general: ['Failed to submit onboarding data'] }
    };
  }
  
  return res.json();
}

// [TEMPLAB] Create a reusable TemplateSection from an existing Section
export async function createTemplateSectionFromSection(
  sectionId: string | number, 
  name?: string, 
  key?: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/template-sections/from-section/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      section_id: sectionId,
      name: name,
      key: key
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to create template section (${res.status})`);
  }

  return res.json();
}

// [API] Simple API client object for convenience
export const api = {
  post: async (url: string, data: any) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
    const token = localStorage.getItem('access_token');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = await getCSRFToken();
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
    
    const res = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      credentials: 'include',
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed (${res.status})`);
    }
    
    return res;
  },
  
  get: async (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
    const token = localStorage.getItem('access_token');
    
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(fullUrl, {
      method: 'GET',
      headers,
      credentials: 'include',
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Request failed (${res.status})`);
    }
    
    return res;
  }
};
