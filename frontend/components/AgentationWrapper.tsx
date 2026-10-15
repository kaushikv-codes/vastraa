"use client";

import dynamic from "next/dynamic";

// Agentation must be client-only — it reads DOM/window
const Agentation = dynamic(
  () => import("agentation").then((m) => ({ default: m.Agentation })),
  { ssr: false }
);

export function AgentationWrapper() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation />;
}
