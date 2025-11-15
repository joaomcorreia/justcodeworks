import type { PageConfig } from "@/types/page-config";

export const defaultCustomWebsitesConfig: PageConfig = {
  sections: [
    {
      id: "jcw-customweb-hero01",
      title: "Custom websites – hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "Custom websites",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "When you need something that doesn't fit in a standard package – custom flows, integrations or layouts.",
        },
      ],
    },
    {
      id: "jcw-customweb-overview01",
      title: "Overview",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          type: "text",
          value: "Designed around your process, not the template",
        },
        {
          id: "body",
          label: "Overview text",
          type: "textarea",
          value:
            "Custom websites are built to match your specific needs: unique user flows, specialized integrations, or designs that reflect exactly how you work.",
        },
      ],
    },
    {
      id: "jcw-customweb-included01",
      title: "What's included",
      internalName: "What's included",
      fields: [
        {
          id: "title",
          label: "Included title",
          type: "text",
          value: "Tailored to your requirements",
        },
        {
          id: "subtitle",
          label: "Included subtitle",
          type: "textarea",
          value: "Custom development, integrations, and ongoing support:",
        },
      ],
    },
    {
      id: "jcw-customweb-benefits01",
      title: "Benefits",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          type: "text",
          value: "Why choose a Custom Website?",
        },
        {
          id: "subtitle",
          label: "Benefits subtitle",
          type: "textarea",
          value: "Exactly what you need, how you need it, with room to evolve as your business grows.",
        },
      ],
    },
  ],
};