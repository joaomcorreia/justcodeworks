export type OnePageSectionId =
  | "jcw-main-onepage-hero01"
  | "jcw-main-onepage-overview01"
  | "jcw-main-onepage-included01"
  | "jcw-main-onepage-benefits01";

export type OnePageTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type OnePageSectionConfig = {
  id: OnePageSectionId;
  internalName: string;
  fields: OnePageTextBlock[];
};

export type OnePagePageConfig = {
  sections: OnePageSectionConfig[];
};

export const defaultOnePagePageConfig: OnePagePageConfig = {
  sections: [
    {
      id: "jcw-main-onepage-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "One Page Website",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "The fastest way to go online. One clean, professional page that says who you are, what you do, and how to contact you.",
        },
      ],
    },
    {
      id: "jcw-main-onepage-overview01",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          value: "Perfect for small businesses and freelancers",
        },
        {
          id: "body",
          label: "Overview text",
          value:
            "If you just need to appear online – fast, simple and reliable – the One Page Website is your best starting point.",
        },
      ],
    },
    {
      id: "jcw-main-onepage-included01",
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
            "*Custom forms can be added depending on your plan or setup preferences.",
        },
      ],
    },
    {
      id: "jcw-main-onepage-benefits01",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          value: "Why choose a One Page Website?",
        },
        {
          id: "body",
          label: "Benefits closing text",
          value:
            "When you're ready to expand, your One Page Website can easily be upgraded to a full multi-page site – no need to start over.",
        },
      ],
    },
  ],
};
