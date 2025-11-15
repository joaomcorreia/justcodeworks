"use client";

import React from "react";

interface VortexBackgroundProps {
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  rangeHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
}

export function VortexBackground({
  className,
  containerClassName,
  particleCount = 700,
  rangeY = 800,
  baseHue = 220,
  rangeHue = 100,
  baseSpeed = 0.1,
  rangeSpeed = 1,
  baseRadius = 1,
  rangeRadius = 2,
}: VortexBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      speed: number;
      hue: number;
      radius: number;
      life: number;
      decay: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticle = () => {
      return {
        x: canvas.offsetWidth / 2,
        y: canvas.offsetHeight / 2,
        z: Math.random() * rangeY,
        speed: baseSpeed + Math.random() * rangeSpeed,
        hue: baseHue + Math.random() * rangeHue,
        radius: baseRadius + Math.random() * rangeRadius,
        life: 1,
        decay: 0.01 + Math.random() * 0.01,
      };
    };

    const initParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    };

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((particle, index) => {
        const centerX = canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2;
        
        // Convert 3D position to 2D screen coordinates
        const scale = 200 / (200 + particle.z);
        const x2D = centerX + (particle.x - centerX) * scale;
        const y2D = centerY + (particle.y - centerY) * scale;

        // Update particle position (spiral motion)
        const angle = Date.now() * particle.speed * 0.001;
        const radius = (particle.z / rangeY) * 300;
        
        particle.x = centerX + Math.cos(angle) * radius;
        particle.y = centerY + Math.sin(angle) * radius;
        particle.z -= particle.speed * 5;
        
        particle.life -= particle.decay;

        // Reset particle if it goes too far or dies
        if (particle.z <= 0 || particle.life <= 0) {
          particles[index] = createParticle();
          return;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.life * scale;
        ctx.fillStyle = `hsl(${particle.hue}, 100%, 60%)`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${particle.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(x2D, y2D, particle.radius * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [
    particleCount,
    rangeY,
    baseHue,
    rangeHue,
    baseSpeed,
    rangeSpeed,
    baseRadius,
    rangeRadius,
  ]);

  return (
    <div className={[
      "relative h-full w-full overflow-hidden bg-slate-950",
      containerClassName
    ].filter(Boolean).join(" ")}>
      <canvas
        ref={canvasRef}
        className={[
          "absolute inset-0 h-full w-full",
          className
        ].filter(Boolean).join(" ")}
        style={{ width: "100%", height: "100%" }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-950/80 pointer-events-none" />
    </div>
  );
}