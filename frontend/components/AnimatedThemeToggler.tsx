"use client";

import { motion, AnimatePresence } from "motion/react";

interface Props {
  theme: "dark" | "light";
  onThemeChange: (theme: string) => void;
}

export function AnimatedThemeToggler({ theme, onThemeChange }: Props) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => onThemeChange(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        /* var(--neutral) = #111 in dark, #EDEAE4 in light — always a visible surface */
        background: "var(--neutral)",
        /* var(--hairline) adapts to both themes */
        border: "1px solid var(--hairline)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--saffron)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--saffron)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--neutral)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)";
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          /* Moon — shown in dark mode, ivory colored */
          <motion.svg
            key="moon"
            xmlns="http://www.w3.org/2000/svg"
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            /* var(--ivory) = #F5F0E8 in dark (light icon on dark bg) ✓ */
            style={{ color: "var(--ivory)" }}
            initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        ) : (
          /* Sun — shown in light mode, dark colored */
          <motion.svg
            key="sun"
            xmlns="http://www.w3.org/2000/svg"
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            /* var(--ivory) = #1A1814 in light mode (dark icon on light bg) ✓ */
            style={{ color: "var(--ivory)" }}
            initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
