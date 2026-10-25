import { NextRequest, NextResponse } from "next/server";
import { embedText, buildProductEmbeddingText } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// Protect this route — only allow calls with the service key
function isAuthorized(req: NextRequest) {
  const secret = req.headers.get("x-ingest-secret");
  return secret === process.env.INGEST_SECRET;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { products } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "products array required" }, { status: 400 });
    }

    const results = [];

    for (const product of products) {
      // 1. Build a descriptive text for the product
      const embeddingText = buildProductEmbeddingText(product);

      // 2. Embed it with Gemini
      const embedding = await embedText(embeddingText);

      // 3. Upsert into Supabase products table
      const { data, error } = await supabaseAdmin
        .from("products")
        .upsert(
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category ?? null,
            description: product.description ?? null,
            tags: product.tags ?? [],
            price: product.price,
            currency: product.currency ?? "INR",
            image_url: product.image_url,
            product_url: product.product_url,
            gender: product.gender ?? "women",
            shopify_store_id: product.shopify_store_id ?? null,
            embedding,
          },
          { onConflict: "id" }
        )
        .select("id")
        .single();

      if (error) {
        results.push({ id: product.id, status: "error", error: error.message });
      } else {
        results.push({ id: product.id, status: "ok" });
      }
    }

    const ok = results.filter((r) => r.status === "ok").length;
    const failed = results.filter((r) => r.status === "error").length;

    return NextResponse.json({ ok, failed, results });
  } catch (err: any) {
    console.error("[ingest] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
