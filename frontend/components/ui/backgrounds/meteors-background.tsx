"use client";

import React from "react";

interface MeteorsBackgroundProps {
  className?: string;
  number?: number;
}

export function MeteorsBackground({ className, number = 20 }: MeteorsBackgroundProps) {
  const meteors = new Array(number).fill(true);

  return (
    <div className={[
      "relative h-full w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black",
      className
    ].filter(Boolean).join(" ")}>
      {meteors.map((_, idx) => (
        <span
          key={"meteor" + idx}
          className={[
            "absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor-effect rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
          ].join(" ")}
          style={{
            top: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
            animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
            animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
          }}
        ></span>
      ))}
    </div>
  );
}