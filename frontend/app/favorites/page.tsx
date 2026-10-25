"use client";

import { motion } from "motion/react";
import { Heart, MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";
import { Navigation } from "@/components/Navigation";
import { useApp } from "@/contexts/AppContext";

// Mock data — replace with Supabase query later
const MOCK_FAVORITES = [
  { id: "1", name: "Ombre Linen Dress", brand: "Summeraway", price: 3200, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&auto=format&fit=crop", tag: "homegrown label" },
  { id: "2", name: "Nelly Soft Shoulder Bag", brand: "Lino Perros", price: 2800, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80&auto=format&fit=crop", tag: "leather classics" },
  { id: "3", name: "Avery Leather Flats", brand: "Peach Flores", price: 1900, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80&auto=format&fit=crop", tag: "hidden gem" },
  { id: "4", name: "Emely Pocket Dress", brand: "Botnia", price: 4100, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80&auto=format&fit=crop", tag: "considered basics" },
  { id: "5", name: "Crystal Moon Top", brand: "Truewest", price: 1650, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80&auto=format&fit=crop", tag: "under ₹2k" },
  { id: "6", name: "Pure Linen Shirt", brand: "Saadaa", price: 2400, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80&auto=format&fit=crop", tag: "quiet luxury" },
];

function AuthGate({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "4rem 2rem", textAlign: "center", gap: "1.25rem" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Heart size={24} color="var(--muted)" weight="light" />
      </div>
      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--ivory)", fontWeight: 700, marginBottom: "0.5rem" }}>Sign in to see your Favourites</h2>
        <p style={{ fontSize: "0.825rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.6, maxWidth: 320 }}>
          Save products you love from across 10,000+ Indian indie brands. Build wishlists, compare, and buy.
        </p>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={onSignIn}
          style={{ padding: "0.75rem 2rem", borderRadius: "9999px", background: "var(--terracotta)", border: "none", color: "#fff", fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 600, transition: "opacity 0.18s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Sign in
        </button>
        <a href="/" style={{ padding: "0.75rem 2rem", borderRadius: "9999px", border: "1px solid var(--hairline)", color: "var(--muted)", fontSize: "0.875rem", fontFamily: "var(--font-body)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          Browse first <ArrowRight size={14} weight="light" />
        </a>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { user, signIn } = useApp();
  const showMock = true; // flip to false when wired to Supabase

  return (
    <div style={{ minHeight: "100dvh", background: "var(--black)", display: "flex", flexDirection: "column" }}>
      <Navigation />

      <main style={{ flex: 1, paddingTop: "5rem", display: "flex", flexDirection: "column" }}>
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--ivory)", fontWeight: 700, lineHeight: 1.1 }}>
                Your{" "}
                <em style={{ color: "var(--terracotta)", fontStyle: "italic" }}>Favourites</em>
              </h1>
              {user && showMock && (
                <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: "0.35rem" }}>
                  {MOCK_FAVORITES.length} saved items
                </p>
              )}
            </div>
            {user && (
              <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", textDecoration: "none", padding: "0.5rem 0.875rem", borderRadius: "9999px", border: "1px solid var(--hairline)", transition: "color 0.18s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--ivory)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                <MagnifyingGlass size={13} weight="light" /> Discover more
              </a>
            )}
          </div>

          {!user ? (
            <AuthGate onSignIn={() => signIn("favorites")} />
          ) : !showMock ? (
            /* Empty state */
            <div style={{ textAlign: "center", paddingTop: "4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <Heart size={36} color="var(--muted)" weight="light" />
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--ivory)", fontWeight: 600 }}>No favourites yet</h2>
              <p style={{ fontSize: "0.825rem", color: "var(--muted)", fontFamily: "var(--font-body)", maxWidth: 280, lineHeight: 1.6 }}>Tap the heart on any product to save it here for later.</p>
              <a href="/" style={{ marginTop: "0.5rem", padding: "0.7rem 1.75rem", borderRadius: "9999px", background: "var(--terracotta)", border: "none", color: "#fff", fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 600, textDecoration: "none" }}>
                Start exploring
              </a>
            </div>
          ) : (
            /* Product grid */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
              {MOCK_FAVORITES.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid var(--hairline)", background: "var(--neutral)", position: "relative" }}
                >
                  {/* Image */}
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    {/* Tag */}
                    <span style={{
                      position: "absolute", top: "0.75rem", left: "0.75rem",
                      fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "0.3rem 0.6rem", borderRadius: "9999px",
                      background: "rgba(8,8,8,0.7)", backdropFilter: "blur(8px)",
                      color: "var(--ivory)", fontFamily: "var(--font-body)",
                    }}>
                      {item.tag}
                    </span>
                    {/* Unsave heart */}
                    <button
                      aria-label="Remove from favourites"
                      title="Remove"
                      style={{
                        position: "absolute", top: "0.75rem", right: "0.75rem",
                        width: 30, height: 30, borderRadius: "50%",
                        background: "rgba(8,8,8,0.6)", backdropFilter: "blur(6px)",
                        border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                        color: "var(--terracotta)",
                      }}
                    >
                      <Heart size={14} weight="fill" />
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "0.875rem" }}>
                    <p style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "0.2rem" }}>{item.brand}</p>
                    <p style={{ fontSize: "0.825rem", color: "var(--ivory)", fontFamily: "var(--font-body)", fontWeight: 500, lineHeight: 1.3 }}>{item.name}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.625rem" }}>
                      <span style={{ fontSize: "0.875rem", color: "var(--saffron)", fontFamily: "var(--font-display)", fontWeight: 700 }}>
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      <button style={{
                        fontSize: "0.7rem", padding: "0.3rem 0.75rem", borderRadius: "9999px",
                        background: "transparent", border: "1px solid var(--hairline)",
                        color: "var(--muted)", fontFamily: "var(--font-body)",
                        transition: "all 0.18s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,240,232,0.25)"; e.currentTarget.style.color = "var(--ivory)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--hairline)"; e.currentTarget.style.color = "var(--muted)"; }}
                      >
                        Shop
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
