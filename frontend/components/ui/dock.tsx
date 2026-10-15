"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useRef } from "react";

// ── Dock container ────────────────────────────────────────────────────────
interface DockProps {
  className?: string;
  /** Base size of icons in px. Default: 36 */
  iconSize?: number;
  /** Scale multiplier at cursor. Default: 1.45 */
  iconMagnification?: number;
  /** Pixel radius of magnification influence. Default: 120 */
  iconDistance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Dock({
  className = "",
  children,
  iconSize = 36,
  iconMagnification = 1.45,
  iconDistance = 120,
  style,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-center gap-3 ${className}`}
      style={style}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<DockIconProps>, {
              _mouseX: mouseX,
              _iconSize: iconSize,
              _magnification: iconMagnification,
              _distance: iconDistance,
            })
          : child
      )}
    </motion.div>
  );
}

// ── DockIcon ──────────────────────────────────────────────────────────────
interface DockIconProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  "aria-label"?: string;
  // injected by Dock — prefixed with _ to avoid HTML attribute warnings
  _mouseX?: ReturnType<typeof useMotionValue<number>>;
  _iconSize?: number;
  _magnification?: number;
  _distance?: number;
}

export function DockIcon({
  className = "",
  children,
  style,
  onClick,
  "aria-label": ariaLabel,
  _mouseX,
  _iconSize = 36,
  _magnification = 1.45,
  _distance = 120,
}: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Always create the motion value (Rules of Hooks)
  const fallback = useMotionValue(Infinity);
  const mx = _mouseX ?? fallback;

  const distanceCalc = useTransform(mx, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - (bounds.left + bounds.width / 2);
  });

  const scaleTransform = useTransform(
    distanceCalc,
    [-_distance, 0, _distance],
    [1, _magnification, 1]
  );

  const scale = useSpring(scaleTransform, {
    mass: 0.1,
    stiffness: 180,
    damping: 14,
  });

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        scale,
        width: _iconSize,
        height: _iconSize,
        transformOrigin: "bottom center",
        ...style,
      }}
      className={`flex items-center justify-center rounded-full cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}
