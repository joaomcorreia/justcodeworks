export type CustomSectionId =
  | "jcw-main-custom-hero01"
  | "jcw-main-custom-overview01"
  | "jcw-main-custom-included01"
  | "jcw-main-custom-benefits01";

export type CustomTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type CustomSectionConfig = {
  id: CustomSectionId;
  internalName: string;
  fields: CustomTextBlock[];
};

export type CustomPageConfig = {
  sections: CustomSectionConfig[];
};

export const defaultCustomPageConfig: CustomPageConfig = {
  sections: [
    {
      id: "jcw-main-custom-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Custom websites",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "When you need something that doesn't fit in a standard package – custom flows, integrations or layouts.",
        },
      ],
    },
    {
      id: "jcw-main-custom-overview01",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          value: "Designed around your process, not the template",
        },
        {
          id: "body",
          label: "Overview text",
          value:
            "We map how your business works and design the site, content and tools to match it.",
        },
      ],
    },
    {
      id: "jcw-main-custom-included01",
      internalName: "What's included",
      fields: [
        {
          id: "title",
          label: "Included title",
          value: "What's included",
        },
        {
          id: "note",
          label: "Small note text",
          value:
            "Custom projects are scoped individually, with a clear plan and timeline before we start.",
        },
      ],
    },
    {
      id: "jcw-main-custom-benefits01",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          value: "Why choose a custom website?",
        },
        {
          id: "body",
          label: "Benefits closing text",
          value:
            "Ideal when your website needs to connect to internal tools, APIs or a very specific customer journey.",
        },
      ],
    },
  ],
};
