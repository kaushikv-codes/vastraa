"use client";

import { motion } from "motion/react";
import { ArrowRight, InstagramLogo, GithubLogo } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--hairline)", marginBottom: "3rem" }}>

      {/* ── CTA Block ──────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--hairline)" }}>
        <div className="container" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{
              fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.22em",
              color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "1.25rem",
            }}>
              Ready to wear the occasion
            </p>

            <h2 style={{
              fontFamily: "var(--font-display)",
              color: "var(--ivory)",
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: "2.25rem",
              maxWidth: "640px",
            }}>
              Your look starts here.
            </h2>

            <a
              href="#stylist"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.625rem",
                padding: "0.875rem 2rem", fontSize: "0.78rem",
                textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 500,
                background: "var(--saffron)", color: "var(--black)",
                fontFamily: "var(--font-body)", textDecoration: "none",
                borderRadius: "4px", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--ivory)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--saffron)")}
            >
              Get Styled by AI
              <ArrowRight size={13} weight="bold" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Links Row ──────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--hairline)" }}>
        <div
          className="container"
          style={{
            paddingTop: "1.75rem", paddingBottom: "1.75rem",
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between", gap: "1.5rem",
          }}
        >
          {/* Wordmark */}
          <p style={{
            fontFamily: "var(--font-display)", color: "var(--ivory)",
            fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em",
          }}>
            vastraa
          </p>

          {/* Nav links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
            {["Products", "AI Stylist", "Virtual Try-On", "B2B API"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.14em",
                  color: "var(--muted)", textDecoration: "none",
                  fontFamily: "var(--font-body)", transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ivory)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <a href="https://github.com" aria-label="GitHub"
              style={{ color: "var(--muted)", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ivory)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}>
              <GithubLogo size={16} weight="light" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram"
              style={{ color: "var(--muted)", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ivory)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--muted)")}>
              <InstagramLogo size={16} weight="light" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Copyright ──────────────────────── */}
      <div className="container" style={{ paddingTop: "1.25rem", paddingBottom: "1.25rem" }}>
        <p style={{
          fontSize: "0.68rem", color: "var(--muted)",
          fontFamily: "var(--font-body)",
        }}>
          © 2026 Vastraa. AI-powered fashion for modern India.
        </p>
      </div>
    </footer>
  );
}
