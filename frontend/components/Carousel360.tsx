"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";

// ── Fashion images for the 3D ring ──────────────────────────────
const RING_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=300&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582295798892-6cde35b07f45?w=300&q=80&auto=format&fit=crop",
];

const AUTOPLAY_MS    = 2600;
const RADIUS_MIN     = 110;
const RADIUS_MAX     = 300;
const RADIUS_RATIO   = 0.52;
const PERSPECTIVE_MX = 2.4;
const TILT_DEG       = 36;
const CROSSFADE_S    = 0.42;

const springTransition = {
  type: "spring" as const,
  stiffness: 60,
  damping: 16,
  mass: 0.7,
};

// Small spinner shown while image loads
function Spinner() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(245,240,232,0.04)",
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: "2px solid rgba(245,240,232,0.15)",
        borderTopColor: "rgba(245,240,232,0.6)",
        animation: "spin 0.8s linear infinite",
      }} />
    </div>
  );
}

interface Carousel360Props {
  images?: string[];
  autoplayInterval?: number;
  /** Optional extra class names */
  className?: string;
}

export function Carousel360({
  images = RING_IMAGES,
  autoplayInterval = AUTOPLAY_MS,
}: Carousel360Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius]     = useState(220);
  const [loadedThumbs, setLoadedThumbs] = useState<boolean[]>(() => images.map(() => false));
  const [centerLoaded, setCenterLoaded] = useState(false);

  const numImages = images.length;
  const angleStep = 360 / numImages;

  const steps       = Math.round(rotation / angleStep);
  const centerIndex = ((-steps % numImages) + numImages) % numImages;
  const centerImage = images[centerIndex];

  const [prevCenter, setPrevCenter] = useState(centerIndex);
  if (centerIndex !== prevCenter) {
    setPrevCenter(centerIndex);
    setCenterLoaded(false);
  }

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.offsetWidth;
      setRadius(Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, w * RADIUS_RATIO)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRotation((r) => r + angleStep), autoplayInterval);
    return () => clearInterval(id);
  }, [angleStep, autoplayInterval]);

  const rotate = useCallback(
    (dir: "left" | "right") => setRotation((r) => r + (dir === "left" ? -angleStep : angleStep)),
    [angleStep]
  );

  const markThumb = useCallback((i: number) => {
    setLoadedThumbs((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }, []);

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", userSelect: "none", padding: "2.5rem 0 2rem" }}>

        {/* 3D ring stage */}
        <div
          ref={containerRef}
          style={{ position: "relative", width: "92%", maxWidth: "600px", aspectRatio: "5/3", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%", perspective: `${radius * PERSPECTIVE_MX}px` }}>

            {/* Orbiting thumbnails */}
            {images.map((src, i) => {
              const targetAngle = rotation + angleStep * i;
              return (
                <motion.div
                  key={src}
                  style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transformStyle: "preserve-3d",
                  }}
                  animate={{ rotateY: targetAngle }}
                  transition={springTransition}
                >
                  <motion.div
                    style={{
                      position: "relative", borderRadius: "10px", overflow: "hidden",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
                      transformStyle: "preserve-3d",
                    }}
                    animate={{ rotateY: -targetAngle, rotateX: TILT_DEG, z: radius }}
                    transition={springTransition}
                  >
                    {!loadedThumbs[i] && <Spinner />}
                    <img
                      src={src}
                      alt={`Look ${i + 1}`}
                      width={80}
                      height={80}
                      onLoad={() => markThumb(i)}
                      style={{
                        display: "block", objectFit: "cover",
                        width: "clamp(48px, 6vw, 80px)", height: "clamp(48px, 6vw, 80px)",
                        opacity: loadedThumbs[i] ? 0.88 : 0,
                        transition: "opacity 0.3s",
                      }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Center featured image */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 10, pointerEvents: "none",
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={centerIndex}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: CROSSFADE_S, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "relative", borderRadius: "16px", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.28)" }}
                >
                  {!centerLoaded && <Spinner />}
                  <img
                    src={centerImage}
                    alt="Featured look"
                    width={280}
                    height={280}
                    onLoad={() => setCenterLoaded(true)}
                    style={{
                      display: "block", objectFit: "cover",
                      width: "clamp(160px, 18vw, 280px)", height: "clamp(160px, 18vw, 280px)",
                      opacity: centerLoaded ? 1 : 0,
                      transition: "opacity 0.3s",
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Prev / Next buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.75rem", zIndex: 30 }}>
          {(["left", "right"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir === "left" ? "Previous" : "Next"}
              onClick={() => rotate(dir)}
              style={{
                position: "relative", width: 36, height: 36, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", border: "1px solid var(--hairline)",
                background: "var(--neutral)", color: "var(--ivory)",
                transition: "background 0.2s, border-color 0.2s, color 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--saffron)";
                el.style.borderColor = "var(--saffron)";
                el.style.color = "#080808";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--neutral)";
                el.style.borderColor = "var(--hairline)";
                el.style.color = "var(--ivory)";
              }}
            >
              {dir === "left"
                ? <ArrowLeft size={13} weight="bold" />
                : <ArrowRight size={13} weight="bold" />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
