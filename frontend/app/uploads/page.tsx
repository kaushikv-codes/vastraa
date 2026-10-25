"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UploadSimple, X, CheckCircle, Image as ImageIcon, ArrowRight } from "@phosphor-icons/react";
import { Navigation } from "@/components/Navigation";
import { useApp } from "@/contexts/AppContext";

type UploadFile = {
  id: string;
  name: string;
  preview: string;
  size: number;
  status: "uploading" | "done" | "error";
  progress: number;
};

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); onFiles(Array.from(e.dataTransfer.files)); }}
      onClick={() => inputRef.current?.click()}
      style={{
        borderRadius: "20px",
        border: `2px dashed ${dragging ? "var(--terracotta)" : "var(--hairline)"}`,
        background: dragging ? "rgba(200,75,49,0.04)" : "rgba(245,240,232,0.02)",
        padding: "4rem 2rem",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: "1rem", textAlign: "center",
        cursor: "none", transition: "border-color 0.2s, background 0.2s",
        userSelect: "none",
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: dragging ? "rgba(200,75,49,0.12)" : "rgba(245,240,232,0.04)",
        border: "1px solid var(--hairline)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}>
        <UploadSimple size={24} color={dragging ? "var(--terracotta)" : "var(--muted)"} weight="light" />
      </div>
      <div>
        <p style={{ fontSize: "1rem", color: "var(--ivory)", fontFamily: "var(--font-body)", fontWeight: 500, marginBottom: "0.35rem" }}>
          {dragging ? "Drop to upload" : "Upload your garments"}
        </p>
        <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.55 }}>
          Drag & drop or <span style={{ color: "var(--terracotta)" }}>click to browse</span>
          <br />JPEG, PNG, WEBP up to 10 MB each
        </p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => onFiles(Array.from(e.target.files || []))} />
    </div>
  );
}

function UploadCard({ item, onRemove }: { item: UploadFile; onRemove: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3 }}
      style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid var(--hairline)", background: "var(--neutral)", position: "relative" }}
    >
      <div style={{ aspectRatio: "1", overflow: "hidden", position: "relative" }}>
        <img src={item.preview} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {item.status === "uploading" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,8,8,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "60%", height: 3, borderRadius: 999, background: "rgba(245,240,232,0.15)", overflow: "hidden" }}>
              <motion.div style={{ height: "100%", background: "var(--terracotta)", borderRadius: 999 }} animate={{ width: `${item.progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
        )}
        {item.status === "done" && (
          <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
            <CheckCircle size={20} color="var(--saffron)" weight="fill" />
          </div>
        )}
        <button
          onClick={() => onRemove(item.id)}
          style={{ position: "absolute", top: "0.5rem", left: "0.5rem", width: 24, height: 24, borderRadius: "50%", background: "rgba(8,8,8,0.65)", border: "none", color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <X size={12} weight="bold" />
        </button>
      </div>
      <div style={{ padding: "0.625rem 0.75rem" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
        <p style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "var(--font-body)", opacity: 0.6, marginTop: "0.1rem" }}>
          {(item.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
    </motion.div>
  );
}

export default function UploadsPage() {
  const { user, signIn } = useApp();
  const [uploads, setUploads] = useState<UploadFile[]>([]);

  function handleFiles(files: File[]) {
    const newItems: UploadFile[] = files.filter(f => f.type.startsWith("image/")).map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      preview: URL.createObjectURL(f),
      size: f.size,
      status: "uploading",
      progress: 0,
    }));
    setUploads(prev => [...newItems, ...prev]);

    // Simulate upload progress — replace with real Supabase Storage upload later
    newItems.forEach(item => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          clearInterval(interval);
          setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: "done", progress: 100 } : u));
        } else {
          setUploads(prev => prev.map(u => u.id === item.id ? { ...u, progress } : u));
        }
      }, 220);
    });
  }

  function handleRemove(id: string) {
    setUploads(prev => prev.filter(u => u.id !== id));
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--black)", display: "flex", flexDirection: "column" }}>
      <Navigation />

      <main style={{ flex: 1, paddingTop: "5rem" }}>
        <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "4rem", maxWidth: 760 }}>
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "var(--ivory)", fontWeight: 700, lineHeight: 1.1 }}>
              Your{" "}
              <em style={{ color: "var(--terracotta)", fontStyle: "italic" }}>Uploads</em>
            </h1>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: "0.5rem", lineHeight: 1.6 }}>
              Upload garments you own or love. Use them for AI try-ons, visual search, and building looks.
            </p>
          </div>

          {!user ? (
            /* Auth gate */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", paddingTop: "2rem" }}>
              <div style={{
                width: "100%", borderRadius: "20px",
                border: "2px dashed var(--hairline)",
                background: "rgba(245,240,232,0.02)",
                padding: "4rem 2rem",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center",
              }}>
                <UploadSimple size={28} color="var(--terracotta)" weight="light" />
                <div>
                  <p style={{ fontSize: "1rem", fontFamily: "var(--font-body)", color: "var(--ivory)", fontWeight: 500, marginBottom: "0.4rem" }}>Upload garments</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.55, maxWidth: 320 }}>
                    Sign in to upload garments, style new looks, and try them on with AI.
                  </p>
                </div>
                <button
                  onClick={() => signIn("uploads")}
                  style={{ marginTop: "0.5rem", padding: "0.7rem 2rem", borderRadius: "9999px", background: "var(--terracotta)", border: "none", color: "#fff", fontSize: "0.875rem", fontFamily: "var(--font-body)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  Sign in to upload <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <DropZone onFiles={handleFiles} />

              {uploads.length > 0 && (
                <div style={{ marginTop: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {uploads.length} garment{uploads.length > 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => setUploads([])}
                      style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body)", background: "none", border: "none", transition: "color 0.18s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--ivory)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                    >
                      Clear all
                    </button>
                  </div>
                  <AnimatePresence>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.875rem" }}>
                      {uploads.map(item => (
                        <UploadCard key={item.id} item={item} onRemove={handleRemove} />
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              )}

              {uploads.length === 0 && (
                <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: "12px", background: "rgba(245,240,232,0.03)", border: "1px solid var(--hairline)" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <ImageIcon size={18} color="var(--muted)" weight="light" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: "0.8rem", color: "var(--ivory)", fontFamily: "var(--font-body)", fontWeight: 500, marginBottom: "0.3rem" }}>How uploads work</p>
                      <ul style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.7, paddingLeft: "1rem" }}>
                        <li>Upload a photo of any garment (yours or from a brand)</li>
                        <li>Use it to find visually similar items in our catalog</li>
                        <li>Add it to a look and try it on virtually with AI</li>
                        <li>Build your personal digital wardrobe over time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
