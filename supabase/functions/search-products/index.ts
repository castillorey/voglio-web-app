import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "http://localhost:5173";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, apikey, authorization",
};

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = hits.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

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

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return json({ error: "Rate limit exceeded. Try again later." }, 429);
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

    const results = data.shopping_results.map((item: Record<string, unknown>) => ({
      title: (item.title as string) ?? "",
      price: (item.price as string) ?? "",
      link: (item.link as string) || (item.product_link as string) || (item.merchant_link as string) || "",
      thumbnail: (item.thumbnail as string) ?? "",
      source: (item.source as string) ?? "",
      description: (item.extracted_description as string) ?? (item.description as string) ?? "",
    }));

    return json({ results });
  } catch (err) {
    console.error("Function error:", err);
    return json({ error: "Internal error" }, 500);
  }
});
