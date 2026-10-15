"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MagnifyingGlass, Camera } from "@phosphor-icons/react";
import { TextRoll } from "@/components/TextRoll";
import { BorderBeam } from "@/components/BorderBeam";

const SUGGESTIONS = [
  "lehenga under ₹6000",
  "office kurta not boring",
  "wedding guest but not overdressed",
  "date night Indian style",
];

export function Hero() {
  const [query, setQuery] = useState("");

  return (
    <section
      style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div className="container" style={{ paddingTop: "7rem", paddingBottom: "5rem", textAlign: "center" }}>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--ivory)",
            fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            maxWidth: "720px",
            margin: "0 auto 1.25rem",
          }}
        >
          <TextRoll center className="block" style={{ fontFamily: "var(--font-display)", color: "var(--ivory)", fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit" }}>
            Style the occasion.
          </TextRoll>
          <TextRoll center hoverColor="var(--ivory)" className="block" style={{ fontFamily: "var(--font-display)", color: "var(--terracotta)", fontStyle: "italic", fontSize: "inherit", fontWeight: "inherit", letterSpacing: "inherit" }}>
            AI picks for you.
          </TextRoll>
        </motion.h1>

        {/* Bullet subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            color: "var(--muted)",
            fontSize: "0.875rem",
            marginBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <span
            style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "var(--saffron)", display: "inline-block", flexShrink: 0,
            }}
          />
          Describe your event — we build the complete look.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "560px", margin: "0 auto 0.75rem" }}
        >
          <BorderBeam size="line" colorVariant="colorful" duration={3.1} borderRadius={9999}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.875rem 1.25rem",
                borderRadius: "9999px",
                background: "var(--neutral)",
              }}
            >
              <Camera size={17} color="var(--muted)" weight="light" style={{ flexShrink: 0 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "lehenga for a wedding under ₹8000"'
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "0.875rem",
                  color: "var(--ivory)",
                  fontFamily: "var(--font-body)",
                  caretColor: "var(--saffron)",
                }}
              />
              <button
                style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: "var(--ivory)", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--black)", flexShrink: 0, transition: "background 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--saffron)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--ivory)")}
              >
                <MagnifyingGlass size={14} weight="bold" />
              </button>
            </div>
          </BorderBeam>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          style={{
            color: "var(--muted)", fontSize: "0.75rem",
            fontStyle: "italic", marginBottom: "1.75rem",
            fontFamily: "var(--font-body)",
          }}
        >
          Be specific or vague. Describe the mood. We will find it.
        </motion.p>

        {/* Chips */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.5 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.625rem" }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              style={{
                fontSize: "0.75rem",
                padding: "0.45rem 1rem",
                borderRadius: "9999px",
                background: "transparent",
                border: "1px solid var(--hairline)",
                color: "var(--muted)",
                fontFamily: "var(--font-body)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,240,232,0.3)";
                (e.currentTarget as HTMLElement).style.color = "var(--ivory)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)";
                (e.currentTarget as HTMLElement).style.color = "var(--muted)";
              }}
            >
              {s}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
