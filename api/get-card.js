// api/get-card.js
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query || {};
  if (!id) return res.status(400).json({ error: "Missing id" });

  // dynamic import of KV
  let kv;
  try {
    kv = await import("@vercel/kv");
    kv = kv.default || kv;
  } catch (err) {
    return res.status(500).json({
      error:
        "KV not configured or @vercel/kv not available. Configure Vercel KV and add VERCEL_KV_REST_URL and VERCEL_KV_REST_TOKEN env vars. See README.",
    });
  }

  try {
    const raw = await kv.get(`card:${id}`);
    if (!raw) return res.status(404).json({ error: "Not found" });
    // raw might be JSON string
    let card = raw;
    if (typeof raw === "string") {
      try {
        card = JSON.parse(raw);
      } catch (e) {
        // if not JSON string, return as-is
      }
    }
    return res.status(200).json(card);
  } catch (err) {
    console.error("KV get error:", err);
    return res.status(500).json({ error: "Failed to retrieve card" });
  }
}
