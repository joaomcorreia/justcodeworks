import type { ApiPageSnapshot, ApiSection, ApiField } from "@/lib/api";
import type {
  HomepageConfig,
  HomepageSectionConfig,
  TextBlock,
  HomepageSectionId,
} from "@/config/homepage-sections";
import type { PageConfig, PageConfigField, PageConfigSection } from "@/types/page-config";

/**
 * Maps a backend API field to a frontend TextBlock.
 */
function mapApiFieldToTextBlock(apiField: ApiField): TextBlock {
  return {
    id: apiField.key,
    label: apiField.label || apiField.key,
    value: apiField.value ?? "",
    backendFieldId: apiField.id,
  };
}

/**
 * Maps a backend API section to a frontend HomepageSectionConfig.
 */
function mapApiSectionToHomepageSectionConfig(
  apiSection: ApiSection,
): HomepageSectionConfig {
  return {
    id: apiSection.identifier as HomepageSectionId,
    internalName: apiSection.internal_name || apiSection.identifier,
    fields: apiSection.fields.map(mapApiFieldToTextBlock),
  };
}

/**
 * Converts a backend page snapshot into the frontend HomepageConfig structure.
 */
export function mapSnapshotToHomepageConfig(
  snapshot: ApiPageSnapshot,
): HomepageConfig {
  return {
    sections: snapshot.sections
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(mapApiSectionToHomepageSectionConfig),
    heroSettings: {
      enabled: true, // Default, can be stored in backend later
    },
  };
}

/**
 * Updates a single field in HomepageConfig when backend returns the new value.
 */
export function applyFieldUpdateToHomepageConfig(
  config: HomepageConfig,
  backendField: ApiField,
): HomepageConfig {
  return {
    ...config,
    sections: config.sections.map((section) => ({
      ...section,
      fields: section.fields.map((f) => {
        if (f.backendFieldId === backendField.id) {
          return {
            ...f,
            value: backendField.value ?? "",
          };
        }
        return f;
      }),
    })),
  };
}

// Generic versions for any PageConfig

/**
 * Maps a backend API field to a generic PageConfigField.
 */
function mapApiFieldToPageConfigField(apiField: ApiField): PageConfigField {
  return {
    id: apiField.key,
    label: apiField.label || apiField.key,
    type: "text", // Default type, can be enhanced later
    value: apiField.value ?? "",
    backendFieldId: apiField.id,
  };
}

/**
 * Maps a backend API section to a generic PageConfigSection.
 */
function mapApiSectionToPageConfigSection(
  apiSection: ApiSection,
): PageConfigSection {
  return {
    id: apiSection.identifier,
    title: apiSection.internal_name,
    internalName: apiSection.internal_name || apiSection.identifier,
    fields: apiSection.fields.map(mapApiFieldToPageConfigField),
  };
}

/**
 * Converts a backend page snapshot into the generic PageConfig structure.
 */
export function mapSnapshotToPageConfig(
  snapshot: ApiPageSnapshot,
): PageConfig {
  return {
    sections: snapshot.sections
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(mapApiSectionToPageConfigSection),
  };
}

/**
 * Updates a single field in generic PageConfig when backend returns the new value.
 */
export function applyFieldUpdateToPageConfig(
  config: PageConfig,
  backendField: ApiField,
): PageConfig {
  return {
    ...config,
    sections: config.sections.map((section) => ({
      ...section,
      fields: section.fields.map((f) => {
        if (f.backendFieldId === backendField.id) {
          return {
            ...f,
            value: backendField.value ?? "",
          };
        }
        return f;
      }),
    })),
  };
}
