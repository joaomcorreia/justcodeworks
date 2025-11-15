export type SeoSectionId =
  | "jcw-main-seo-hero01"
  | "jcw-main-seo-overview01"
  | "jcw-main-seo-included01"
  | "jcw-main-seo-benefits01";

export type SeoTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type SeoSectionConfig = {
  id: SeoSectionId;
  internalName: string;
  fields: SeoTextBlock[];
};

export type SeoPageConfig = {
  sections: SeoSectionConfig[];
};

export const defaultSeoPageConfig: SeoPageConfig = {
  sections: [
    {
      id: "jcw-main-seo-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Search engine optimization (SEO)",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Simple, practical SEO work so your website can be found by the right people – not just 'anyone' on Google.",
        },
      ],
    },
    {
      id: "jcw-main-seo-overview01",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          value: "Focused on the keywords that actually matter",
        },
        {
          id: "body",
          label: "Overview text",
          value:
            "We look at what your customers are already searching for and adjust your pages, structure and content around that.",
        },
      ],
    },
    {
      id: "jcw-main-seo-included01",
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
            "We keep SEO recommendations realistic for small businesses – no fake promises or 'instant ranking' tricks.",
        },
      ],
    },
    {
      id: "jcw-main-seo-benefits01",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          value: "Why choose SEO with JCW?",
        },
        {
          id: "body",
          label: "Benefits closing text",
          value:
            "You don't have to become an SEO expert – we translate everything into clear actions and results.",
        },
      ],
    },
  ],
};
