import type { PageConfig } from "@/types/page-config";

export const defaultPosPageConfig: PageConfig = {
  sections: [
    {
      id: "jcw-pos-hero01",
      title: "POS systems – hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "POS systems",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "Modern point-of-sale systems that can work together with your website and online store.",
        },
      ],
    },
    {
      id: "jcw-pos-overview01",
      title: "Overview",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          type: "text",
          value: "Take payments where your customers are",
        },
        {
          id: "body",
          label: "Overview text",
          type: "textarea",
          value:
            "Setups for hospitality and retail where bookings, orders and payments flow properly between your physical and online presence.",
        },
      ],
    },
    {
      id: "jcw-pos-included01",
      title: "What's included",
      internalName: "What's included",
      fields: [
        {
          id: "title",
          label: "Included title",
          type: "text",
          value: "Complete POS integration",
        },
        {
          id: "subtitle",
          label: "Included subtitle",
          type: "textarea",
          value: "Hardware, software, training, and ongoing support:",
        },
      ],
    },
    {
      id: "jcw-pos-benefits01",
      title: "Benefits",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          type: "text",
          value: "Why choose our POS solution?",
        },
        {
          id: "subtitle",
          label: "Benefits subtitle",
          type: "textarea",
          value: "Seamless integration with your website, inventory sync, and customer data that flows everywhere it needs to go.",
        },
      ],
    },
  ],
};