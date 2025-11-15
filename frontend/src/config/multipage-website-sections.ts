export type MultiPageSectionId =
  | "jcw-main-multipage-hero01"
  | "jcw-main-multipage-overview01"
  | "jcw-main-multipage-included01"
  | "jcw-main-multipage-benefits01";

export type MultiPageTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type MultiPageSectionConfig = {
  id: MultiPageSectionId;
  internalName: string;
  fields: MultiPageTextBlock[];
};

export type MultiPagePageConfig = {
  sections: MultiPageSectionConfig[];
};

export const defaultMultiPagePageConfig: MultiPagePageConfig = {
  sections: [
    {
      id: "jcw-main-multipage-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Multi page websites",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "For businesses that need more space: separate pages for services, team, portfolio, blog and more.",
        },
      ],
    },
    {
      id: "jcw-main-multipage-overview01",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          value: "Structure your content the way you work",
        },
        {
          id: "body",
          label: "Overview text",
          value:
            "Multi page sites are ideal when you have several services or want a deeper story for each part of your business.",
        },
      ],
    },
    {
      id: "jcw-main-multipage-included01",
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
            "You choose which pages you start with – more can be added later without rebuilding the site.",
        },
      ],
    },
    {
      id: "jcw-main-multipage-benefits01",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          value: "Why choose a multi page website?",
        },
        {
          id: "body",
          label: "Benefits closing text",
          value:
            "Ideal when you need separate pages for SEO, campaigns, services and future growth.",
        },
      ],
    },
  ],
};
