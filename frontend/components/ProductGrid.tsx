"use client";

import { motion } from "motion/react";
import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";

const PRODUCTS: WorksWheelItem[] = [
  {
    title: "linen pants under ₹3k",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=700&q=80&auto=format&fit=crop",
    href: "#products",
  },
  {
    title: "zari lehenga set",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&q=80&auto=format&fit=crop",
    href: "#products",
  },
  {
    title: "white cotton co-ords",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=700&q=80&auto=format&fit=crop",
    href: "#products",
  },
  {
    title: "bags that look expensive",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=80&auto=format&fit=crop",
    href: "#products",
  },
  {
    title: "silk blend saree",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80&auto=format&fit=crop",
    href: "#products",
  },
  {
    title: "office kurta that works",
    image: "https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=700&q=80&auto=format&fit=crop",
    href: "#products",
  },
];

export function ProductGrid() {
  return (
    <section
      id="products"
      className="section"
      style={{ borderTop: "1px solid var(--hairline)", overflow: "hidden", padding: 0 }}
    >
      {/* Section header */}
      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "2rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}
        >
          <h2 style={{
            fontFamily: "var(--font-display)", color: "var(--ivory)",
            fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, letterSpacing: "-0.02em",
          }}>
            Explore{" "}
            <em style={{ color: "var(--terracotta)", fontStyle: "italic" }}>the edit</em>
          </h2>
          <span style={{
            fontSize: "0.72rem", color: "var(--muted)",
            fontFamily: "var(--font-body)", letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Scroll or drag the wheel
          </span>
        </motion.div>
      </div>

      {/* Works Wheel — takes up remaining height */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: "72vh", minHeight: "480px" }}
      >
        <WorksWheel
          items={PRODUCTS}
          label="The Edit"
          action="View"
          style={{ height: "100%" }}
        />
      </motion.div>
    </section>
  );
}
