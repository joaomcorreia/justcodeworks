export type PrintSectionId =
  | "jcw-main-print-hero01"
  | "jcw-main-print-intro01"
  | "jcw-main-print-grid01";

export type PrintTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type PrintSectionConfig = {
  id: PrintSectionId;
  internalName: string;
  fields: PrintTextBlock[];
};

export type PrintPageConfig = {
  sections: PrintSectionConfig[];
};

export const defaultPrintPageConfig: PrintPageConfig = {
  sections: [
    {
      id: "jcw-main-print-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Print & Merch",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Business cards, flyers, clothing and gifts that match your website and brand.",
        },
      ],
    },
    {
      id: "jcw-main-print-intro01",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          value: "Your offline and online branding in sync",
        },
        {
          id: "body",
          label: "Intro text",
          value:
            "We take the colours, fonts and style from your website and reuse them on print materials so everything feels connected.",
        },
      ],
    },
    {
      id: "jcw-main-print-grid01",
      internalName: "Print products grid",
      fields: [
        {
          id: "title",
          label: "Grid title",
          value: "What we can print for you",
        },
        {
          id: "subtitle",
          label: "Grid subtitle",
          value:
            "From first impressions to long-term customer gifts, we cover the basics most small businesses need.",
        },
      ],
    },
  ],
};
