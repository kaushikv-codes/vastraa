"use client";

import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/dist/lenis-react.mjs";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
