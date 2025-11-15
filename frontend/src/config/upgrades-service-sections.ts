export type UpgradesSectionId =
  | "jcw-main-upgrades-hero01"
  | "jcw-main-upgrades-overview01"
  | "jcw-main-upgrades-included01"
  | "jcw-main-upgrades-benefits01";

export type UpgradesTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type UpgradesSectionConfig = {
  id: UpgradesSectionId;
  internalName: string;
  fields: UpgradesTextBlock[];
};

export type UpgradesPageConfig = {
  sections: UpgradesSectionConfig[];
};

export const defaultUpgradesPageConfig: UpgradesPageConfig = {
  sections: [
    {
      id: "jcw-main-upgrades-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Website upgrades & improvements",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "If you already have a site, we can improve it step by step instead of rebuilding everything from zero.",
        },
      ],
    },
    {
      id: "jcw-main-upgrades-overview01",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          value: "Small, focused changes that add up",
        },
        {
          id: "body",
          label: "Overview text",
          value:
            "We analyse what's slowing your site down or confusing visitors and suggest clear improvements.",
        },
      ],
    },
    {
      id: "jcw-main-upgrades-included01",
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
            "You decide which changes to start with – we can plan upgrades over several months if needed.",
        },
      ],
    },
    {
      id: "jcw-main-upgrades-benefits01",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          value: "Why focus on upgrades?",
        },
        {
          id: "body",
          label: "Benefits closing text",
          value:
            "Perfect when you want better results without replacing a site that already works for you.",
        },
      ],
    },
  ],
};
