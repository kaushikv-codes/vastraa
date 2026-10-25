"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { User, PencilSimple, Camera, Heart, UploadSimple, TShirt, ArrowRight } from "@phosphor-icons/react";
import { Navigation } from "@/components/Navigation";
import { useApp } from "@/contexts/AppContext";

const STATS = [
  { label: "Saved looks", value: 0, icon: <TShirt size={16} weight="light" /> },
  { label: "Favourites", value: 0, icon: <Heart size={16} weight="light" /> },
  { label: "Uploads", value: 0, icon: <UploadSimple size={16} weight="light" /> },
];

const PREFERENCE_TAGS = [
  "Ethnic wear", "Streetwear", "Office-ready", "Sustainable",
  "Budget-friendly", "Luxury", "Indo-western", "Minimalist",
  "Bold prints", "Monochrome",
];

export default function ProfilePage() {
  const { user, signIn, openLooksDrawer } = useApp();
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [gender, setGender] = useState<"women" | "men">("women");

  function toggleTag(tag: string) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100dvh", background: "var(--black)", display: "flex", flexDirection: "column" }}>
        <Navigation />
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", paddingTop: "5rem" }}>
          <div style={{ textAlign: "center", maxWidth: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={30} color="var(--muted)" weight="light" />
            </div>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--ivory)", fontWeight: 700, marginBottom: "0.5rem" }}>Your Profile</h1>
              <p style={{ fontSize: "0.825rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.6 }}>
                Sign in to access your profile, set style preferences, and manage your Vastraa account.
              </p>
            </div>
            <button
              onClick={() => signIn()}
              style={{ padding: "0.75rem 2.25rem", borderRadius: "9999px", background: "var(--terracotta)", border: "none", color: "#fff", fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              Sign in <ArrowRight size={14} weight="bold" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--black)" }}>
      <Navigation />

      <main style={{ paddingTop: "5rem" }}>
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem", maxWidth: 680 }}>

          {/* Avatar + Name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem" }}
          >
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "var(--terracotta)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.8rem", fontWeight: 700, color: "#fff",
                overflow: "hidden", border: "2px solid var(--hairline)",
              }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (user.name?.[0] || "V").toUpperCase()
                }
              </div>
              <button
                aria-label="Change photo"
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 26, height: 26, borderRadius: "50%",
                  background: "var(--black)", border: "1px solid var(--hairline)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--muted)",
                }}
              >
                <Camera size={13} weight="light" />
              </button>
            </div>

            {/* Name */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {editName ? (
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                    style={{
                      background: "transparent", border: "none",
                      borderBottom: "1px solid var(--hairline)", outline: "none",
                      fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: 700,
                      color: "var(--ivory)", caretColor: "var(--saffron)", padding: "0 0 0.25rem",
                      width: "100%",
                    }}
                    onBlur={() => setEditName(false)}
                    onKeyDown={e => { if (e.key === "Enter") setEditName(false); }}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--ivory)", fontWeight: 700 }}>
                    {name || "Your Name"}
                  </h1>
                  <button onClick={() => setEditName(true)} style={{ background: "none", border: "none", color: "var(--muted)", lineHeight: 1, padding: "0.2rem" }}>
                    <PencilSimple size={14} weight="light" />
                  </button>
                </div>
              )}
              <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: "0.25rem" }}>
                {user.email || user.phone}
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem", marginBottom: "2.5rem" }}
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: "1.25rem 1rem", borderRadius: "14px",
                  border: "1px solid var(--hairline)", background: "var(--neutral)",
                  textAlign: "center", cursor: "none",
                }}
                onClick={i === 0 ? openLooksDrawer : undefined}
              >
                <div style={{ display: "flex", justifyContent: "center", color: "var(--muted)", marginBottom: "0.5rem" }}>{stat.icon}</div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--ivory)", fontWeight: 700 }}>{stat.value}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: "0.2rem" }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Gender preference */}
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.14 }}
            style={{ marginBottom: "2rem" }}
          >
            <h2 style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "0.875rem" }}>
              Shop for
            </h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(["women", "men"] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  style={{
                    padding: "0.6rem 1.5rem", borderRadius: "9999px",
                    background: gender === g ? "var(--ivory)" : "transparent",
                    border: `1px solid ${gender === g ? "transparent" : "var(--hairline)"}`,
                    color: gender === g ? "var(--black)" : "var(--muted)",
                    fontSize: "0.825rem", fontFamily: "var(--font-body)",
                    fontWeight: gender === g ? 600 : 400,
                    textTransform: "capitalize", transition: "all 0.18s",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </motion.section>

          {/* Style preferences */}
          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "0.875rem" }}>
              Style preferences
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {PREFERENCE_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: "0.5rem 1rem", borderRadius: "9999px",
                    background: selectedTags.includes(tag) ? "var(--terracotta)" : "transparent",
                    border: `1px solid ${selectedTags.includes(tag) ? "var(--terracotta)" : "var(--hairline)"}`,
                    color: selectedTags.includes(tag) ? "#fff" : "var(--muted)",
                    fontSize: "0.78rem", fontFamily: "var(--font-body)",
                    transition: "all 0.18s",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <button
                style={{ marginTop: "1.25rem", padding: "0.7rem 2rem", borderRadius: "9999px", background: "var(--terracotta)", border: "none", color: "#fff", fontSize: "0.825rem", fontFamily: "var(--font-body)", fontWeight: 600 }}
              >
                Save preferences
              </button>
            )}
          </motion.section>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ marginTop: "2.5rem", padding: "1.25rem", borderRadius: "14px", border: "1px solid var(--hairline)", background: "var(--neutral)", display: "flex", flexDirection: "column", gap: "0.15rem" }}
          >
            {[
              { label: "Your Favourites", href: "/favorites", icon: <Heart size={16} weight="light" /> },
              { label: "Your Uploads", href: "/uploads", icon: <UploadSimple size={16} weight="light" /> },
              { label: "Your Looks", href: "#", icon: <TShirt size={16} weight="light" />, onClick: openLooksDrawer },
            ].map(link => (
              link.onClick ? (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0.5rem", background: "none", border: "none", color: "var(--ivory)", width: "100%", borderBottom: "1px solid var(--hairline)", fontFamily: "var(--font-body)", fontSize: "0.875rem", textAlign: "left", transition: "opacity 0.18s" }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <span style={{ color: "var(--muted)" }}>{link.icon}</span> {link.label}
                  </span>
                  <ArrowRight size={14} color="var(--muted)" weight="light" />
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0.5rem", color: "var(--ivory)", textDecoration: "none", borderBottom: "1px solid var(--hairline)", fontFamily: "var(--font-body)", fontSize: "0.875rem" }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <span style={{ color: "var(--muted)" }}>{link.icon}</span> {link.label}
                  </span>
                  <ArrowRight size={14} color="var(--muted)" weight="light" />
                </a>
              )
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
