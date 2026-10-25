import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

/**
 * Generate a 768-dim embedding vector for a text string.
 * Used for both indexing products and querying.
 */
export async function embedText(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

/**
 * Build a rich product embedding string from structured product data.
 * The more descriptive this is, the better semantic search will work.
 */
export function buildProductEmbeddingText(product: {
  name: string;
  brand: string;
  category?: string;
  description?: string;
  tags?: string[];
  price?: number;
  gender?: string;
}): string {
  const parts = [
    product.name,
    `by ${product.brand}`,
    product.category && `category: ${product.category}`,
    product.gender && `for ${product.gender}`,
    product.description,
    product.tags?.join(", "),
    product.price && `priced at ₹${product.price}`,
  ].filter(Boolean);

  return parts.join(". ");
}
