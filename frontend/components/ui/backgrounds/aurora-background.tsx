"use client";

import React from "react";

interface AuroraBackgroundProps {
  className?: string;
  showRadialGradient?: boolean;
}

export function AuroraBackground({ 
  className, 
  showRadialGradient = true 
}: AuroraBackgroundProps) {
  return (
    <div className={[
      "relative h-full w-full overflow-hidden bg-slate-950",
      className
    ].filter(Boolean).join(" ")}>
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />
        
        {/* Aurora effects */}
        <div className="absolute inset-0 animate-aurora-1">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-green-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="absolute inset-0 animate-aurora-2">
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/15 rounded-full blur-2xl" />
          <div className="absolute bottom-1/3 left-1/4 w-88 h-88 bg-cyan-400/15 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl" />
        </div>

        {/* Overlay gradient for depth */}
        {showRadialGradient && (
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/50 to-slate-950" />
        )}
      </div>


    </div>
  );
}