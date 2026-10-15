"use client";

import * as React from "react";

export interface WorksWheelItem {
  title: string;
  image: string;
  href?: string;
}

export interface WorksWheelProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items: WorksWheelItem[];
  label?: string;
  action?: string;
}

const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const TITLE = 0.124;
const INDEX = 0.04;
const CULL = 1.6;
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;

type Stage = { w: number; h: number };

const bowAt = (drumDeg: number, bow: number) => -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "The Edit",
  action = "View",
  className = "",
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW, cardH, ringR, ringScale, drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: Math.max(cardH * TITLE, 14),
      index: Math.max(cardH * INDEX, 10),
    };
  }, [stage, count]);

  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(d * (360 / count), drumDeg, ringR, drumR, bow, m);
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback(
    (next: number) => { target.current = clamp(next, 0, last + 1); },
    [last],
  );

  const settling = React.useRef(0);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (!isHovered.current) return; // cursor not over wheel — let Lenis handle it
      const next = target.current + event.deltaY / WHEEL_UNITS;
      event.stopPropagation();
      if (next > 0 && next < last + 1) event.preventDefault();
      to(next);
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  const drag = React.useRef<number | null>(null);
  const isHovered = React.useRef(false);

  return (
    <section
      aria-label={label}
      className={`relative h-full min-h-[24rem] w-full overflow-hidden select-none ${className}`}
      style={{ background: "var(--black)", color: "var(--ivory)" }}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="absolute inset-0 cursor-grab outline-none active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px`, touchAction: "none" }}
        onMouseMove={(e) => {
          const rect = stageRef.current?.getBoundingClientRect();
          if (!rect) { isHovered.current = false; return; }
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Wheel zone = circle of radius 1.8 × card width around center.
          // Everything outside (title, index list, scroll hint) stays as page scroll.
          isHovered.current = dist < metrics.cardW * 1.8;
        }}
        onMouseLeave={() => { isHovered.current = false; }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
          drag.current = event.clientY;
        }}
        onPointerUp={() => {
          drag.current = null;
          if (target.current > 1) to(Math.round(target.current));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item, i) => {
            const Tag = (item.href ? "a" : "div") as "a";
            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={i === active}
                  href={item.href}
                  ref={(node: HTMLElement | null) => { cardRefs.current[i] = node; }}
                  className="group absolute"
                  style={{
                    backfaceVisibility: "hidden",
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                    textDecoration: "none",
                  }}
                >
                  <span
                    className="relative block overflow-hidden rounded-xl"
                    style={{
                      width: "100%", height: "100%",
                      boxShadow: "0 18px 40px -18px rgba(0,0,0,0.7)",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    {/* Gradient overlay */}
                    <span
                      style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 55%)",
                        pointerEvents: "none",
                      }}
                    />
                    {/* Title on card */}
                    <span
                      style={{
                        position: "absolute", bottom: "1rem", left: "1rem", right: "1rem",
                        fontSize: "0.8rem", fontWeight: 600,
                        color: "#F5F0E8", lineHeight: 1.3,
                        fontFamily: "var(--font-body)",
                        pointerEvents: "none",
                      }}
                    >
                      {item.title}
                    </span>
                    {action && item.href ? (
                      <span
                        className="group-hover:opacity-100 group-hover:translate-y-0"
                        style={{
                          position: "absolute", right: "0.75rem", bottom: "0.75rem",
                          display: "flex", alignItems: "center", gap: "0.25rem",
                          padding: "0.25rem 0.625rem",
                          background: "rgba(245,240,232,0.15)",
                          borderRadius: "999px", fontSize: "0.65rem",
                          color: "#F5F0E8", backdropFilter: "blur(8px)",
                          opacity: 0, transform: "translateY(4px)",
                          transition: "opacity 0.2s, transform 0.2s",
                          pointerEvents: "none",
                        }}
                      >
                        <svg viewBox="0 0 12 12" style={{ width: "0.625rem", height: "0.625rem" }} aria-hidden="true">
                          <path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {action}
                      </span>
                    ) : null}
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Ring centre label */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center"
        style={{
          fontSize: metrics.title,
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          color: "var(--ivory)",
        }}
      >
        {label}
      </div>

      {/* Front-card title */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{
          left: "8%",
          fontSize: metrics.title,
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          color: "var(--ivory)",
          opacity: 0,
        }}
      >
        {items[active]?.title}
      </div>

      {/* Index list */}
      <ol
        className="absolute text-right"
        style={{
          top: "7.5%", right: "2.5%",
          fontSize: metrics.index,
          lineHeight: 1.75,
          color: "var(--muted)",
        }}
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => to(i + 1)}
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                color: i === active ? "var(--ivory)" : "var(--muted)",
                fontWeight: i === active ? 600 : 400,
                fontFamily: "var(--font-body)",
                fontSize: "inherit",
                transition: "color 0.2s",
                outline: "none",
              }}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      {/* Scroll hint */}
      <p
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2"
        style={{
          fontSize: "0.6rem", letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--muted)",
          opacity: 0.55,
        }}
      >
        Scroll or drag to explore
      </p>
    </section>
  );
}

export default WorksWheel;
