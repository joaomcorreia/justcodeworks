import type { PageConfig } from "@/types/page-config";

export const defaultMultiPageWebsitesConfig: PageConfig = {
  sections: [
    {
      id: "jcw-multipage-hero01",
      title: "Multi-page websites – hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "Multi page websites",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "For businesses that need more space: separate pages for services, team, portfolio, blog and more.",
        },
      ],
    },
    {
      id: "jcw-multipage-overview01",
      title: "Overview",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          type: "text",
          value: "Structure your content the way you work",
        },
        {
          id: "body",
          label: "Overview text",
          type: "textarea",
          value:
            "Multi-page websites let you organize information clearly, improve SEO with more targeted content, and give visitors exactly what they're looking for.",
        },
      ],
    },
    {
      id: "jcw-multipage-included01",
      title: "What's included",
      internalName: "What's included",
      fields: [
        {
          id: "title",
          label: "Included title",
          type: "text",
          value: "Everything you need for a professional web presence",
        },
        {
          id: "subtitle",
          label: "Included subtitle",
          type: "textarea",
          value: "Multiple pages, clear navigation, structured for growth:",
        },
      ],
    },
    {
      id: "jcw-multipage-benefits01",
      title: "Benefits",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          type: "text",
          value: "Why choose a Multi-Page Website?",
        },
        {
          id: "subtitle",
          label: "Benefits subtitle",
          type: "textarea",
          value: "Better organization, improved SEO, room to grow your content and services.",
        },
      ],
    },
  ],
};