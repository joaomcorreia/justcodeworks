import type { PageConfig } from "@/types/page-config";

export const defaultServicesPageConfig: PageConfig = {
  sections: [
    {
      id: "jcw-main-services-hero01",
      title: "Hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "Services that support your website and growth",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "Search, social and continuous improvements so your site doesn't just exist – it performs.",
        },
      ],
    },
    {
      id: "jcw-main-services-intro01",
      title: "Intro",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          type: "text",
          value: "Keep your online presence moving",
        },
        {
          id: "body",
          label: "Intro text",
          type: "textarea",
          value:
            "We focus on practical actions: better rankings, better clicks and a website that stays up-to-date.",
        },
      ],
    },
    {
      id: "jcw-main-services-grid01",
      title: "Services grid",
      internalName: "Services grid",
      fields: [
        {
          id: "title",
          label: "Grid title",
          type: "text",
          value: "What we help you with",
        },
        {
          id: "subtitle",
          label: "Grid subtitle",
          type: "textarea",
          value:
            "Pick a single service or combine them into a simple monthly plan.",
        },
      ],
    },
  ],
};