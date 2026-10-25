"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, House, Sparkle, User, Heart, UploadSimple, TShirt, Sun, Moon, SignIn, SignOut } from "@phosphor-icons/react";
import { useApp } from "@/contexts/AppContext";

export function AccountSidebar() {
  const {
    user, accountSidebarOpen, closeAccountSidebar,
    openLooksDrawer, signIn, signOut,
    theme, toggleTheme, looksCount, generatingCount,
  } = useApp();

  // Close on Escape
  useEffect(() => {
    if (!accountSidebarOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeAccountSidebar(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [accountSidebarOpen, closeAccountSidebar]);

  // Lock body scroll
  useEffect(() => {
    if (!accountSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [accountSidebarOpen]);

  const navItems = [
    { icon: <House size={17} weight="light" />, label: "Home", href: "/", auth: false },
    { icon: <Sparkle size={17} weight="light" />, label: "Genius", href: "/ai", auth: false },
    { icon: <User size={17} weight="light" />, label: "Profile", href: "/profile", auth: true },
    { icon: <Heart size={17} weight="light" />, label: "Favourites", href: "/favorites", auth: true },
    { icon: <UploadSimple size={17} weight="light" />, label: "Uploads", href: "/uploads", auth: true },
  ];

  return (
    <AnimatePresence>
      {accountSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeAccountSidebar}
            style={{
              position: "fixed", inset: 0, zIndex: 90,
              background: "rgba(8,8,8,0.6)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Sidebar panel */}
          <motion.aside
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 91,
              width: "min(340px, 90vw)",
              background: "var(--overlay-bg)",
              borderLeft: "1px solid var(--hairline)",
              display: "flex", flexDirection: "column",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <header style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--hairline)",
            }}>
              <span style={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                Account
              </span>
              <button
                onClick={closeAccountSidebar}
                aria-label="Close"
                style={{ background: "none", border: "none", color: "var(--muted)", lineHeight: 1, padding: "0.25rem" }}
              >
                <X size={18} weight="light" />
              </button>
            </header>

            {/* User identity */}
            {user && (
              <div style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--hairline)",
                display: "flex", alignItems: "center", gap: "0.875rem",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--terracotta)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", fontWeight: 700, color: "#fff",
                  flexShrink: 0,
                  overflow: "hidden",
                }}>
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : (user.name?.[0] || "V").toUpperCase()
                  }
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.9rem", color: "var(--ivory)", fontWeight: 500, fontFamily: "var(--font-body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: "0.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.email || user.phone}
                  </div>
                </div>
              </div>
            )}

            {/* Nav items */}
            <nav style={{ flex: 1, padding: "0.75rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.15rem", overflowY: "auto" }}>
              {navItems.map((item) => {
                if (item.auth && !user) return null;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={closeAccountSidebar}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.875rem",
                      padding: "0.75rem 0.875rem", borderRadius: "10px",
                      color: "var(--ivory)", textDecoration: "none",
                      fontSize: "0.9rem", fontFamily: "var(--font-body)",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,240,232,0.06)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ color: "var(--muted)", lineHeight: 1 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                );
              })}

              {/* Uploads — unauthenticated gate */}
              {!user && (
                <button
                  onClick={() => { closeAccountSidebar(); signIn("uploads"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.75rem 0.875rem", borderRadius: "10px",
                    background: "none", border: "none",
                    color: "var(--ivory)", textAlign: "left", width: "100%",
                    fontSize: "0.9rem", fontFamily: "var(--font-body)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,240,232,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color: "var(--muted)", lineHeight: 1 }}><UploadSimple size={17} weight="light" /></span>
                  <span>Uploads</span>
                </button>
              )}

              {/* Try-ons — authenticated only */}
              {user && (
                <button
                  onClick={openLooksDrawer}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.75rem 0.875rem", borderRadius: "10px",
                    background: "none", border: "none",
                    color: "var(--ivory)", textAlign: "left", width: "100%",
                    fontSize: "0.9rem", fontFamily: "var(--font-body)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,240,232,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color: "var(--muted)", lineHeight: 1 }}><TShirt size={17} weight="light" /></span>
                  <span>Your Looks</span>
                  {(looksCount > 0 || generatingCount > 0) && (
                    <span style={{
                      marginLeft: "auto",
                      minWidth: 18, height: 18, borderRadius: "9999px",
                      background: "var(--terracotta)",
                      fontSize: "0.65rem", color: "#fff", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 5px",
                    }}>
                      {generatingCount > 0 ? generatingCount : looksCount}
                    </span>
                  )}
                </button>
              )}

              <div style={{ height: "1px", background: "var(--hairline)", margin: "0.5rem 0.875rem" }} />

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                style={{
                  display: "flex", alignItems: "center", gap: "0.875rem",
                  padding: "0.75rem 0.875rem", borderRadius: "10px",
                  background: "none", border: "none",
                  color: "var(--ivory)", textAlign: "left", width: "100%",
                  fontSize: "0.9rem", fontFamily: "var(--font-body)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,240,232,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ color: "var(--muted)", lineHeight: 1 }}>
                  {theme === "dark" ? <Sun size={17} weight="light" /> : <Moon size={17} weight="light" />}
                </span>
                <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
              </button>

              {/* Auth action */}
              {user ? (
                <button
                  onClick={async () => { closeAccountSidebar(); await signOut(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.75rem 0.875rem", borderRadius: "10px",
                    background: "none", border: "none",
                    color: "var(--muted)", textAlign: "left", width: "100%",
                    fontSize: "0.9rem", fontFamily: "var(--font-body)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,240,232,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ lineHeight: 1 }}><SignOut size={17} weight="light" /></span>
                  <span>Sign out</span>
                </button>
              ) : (
                <button
                  onClick={() => { closeAccountSidebar(); signIn(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.875rem",
                    padding: "0.75rem 0.875rem", borderRadius: "10px",
                    background: "none", border: "none",
                    color: "var(--ivory)", textAlign: "left", width: "100%",
                    fontSize: "0.9rem", fontFamily: "var(--font-body)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,240,232,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color: "var(--muted)", lineHeight: 1 }}><SignIn size={17} weight="light" /></span>
                  <span>Sign in</span>
                </button>
              )}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
