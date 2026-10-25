"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PaperPlaneTilt, Image as ImageIcon, Sparkle, ArrowRight, ClockCounterClockwise, X } from "@phosphor-icons/react";
import { Navigation } from "@/components/Navigation";
import { useApp } from "@/contexts/AppContext";

const SUGGESTION_CHIPS = [
  "Dresses that would look good in Mykonos",
  "Top brands of baggy jeans in India",
  "What should I wear to a rooftop party in July?",
  "Something like Deepika's award night look but cheaper",
  "Saree that's easy to drape for a first-timer",
];

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: { name: string; brand: string; price: number; image: string }[];
};

const MOCK_HISTORY = [
  { id: "1", title: "Goa trip outfits for 5 days" },
  { id: "2", title: "Wedding guest — semi-formal vibe" },
  { id: "3", title: "Office outfits under ₹3000" },
];

export default function AiPage() {
  const { user, signIn, openAccountSidebar, looksCount, openLooksDrawer } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [gender, setGender] = useState<"women" | "men">("women");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 160) + "px";
  }, [input]);

  function handleChip(chip: string) {
    setInput(chip);
    inputRef.current?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Placeholder response — wire to Gemini API later
    await new Promise(r => setTimeout(r, 1100));
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Great question! For "${q}", here's what I'd suggest based on Vastraa's catalog of Indian indie brands:`,
      products: [
        { name: "Ombre Linen Dress", brand: "Summeraway", price: 3200, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80&auto=format&fit=crop" },
        { name: "Silk Co-ord Set", brand: "Botnia", price: 5800, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80&auto=format&fit=crop" },
        { name: "Embroidered Kurta", brand: "Label Stories", price: 2100, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&q=80&auto=format&fit=crop" },
      ],
    };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  }

  const isEmpty = messages.length === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "var(--black)", overflow: "hidden" }}>
      {/* Top bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 1.5rem", flexShrink: 0,
        borderBottom: "1px solid var(--hairline)",
        background: "var(--nav-bg)", backdropFilter: "blur(12px)",
        position: "relative", zIndex: 10,
      }}>
        {/* History toggle */}
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          title="Recent chats"
          style={{ background: "none", border: "none", color: "var(--muted)", lineHeight: 1, padding: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", fontFamily: "var(--font-body)" }}
        >
          <ClockCounterClockwise size={18} weight="light" />
          <span style={{ display: "none" }}>History</span>
        </button>

        {/* Mode tabs */}
        <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", borderRadius: "9999px", border: "1px solid var(--hairline)", overflow: "hidden" }}>
          {(["Search", "Genius"] as const).map(mode => (
            <a
              key={mode}
              href={mode === "Search" ? "/" : "/ai"}
              style={{
                padding: "0.4rem 1.1rem",
                fontSize: "0.8rem", fontFamily: "var(--font-body)",
                color: mode === "Genius" ? "var(--black)" : "var(--muted)",
                background: mode === "Genius" ? "var(--ivory)" : "transparent",
                textDecoration: "none", transition: "all 0.18s",
                fontWeight: mode === "Genius" ? 600 : 400,
              }}
            >
              {mode}
            </a>
          ))}
        </div>

        {/* Right — looks + menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={openLooksDrawer}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.4rem 0.875rem", borderRadius: "9999px",
              border: "1px solid var(--hairline)", background: "transparent",
              color: "var(--muted)", fontSize: "0.75rem", fontFamily: "var(--font-body)",
            }}
          >
            <Sparkle size={13} weight="light" />
            <span>Your looks</span>
            {looksCount > 0 && (
              <strong style={{ minWidth: 16, height: 16, borderRadius: "50%", background: "var(--terracotta)", color: "#fff", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {looksCount}
              </strong>
            )}
          </button>
          <button
            onClick={openAccountSidebar}
            style={{ background: "rgba(245,240,232,0.06)", border: "1px solid var(--hairline)", borderRadius: "8px", padding: "0.45rem 0.65rem", color: "var(--muted)", lineHeight: 1, display: "flex" }}
          >
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", display: "inline-block", marginRight: 3 }} />
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", display: "inline-block", marginRight: 3 }} />
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* History sidebar */}
        <AnimatePresence>
          {historyOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }} animate={{ width: 240, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              style={{ flexShrink: 0, overflow: "hidden", borderRight: "1px solid var(--hairline)", background: "var(--overlay-bg)", display: "flex", flexDirection: "column" }}
            >
              <div style={{ padding: "1rem 1rem 0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", fontFamily: "var(--font-body)" }}>Recent chats</span>
                <button onClick={() => setHistoryOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", lineHeight: 1 }}><X size={14} weight="light" /></button>
              </div>
              <button style={{ margin: "0.5rem", padding: "0.6rem 0.875rem", borderRadius: "9px", background: "rgba(245,240,232,0.05)", border: "1px solid var(--hairline)", color: "var(--ivory)", fontSize: "0.78rem", fontFamily: "var(--font-body)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>+ New chat</span>
              </button>
              <div style={{ flex: 1, overflowY: "auto", padding: "0.25rem 0.5rem" }}>
                {user ? MOCK_HISTORY.map(h => (
                  <button key={h.id} style={{ width: "100%", textAlign: "left", padding: "0.625rem 0.875rem", borderRadius: "8px", background: "none", border: "none", color: "var(--muted)", fontSize: "0.78rem", fontFamily: "var(--font-body)", display: "block", marginBottom: "0.15rem", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,240,232,0.05)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {h.title}
                  </button>
                )) : (
                  <p style={{ padding: "0.875rem", fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.55 }}>
                    Sign in to save conversations and pick them up anywhere.
                  </p>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Messages / Empty state */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
            {isEmpty ? (
              <div style={{ maxWidth: 540, margin: "0 auto", paddingTop: "4rem", textAlign: "center" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--ivory)", fontWeight: 700, lineHeight: 1.15, marginBottom: "0.875rem" }}>
                  Describe it.{" "}
                  <em style={{ color: "var(--terracotta)", fontStyle: "italic" }}>We'll find it.</em>
                </h1>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: "2rem" }}>
                  Type a query the way you&apos;d ask a stylist friend. Answers blend advice, images, brands, and real products.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
                  {SUGGESTION_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      style={{
                        padding: "0.5rem 1rem", borderRadius: "9999px",
                        background: "transparent", border: "1px solid var(--hairline)",
                        color: "var(--muted)", fontSize: "0.78rem", fontFamily: "var(--font-body)",
                        transition: "all 0.18s", textAlign: "left",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,240,232,0.25)"; e.currentTarget.style.color = "var(--ivory)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--hairline)"; e.currentTarget.style.color = "var(--muted)"; }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {messages.map(msg => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    {msg.role === "user" ? (
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{ maxWidth: "72%", padding: "0.875rem 1.125rem", borderRadius: "16px 16px 4px 16px", background: "rgba(245,240,232,0.08)", border: "1px solid var(--hairline)", fontSize: "0.875rem", color: "var(--ivory)", fontFamily: "var(--font-body)", lineHeight: 1.55 }}>
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--terracotta)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Sparkle size={14} weight="fill" color="#fff" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "0.875rem", color: "var(--ivory)", fontFamily: "var(--font-body)", lineHeight: 1.6, marginBottom: msg.products ? "1rem" : 0 }}>{msg.content}</p>
                          {msg.products && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
                              {msg.products.map((p, i) => (
                                <div key={i} style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid var(--hairline)", background: "var(--neutral)" }}>
                                  <img src={p.image} alt={p.name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                                  <div style={{ padding: "0.625rem" }}>
                                    <p style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{p.brand}</p>
                                    <p style={{ fontSize: "0.78rem", color: "var(--ivory)", fontFamily: "var(--font-body)", fontWeight: 500, marginTop: "0.1rem" }}>{p.name}</p>
                                    <p style={{ fontSize: "0.75rem", color: "var(--saffron)", fontFamily: "var(--font-display)", fontWeight: 700, marginTop: "0.35rem" }}>₹{p.price.toLocaleString("en-IN")}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {loading && (
                  <div style={{ display: "flex", gap: "0.875rem", alignItems: "center" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--terracotta)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Sparkle size={14} weight="fill" color="#fff" /></motion.div>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--muted)" }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Composer */}
          <div style={{ flexShrink: 0, padding: "1rem 1.5rem 1.25rem", borderTop: "1px solid var(--hairline)", background: "var(--nav-bg)", backdropFilter: "blur(12px)" }}>
            {/* Gender toggle */}
            <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.75rem" }}>
              {(["women", "men"] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  style={{
                    padding: "0.3rem 0.875rem", borderRadius: "9999px",
                    background: gender === g ? "var(--ivory)" : "transparent",
                    border: `1px solid ${gender === g ? "transparent" : "var(--hairline)"}`,
                    color: gender === g ? "var(--black)" : "var(--muted)",
                    fontSize: "0.72rem", fontFamily: "var(--font-body)",
                    fontWeight: gender === g ? 600 : 400,
                    textTransform: "capitalize",
                    transition: "all 0.18s",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "14px", border: "1px solid var(--hairline)", background: "rgba(245,240,232,0.03)" }}>
              <button type="button" title="Upload image" style={{ background: "none", border: "none", color: "var(--muted)", lineHeight: 1, flexShrink: 0, paddingBottom: "2px" }}>
                <ImageIcon size={18} weight="light" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }}
                placeholder="Ask anything about fashion..."
                rows={1}
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", overflow: "hidden",
                  fontSize: "0.875rem", color: "var(--ivory)", fontFamily: "var(--font-body)",
                  caretColor: "var(--saffron)", lineHeight: 1.5, minHeight: "1.5rem",
                }}
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  flexShrink: 0, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: input.trim() && !loading ? "var(--terracotta)" : "rgba(245,240,232,0.06)",
                  border: "none", color: input.trim() && !loading ? "#fff" : "var(--muted)",
                  transition: "all 0.18s",
                }}
              >
                <PaperPlaneTilt size={14} weight="fill" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
