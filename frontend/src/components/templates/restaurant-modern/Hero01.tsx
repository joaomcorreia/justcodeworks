// [RMOD]
"use client";

import type { SectionJson } from "@/lib/types/sitePublic";

type Props = {
  section: SectionJson;
  mode?: "public" | "preview";
};

export function RestaurantHero01({ section, mode = "public" }: Props) {
  const headline = section.fields.find(f => f.key === "headline")?.value ?? "Restaurant Name";
  const subheadline = section.fields.find(f => f.key === "subheadline")?.value ?? "Delicious food in your town.";
  const ctaText = section.fields.find(f => f.key === "cta_text")?.value ?? "View Menu";
  const ctaLink = section.fields.find(f => f.key === "cta_link")?.value ?? "#menu";
  const backgroundImage = section.fields.find(f => f.key === "background_image")?.value ?? "";

  return (
    <section id="hero" className="relative min-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10"></div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold jcw-text-primary md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        <p className="mb-8 text-xl text-gray-700 md:text-2xl lg:max-w-3xl lg:mx-auto">
          {subheadline}
        </p>
        <a
          href={ctaLink}
          className="inline-flex items-center gap-2 rounded-lg jcw-bg-accent px-8 py-4 text-lg font-semibold text-white transition-all hover:opacity-90 hover:scale-105 focus:outline-none focus:ring-2 jcw-border-accent focus:ring-offset-2"
        >
          {ctaText}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
      
      {/* Decorative elements - using theme colors with opacity */}
      <div className="absolute top-10 left-10 w-20 h-20 jcw-bg-primary opacity-20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 jcw-bg-secondary opacity-20 rounded-full blur-xl"></div>
    </section>
  );
}