export interface DashboardPage {
  id: number;
  title: string;
  slug: string;
  path: string;
  locale: string;
  is_published: boolean;
  order: number;
  project_slug: string;
  project_name: string;
}

export interface DashboardBlock {
  id: number;
  key: string;
  title: string;
  description: string;
  region: string; // e.g. "main", "sidebar"
  order: number;
  is_active: boolean;
  target_route: string;
}

export interface DashboardTemplate {
  id: number;
  key: string;
  name: string;
  description: string;
  is_default_for_tenants: boolean;
  blocks: DashboardBlock[];
}

export type TemplateStatus = "draft" | "published" | "archived";

export interface AdminSiteTemplate {
  id: number;
  key: string;
  name: string;
  description: string;
  type: "website" | "email" | "landing";
  category: string;
  status: TemplateStatus;
  sections_count: number;
  usage_count: number;
  is_active: boolean;
  updated_at: string;
  created_at: string;  // [TEMPLAB] needed for template card date display
  site_count: number;  // [TEMPLAB] needed for template card usage count
  preview_image?: string;  // [TEMPLAB] template card preview scroll
}

export interface AdminSiteTemplateDetail extends AdminSiteTemplate {
  preview_image?: string;
  version?: string;
  header_logo_url?: string;
  footer_logo_url?: string;
  favicon_url?: string;
}

export interface TemplateBranding {
  id: number;
  header_logo_url: string;
  footer_logo_url: string;
  favicon_url: string;
}

export interface TemplateSectionData {
  id: number;
  key: string;
  name: string;
  type: string;
  order: number;
  is_active: boolean;
  screenshot_url?: string;
}

// [GARAGE-FORM] Quote Request types for admin interface
export interface AdminQuoteRequest {
  id: number;
  site_project_name: string;
  site_project_slug: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  license_plate: string;
  car_make_model: string;
  service_type: string;
  service_type_display: string;
  message: string;
  source_page_slug: string;
  locale: string;
  consent_marketing: boolean;
}

export interface SiteProject {
  id: string;
  name: string;
  slug: string;
}