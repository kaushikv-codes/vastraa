import type { Metadata } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { AgentationWrapper } from "@/components/AgentationWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProvider } from "@/contexts/AppContext";
import { AccountSidebar } from "@/components/AccountSidebar";
import { LooksDrawer } from "@/components/LooksDrawer";
import { AuthModal } from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "Vastraa — AI Occasion Styling for Modern India",
  description:
    "Vastraa uses AI to match your outfit to any occasion. Wedding, office, festival — tell us the event and we find the look.",
  keywords: ["Indian fashion", "AI stylist", "ethnic wear", "lehenga", "saree", "occasion styling"],
  openGraph: {
    title: "Vastraa",
    description: "AI occasion styling for modern India",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500&f[]=satoshi@400,500&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bodoni+Moda:opsz,wght@6..96,700&family=Josefin+Sans:wght@300;400&family=Noto+Sans+Devanagari:wght@300;400&family=Poppins:ital,wght@1,600&family=Ubuntu:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <AppProvider>
            <SmoothScrollProvider>
              <SmoothCursor />
              {children}
            </SmoothScrollProvider>
            {/* Global UI layers — available on every page */}
            <AccountSidebar />
            <LooksDrawer />
            <AuthModal />
            {/* Agentation — dev-only, client-only annotation toolbar */}
            <AgentationWrapper />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
