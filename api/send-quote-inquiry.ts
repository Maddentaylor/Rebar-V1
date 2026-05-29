import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const ALLOWED_TYPES = new Set(["machinery", "parts", "service", "other"]);

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clamp(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function setCors(res: VercelResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  const raw = req.body;
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as Record<string, unknown>;
  return {};
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL?.trim();
  const from = process.env.RESEND_FROM?.trim() || "Quotes <onboarding@resend.dev>";

  if (!apiKey) {
    res.status(503).json({
      error: "Email is not configured. Set RESEND_API_KEY on the server.",
    });
    return;
  }
  if (!to) {
    res.status(503).json({
      error: "Email is not configured. Set QUOTE_TO_EMAIL on the server.",
    });
    return;
  }

  const body = parseBody(req);
  const firstName = typeof body.first_name === "string" ? body.first_name.trim() : "";
  const lastName = typeof body.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const inquiryRaw = typeof body.inquiry_type === "string" ? body.inquiry_type.trim() : "";
  const message = typeof body.message === "string" ? clamp(body.message.trim(), 6000) : "";

  const inquiryLabel =
    inquiryRaw === "machinery"
      ? "Machinery / line expansion"
      : inquiryRaw === "parts"
        ? "Parts pricing"
        : inquiryRaw === "service"
          ? "Service / training"
          : inquiryRaw === "other"
            ? "Other inquiry"
            : "";

  if (!firstName || !lastName || !email || !emailOk(email)) {
    res.status(400).json({ error: "Please provide valid first name, last name, and email." });
    return;
  }
  if (!ALLOWED_TYPES.has(inquiryRaw) || !inquiryLabel) {
    res.status(400).json({ error: "Please choose what you're looking for." });
    return;
  }
  if (!message || message.length < 4) {
    res.status(400).json({ error: "Please add a short description of what you need." });
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#eeece6;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:0 auto;background:#fafaf8;border-radius:14px;border:1px solid #e4e2dc;">
    <tr>
      <td style="padding:24px 26px;background:linear-gradient(120deg,#D32F2F 0%,#b71c1c 52%,#1a1a1f 100%);">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.76);">Web quote inquiry</p>
        <h1 style="margin:0;font-size:22px;line-height:1.15;font-weight:800;color:#fff;">Pricing / quote modal</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:22px 26px;color:#1a1a1f;font-size:14px;line-height:1.65;">
        <p style="margin:0 0 10px;"><strong>Type:</strong> ${esc(inquiryLabel)}</p>
        <p style="margin:0 0 14px;line-height:1.55;"><strong>Name:</strong> ${esc(`${firstName} ${lastName}`)}</p>
        <p style="margin:0 0 6px;"><strong>Email:</strong> <a href="mailto:${esc(email)}" style="color:#D32F2F;font-weight:600;text-decoration:none;">${esc(email)}</a></p>
        ${phone ? `<p style="margin:0 0 6px;"><strong>Phone:</strong> ${esc(phone)}</p>` : ""}
        ${company ? `<p style="margin:0 0 16px;"><strong>Company:</strong> ${esc(company)}</p>` : "<p style='margin:0 0 16px;'></p>"}
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#a3a3ad;">Message</p>
        <pre style="margin:0;padding:14px;background:#f5f4f1;border-radius:10px;font-size:13px;white-space:pre-wrap;font-family:inherit;border:1px solid #e4e2dc;line-height:1.5;color:#35353f;">${esc(message)}</pre>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Quote inquiry (${inquiryLabel})`,
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    company ? `Company: ${company}` : "",
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error: sendErr } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Quote inquiry · ${inquiryLabel} · ${firstName} ${lastName}`,
      html,
      text,
    });

    if (sendErr) {
      console.error("Resend quote inquiry error:", sendErr);
      res.status(502).json({ error: sendErr.message || "Could not send email." });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unexpected error sending email." });
  }
}
