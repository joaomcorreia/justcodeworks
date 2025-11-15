"use client";

import React from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";
import type { ISourceOptions } from "@tsparticles/engine";

type HeroParticlesConfig = {
  enabled: boolean;
  density: number;
  speed: number;
  size: number;
};

interface ParticlesHeroBackgroundProps {
  particles: HeroParticlesConfig;
}

export default function ParticlesHeroBackground({ particles }: ParticlesHeroBackgroundProps) {
  const [init, setInit] = useState(false);
  const [particlesKey, setParticlesKey] = useState(0);

  useEffect(() => {
    if (particles.enabled) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setInit(true);
      });
    } else {
      setInit(false);
    }
  }, [particles.enabled]);

  // Force particles refresh when config changes
  useEffect(() => {
    if (init) {
      console.log('Particles config changed:', particles);
      setParticlesKey(prev => prev + 1);
    }
  }, [particles.density, particles.speed, particles.size, init]);

  if (!particles.enabled || !init) {
    return null;
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
        speed: particles.speed,
        direction: "none",
        outModes: {
          default: "bounce",
        },
      },
      number: {
        density: {
          enable: true,
        },
        value: particles.density,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: particles.size * 0.5, max: particles.size * 2 },
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
    <div 
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Particles
        key={particlesKey}
        id="tsparticles-hero"
        options={options}
      />
    </div>
  );
}
