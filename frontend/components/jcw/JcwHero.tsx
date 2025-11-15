import React from "react";
import type { HeroSlide, ApiSiteProject } from "../../src/lib/api";
import { HeaderBackground } from "./HeaderBackground";
import { HeroSlider } from "./HeroSlider";
import type { HeaderBackgroundMode } from "../../lib/header-backgrounds";

interface JcwHeroProps {
  project: ApiSiteProject;
  slides: HeroSlide[];
  className?: string;
}

export function JcwHero({ project, slides, className }: JcwHeroProps) {
  const mode = (project.header_background_mode as HeaderBackgroundMode) ?? "particles";

  return (
    <section className={`relative overflow-hidden py-12 sm:py-16 md:py-20 ${className ?? ""}`}>
      <HeaderBackground mode={mode} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <HeroSlider slides={slides} />
      </div>
    </section>
  );
}