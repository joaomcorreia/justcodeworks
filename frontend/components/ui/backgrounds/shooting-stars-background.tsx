"use client";

import React from "react";

interface ShootingStarsBackgroundProps {
  className?: string;
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: string;
  starHeight?: string;
}

export function ShootingStarsBackground({
  className,
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = "10px",
  starHeight = "1px",
}: ShootingStarsBackgroundProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className={[
        "h-full w-full bg-gradient-to-b from-slate-900 via-slate-950 to-black",
        className
      ].filter(Boolean).join(" ")} />
    );
  }

  return (
    <div className={[
      "relative h-full w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black",
      className
    ].filter(Boolean).join(" ")}>
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(200)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute animate-twinkle rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting stars */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={`shooting-star-${i}`}
            className="absolute animate-shoot rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: starWidth,
              height: starHeight,
              background: `linear-gradient(45deg, ${starColor}, ${trailColor})`,
              animationDelay: `${Math.random() * (maxDelay - minDelay) + minDelay}ms`,
              animationDuration: `${Math.random() * (maxSpeed - minSpeed) + minSpeed}s`,
            }}
          />
        ))}
      </div>


    </div>
  );
}