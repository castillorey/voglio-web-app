import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, apikey, authorization",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const { q } = await req.json();
    if (!q || typeof q !== "string" || !q.trim()) {
      return json({ error: "Missing query" }, 400);
    }

    const apiKey = Deno.env.get("SERPAPI_KEY");
    if (!apiKey) {
      console.error("SERPAPI_KEY not set");
      return json({ error: "SERPAPI_KEY not configured" }, 500);
    }

    const res = await fetch(
      `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q.trim())}&api_key=${apiKey}&num=10`
    );
    const data = await res.json();

    if (!data.shopping_results) {
      return json({ results: [] });
    }

    const results = data.shopping_results.map((item: any) => ({
      title: item.title ?? "",
      price: item.price ?? "",
      link: item.link || item.product_link || item.merchant_link || "",
      thumbnail: item.thumbnail ?? "",
      source: item.source ?? "",
      description: item.extracted_description ?? item.description ?? "",
    }));

    return json({ results });
  } catch (err) {
    console.error("Function error:", err);
    return json({ error: "Internal error" }, 500);
  }
});
