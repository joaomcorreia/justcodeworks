import type { PageConfig } from "@/types/page-config";

export const defaultPrintPageConfig: PageConfig = {
  sections: [
    {
      id: "jcw-print-hero01",
      title: "Print & merch – hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "Print & Merch",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "Business cards, flyers, clothing and gifts that match your website and brand.",
        },
      ],
    },
    {
      id: "jcw-print-intro01",
      title: "Intro",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          type: "text",
          value: "Your offline and online branding in sync",
        },
        {
          id: "body",
          label: "Intro text",
          type: "textarea",
          value:
            "Keep your brand consistent across web, print and what your customers actually hold in their hands.",
        },
      ],
    },
    {
      id: "jcw-print-grid01",
      title: "Print categories",
      internalName: "Print categories",
      fields: [
        {
          id: "title",
          label: "Categories title",
          type: "text",
          value: "What we print for you",
        },
        {
          id: "subtitle",
          label: "Categories subtitle",
          type: "textarea",
          value: "From business essentials to branded merchandise:",
        },
      ],
    },
  ],
};