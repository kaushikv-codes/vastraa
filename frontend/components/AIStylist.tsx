"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkle, MagnifyingGlass } from "@phosphor-icons/react";
import { HeroCarousel, type HeroCarouselItem } from "@/components/HeroCarousel";
import { Carousel360 } from "@/components/Carousel360";

const SEARCH_MODES = [
  { label: "By mood",      example: '"a revenge dress"',                     img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&auto=format&fit=crop" },
  { label: "By occasion",  example: '"first date but not trying too hard"',  img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80&auto=format&fit=crop" },
  { label: "By budget",    example: '"linen shirts under ₹2500"',            img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80&auto=format&fit=crop" },
  { label: "By problem",   example: '"tops that work with low-waist jeans"', img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80&auto=format&fit=crop" },
  { label: "By reference", example: '"saree like Deepika but edgier"',       img: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80&auto=format&fit=crop" },
];

const EXPLORE_CARDS: HeroCarouselItem[] = [
  { id: 1, title: "Wedding\nGuest Season",     sub: "Sangeet, mehendi, reception — sorted.", accent: "#8B2252", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80&auto=format&fit=crop" },
  { id: 2, title: "Office but\nmake it fashion", sub: "Look great, feel sharp.",              accent: "#1A3A5C", image: "https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=600&q=80&auto=format&fit=crop" },
  { id: 3, title: "Festival\nDressing",          sub: "Navratri to Diwali, all moods.",       accent: "#B5451B", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80&auto=format&fit=crop" },
  { id: 4, title: "Date Night\nIndian Edition",  sub: "Chic without trying too hard.",        accent: "#2D1B4E", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80&auto=format&fit=crop" },
];

const CTA_CHIPS = [
  "beach wedding but not lehenga",
  "shirt that says I have taste",
  "black long flowy dress",
  "out-of-touch airport outfit",
];

// ── Shared hover handlers ────────────────────────────────────
const arrowBtnEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  const el = e.currentTarget as HTMLElement;
  el.style.background = "var(--saffron)"; el.style.borderColor = "var(--saffron)"; el.style.color = "#080808";
};
const arrowBtnLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  const el = e.currentTarget as HTMLElement;
  el.style.background = "rgba(245,240,232,0.12)"; el.style.borderColor = "rgba(245,240,232,0.2)"; el.style.color = "#F5F0E8";
};
const chipEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,240,232,0.3)";
  (e.currentTarget as HTMLElement).style.color = "var(--ivory)";
};
const chipLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  (e.currentTarget as HTMLElement).style.borderColor = "var(--hairline)";
  (e.currentTarget as HTMLElement).style.color = "var(--muted)";
};

export function AIStylist() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ name: string; brand: string; price: number; image_url?: string }[] | null>(null);
  const [noResults, setNoResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setResults(null); setNoResults(false);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), limit: 6 }),
      });
      const data = await res.json();
      if (data.results?.length > 0) {
        setResults(data.results.slice(0, 3).map((r: any) => ({
          name: r.name,
          brand: r.brand,
          price: r.price,
          image_url: r.image_url,
        })));
      } else {
        setNoResults(true);
        setResults(null);
      }
    } catch {
      setNoResults(true);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
      {/* ── Section 1: 3D ring carousel ── */}
      <section className="section" id="stylist" style={{ borderTop: "1px solid var(--hairline)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ivory)", fontSize: "1.5rem", fontWeight: 600 }}>
              Search the way you{" "}
              <em style={{ color: "var(--terracotta)", fontStyle: "italic" }}>actually</em> think
            </h2>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-body)" }}>
              Fresh prompts. Different mood.
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--terracotta)", display: "inline-block" }} />
            </span>
          </div>
        </div>
        <Carousel360 />
      </section>

      {/* ── Section 2: Explore moods — HeroCarousel filmstrip ── */}
      <section style={{ borderTop: "1px solid var(--hairline)", height: "520px" }}>
        <HeroCarousel
          items={EXPLORE_CARDS}
          defaultIndex={0}
          autoplay
          autoplayDelay={4500}
          brand="EXPLORE"
        />
      </section>

      {/* ── Section 3: CTA search block ── */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ borderRadius: "20px", padding: "4rem 2rem", textAlign: "center", background: "var(--neutral)", border: "1px solid var(--hairline)" }}
          >
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--ivory)", fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 600, lineHeight: 1.2, maxWidth: "600px", margin: "0 auto 2.25rem" }}>
              Start with the{" "}
              <em style={{ color: "var(--terracotta)", fontStyle: "italic" }}>weirdest</em>{" "}
              thing in your head.
            </h2>

            <form onSubmit={handleSubmit} style={{ maxWidth: "520px", margin: "0 auto 1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1.25rem", borderRadius: "9999px", background: "var(--neutral)", border: "1px solid var(--hairline)" }}>
                <MagnifyingGlass size={15} color="var(--muted)" weight="light" style={{ flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Try "a revenge dress"'
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "0.875rem", color: "var(--ivory)", fontFamily: "var(--font-body)", caretColor: "var(--saffron)" }}
                />
                <button
                  type="submit" disabled={loading}
                  style={{ width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ivory)", border: "none", color: "var(--black)", transition: "background 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--saffron)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--ivory)")}
                >
                  {loading
                    ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}><Sparkle size={12} /></motion.div>
                    : <MagnifyingGlass size={12} weight="bold" />
                  }
                </button>
              </div>
            </form>

            <AnimatePresence>
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ maxWidth: "480px", margin: "0 auto 1.5rem", textAlign: "left" }}
                >
                  {results.map((r, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid var(--hairline)" }}
                    >
                      <div>
                        <p style={{ fontSize: "0.875rem", color: "var(--ivory)", fontFamily: "var(--font-body)", fontWeight: 500 }}>{r.name}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: "0.15rem" }}>{r.brand}</p>
                      </div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--saffron)", fontFamily: "var(--font-display)" }}>
                        &#8377;{r.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.625rem" }}>
              {CTA_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => { setQuery(chip); inputRef.current?.focus(); }}
                  style={{ fontSize: "0.75rem", padding: "0.45rem 1rem", borderRadius: "9999px", background: "transparent", border: "1px solid var(--hairline)", color: "var(--muted)", fontFamily: "var(--font-body)", transition: "all 0.2s" }}
                  onMouseEnter={chipEnter}
                  onMouseLeave={chipLeave}
                >
                  {chip}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
