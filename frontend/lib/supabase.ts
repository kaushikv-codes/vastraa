import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side client (uses anon key — safe to expose)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (uses service role — NEVER expose to browser)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ── Types ────────────────────────────────────────────────────
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string | null;
  tags: string[];
  price: number;
  currency: string;
  image_url: string;
  product_url: string;
  gender: "women" | "men" | "unisex";
  shopify_store_id: string | null;
  embedding: number[] | null;
  created_at: string;
};

export type SearchResult = Omit<Product, "embedding"> & {
  similarity: number;
};
