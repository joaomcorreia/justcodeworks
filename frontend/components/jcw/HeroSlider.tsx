"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroSlide, HeroAnimationMode } from "../../src/lib/api";

interface HeroSliderProps {
  slides: HeroSlide[];
  className?: string;
  autoPlayIntervalMs?: number;
}

const DEFAULT_INTERVAL = 8000;

export function HeroSlider({
  slides,
  className,
  autoPlayIntervalMs = DEFAULT_INTERVAL,
}: HeroSliderProps) {
  const activeSlides = slides.filter((s) => s.is_active).sort((a, b) => a.order - b.order);
  const [index, setIndex] = useState(0);

  const currentSlide =
    activeSlides.length > 0 ? activeSlides[index % activeSlides.length] : undefined;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % activeSlides.length);
    }, autoPlayIntervalMs);
    return () => clearInterval(id);
  }, [activeSlides.length, autoPlayIntervalMs]);

  if (!currentSlide) {
    return null;
  }

  const handleDotClick = (i: number) => setIndex(i);

  const animationMode: HeroAnimationMode = currentSlide.animation_mode as HeroAnimationMode;

  const variants =
    animationMode === "slide-left"
      ? {
          initial: { opacity: 0, x: 40 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -40 },
        }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        };

  return (
    <div className={[
      "relative overflow-hidden",
      className
    ].filter(Boolean).join(" ")}>
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="relative z-10 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={variants.initial}
              animate={variants.animate}
              exit={variants.exit}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              {currentSlide.eyebrow && (
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
                  {currentSlide.eyebrow}
                </div>
              )}

              <HeroAnimatedTitle
                title={currentSlide.title}
                mode={animationMode}
              />

              {currentSlide.subtitle && (
                <p className="text-lg text-slate-300">
                  {currentSlide.subtitle}
                </p>
              )}

              {currentSlide.body && (
                <p className="max-w-xl text-sm text-slate-400">
                  {currentSlide.body}
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-4">
                {currentSlide.primary_button_label && currentSlide.primary_button_url && (
                  <a
                    href={currentSlide.primary_button_url}
                    className="inline-flex items-center rounded-full bg-yellow-400 px-6 py-2 text-sm font-medium text-slate-900 shadow hover:bg-yellow-300"
                  >
                    {currentSlide.primary_button_label}
                  </a>
                )}
                {currentSlide.secondary_button_label && currentSlide.secondary_button_url && (
                  <a
                    href={currentSlide.secondary_button_url}
                    className="inline-flex items-center rounded-full border border-slate-600 px-6 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800"
                  >
                    {currentSlide.secondary_button_label}
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {activeSlides.length > 1 && (
            <div className="mt-6 flex gap-2">
              {activeSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => handleDotClick(i)}
                  className={[
                    "h-2 w-6 rounded-full transition",
                    i === index ? "bg-yellow-400" : "bg-slate-600 hover:bg-yellow-400/60"
                  ].filter(Boolean).join(" ")}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id + "-image"}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 shadow-xl"
            >
              {currentSlide.image_url ? (
                // You can swap to next/image later
                <img
                  src={currentSlide.image_url}
                  alt={currentSlide.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                  Hero image goes here
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface HeroAnimatedTitleProps {
  title: string;
  mode: HeroAnimationMode;
}

// Simple typewriter for title only
function HeroAnimatedTitle({ title, mode }: HeroAnimatedTitleProps) {
  const [displayed, setDisplayed] = useState(title);

  useEffect(() => {
    if (mode !== "typewriter") {
      setDisplayed(title);
      return;
    }

    setDisplayed("");
    let i = 0;
    const chars = title.split("");
    const id = setInterval(() => {
      i += 1;
      setDisplayed(chars.slice(0, i).join(""));
      if (i >= chars.length) {
        clearInterval(id);
      }
    }, 40);

    return () => clearInterval(id);
  }, [title, mode]);

  return (
    <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl md:text-5xl lg:text-6xl">
      {displayed}
      {mode === "typewriter" && (
        <span className="inline-block w-[1ch] animate-pulse">|</span>
      )}
    </h1>
  );
}