"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);

  const ringX = useSpring(dotX, { stiffness: 120, damping: 22 });
  const ringY = useSpring(dotY, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [dotX, dotY]);

  return (
    <>
      {/* Dot — follows instantly */}
      <motion.div
        className="cursor-dot"
        style={{ left: dotX, top: dotY }}
      />
      {/* Ring — follows with spring lag */}
      <motion.div
        className="cursor-ring"
        style={{ left: ringX, top: ringY }}
      />
    </>
  );
}
