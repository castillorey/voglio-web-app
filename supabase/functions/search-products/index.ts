import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    const { q } = await req.json();
    if (!q || typeof q !== "string" || !q.trim()) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("SERPAPI_KEY");
    if (!apiKey) {
      console.error("SERPAPI_KEY not set");
      return new Response(JSON.stringify({ error: "SERPAPI_KEY not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(
      `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(q.trim())}&api_key=${apiKey}&num=10`
    );
    const data = await res.json();

    if (!data.shopping_results) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = data.shopping_results.map((item: any) => ({
      title: item.title ?? "",
      price: item.price ?? "",
      link: item.link ?? "",
      thumbnail: item.thumbnail ?? "",
      source: item.source ?? "",
      description: item.extracted_description ?? item.description ?? "",
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
