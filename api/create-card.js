import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import kv from "@vercel/kv";


const escapeHtml = (s) =>
(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));


export default async function handler(req, res) {
if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });


const { frontText = "Merry Christmas", backText = "", recipientEmail, senderName } = req.body || {};
if (!recipientEmail || !senderName)
return res.status(400).json({ error: "recipientEmail and senderName required" });


const id = uuidv4();
const card = {
id,
frontText,
backText,
recipientEmail,
senderName,
createdAt: new Date().toISOString(),
};


// Store in Vercel KV
await kv.set(`card:${id}`, JSON.stringify(card));


const base = process.env.BASE_URL || `https://${process.env.VERCEL_URL}`;
const viewLink = `${base}/view/${id}`;


// Send email
try {
const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT || 587),
secure: Number(process.env.SMTP_PORT) === 465,
auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});


await transporter.sendMail({
from: process.env.FROM_EMAIL,
to: recipientEmail,
subject: `${senderName} sent you a Christmas card 🎄`,
html: `
<h2>You received a Christmas card 🎄</h2>
<p><strong>${escapeHtml(senderName)}</strong> sent you a message.</p>
<a href="${viewLink}">Open card</a>
`
});
} catch (err) {
console.error("Email error:", err);
}


return res.status(200).json({ id, link: viewLink });
}
