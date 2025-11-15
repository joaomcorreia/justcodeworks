import type { PageConfig } from "@/types/page-config";

export const defaultContactPageConfig: PageConfig = {
  sections: [
    {
      id: "jcw-contact-hero01",
      title: "Contact – hero",
      internalName: "Hero",
      fields: [
        {
          id: "title",
          label: "Title",
          type: "text",
          value: "Contact",
        },
        {
          id: "subtitle",
          label: "Subtitle",
          type: "textarea",
          value:
            "Tell us what you need help with and we'll get back to you with a clear next step.",
        },
      ],
    },
    {
      id: "jcw-contact-details01",
      title: "Contact details",
      internalName: "Contact details",
      fields: [
        {
          id: "title",
          label: "Details title",
          type: "text",
          value: "How to reach us",
        },
        {
          id: "body",
          label: "Details text",
          type: "textarea",
          value:
            "A short form is usually faster than going back-and-forth over email.",
        },
      ],
    },
    {
      id: "jcw-contact-form01",
      title: "Contact form",
      internalName: "Contact form",
      fields: [
        {
          id: "title",
          label: "Form title",
          type: "text",
          value: "Tell us what you need",
        },
        {
          id: "subtitle",
          label: "Form subtitle",
          type: "textarea",
          value: "The more details you provide, the better we can help:",
        },
      ],
    },
  ],
};