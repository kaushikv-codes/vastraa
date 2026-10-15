"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * ASMRStaticBackground
 * High-density particle system — magnetic vortex on hover, friction glow.
 * Fixed behind all page content (z-index: 0).
 * Theme-aware: dark charcoal particles on dark bg, softer dust on light bg.
 */
export function ASMRStaticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isLight = resolvedTheme === "light";

    let width: number;
    let height: number;
    let animationFrameId: number;
    const mouse = { x: -1000, y: -1000 };

    const PARTICLE_COUNT = 350;
    const MAGNETIC_RADIUS = 280;
    const VORTEX_STRENGTH = 0.07;
    const PULL_STRENGTH = 0.12;

    // Theme-driven colors
    const BG_FILL   = isLight ? "rgba(247, 244, 239, 0.25)" : "rgba(10, 10, 12, 0.18)";
    // Dark mode: 70% charcoal + 30% glass-shard
    // Light mode: 70% warm dust + 30% pale gold
    const colorA = isLight ? "160, 150, 135" : "80, 80, 85";   // charcoal / warm dust
    const colorB = isLight ? "220, 190, 120" : "240, 245, 255"; // pale gold / glass

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0;
      size = 0; alpha = 0; color = "";
      rotation = 0; rotationSpeed = 0; frictionGlow = 0;

      constructor() { this.reset(); }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 0.6 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.color = Math.random() > 0.7 ? colorB : colorA;
        this.alpha = Math.random() * 0.12 + (isLight ? 0.03 : 0.04);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
        this.frictionGlow = 0;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNETIC_RADIUS && dist > 0) {
          const force = (MAGNETIC_RADIUS - dist) / MAGNETIC_RADIUS;
          this.vx += (dx / dist) * force * PULL_STRENGTH;
          this.vy += (dy / dist) * force * PULL_STRENGTH;
          this.vx += (dy / dist) * force * VORTEX_STRENGTH * 10;
          this.vy -= (dx / dist) * force * VORTEX_STRENGTH * 10;
          this.frictionGlow = force * 0.7;
        } else {
          this.frictionGlow *= 0.92;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.04;
        this.rotation += this.rotationSpeed + (Math.abs(this.vx) + Math.abs(this.vy)) * 0.05;

        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
        if (this.y < -20) this.y = height + 20;
        if (this.y > height + 20) this.y = -20;
      }

      draw() {
        ctx!.save();
        ctx!.translate(this.x, this.y);
        ctx!.rotate(this.rotation);

        const finalAlpha = Math.min(this.alpha + this.frictionGlow, 0.9);
        ctx!.fillStyle = `rgba(${this.color}, ${finalAlpha})`;

        if (this.frictionGlow > 0.3) {
          ctx!.shadowBlur = 8 * this.frictionGlow;
          ctx!.shadowColor = isLight
            ? `rgba(220, 160, 60, ${this.frictionGlow})`   // warm amber glow in light
            : `rgba(180, 220, 255, ${this.frictionGlow})`; // blue-white glow in dark
        }

        // Diamond / shard geometry
        ctx!.beginPath();
        ctx!.moveTo(0, -this.size * 2.5);
        ctx!.lineTo(this.size, 0);
        ctx!.lineTo(0, this.size * 2.5);
        ctx!.lineTo(-this.size, 0);
        ctx!.closePath();
        ctx!.fill();
        ctx!.restore();
      }
    }

    let particles: Particle[] = [];

    const init = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    };

    const render = () => {
      ctx.fillStyle = BG_FILL;
      ctx.fillRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(render);
    };

    const onMouse = (e: MouseEvent)  => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onTouch = (e: TouchEvent)  => {
      if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
    };
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000; };

    window.addEventListener("resize",    init);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    init();
    render();

    return () => {
      window.removeEventListener("resize",    init);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]); // re-init when theme changes

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
