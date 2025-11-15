// [RMOD]
export type FieldJson = {
  key: string;
  label: string;
  value: string;
  order: number;
};

export type SectionJson = {
  id: number | string;  // Database ID for API calls
  identifier: string;   // e.g. "hero-banner", "about-us", "contact-info"
  internal_name: string;
  order: number;
  fields: FieldJson[];
};

// [SEO] SEO metadata for each page
export type SeoJson = {
  meta_title: string;
  meta_description: string;
  slug: string;
  indexable: boolean;
};

export type PageJson = {
  id: number | string;
  slug: string;  // e.g. "home"
  path: string;
  title: string;
  order: number;
  is_published: boolean;
  locale: string;
  sections: SectionJson[];
  seo: SeoJson;
};

// [SEO]
export type PageSeoUpdatePayload = {
  meta_title?: string;
  meta_description?: string;
  meta_slug?: string;
  indexable?: boolean;
};

// [CONTENT]
export type FieldUpdatePayload = {
  key: string;
  value: string;
};

export type SectionContentUpdatePayload = {
  fields: FieldUpdatePayload[];
};

export type SiteProjectPublic = {
  id: string;
  name: string;
  slug: string;
  site_template_key: string; // e.g. "restaurant-modern"
  pages: PageJson[];
};