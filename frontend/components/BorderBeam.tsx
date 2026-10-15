"use client";

import React from "react";

export type BorderBeamSize = "sm" | "md" | "lg" | "line";
export type BorderBeamColorVariant =
  | "default"
  | "colorful"
  | "saffron"
  | "subtle";

export interface BorderBeamProps {
  children: React.ReactNode;
  size?: BorderBeamSize;
  colorVariant?: BorderBeamColorVariant;
  duration?: number;          // seconds
  borderRadius?: number;      // px
  className?: string;
  style?: React.CSSProperties;
}

const GRADIENTS: Record<BorderBeamColorVariant, string> = {
  default:  "conic-gradient(from var(--beam-angle), transparent 75%, rgba(245,240,232,0.9) 80%, transparent 85%)",
  colorful: "conic-gradient(from var(--beam-angle), transparent 75%, #E8C547 78%, #C84B31 81%, #a78bfa 84%, transparent 87%)",
  saffron:  "conic-gradient(from var(--beam-angle), transparent 75%, #E8C547 80%, transparent 85%)",
  subtle:   "conic-gradient(from var(--beam-angle), transparent 75%, rgba(245,240,232,0.45) 80%, transparent 85%)",
};

// Beam width: "line" = very thin, else scale with size
const PADDING: Record<BorderBeamSize, number> = {
  line: 1,
  sm:   2,
  md:   3,
  lg:   4,
};

/**
 * BorderBeam — rotating conic-gradient beam that travels around the border.
 * Wraps children with a padding layer that shows the animated beam.
 */
export function BorderBeam({
  children,
  size = "line",
  colorVariant = "colorful",
  duration = 3,
  borderRadius = 9999,
  className,
  style,
}: BorderBeamProps) {
  const pad = PADDING[size];
  const gradient = GRADIENTS[colorVariant];
  const animName = `beam-rotate-${Math.round(duration * 10)}`;

  return (
    <>
      <style>{`
        @property --beam-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes ${animName} {
          to { --beam-angle: 360deg; }
        }
      `}</style>

      <div
        className={className}
        style={{
          position: "relative",
          padding: `${pad}px`,
          borderRadius: `${borderRadius + pad}px`,
          background: gradient,
          animation: `${animName} ${duration}s linear infinite`,
          ...style,
        }}
      >
        {/* Inner clipping layer — keeps children unaffected by gradient */}
        <div
          style={{
            position: "relative",
            borderRadius: `${borderRadius}px`,
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
