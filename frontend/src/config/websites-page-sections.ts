export type WebsitesSectionId =
  | "jcw-main-websites-hero01"
  | "jcw-main-websites-intro01"
  | "jcw-main-websites-plans01"
  | "jcw-main-websites-promise01";

export type WebsitesTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type WebsitesSectionConfig = {
  id: WebsitesSectionId;
  internalName: string;
  fields: WebsitesTextBlock[];
};

export type WebsitesPageConfig = {
  sections: WebsitesSectionConfig[];
};

export const defaultWebsitesPageConfig: WebsitesPageConfig = {
  sections: [
    {
      id: "jcw-main-websites-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Websites that work as hard as you do",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "From simple one-page sites to complete business websites and online stores – all built on the same JCW foundation.",
        },
      ],
    },
    {
      id: "jcw-main-websites-intro01",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          value: "Choose the type of website that fits you",
        },
        {
          id: "body",
          label: "Intro text",
          value:
            "Every Just Code Works website includes EU hosting, SSL, backups and a free domain for the first year.",
        },
      ],
    },
    {
      id: "jcw-main-websites-plans01",
      internalName: "Plans section",
      fields: [
        {
          id: "title",
          label: "Plans title",
          value: "Website plans",
        },
        {
          id: "subtitle",
          label: "Plans subtitle",
          value:
            "Start with a basic one-page site or go straight to a full multi-page website or store.",
        },
      ],
    },
    {
      id: "jcw-main-websites-promise01",
      internalName: "Promise section",
      fields: [
        {
          id: "title",
          label: "Promise title",
          value: "Every plan comes with our core promise",
        },
        {
          id: "body",
          label: "Promise text",
          value:
            "Secure hosting, backups, and upgrade paths so your site can grow with your business.",
        },
      ],
    },
  ],
};
