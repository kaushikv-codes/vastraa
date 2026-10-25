"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, GoogleLogo, Phone, EnvelopeSimple } from "@phosphor-icons/react";
import { useApp } from "@/contexts/AppContext";

export function AuthModal() {
  const { authModalOpen, authModalIntent, closeAuthModal } = useApp();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");

  const isUploads = authModalIntent === "uploads";
  const isLooks = authModalIntent === "looks";

  const title = isUploads ? "Upload garments" : isLooks ? "Your Looks" : "Welcome to Vastraa";
  const message = isUploads
    ? "Sign in to upload garments, style new looks, and try them on."
    : isLooks
    ? "Sign in to try on outfits, build looks, and manage your wardrobe."
    : "Sign in to save your favourites, manage uploads, and build your personal wardrobe.";

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthModal}
            style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,8,8,0.75)", backdropFilter: "blur(8px)" }}
          />

          <motion.div
            key="auth-modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", zIndex: 101,
              top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "min(400px, calc(100vw - 2rem))",
              background: "var(--overlay-bg)",
              border: "1px solid var(--hairline)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            }}
          >
            {/* Close */}
            <button
              onClick={closeAuthModal}
              aria-label="Close"
              style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "none", border: "none", color: "var(--muted)", lineHeight: 1, padding: "0.2rem" }}
            >
              <X size={18} weight="light" />
            </button>

            {/* Title */}
            <h2 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)", color: "var(--ivory)", fontWeight: 700, marginBottom: "0.5rem" }}>
              {title}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.55, marginBottom: "1.75rem" }}>
              {message}
            </p>

            {/* Google CTA */}
            <button
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
                padding: "0.875rem 1.25rem", borderRadius: "12px",
                background: "var(--ivory)", border: "none",
                color: "var(--black)", fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 600,
                marginBottom: "1rem", transition: "opacity 0.18s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <GoogleLogo size={18} weight="bold" />
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "1rem" }}>
              <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
              <span style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)", letterSpacing: "0.08em" }}>OR</span>
              <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
            </div>

            {/* Tab toggle */}
            <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.875rem", padding: "0.25rem", borderRadius: "10px", background: "rgba(245,240,232,0.04)", border: "1px solid var(--hairline)" }}>
              {(["phone", "email"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1, padding: "0.5rem", borderRadius: "8px",
                    background: tab === t ? "rgba(245,240,232,0.1)" : "transparent",
                    border: "none",
                    color: tab === t ? "var(--ivory)" : "var(--muted)",
                    fontSize: "0.78rem", fontFamily: "var(--font-body)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                    transition: "all 0.15s",
                  }}
                >
                  {t === "phone" ? <Phone size={14} weight="light" /> : <EnvelopeSimple size={14} weight="light" />}
                  {t === "phone" ? "Phone" : "Email"}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "12px", border: "1px solid var(--hairline)", background: "rgba(245,240,232,0.03)", marginBottom: "0.875rem" }}>
              {tab === "phone"
                ? <><Phone size={15} color="var(--muted)" weight="light" /><span style={{ fontSize: "0.85rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>+91</span></>
                : <EnvelopeSimple size={15} color="var(--muted)" weight="light" />
              }
              <input
                value={value}
                onChange={e => setValue(e.target.value)}
                type={tab === "phone" ? "tel" : "email"}
                placeholder={tab === "phone" ? "10-digit mobile number" : "your@email.com"}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "0.875rem", color: "var(--ivory)", fontFamily: "var(--font-body)", caretColor: "var(--saffron)" }}
              />
            </div>

            <button
              disabled={value.length < 5}
              style={{
                width: "100%", padding: "0.875rem", borderRadius: "12px",
                background: value.length >= 5 ? "var(--terracotta)" : "rgba(245,240,232,0.06)",
                border: "none", color: value.length >= 5 ? "#fff" : "var(--muted)",
                fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 600,
                transition: "all 0.18s",
              }}
              onMouseEnter={e => { if (value.length >= 5) (e.currentTarget.style.opacity = "0.88"); }}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Continue
            </button>

            <p style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body)", textAlign: "center", marginTop: "1.25rem", lineHeight: 1.5 }}>
              By continuing, you agree to Vastraa&apos;s Terms and Privacy Policy.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
