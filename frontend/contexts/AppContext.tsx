"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────
export type User = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
};

export type LookItem = {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  addedAt: Date;
};

export type FavoriteItem = {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  savedAt: Date;
};

export type UploadItem = {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
  usedInTryOn: boolean;
};

// ── Context Shape ────────────────────────────────────────────
type AppContextType = {
  // Auth
  user: User | null;
  isAuthLoading: boolean;
  signIn: (intent?: string) => void;
  signOut: () => void;

  // Sidebar
  accountSidebarOpen: boolean;
  openAccountSidebar: () => void;
  closeAccountSidebar: () => void;

  // Auth modal
  authModalOpen: boolean;
  authModalIntent: string;
  openAuthModal: (intent?: string) => void;
  closeAuthModal: () => void;

  // Looks drawer
  looksDrawerOpen: boolean;
  openLooksDrawer: () => void;
  closeLooksDrawer: () => void;

  // Counts (will be real when backend is wired)
  looksCount: number;
  favoritesCount: number;
  generatingCount: number;

  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading] = useState(false);
  const [accountSidebarOpen, setAccountSidebarOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalIntent, setAuthModalIntent] = useState("signin");
  const [looksDrawerOpen, setLooksDrawerOpen] = useState(false);
  const [looksCount] = useState(0);
  const [favoritesCount] = useState(0);
  const [generatingCount] = useState(0);
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  const signIn = useCallback((intent = "signin") => {
    setAuthModalIntent(intent);
    setAuthModalOpen(true);
    setAccountSidebarOpen(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setAccountSidebarOpen(false);
  }, []);

  const openAccountSidebar = useCallback(() => setAccountSidebarOpen(true), []);
  const closeAccountSidebar = useCallback(() => setAccountSidebarOpen(false), []);
  const openAuthModal = useCallback((intent = "signin") => { setAuthModalIntent(intent); setAuthModalOpen(true); }, []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);
  const openLooksDrawer = useCallback(() => { setLooksDrawerOpen(true); setAccountSidebarOpen(false); }, []);
  const closeLooksDrawer = useCallback(() => setLooksDrawerOpen(false), []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("vastraa.theme", next); } catch {}
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      user, isAuthLoading, signIn, signOut,
      accountSidebarOpen, openAccountSidebar, closeAccountSidebar,
      authModalOpen, authModalIntent, openAuthModal, closeAuthModal,
      looksDrawerOpen, openLooksDrawer, closeLooksDrawer,
      looksCount, favoritesCount, generatingCount,
      theme, toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
