// [RMOD]
import type { SectionJson } from "@/lib/types/sitePublic";
import { RestaurantHero01 } from "./Hero01";
import { RestaurantAbout01 } from "./About01";
import { RestaurantMenu01 } from "./Menu01";
import { RestaurantGallery01 } from "./Gallery01";
import { RestaurantContact01 } from "./Contact01";

type RendererProps = {
  section: SectionJson;
  mode?: "public" | "preview";
};

type Renderer = (props: RendererProps) => JSX.Element | null;

const registry: Record<string, Renderer> = {
  "hero-banner": ({ section, mode }) => (
    <RestaurantHero01 section={section} mode={mode} />
  ),
  "about-us": ({ section, mode }) => (
    <RestaurantAbout01 section={section} mode={mode} />
  ),
  "appetizers": ({ section, mode }) => (
    <RestaurantMenu01 section={section} mode={mode} />
  ),
  "main-courses": ({ section, mode }) => (
    <RestaurantMenu01 section={section} mode={mode} />
  ),
  "gallery": ({ section, mode }) => (
    <RestaurantGallery01 section={section} mode={mode} />
  ),
  "contact-info": ({ section, mode }) => (
    <RestaurantContact01 section={section} mode={mode} />
  ),
};

export function renderRestaurantModernSection(
  section: SectionJson,
  mode: "public" | "preview" = "public"
) {
  const renderer = registry[section.identifier];
  if (!renderer) {
    return (
      <section className="px-6 py-6 text-xs text-slate-500 bg-yellow-50 border border-yellow-200">
        <div className="max-w-4xl mx-auto">
          Unknown section: <code className="bg-yellow-100 px-1 rounded">{section.identifier}</code>
        </div>
      </section>
    );
  }
  return renderer({ section, mode });
}