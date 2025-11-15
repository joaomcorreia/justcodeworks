export type ContactSectionId =
  | "jcw-main-contact-hero01"
  | "jcw-main-contact-details01"
  | "jcw-main-contact-form01";

export type ContactTextBlock = {
  id: string;
  label: string;
  value: string;
};

export type ContactSectionConfig = {
  id: ContactSectionId;
  internalName: string;
  fields: ContactTextBlock[];
};

export type ContactPageConfig = {
  sections: ContactSectionConfig[];
};

export const defaultContactPageConfig: ContactPageConfig = {
  sections: [
    {
      id: "jcw-main-contact-hero01",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          value: "Contact",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          value:
            "Tell us what you need help with and we'll get back to you with a clear next step.",
        },
      ],
    },
    {
      id: "jcw-main-contact-details01",
      internalName: "Contact details",
      fields: [
        {
          id: "title",
          label: "Details title",
          value: "How to reach us",
        },
        {
          id: "body",
          label: "Details body",
          value:
            "Use the form or email us directly. We aim to respond within one business day on EU time.",
        },
        {
          id: "email",
          label: "Email",
          value: "hello@justcodeworks.com",
        },
      ],
    },
    {
      id: "jcw-main-contact-form01",
      internalName: "Form intro",
      fields: [
        {
          id: "title",
          label: "Form title",
          value: "Send us a message",
        },
        {
          id: "body",
          label: "Form helper text",
          value:
            "Share a short description and, if relevant, your existing website URL. Don't include passwords or sensitive data.",
        },
      ],
    },
  ],
};
