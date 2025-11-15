export type ServicesSectionId =
  | "jcw-main-services-hero01"
  | "jcw-main-services-intro01"
  | "jcw-main-services-grid01";

export type ServicesTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type ServicesSectionConfig = {
  id: ServicesSectionId;
  internalName: string;
  fields: ServicesTextBlock[];
};

export type ServicesPageConfig = {
  sections: ServicesSectionConfig[];
};

export const defaultServicesPageConfig: ServicesPageConfig = {
  sections: [
    {
      id: "jcw-main-services-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Services that support your website and growth",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Search, social and continuous improvements so your site doesn't just exist – it performs.",
        },
      ],
    },
    {
      id: "jcw-main-services-intro01",
      internalName: "Intro",
      fields: [
        {
          id: "title",
          label: "Intro title",
          value: "Keep your online presence moving",
        },
        {
          id: "body",
          label: "Intro text",
          value:
            "We focus on practical actions: better rankings, better clicks and a website that stays up-to-date.",
        },
      ],
    },
    {
      id: "jcw-main-services-grid01",
      internalName: "Services grid",
      fields: [
        {
          id: "title",
          label: "Grid title",
          value: "What we help you with",
        },
        {
          id: "subtitle",
          label: "Grid subtitle",
          value:
            "Pick a single service or combine them into a simple monthly plan.",
        },
      ],
    },
  ],
};
