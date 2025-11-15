"use client";

import React from "react";
import type { HeaderBackgroundMode } from "../../lib/header-backgrounds";
import { ParticlesBackground } from "../ui/backgrounds/particles-background";

interface HeaderBackgroundProps {
  mode: HeaderBackgroundMode;
  className?: string;
}

/**
 * Full-bleed header background controlled by SiteProject.header_background_mode.
 * Parent container should be relative; this is absolutely positioned.
 */
export function HeaderBackground({ mode, className }: HeaderBackgroundProps) {
  const base = "pointer-events-none absolute inset-0 -z-10";

  if (mode === "none") {
    return (
      <div
        className={[
          base,
          className,
          "bg-gradient-to-b from-background via-background to-background/80"
        ].filter(Boolean).join(" ")}
      />
    );
  }

  if (mode === "particles") {
    return <ParticlesBackground className={[base, className].filter(Boolean).join(" ")} />;
  }

  // Fallback: simple gradient
  return (
    <div
      className={[
        base,
        className,
        "bg-gradient-to-b from-slate-900 via-slate-950 to-black"
      ].filter(Boolean).join(" ")}
    />
  );
}