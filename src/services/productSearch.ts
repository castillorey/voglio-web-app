export interface ProductResult {
  title: string;
  price: string;
  link: string;
  thumbnail: string;
  source: string;
  description: string;
}

const FUNCTION_URL =
  import.meta.env.DEV
    ? "/api/functions/search-products"
    : import.meta.env.VITE_SUPABASE_URL + "/functions/v1/search-products";

export async function searchProducts(query: string): Promise<ProductResult[]> {
  try {
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: query }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Product search failed:", res.status, text);
      return [];
    }

    const data = await res.json();
    return data?.results ?? [];
  } catch (err) {
    console.error("Product search failed:", err);
    return [];
  }
}
