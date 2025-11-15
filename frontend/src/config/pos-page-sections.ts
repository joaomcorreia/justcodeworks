export type PosSectionId =
  | "jcw-main-pos-hero01"
  | "jcw-main-pos-overview01"
  | "jcw-main-pos-grid01"
  | "jcw-main-pos-benefits01";

export type PosTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type PosSectionConfig = {
  id: PosSectionId;
  internalName: string;
  fields: PosTextBlock[];
};

export type PosPageConfig = {
  sections: PosSectionConfig[];
};

export const defaultPosPageConfig: PosPageConfig = {
  sections: [
    {
      id: "jcw-main-pos-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "POS systems",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Modern point-of-sale systems that can work together with your website and online store.",
        },
      ],
    },
    {
      id: "jcw-main-pos-overview01",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          value: "Take payments where your customers are",
        },
        {
          id: "body",
          label: "Overview text",
          value:
            "In-store, on the go or online – your POS should help you take payments simply, not get in the way.",
        },
      ],
    },
    {
      id: "jcw-main-pos-grid01",
      internalName: "POS options grid",
      fields: [
        {
          id: "title",
          label: "Grid title",
          value: "POS options we can support",
        },
        {
          id: "subtitle",
          label: "Grid subtitle",
          value:
            "From simple terminals to connected systems that talk to your website and inventory.",
        },
      ],
    },
    {
      id: "jcw-main-pos-benefits01",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          value: "Why connect POS with your online presence?",
        },
        {
          id: "body",
          label: "Benefits text",
          value:
            "When your POS, website and store are aligned, you avoid double work and reduce mistakes in orders, stock and reporting.",
        },
      ],
    },
  ],
};
