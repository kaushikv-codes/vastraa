"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, TShirt, Plus, Sparkle, Heart } from "@phosphor-icons/react";
import { useApp } from "@/contexts/AppContext";

const TABS = ["Try-ons", "Build Look"] as const;
type Tab = (typeof TABS)[number];

function EmptyState({ icon, title, sub, cta, onCta }: {
  icon: React.ReactNode; title: string; sub: string; cta?: string; onCta?: () => void;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", gap: "0.875rem" }}>
      <div style={{ color: "var(--muted)", opacity: 0.4 }}>{icon}</div>
      <div>
        <p style={{ fontSize: "0.875rem", color: "var(--ivory)", fontFamily: "var(--font-body)", fontWeight: 500, marginBottom: "0.35rem" }}>{title}</p>
        <p style={{ fontSize: "0.76rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.55, maxWidth: 220 }}>{sub}</p>
      </div>
      {cta && onCta && (
        <button
          onClick={onCta}
          style={{
            marginTop: "0.5rem", padding: "0.6rem 1.4rem", borderRadius: "9999px",
            background: "var(--terracotta)", border: "none",
            color: "#fff", fontSize: "0.8rem", fontFamily: "var(--font-body)", fontWeight: 500,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          {cta}
        </button>
      )}
    </div>
  );
}

export function LooksDrawer() {
  const { looksDrawerOpen, closeLooksDrawer, user, signIn } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("Try-ons");

  // Close on Escape
  useEffect(() => {
    if (!looksDrawerOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeLooksDrawer(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [looksDrawerOpen, closeLooksDrawer]);

  // Lock body scroll
  useEffect(() => {
    if (!looksDrawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [looksDrawerOpen]);

  const renderTabContent = () => {
    if (!user) {
      return (
        <EmptyState
          icon={<TShirt size={40} />}
          title="Sign in to access Your Looks"
          sub="Try on outfits and build looks with AI."
          cta="Sign in"
          onCta={() => { closeLooksDrawer(); signIn("looks"); }}
        />
      );
    }

    if (activeTab === "Try-ons") {
      return (
        <EmptyState
          icon={<TShirt size={40} />}
          title="No try-ons yet"
          sub="Browse products and hit 'Try On' to see how they look on you with AI."
        />
      );
    }

    // Build Look tab
    return (
      <div style={{ padding: "1.25rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{
          borderRadius: "16px", border: "2px dashed var(--hairline)",
          minHeight: 260, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "0.75rem",
          background: "rgba(245,240,232,0.02)",
        }}>
          <Plus size={28} color="var(--muted)" weight="light" />
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)", textAlign: "center", maxWidth: 180, lineHeight: 1.5 }}>
            Search for products and press + to add them to your look canvas
          </p>
        </div>
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body)", textAlign: "center", lineHeight: 1.55 }}>
          Style pieces together, then try the full look on with AI.
        </p>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {looksDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="looks-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeLooksDrawer}
            style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(8,8,8,0.6)", backdropFilter: "blur(4px)" }}
          />

          {/* Drawer panel */}
          <motion.div
            key="looks-drawer"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 91,
              width: "min(400px, 95vw)",
              background: "var(--overlay-bg)",
              borderLeft: "1px solid var(--hairline)",
              display: "flex", flexDirection: "column",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <header style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--hairline)", flexShrink: 0,
            }}>
              <span style={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                Your Looks
              </span>
              <button
                onClick={closeLooksDrawer}
                aria-label="Close"
                style={{ background: "none", border: "none", color: "var(--muted)", lineHeight: 1, padding: "0.25rem" }}
              >
                <X size={18} weight="light" />
              </button>
            </header>

            {/* Tabs — only Try-ons + Build Look */}
            <div style={{
              display: "flex", gap: "0.35rem", padding: "0.875rem 1rem",
              borderBottom: "1px solid var(--hairline)", flexShrink: 0,
            }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "0.45rem 1rem", borderRadius: "9999px",
                    background: activeTab === tab ? "var(--ivory)" : "transparent",
                    border: `1px solid ${activeTab === tab ? "transparent" : "var(--hairline)"}`,
                    color: activeTab === tab ? "var(--black)" : "var(--muted)",
                    fontSize: "0.78rem", fontFamily: "var(--font-body)",
                    fontWeight: activeTab === tab ? 600 : 400,
                    transition: "all 0.18s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {renderTabContent()}
            </div>

            {/* Bottom — quick links to the 3 pages that live in ··· menu */}
            <div style={{
              flexShrink: 0, borderTop: "1px solid var(--hairline)",
              padding: "0.875rem 1rem",
              display: "flex", gap: "0.5rem",
            }}>
              {[
                { icon: <Heart size={14} weight="light" />, label: "Favourites", href: "/favorites" },
                { icon: <Sparkle size={14} weight="light" />, label: "Wardrobe", href: "/profile" },
              ].map(link => (
                <a
                  key={link.label}
                  href={user ? link.href : "#"}
                  onClick={!user ? (e) => { e.preventDefault(); closeLooksDrawer(); signIn(); } : closeLooksDrawer}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", gap: "0.3rem",
                    padding: "0.6rem 0.25rem", borderRadius: "10px",
                    border: "1px solid var(--hairline)", background: "rgba(245,240,232,0.03)",
                    color: "var(--muted)", textDecoration: "none",
                    fontSize: "0.68rem", fontFamily: "var(--font-body)",
                    transition: "all 0.18s", textAlign: "center",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(245,240,232,0.07)";
                    (e.currentTarget as HTMLElement).style.color = "var(--ivory)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(245,240,232,0.03)";
                    (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                  }}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
