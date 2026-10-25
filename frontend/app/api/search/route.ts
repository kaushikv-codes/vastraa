import { NextRequest, NextResponse } from "next/server";
import { embedText } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { query, gender, limit = 20 } = await req.json();

    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Embed the search query with Gemini
    const queryEmbedding = await embedText(query.trim());

    // 2. Run pgvector similarity search in Supabase
    const { data, error } = await supabaseAdmin.rpc("search_products", {
      query_embedding: queryEmbedding,
      gender_filter: gender || null,   // "women" | "men" | null = both
      match_count: limit,
      match_threshold: 0.3,            // min cosine similarity — tune this
    });

    if (error) throw error;

    return NextResponse.json({
      results: data ?? [],
      count: data?.length ?? 0,
      query,
    });
  } catch (err: any) {
    console.error("[search] error:", err);
    return NextResponse.json(
      { error: err.message ?? "Search failed" },
      { status: 500 }
    );
  }
}
