"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { VastraaLogo } from "@/components/VastraaLogo";

// ── Shared animation targets ─────────────────────────────────
const init = { pathLength: 0, opacity: 0 };
const anim = { pathLength: 1, opacity: 1 };

// ── "Hello" SVG — Apple handwriting effect ───────────────────
function HelloSVG({ onComplete }: { onComplete: () => void }) {
  const s = 1; // speed multiplier
  const c = (x: number) => x * s;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 638 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="14.8883"
      style={{ height: "clamp(56px, 8vw, 96px)", color: "#F5F0E8" }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <title>hello</title>
      {/* h1 */}
      <motion.path
        d="M8.69214 166.553C36.2393 151.239 61.3409 131.548 89.8191 98.0295C109.203 75.1488 119.625 49.0228 120.122 31.0026C120.37 17.6036 113.836 7.43883 101.759 7.43883C88.3598 7.43883 79.9231 17.6036 74.7122 40.9363C69.005 66.5793 64.7866 96.0036 54.1166 190.356"
        strokeLinecap="round"
        initial={init} animate={anim}
        transition={{ duration: c(0.8), ease: "easeInOut", opacity: { duration: 0.4 } }}
      />
      {/* h2, ello */}
      <motion.path
        d="M55.1624 181.135C60.6251 133.114 81.4118 98.0479 107.963 98.0479C123.844 98.0479 133.937 110.703 131.071 128.817C129.457 139.487 127.587 150.405 125.408 163.06C122.869 178.941 130.128 191.348 152.122 191.348C184.197 191.348 219.189 173.523 237.097 145.915C243.198 136.509 245.68 128.073 245.928 119.884C246.176 104.996 237.739 93.8296 222.851 93.8296C203.992 93.8296 189.6 115.17 189.6 142.465C189.6 171.745 205.481 192.341 239.208 192.341C285.066 192.341 335.86 137.292 359.199 75.8585C365.788 58.513 368.26 42.4065 368.26 31.1512C368.26 17.8057 364.042 7.55823 352.131 7.55823C340.469 7.55823 332.777 16.6141 325.829 30.9129C317.688 47.4967 311.667 71.4162 309.203 98.4549C303 166.301 316.896 191.348 349.936 191.348C390 191.348 434.542 135.534 457.286 75.6686C463.803 58.513 466.275 42.4065 466.275 31.1512C466.275 17.8057 462.057 7.55823 450.146 7.55823C438.484 7.55823 430.792 16.6141 423.844 30.9129C415.703 47.4967 409.682 71.4162 407.218 98.4549C401.015 166.301 414.911 191.348 444.416 191.348C473.874 191.348 489.877 165.67 499.471 138.402C508.955 111.447 520.618 94.8221 544.935 94.8221C565.035 94.8221 580.916 109.71 580.916 137.75C580.916 168.768 560.792 192.093 535.362 192.341C512.984 192.589 498.285 174.475 499.774 147.179C501.511 116.907 519.873 94.8221 543.943 94.8221C557.839 94.8221 569.51 100.999 578.682 107.725C603.549 125.866 622.709 114.656 630.047 96.7186"
        strokeLinecap="round"
        initial={init} animate={anim}
        transition={{
          duration: c(2.8), ease: "easeInOut",
          delay: c(0.7),
          opacity: { duration: 0.7, delay: c(0.7) },
        }}
        onAnimationComplete={onComplete}
      />
    </motion.svg>
  );
}

// ── "नमस्ते" — staggered character wipe-up ───────────────────
const NAMASTE_CHARS = ["न", "म", "स्", "ते"];

function NamasteSVG({ startDelay }: { startDelay: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.08em", overflow: "hidden" }}>
      {NAMASTE_CHARS.map((ch, i) => (
        <div key={i} style={{ overflow: "hidden", lineHeight: 1 }}>
          <motion.span
            style={{
              display: "block",
              fontFamily: "'Noto Sans Devanagari', 'Mangal', serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 300,
              color: "#F5F0E8",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.65,
              delay: startDelay + i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {ch}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

// ── Vastraa logo mark — same SVG as nav ────────────────────────
function LogoMark() {
  return (
    <motion.div
      style={{ marginTop: "3rem" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      <VastraaLogo
          src="/logo.svg.svg"
          size="3rem"
          colorFilter="brightness(0) saturate(100%) invert(35%) sepia(72%) saturate(800%) hue-rotate(338deg) brightness(90%)"
        />
    </motion.div>
  );
}

// ── Main IntroScreen ───────────────────────────────────────────
interface IntroScreenProps {
  onComplete: () => void;
}

type Phase = "hello" | "namaste" | "done";

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<Phase>("hello");

  // When hello SVG finishes → switch to namaste
  const onHelloDone = () => setPhase("namaste");

  // After namaste appears, wait then exit
  useEffect(() => {
    if (phase !== "namaste") return;
    // नमस्ते chars stagger over ~0.7s total; wait for them + hold
    const id = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 1800);
    return () => clearTimeout(id);
  }, [phase, onComplete]);

  // Safety net — if something hangs, force exit at 8s
  useEffect(() => {
    const id = setTimeout(onComplete, 8000);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <motion.div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#080808",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Grain */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* Saffron dot */}
      <motion.div
        style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8C547", marginBottom: "2.5rem", position: "relative" }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: "backOut" }}
      />

      {/* Word swap — hello then namaste */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "clamp(80px, 10vw, 120px)" }}>
        <AnimatePresence mode="wait">
          {phase === "hello" && (
            <motion.div
              key="hello"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: "easeIn" }}
            >
              <HelloSVG onComplete={onHelloDone} />
            </motion.div>
          )}

          {(phase === "namaste" || phase === "done") && (
            <motion.div
              key="namaste"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <NamasteSVG startDelay={0} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vastraa wordmark */}
      <LogoMark />
    </motion.div>
  );
}
