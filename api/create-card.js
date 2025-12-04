// api/create-card.js
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

// Try to import @vercel/kv client if available
let kv = null;
try {
  // @vercel/kv uses process.env.VERCEL_KV_REST_URL and VERCEL_KV_REST_TOKEN
  // and exposes a default export function createClient - but the runtime resolves it automatically.
  // The package exports get/set helpers when imported as below.
  // In many setups you can do: import kv from '@vercel/kv'
  // We'll dynamic-import to avoid crashing locally if not installed.
  // NOTE: In your Vercel deployment, add the @vercel/kv package to your api package.json dependencies.
  // See README steps below.
  // Fallback: kv remains null -> code will throw a helpful error if not configured.
  // eslint-disable-next-line no-undef
  // dynamic import:
  // (we keep it simple)
} catch (err) {
  // no-op; we'll check later
}

const ensureKV = async () => {
  if (kv) return kv;
  try {
    const mod = await import("@vercel/kv");
    // default export is a client factory; in some environments you can call createClient() but
    // the package provides get/set exported helpers. We'll use the simplest form:
    kv = mod.default || mod; // try both forms
    return kv;
  } catch (e) {
    // not installed or not available -> we will detect and return null
    return null;
  }
};

const getKV = async () => {
  // returns object with get,set if possible
  const client = await ensureKV();
  if (!client) return null;
  // @vercel/kv exports 'get' and 'set' as functions on the module itself
  // Some bundlers expose them as default; handle both.
  return client;
};

const sendMail = async ({ recipientEmail, senderName, link }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 465) === 465, // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailHtml = `
    <div style="font-family: Helvetica, Arial, sans-serif;">
      <h2>You received a Christmas card 🎄</h2>
      <p><strong>${escapeHtml(senderName)}</strong> sent you a Christmas card.</p>
      <a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:8px;text-decoration:none;background:#a71d31;color:#fff">Open your Christmas card</a>
      <p style="color:#666;margin-top:16px;font-size:13px">If the button doesn't work, open this link: ${link}</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || "noreply@example.com",
    to: recipientEmail,
    subject: `${senderName} sent you a Christmas card 🎄`,
    html: mailHtml,
  });
};

const escapeHtml = (s) =>
  (s || "").replace(/[&<>\"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { frontText = "Merry Christmas", backText = "", recipientEmail, senderName } = req.body || {};

  if (!recipientEmail || !senderName) {
    return res.status(400).json({ error: "recipientEmail and senderName required" });
  }

  // prepare card
  const id = uuidv4();
  const card = {
    id,
    frontText,
    backText,
    recipientEmail,
    senderName,
    createdAt: new Date().toISOString(),
  };

  // store card in Vercel KV
  const client = await getKV();
  if (!client || typeof client.set !== "function") {
    // helpful error for deployment dev
    return res.status(500).json({
      error:
        "KV not configured or @vercel/kv not available. Configure Vercel KV and add VERCEL_KV_REST_URL and VERCEL_KV_REST_TOKEN env vars. See README.",
    });
  }

  try {
    // store under key `card:{id}` as JSON
    await client.set(`card:${id}`, JSON.stringify(card));
  } catch (err) {
    console.error("KV set error:", err);
    return res.status(500).json({ error: "Failed to store card" });
  }

  // compose link
  const base = process.env.BASE_URL || `https://${process.env.VERCEL_URL || ""}`.replace(/(^https?:\/\/)|\/$/g, "");
  const publicBase = process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  const viewLink = publicBase ? `${publicBase}/view/${id}` : `/view/${id}`;

  // send email (best-effort)
  try {
    await sendMail({ recipientEmail, senderName, link: publicBase ? viewLink : `${base}/view/${id}` });
  } catch (err) {
    console.error("Failed to send email:", err?.message || err);
    // continue — we still return the link even if email fails
  }

  return res.status(200).json({ id, link: publicBase ? viewLink : `${base}/view/${id}` });
}
