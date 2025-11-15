export type SocialSectionId =
  | "jcw-main-social-hero01"
  | "jcw-main-social-overview01"
  | "jcw-main-social-included01"
  | "jcw-main-social-benefits01";

export type SocialTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type SocialSectionConfig = {
  id: SocialSectionId;
  internalName: string;
  fields: SocialTextBlock[];
};

export type SocialPageConfig = {
  sections: SocialSectionConfig[];
};

export const defaultSocialPageConfig: SocialPageConfig = {
  sections: [
    {
      id: "jcw-main-social-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Social Media support",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Keep your website and social channels connected so people always land on the right place.",
        },
      ],
    },
    {
      id: "jcw-main-social-overview01",
      internalName: "Overview",
      fields: [
        {
          id: "title",
          label: "Overview title",
          value: "From posts to landing pages",
        },
        {
          id: "body",
          label: "Overview text",
          value:
            "We prepare basic content ideas and simple landing pages so your social traffic doesn't get lost.",
        },
      ],
    },
    {
      id: "jcw-main-social-included01",
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
            "We don't try to replace a full-time social agency – we focus on what connects to your website.",
        },
      ],
    },
    {
      id: "jcw-main-social-benefits01",
      internalName: "Benefits",
      fields: [
        {
          id: "title",
          label: "Benefits title",
          value: "Why add Social Media support?",
        },
        {
          id: "body",
          label: "Benefits closing text",
          value:
            "Your website becomes the hub: posts, campaigns and ads always lead back to a page that can convert.",
        },
      ],
    },
  ],
};
