/**
 * Generic page configuration types for backend integration.
 * These types are compatible with any page (homepage, websites, services, etc.)
 */

export type PageConfigField = {
  id: string;
  label: string;
  type?: "text" | "textarea" | "number" | "boolean";
  value: string;
  backendFieldId?: number; // Used when field exists in backend
};

export type PageConfigSection = {
  id: string;
  title?: string;
  internalName?: string;
  fields: PageConfigField[];
};

export type PageConfig = {
  sections: PageConfigSection[];
  // Allow for additional properties like heroSettings for homepage
  [key: string]: any;
};