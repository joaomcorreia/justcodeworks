export type HomepageSectionId =
  | "jcw-main-hero01"
  | "jcw-main-websites01"
  | "jcw-main-print01"
  | "jcw-main-pos01"
  | "jcw-main-ai01"
  | "jcw-main-cta01"
  | "jcw-main-testimonial01"
  | "jcw-main-faq01"
  | "jcw-main-blog01";

export type TextBlock = {
  id: string;
  label: string;
  value: string;
  backendFieldId?: number; // For syncing with Django API
};

export type HomepageSectionConfig = {
  id: HomepageSectionId;
  internalName: string;
  fields: TextBlock[];
};

export type HeroParticlesSettings = {
  enabled: boolean;
};

export type HomepageConfig = {
  sections: HomepageSectionConfig[];
  heroSettings: HeroParticlesSettings;
};

export const defaultHomepageConfig: HomepageConfig = {
  sections: [
    {
      id: "jcw-main-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "headline",
          label: "Headline",
          value: "Everything you need to get your business online",
        },
        {
          id: "subheadline",
          label: "Subheadline",
          value:
            "Websites, printing, POS systems, and smart tools that help real EU businesses start, grow, and stay visible.",
        },
        {
          id: "primaryCta",
          label: "Primary CTA",
          value: "Start now",
        },
        {
          id: "secondaryCta",
          label: "Secondary CTA",
          value: "See how it works",
        },
      ],
    },
    {
      id: "jcw-main-websites01",
      internalName: "Websites section",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Websites that work as hard as you do",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Pick the right website type for your business. We handle hosting, security and updates.",
        },
      ],
    },
    {
      id: "jcw-main-print01",
      internalName: "Print section",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Your brand, beautifully printed",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Connect your website content to cards, flyers, clothing and more – so everything matches.",
        },
      ],
    },
    {
      id: "jcw-main-pos01",
      internalName: "POS section",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Modern POS systems that grow with you",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Take payments in-store, online and on the go, with one system connected to your website.",
        },
      ],
    },
    {
      id: "jcw-main-ai01",
      internalName: "MagicAI Tools",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "MagicAI tools that help you write, plan and launch",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Use AI to generate texts, ideas and content blocks based on a few simple answers.",
        },
      ],
    },
    {
      id: "jcw-main-cta01",
      internalName: "CTA band",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Start your online journey today",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Answer a few questions, pick a website type and let your assistant handle the hard parts.",
        },
        {
          id: "cta",
          label: "CTA",
          value: "Start building",
        },
      ],
    },
    {
      id: "jcw-main-testimonial01",
      internalName: "Testimonial",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "What our clients say",
        },
        {
          id: "quote",
          label: "Main quote",
          value:
            '"Just Code Works helped me go from no website to a full online presence with matching cards and flyers in a few days."',
        },
        {
          id: "author",
          label: "Author",
          value: "Small business owner, Lisbon",
        },
      ],
    },
    {
      id: "jcw-main-faq01",
      internalName: "FAQ",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Frequently asked questions",
        },
      ],
    },
    {
      id: "jcw-main-blog01",
      internalName: "Latest insights",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Latest insights",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Short articles and updates about websites, printing and tools for EU businesses.",
        },
      ],
    },
  ],
  heroSettings: {
    enabled: true,
  },
};
