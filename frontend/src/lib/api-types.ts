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