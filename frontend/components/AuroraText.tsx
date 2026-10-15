"use client";

import React, { memo } from "react";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
  style?: React.CSSProperties;
}

export const AuroraText = memo(function AuroraText({
  children,
  className = "",
  colors = ["#E8C547", "#C84B31", "#F5F0E8", "#E8C547"],
  speed = 1,
  style,
}: AuroraTextProps) {
  return (
    <span
      className={`animate-aurora ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${colors.join(", ")}, ${colors[0]})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        backgroundSize: "200% auto",
        animationDuration: `${10 / speed}s`,
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </span>
  );
});
