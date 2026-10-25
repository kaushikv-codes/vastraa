"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { DotsThree, X } from "@phosphor-icons/react";
import { VastraaLogo } from "@/components/VastraaLogo";
import { AnimatedThemeToggler } from "@/components/AnimatedThemeToggler";
import { TextReveal } from "@/components/ui/cascade-text";
import { Dock, DockIcon } from "@/components/ui/dock";
import { useApp } from "@/contexts/AppContext";

const MENU_LINKS = [
  { label: "Explore", href: "#products" },
  { label: "AI Stylist", href: "#stylist" },
  { label: "Your Looks", href: "#stylist" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { openAccountSidebar, openLooksDrawer, looksCount, generatingCount } = useApp();

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
          ].map((link) => (
            <TextReveal
              key={link.text}
              text={link.text}
              href={link.href}
              fontSize="1.01rem"
              staggerDelay={22}
              duration={260}
              gradientFrom="#C84B31"
              gradientTo="#C84B31"
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
          ))}
        </div>

        {/* Right — Dock with pop-up magnification */}
        <Dock
          iconSize={32}
          iconMagnification={1.2}
          iconDistance={100}
          className="gap-3"
        >
          {/* Your Looks pill — opens LooksDrawer */}
          <DockIcon
            style={{ width: "auto", height: "auto", background: "transparent", border: "none" }}
          >
            <button
              onClick={openLooksDrawer}
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontStyle: "italic",
                fontWeight: 900,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                padding: "0.3em 0.9em",
                border: "1px solid var(--hairline)",
                borderRadius: "999px",
                background: "rgba(245,240,232,0.04)",
                whiteSpace: "nowrap",
                color: "var(--ivory)",
                display: "flex",
                alignItems: "center",
                gap: "0.4em",
                position: "relative",
              }}
            >
              YOUR LOOKS
              {(looksCount > 0 || generatingCount > 0) && (
                <span style={{
                  minWidth: 16, height: 16, borderRadius: "9999px",
                  background: "var(--terracotta)",
                  fontSize: "0.6rem", color: "#fff", fontWeight: 700,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "0 4px",
                }}>
                  {generatingCount > 0 ? generatingCount : looksCount}
                </span>
              )}
            </button>
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

          {/* Menu — opens AccountSidebar */}
          <DockIcon
            onClick={openAccountSidebar}
            aria-label="Menu"
            style={{
              background: "rgba(245,240,232,0.06)",
              border: "1px solid var(--hairline)",
              color: "var(--muted)",
            }}
          >
            <DotsThree size={16} weight="bold" />
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
                      gradientTo="#C84B31"
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
