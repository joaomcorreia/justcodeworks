export type TemplateCategory =
  | "one-page"
  | "multi-page"
  | "store"
  | "booking"
  | "portfolio"
  | "custom";

export type TemplateComplexity = "starter" | "standard" | "advanced";

export type TemplateDefinition = {
  id: string;
  slug: string;
  name: string;
  category: TemplateCategory;
  complexity: TemplateComplexity;
  shortDescription: string;
  longDescription: string;
  recommendedFor: string;
  previewImage?: string; // can be wired later
  sectionsSummary: string[];
  estimatedPages: number;
  hasStore: boolean;
  hasBlog: boolean;
  hasBooking: boolean;
};

export const templatesCatalog: TemplateDefinition[] = [
  {
    id: "freelancer-one-page",
    slug: "freelancer-one-page",
    name: "Freelancer One Page",
    category: "one-page",
    complexity: "starter",
    shortDescription: "Clean one-page layout for freelancers and solo services.",
    longDescription:
      "A focused one-page layout with hero, services, testimonials and a simple contact area. Ideal when you just need to be online with a clear message and a direct way to get in touch.",
    recommendedFor: "Freelancers, consultants, small services, personal brands.",
    sectionsSummary: [
      "Hero with CTA",
      "Services overview",
      "About section",
      "Testimonials",
      "Simple contact or booking section",
    ],
    estimatedPages: 1,
    hasStore: false,
    hasBlog: false,
    hasBooking: false,
  },
  {
    id: "local-business-starter",
    slug: "local-business-starter",
    name: "Local Business Starter",
    category: "multi-page",
    complexity: "standard",
    shortDescription: "Multi-page starter for local businesses and shops.",
    longDescription:
      "Homepage plus separate pages for services, about and contact. Made for local businesses that want a more complete presence without going straight into a complex site.",
    recommendedFor:
      "Local shops, restaurants, service providers that work in one city or region.",
    sectionsSummary: [
      "Hero with key service and location",
      "Service highlights on homepage",
      "Dedicated services page",
      "About/Story page",
      "Contact & opening hours page",
    ],
    estimatedPages: 4,
    hasStore: false,
    hasBlog: false,
    hasBooking: false,
  },
  {
    id: "online-store-starter",
    slug: "online-store-starter",
    name: "Online Store Starter",
    category: "store",
    complexity: "advanced",
    shortDescription: "Starter layout for a small online shop.",
    longDescription:
      "A starter store layout with homepage, product listing, product detail and a simple checkout flow. Perfect when you want to test online sales without committing to a large catalog.",
    recommendedFor: "Small retailers, makers, D2C brands testing e-commerce.",
    sectionsSummary: [
      "Store-focused homepage",
      "Category/product listing page",
      "Product detail layout",
      "Trust & FAQ section",
    ],
    estimatedPages: 5,
    hasStore: true,
    hasBlog: false,
    hasBooking: false,
  },
  {
    id: "booking-services",
    slug: "booking-services",
    name: "Booking Services",
    category: "booking",
    complexity: "standard",
    shortDescription: "For services that run on appointments or sessions.",
    longDescription:
      "Layout built around booking – clear services, availability info and a straightforward booking CTA. Ideal when you want people to choose a service and request a time.",
    recommendedFor:
      "Clinics, coaches, beauty salons, trainers and any appointment-based service.",
    sectionsSummary: [
      "Hero with booking CTA",
      "Services with price ranges",
      "Process/How it works",
      "Testimonials",
      "FAQ and contact",
    ],
    estimatedPages: 4,
    hasStore: false,
    hasBlog: false,
    hasBooking: true,
  },
  {
    id: "content-plus-services",
    slug: "content-plus-services",
    name: "Content + Services",
    category: "multi-page",
    complexity: "advanced",
    shortDescription: "For businesses that publish articles and also sell services.",
    longDescription:
      "A layout that combines pages for services with a blog or resources area. Good when you want to rank for content and still send people to clear offers.",
    recommendedFor: "Agencies, consultants, experts who publish articles or guides.",
    sectionsSummary: [
      "Homepage with content highlights",
      "Services pages",
      "Blog/resources listing",
      "Article layout",
    ],
    estimatedPages: 6,
    hasStore: false,
    hasBlog: true,
    hasBooking: false,
  },
];
