"use client";

import React from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";
import type { ISourceOptions } from "@tsparticles/engine";

interface ParticlesBackgroundProps {
  className?: string;
}

export function ParticlesBackground({ className }: ParticlesBackgroundProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) {
    return (
      <div
        className={[
          "bg-gradient-to-b from-slate-900 via-slate-950 to-black",
          className
        ].filter(Boolean).join(" ")}
      />
    );
  }

  const options: ISourceOptions = {
    fullScreen: {
      enable: false,
    },
    fpsLimit: 120,
    particles: {
      color: {
        value: ["#facc15", "#22c55e", "#3b82f6", "#a855f7"],
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        outModes: {
          default: "bounce",
        },
      },
      number: {
        density: {
          enable: true,
        },
        value: 60,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 4 },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1,
          },
        },
      },
    },
  };

  return (
    <div className={[
      "bg-gradient-to-b from-slate-900 via-slate-950 to-black",
      className
    ].filter(Boolean).join(" ")}>
      <Particles
        id="header-particles"
        options={options}
      />
    </div>
  );
}