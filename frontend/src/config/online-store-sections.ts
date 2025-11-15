export type StoreSectionId =
  | "jcw-main-store-hero01"
  | "jcw-main-store-overview01"
  | "jcw-main-store-included01"
  | "jcw-main-store-benefits01";

export type StoreTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type StoreSectionConfig = {
  id: StoreSectionId;
  internalName: string;
  fields: StoreTextBlock[];
};

export type StorePageConfig = {
  sections: StoreSectionConfig[];
};

export const defaultStorePageConfig: StorePageConfig = {
  sections: [
    {
      id: "jcw-main-store-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Online stores",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Sell products or services online with a store that connects to your website and payment systems.",
        },
      ],
    },
    {
      id: "jcw-main-store-overview01",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          value: "Built for EU payments and customers",
        },
        {
          id: "body",
          label: "Overview text",
          value:
            "From local pickup to EU-wide shipping, your store can handle multiple payment methods and languages.",
        },
      ],
    },
    {
      id: "jcw-main-store-included01",
      internalName: "What's included",
      fields: [
        {
          id: "title",
          label: "Included title",
          value: "What's included",
        },
        {
          id: "note",
          label: "Small note text",
          value:
            "Inventory, taxes and email notifications are handled by the system – you focus on products and customers.",
        },
      ],
    },
    {
      id: "jcw-main-store-benefits01",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          value: "Why choose an online store with JCW?",
        },
        {
          id: "body",
          label: "Benefits closing text",
          value:
            "Your website, store and POS can work together so you don't have to manage everything in separate systems.",
        },
      ],
    },
  ],
};
