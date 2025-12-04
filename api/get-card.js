import kv from "@vercel/kv";


export default async function handler(req, res) {
if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });


const { id } = req.query || {};
if (!id) return res.status(400).json({ error: "Missing id" });


const raw = await kv.get(`card:${id}`);
if (!raw) return res.status(404).json({ error: "Not found" });


return res.status(200).json(JSON.parse(raw));
}
