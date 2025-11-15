// [ADMIN] TypeScript types for admin template management

export type AdminSiteTemplate = {
  id: number;
  key: string;
  name: string;
  description: string;
  type: "website" | "email" | "landing";
  category: string;
  status: "draft" | "published" | "archived";
  sections_count: number;
  usage_count: number;
  is_active: boolean;
  updated_at: string;
  site_count: number;
};

export type AdminTemplate = {
  id: string; // UUID
  name: string;
  slug: string;
  short_description: string;
  category: "one-page" | "multi-page" | "store" | "booking" | "portfolio" | "custom";
  complexity: "starter" | "standard" | "advanced";
  estimated_pages: number;
  has_store: boolean;
  has_blog: boolean;
  has_booking: boolean;
};

export type AdminSiteTemplateDetail = AdminSiteTemplate & {
  preview_image?: string;
  // Any additional fields from the detail serializer
};

// [TEMPLAB] Template Section types for Template Lab
export type AdminTemplateSection = {
  id: number;
  site_template_key: string;
  identifier: string;
  internal_name: string;
  code: string;
  group: string | null;
  variant_index: number;
  default_order: number;
  is_active: boolean;
  notes: string | null;
  preview_image: string | null;
  // [TEMPLAB] Enhanced classification fields
  section_type: string;
  min_plan: "free" | "paid" | "premium";
  is_interactive: boolean;
};