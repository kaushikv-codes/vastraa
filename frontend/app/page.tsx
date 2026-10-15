"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ProductGrid } from "@/components/ProductGrid";
import { AIStylist } from "@/components/AIStylist";
import { Footer } from "@/components/Footer";
import { ASMRStaticBackground } from "@/components/ASMRStaticBackground";
import { IntroScreen } from "@/components/IntroScreen";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {/* Fixed canvas particle background — always present */}
      <ASMRStaticBackground />

      {/* Main page — fades in once intro exits */}
      <AnimatePresence>
        {introComplete && (
          <motion.main
            className="overflow-x-hidden w-full"
            style={{ position: "relative", zIndex: 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Navigation />
            <Hero />
            <Marquee />
            <ProductGrid />
            <AIStylist />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Intro overlay — sits on top, exits with scale+fade */}
      <AnimatePresence>
        {!introComplete && (
          <IntroScreen onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>
    </>
  );
}
