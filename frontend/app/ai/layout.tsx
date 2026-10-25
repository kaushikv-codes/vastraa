import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastraa Genius — AI Fashion Stylist",
  description: "Ask Vastraa's AI stylist anything. Saree for a wedding? Office outfit under ₹3000? First date but not trying too hard? Powered by 500,000+ Indian brand products.",
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
