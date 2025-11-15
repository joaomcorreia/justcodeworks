export type UtilitiesSectionId =
  | "jcw-main-utilities-hero01"
  | "jcw-main-utilities-intro01"
  | "jcw-main-utilities-grid01";

export type UtilitiesTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type UtilitiesSectionConfig = {
  id: UtilitiesSectionId;
  internalName: string;
  fields: UtilitiesTextBlock[];
};

export type UtilitiesPageConfig = {
  sections: UtilitiesSectionConfig[];
};

export const defaultUtilitiesPageConfig: UtilitiesPageConfig = {
  sections: [
    {
      id: "jcw-main-utilities-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Utilities & tools",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Small, practical tools you can use while working on your website, content and assets.",
        },
      ],
    },
    {
      id: "jcw-main-utilities-intro01",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          value: "Use them for your own site or client work",
        },
        {
          id: "body",
          label: "Intro text",
          value:
            "Everything runs in the browser – no login needed. More tools will be added over time.",
        },
      ],
    },
    {
      id: "jcw-main-utilities-grid01",
      internalName: "Utilities grid",
      fields: [
        {
          id: "title",
          label: "Grid title",
          value: "Available tools",
        },
        {
          id: "subtitle",
          label: "Grid subtitle",
          value:
            "QR generator, image tools, JSON viewer, password helpers and simple status checks.",
        },
      ],
    },
  ],
};
