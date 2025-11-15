import type { PageConfig } from "@/types/page-config";

export const defaultOnlineShopsConfig: PageConfig = {
  sections: [
    {
      id: "jcw-onlineshops-hero01",
      title: "Online shops – hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "Online stores",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "Sell products or services online with a store that connects to your website and payment systems.",
        },
      ],
    },
    {
      id: "jcw-onlineshops-overview01",
      title: "Overview",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          type: "text",
          value: "Built for EU payments and customers",
        },
        {
          id: "body",
          label: "Overview text",
          type: "textarea",
          value:
            "Handle orders, inventory, and payments in a way that works with European regulations and customer expectations.",
        },
      ],
    },
    {
      id: "jcw-onlineshops-included01",
      title: "What's included",
      internalName: "What's included",
      fields: [
        {
          id: "title",
          label: "Included title",
          type: "text",
          value: "Everything to start selling online",
        },
        {
          id: "subtitle",
          label: "Included subtitle",
          type: "textarea",
          value: "Payment processing, inventory management, customer accounts:",
        },
      ],
    },
    {
      id: "jcw-onlineshops-benefits01",
      title: "Benefits",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          type: "text",
          value: "Why choose our Online Store solution?",
        },
        {
          id: "subtitle",
          label: "Benefits subtitle",
          type: "textarea",
          value: "EU-compliant, mobile-optimized, integrated with your website and POS system.",
        },
      ],
    },
  ],
};