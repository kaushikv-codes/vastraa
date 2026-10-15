"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { DotsThree, X } from "@phosphor-icons/react";
import { VastraaLogo } from "@/components/VastraaLogo";
import { AnimatedThemeToggler } from "@/components/AnimatedThemeToggler";
import { TextReveal } from "@/components/ui/cascade-text";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { Dock, DockIcon } from "@/components/ui/dock";

const MENU_LINKS = [
  { label: "Explore", href: "#products" },
  { label: "AI Stylist", href: "#stylist" },
  { label: "Your Looks", href: "#stylist" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.1rem 2rem",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--hairline)",
          // required for absolute-centered nav links
          position: "fixed" as const,
        }}
      >
        {/* Wordmark */}
        <a href="/" style={{ textDecoration: "none", color: "var(--ivory)" }}>
          <VastraaLogo src="/logo.svg.svg" size="2.4rem" />
        </a>

        {/* Center nav — absolutely positioned to true center */}
        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
        }}>
          {[
            { text: "EXPLORE -", href: "#products" },
            { text: "AI STYLIST", href: "#stylist" },
          ].map((link, i) => (
            <React.Fragment key={link.text}>
              {i > 0 && (
                <span style={{ color: "var(--muted)", fontSize: "0.1rem" }}>·</span>
              )}
              <TextReveal
                text={link.text}
                href={link.href}
                fontSize="1.01rem"
                staggerDelay={22}
                duration={260}
                gradientFrom="#C84B31"
                gradientTo="#c89d31ff"
                gradientSpeed={2}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontStyle: "italic",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  padding: "0.1em 0",
                }}
              />
            </React.Fragment>
          ))}
        </div>

        {/* Right — Dock with pop-up magnification */}
        <Dock
          iconSize={32}
          iconMagnification={1.2}
          iconDistance={100}
          className="gap-3"
        >
          {/* Your Look pill — wider, so override size via style */}
          <DockIcon
            style={{
              width: "auto",
              height: "auto",
              background: "transparent",
              border: "none",
            }}
          >
            <TextReveal
              text="YOUR LOOK"
              href="#stylist"
              fontSize="0.75rem"
              staggerDelay={18}
              duration={240}
              gradientFrom="#C84B31"
              gradientTo="#c89d31ff"
              gradientSpeed={2}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontStyle: "italic",
                fontWeight: 900,
                letterSpacing: "0.1em",
                textDecoration: "none",
                padding: "0.3em 0.9em",
                border: "1px solid var(--hairline)",
                borderRadius: "999px",
                background: "rgba(245,240,232,0.04)",
                whiteSpace: "nowrap",
              }}
            />
          </DockIcon>

          {/* Theme toggler */}
          <DockIcon
            style={{
              background: "rgba(245,240,232,0.06)",
              border: "1px solid var(--hairline)",
            }}
          >
            <AnimatedThemeToggler
              theme={resolvedTheme === "light" ? "light" : "dark"}
              onThemeChange={setTheme}
            />
          </DockIcon>

          {/* Menu */}
          <DockIcon
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            style={{
              background: "rgba(245,240,232,0.06)",
              border: "1px solid var(--hairline)",
              color: "var(--muted)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open
                ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={14} weight="light" /></motion.span>
                : <motion.span key="dots" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><DotsThree size={16} weight="bold" /></motion.span>
              }
            </AnimatePresence>
          </DockIcon>
        </Dock>
      </nav>

      {/* Full-screen menu — Skiper UI TextRoll links */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 flex flex-col justify-center items-center"
            style={{ background: "var(--overlay-bg)", backdropFilter: "blur(16px)" }}
          >
            <ul className="flex flex-col items-center gap-3 px-7 py-3">
              {MENU_LINKS.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.32, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex cursor-pointer flex-col items-center overflow-visible"
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{ textDecoration: "none", color: "var(--ivory)" }}
                  >
                    <TextReveal
                      text={link.label}
                      as="span"
                      className="text-5xl font-extrabold uppercase tracking-tight"
                      fontSize="3rem"
                      staggerDelay={28}
                      duration={280}
                      gradientFrom="#C84B31"
                      gradientTo="#c89d31ff"
                      gradientSpeed={2.5}
                      style={{
                        fontFamily: "var(--font-display)",
                        lineHeight: 1.1,
                      }}
                    />
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* Bottom hint */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="absolute bottom-10 text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}
            >
              press esc or click outside to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
