"use client";

import React, { type CSSProperties } from "react";

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  /** Animation speed in seconds (lower = faster). Default: 3 */
  speed?: number;
  /** Gradient start color. Default: brand saffron */
  colorFrom?: string;
  /** Gradient end color. Default: brand terracotta */
  colorTo?: string;
  style?: CSSProperties;
}

export function AnimatedGradientText({
  children,
  className = "",
  speed = 3,
  colorFrom = "#E8C547",
  colorTo = "#C84B31",
  style,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
        display: "inline-block",
        animation: `gradient-pan ${speed}s linear infinite`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
