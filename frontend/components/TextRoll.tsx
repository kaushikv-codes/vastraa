"use client";

import { motion, type Transition, type Target, type TargetAndTransition, type VariantLabels } from "motion/react";
import { cn } from "@/lib/utils";
import React from "react";

const STAGGER = 0.035;

/**
 * TextRoll — Skiper UI letter-roll animation.
 * Each character slides up (out) and a clone slides in from below on hover.
 * center=true staggers from the middle character outward.
 * hoverColor applies to the incoming (bottom) layer.
 */
export const TextRoll: React.FC<{
  children: string;
  className?: string;
  style?: React.CSSProperties;
  center?: boolean;
  hoverColor?: string;
}> = ({ children, className, style, center = false, hoverColor }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{ lineHeight: 0.85, ...style }}
    >
      {/* First layer — slides out upward on hover */}
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;
          return (
            <motion.span
              key={i}
              variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
              transition={{ ease: "easeInOut", delay }}
              className="inline-block"
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>

      {/* Second layer — slides in from below on hover */}
      <div className="absolute inset-0" style={hoverColor ? { color: hoverColor } : undefined}>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;
          return (
            <motion.span
              key={i}
              variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
              transition={{ ease: "easeInOut", delay }}
              className="inline-block"
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TextRollFlip — motion-primitives rotateX 3D barrel-roll per character.
// Plays on mount (enter flips in), hover reversal via parent whileHover.
// ─────────────────────────────────────────────────────────────────────────────
export type TextRollFlipProps = {
  children: string;
  duration?: number;
  getEnterDelay?: (index: number) => number;
  getExitDelay?: (index: number) => number;
  className?: string;
  style?: React.CSSProperties;
  transition?: Transition;
  variants?: {
    enter: { initial: Target | VariantLabels | boolean; animate: TargetAndTransition | VariantLabels };
    exit:  { initial: Target | VariantLabels | boolean; animate: TargetAndTransition | VariantLabels };
  };
  onAnimationComplete?: () => void;
};

export function TextRollFlip({
  children,
  duration = 0.45,
  getEnterDelay = (i) => i * 0.055,
  getExitDelay  = (i) => i * 0.055 + 0.12,
  className,
  style,
  transition = { ease: "easeInOut" },
  variants,
  onAnimationComplete,
}: TextRollFlipProps) {
  const dv = {
    enter: { initial: { rotateX: 0  }, animate: { rotateX: 90 } },
    exit:  { initial: { rotateX: 90 }, animate: { rotateX: 0  } },
  } as const;

  const letters = children.split("");

  return (
    <span className={className} style={style}>
      {letters.map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "relative",
            display: "inline-block",
            perspective: "10000px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Top half — flips away on mount */}
          <motion.span
            style={{ position: "absolute", display: "inline-block", backfaceVisibility: "hidden", transformOrigin: "50% 25%" }}
            initial={variants?.enter?.initial ?? dv.enter.initial}
            animate={variants?.enter?.animate ?? dv.enter.animate}
            transition={{ ...transition, duration, delay: getEnterDelay(i) }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>

          {/* Bottom half — flips in on mount */}
          <motion.span
            style={{ position: "absolute", display: "inline-block", backfaceVisibility: "hidden", transformOrigin: "50% 100%" }}
            initial={variants?.exit?.initial ?? dv.exit.initial}
            animate={variants?.exit?.animate ?? dv.exit.animate}
            transition={{ ...transition, duration, delay: getExitDelay(i) }}
            onAnimationComplete={letters.length === i + 1 ? onAnimationComplete : undefined}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>

          {/* Invisible spacer keeps the width */}
          <span style={{ visibility: "hidden" }}>{letter === " " ? "\u00A0" : letter}</span>
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </span>
  );
}
