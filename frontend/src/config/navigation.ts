export type NavItem = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
};

export type NavigationConfig = {
  mainNav: NavItem[];
  footerColumns: {
    id: string;
    title: string;
    items: NavItem[];
  }[];
  subfooter: {
    text: string;
  };
};

export const defaultNavigationConfig: NavigationConfig = {
  mainNav: [
    { id: "home", label: "Home", href: "/" },
    { 
      id: "services", 
      label: "Services", 
      href: "/services",
      children: [
        { id: "seo", label: "SEO", href: "/services/search-engine-optimization" },
        { id: "social", label: "Social Media", href: "/services/social-media" },
        { id: "upgrades", label: "Website Upgrades", href: "/services/website-upgrades" },
      ]
    },
    { 
      id: "websites", 
      label: "Websites", 
      href: "/websites",
      children: [
        { id: "one-page", label: "One Page Sites", href: "/websites/one-page-websites" },
        { id: "multi-page", label: "Multi Page Sites", href: "/websites/multi-page-websites" },
        { id: "online-shops", label: "Online Shops", href: "/websites/online-shops" },
        { id: "custom", label: "Custom Websites", href: "/websites/custom-websites" },
      ]
    },
    { 
      id: "print", 
      label: "Print & Merch", 
      href: "/print",
      children: [
        { id: "business-cards", label: "Business Cards", href: "/print/business-cards" },
        { id: "flyers", label: "Flyers & Brochures", href: "/print/trifolds-and-flyers" },
        { id: "clothing", label: "Clothing & Apparel", href: "/print/clothing" },
        { id: "gifts", label: "Gifts & Promotional", href: "/print/gifts" },
      ]
    },
    { id: "pos", label: "POS Systems", href: "/pos-systems" },
    { 
      id: "help-center", 
      label: "Help Center", 
      href: "/help-center",
      children: [
        { id: "utilities", label: "Utilities & Tools", href: "/help-center/utilities" },
      ]
    },
  ],
  footerColumns: [
    {
      id: "footer-about",
      title: "Just Code Works",
      items: [
        {
          id: "footer-about-overview",
          label: "What we do",
          href: "/services",
        },
        {
          id: "footer-about-websites",
          label: "Websites",
          href: "/websites",
        },
        {
          id: "footer-about-pos",
          label: "POS Systems",
          href: "/pos-systems",
        },
      ],
    },
    {
      id: "footer-websites",
      title: "Websites",
      items: [
        {
          id: "footer-one-page",
          label: "One page websites",
          href: "/websites/one-page",
        },
        {
          id: "footer-multi-page",
          label: "Multi page websites",
          href: "/websites/multi-page",
        },
        {
          id: "footer-online-shops",
          label: "Online shops",
          href: "/websites/online-stores",
        },
        {
          id: "footer-custom",
          label: "Custom websites",
          href: "/websites/custom",
        },
      ],
    },
    {
      id: "footer-services",
      title: "Services",
      items: [
        {
          id: "footer-seo",
          label: "Search engine optimization",
          href: "/services/search-engine-optimization",
        },
        {
          id: "footer-social",
          label: "Social media",
          href: "/services/social-media",
        },
        {
          id: "footer-upgrades",
          label: "Website upgrades",
          href: "/services/website-upgrades",
        },
      ],
    },
    {
      id: "footer-print",
      title: "Print & merch",
      items: [
        { id: "footer-business-cards", label: "Business cards", href: "/print" },
        {
          id: "footer-trifolds-flyers",
          label: "Trifolds & flyers",
          href: "/print",
        },
        { id: "footer-clothing", label: "Clothing", href: "/print" },
        { id: "footer-gifts", label: "Gifts", href: "/print" },
      ],
    },
    {
      id: "footer-help",
      title: "Help & tools",
      items: [
        { id: "footer-contact", label: "Contact", href: "/contact" },
        {
          id: "footer-how-tos",
          label: "How To's",
          href: "/help-center",
        },
        {
          id: "footer-utilities",
          label: "Utilities overview",
          href: "/help-center/utilities",
        },
        {
          id: "footer-qr",
          label: "QR code generator",
          href: "/utilities/qr-code-generator",
        },
        {
          id: "footer-password-tools",
          label: "Password tools",
          href: "/utilities/password-tools",
        },
        {
          id: "footer-json-viewer",
          label: "JSON viewer",
          href: "/utilities/json-viewer",
        },
        {
          id: "footer-image-resizer",
          label: "Image resizer",
          href: "/utilities/image-resizer",
        },
        {
          id: "footer-image-cropper",
          label: "Image cropper",
          href: "/utilities/image-cropper",
        },
        {
          id: "footer-site-status",
          label: "My site status",
          href: "/utilities/my-site-status",
        },
      ],
    },
  ],
  subfooter: {
    text: "© Just Code Works · All rights reserved.",
  },
};
