import type { PageConfig } from "@/types/page-config";

export const defaultHelpCenterPageConfig: PageConfig = {
  sections: [
    {
      id: "jcw-help-hero01",
      title: "Help Center – hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "Help Center",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "Find answers, tools and ways to contact us when you need help with your website.",
        },
      ],
    },
    {
      id: "jcw-help-intro01",
      title: "Intro",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          type: "text",
          value: "Support made for small businesses",
        },
        {
          id: "body",
          label: "Intro text",
          type: "textarea",
          value:
            "Short answers and utilities to keep your site, print and POS running smoothly.",
        },
      ],
    },
    {
      id: "jcw-help-grid01",
      title: "Help categories",
      internalName: "Help categories",
      fields: [
        {
          id: "title",
          label: "Categories title",
          type: "text",
          value: "How can we help?",
        },
        {
          id: "subtitle",
          label: "Categories subtitle",
          type: "textarea",
          value: "Choose what you need help with:",
        },
      ],
    },
  ],
};