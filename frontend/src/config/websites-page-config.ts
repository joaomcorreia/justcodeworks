import type { PageConfig } from "@/types/page-config";

export const defaultWebsitesPageConfig: PageConfig = {
  sections: [
    {
      id: "jcw-main-websites-hero01",
      title: "Hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "Websites that work as hard as you do",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "From simple one-page sites to complete business websites and online stores – all built on the same JCW foundation.",
        },
      ],
    },
    {
      id: "jcw-main-websites-intro01",
      title: "Intro",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          type: "text",
          value: "Choose the type of website that fits you",
        },
        {
          id: "body",
          label: "Intro text",
          type: "textarea",
          value:
            "Whether you need a quick landing page or a full-featured business website, we have a solution that fits your needs and budget.",
        },
      ],
    },
    {
      id: "jcw-main-websites-plans01",
      title: "Plans",
      internalName: "Plans section",
      fields: [
        {
          id: "title",
          label: "Plans title",
          type: "text",
          value: "Website plans starting from €99",
        },
        {
          id: "subtitle",
          label: "Plans subtitle",
          type: "textarea",
          value:
            "Start with a basic one-page site or go straight to a full multi-page website or store.",
        },
      ],
    },
    {
      id: "jcw-main-websites-promise01",
      title: "Promise section",
      internalName: "Promise section",
      fields: [
        {
          id: "title",
          label: "Promise title",
          type: "text",
          value: "Every plan comes with our core promise",
        },
        {
          id: "body",
          label: "Promise text",
          type: "textarea",
          value:
            "Secure hosting, backups, and upgrade paths so your site can grow with your business.",
        },
      ],
    },
  ],
};