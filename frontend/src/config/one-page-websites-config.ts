import type { PageConfig } from "@/types/page-config";

export const defaultOnePageWebsitesConfig: PageConfig = {
  sections: [
    {
      id: "jcw-onepage-hero01",
      title: "One page websites – hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "One Page Website",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "The fastest way to go online. One clean, professional page that says who you are, what you do, and how to contact you.",
        },
      ],
    },
    {
      id: "jcw-onepage-overview01",
      title: "Overview",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          type: "text",
          value: "Perfect for small businesses and freelancers",
        },
        {
          id: "body",
          label: "Overview text",
          type: "textarea",
          value:
            "If you just need to appear online – fast, simple and reliable – the One Page Website is your best starting point.",
        },
      ],
    },
    {
      id: "jcw-onepage-included01",
      title: "What's included",
      internalName: "What's included",
      fields: [
        {
          id: "title",
          label: "Included title",
          type: "text",
          value: "What you get",
        },
        {
          id: "subtitle",
          label: "Included subtitle",
          type: "textarea",
          value: "One page, all basics covered:",
        },
      ],
    },
    {
      id: "jcw-onepage-benefits01",
      title: "Benefits",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          type: "text",
          value: "Why choose a One Page Website?",
        },
        {
          id: "subtitle",
          label: "Benefits subtitle",
          type: "textarea",
          value: "Fast to set up, easy to maintain, mobile-friendly by default.",
        },
      ],
    },
  ],
};