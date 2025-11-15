export type HelpSectionId =
  | "jcw-main-help-hero01"
  | "jcw-main-help-intro01"
  | "jcw-main-help-grid01";

export type HelpTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type HelpSectionConfig = {
  id: HelpSectionId;
  internalName: string;
  fields: HelpTextBlock[];
};

export type HelpPageConfig = {
  sections: HelpSectionConfig[];
};

export const defaultHelpPageConfig: HelpPageConfig = {
  sections: [
    {
      id: "jcw-main-help-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Help Center",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Find answers, tools and ways to contact us when you need help with your website.",
        },
      ],
    },
    {
      id: "jcw-main-help-intro01",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          value: "Support made for small businesses",
        },
        {
          id: "body",
          label: "Intro text",
          value:
            "We focus on simple explanations, clear next steps and tools you can actually use yourself.",
        },
      ],
    },
    {
      id: "jcw-main-help-grid01",
      internalName: "Help links grid",
      fields: [
        {
          id: "title",
          label: "Grid title",
          value: "Where do you want to start?",
        },
        {
          id: "subtitle",
          label: "Grid subtitle",
          value:
            "Go to the Help Center articles, open utilities or send us a message directly.",
        },
      ],
    },
  ],
};
