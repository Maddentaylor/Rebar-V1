import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const MAX_LINES = 100;

type QuoteLine = {
  id?: string;
  name?: string;
  partNumber?: string;
  category?: string;
  quantity?: number;
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeLines(raw: unknown): QuoteLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, MAX_LINES).map((row) => {
    if (!row || typeof row !== "object") return {};
    const o = row as Record<string, unknown>;
    return {
      id: typeof o.id === "string" ? o.id : undefined,
      name: typeof o.name === "string" ? o.name : undefined,
      partNumber: typeof o.partNumber === "string" ? o.partNumber : undefined,
      category: typeof o.category === "string" ? o.category : undefined,
      quantity: typeof o.quantity === "number" ? o.quantity : undefined,
    };
  });
}

function buildInternalEmailHtml(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  lines: QuoteLine[];
}): string {
  const { firstName, lastName, email, phone, company, lines } = payload;
  const totalQty = lines.reduce((n, l) => n + (typeof l.quantity === "number" ? l.quantity : 0), 0);

  const rowsHtml = lines
    .map((l) => {
      const qty = typeof l.quantity === "number" ? l.quantity : 0;
      const name = esc(l.name ?? "—");
      const sku = esc(l.partNumber ?? "—");
      const cat = esc(l.category ?? "—");
      const id = esc(l.id ?? "—");
      return `
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #e4e2dc;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#1a1a1f;">${name}</td>
          <td style="padding:14px 16px;border-bottom:1px solid #e4e2dc;font-family:'JetBrains Mono',Consolas,monospace;font-size:12px;color:#6b6b75;">${sku}</td>
          <td style="padding:14px 16px;border-bottom:1px solid #e4e2dc;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;color:#6b6b75;text-transform:uppercase;letter-spacing:0.06em;">${cat}</td>
          <td style="padding:14px 16px;border-bottom:1px solid #e4e2dc;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:#1a1a1f;text-align:right;">${qty}</td>
          <td style="padding:14px 16px;border-bottom:1px solid #e4e2dc;font-family:'JetBrains Mono',Consolas,monospace;font-size:11px;color:#a3a3ad;">${id}</td>
        </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Parts quote request</title>
</head>
<body style="margin:0;padding:0;background:#eeece6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eeece6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fafaf8;border-radius:16px;overflow:hidden;border:1px solid #e4e2dc;box-shadow:0 18px 40px -20px rgba(15,18,24,0.22);">
          <tr>
            <td style="background:linear-gradient(120deg,#D32F2F 0%,#b71c1c 55%,#1a1a1f 100%);padding:28px 28px 24px;">
              <p style="margin:0 0 6px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.78);">New request</p>
              <h1 style="margin:0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:26px;line-height:1.15;font-weight:800;letter-spacing:-0.03em;color:#ffffff;">Parts quote cart</h1>
              <p style="margin:12px 0 0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:rgba(255,255,255,0.82);max-width:420px;">A customer submitted a batch parts quote from your website. Reply to this email to reach them directly.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;background:#fafaf8;">
              <p style="margin:0 0 12px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#a3a3ad;">Contact</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f4f1;border-radius:12px;border:1px solid #e4e2dc;">
                <tr>
                  <td style="padding:16px 18px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#1a1a1f;line-height:1.6;">
                    <strong style="display:block;font-size:15px;margin-bottom:6px;">${esc(firstName)} ${esc(lastName)}</strong>
                    <a href="mailto:${esc(email)}" style="color:#D32F2F;font-weight:600;text-decoration:none;">${esc(email)}</a><br>
                    ${phone ? `<span style="color:#6b6b75;">${esc(phone)}</span><br>` : ""}
                    ${company ? `<span style="color:#6b6b75;">${esc(company)}</span>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 28px 8px;background:#fafaf8;">
              <p style="margin:0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#a3a3ad;">Order summary</p>
              <p style="margin:8px 0 0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:13px;color:#6b6b75;">
                <strong style="color:#1a1a1f;">${lines.length}</strong> line${lines.length !== 1 ? "s" : ""}
                · <strong style="color:#1a1a1f;">${totalQty}</strong> piece${totalQty !== 1 ? "s" : ""} total
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 16px 28px;background:#fafaf8;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e4e2dc;border-radius:12px;overflow:hidden;background:#ffffff;">
                <thead>
                  <tr style="background:#f5f4f1;">
                    <th align="left" style="padding:12px 16px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#a3a3ad;">Part</th>
                    <th align="left" style="padding:12px 16px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#a3a3ad;">#</th>
                    <th align="left" style="padding:12px 16px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#a3a3ad;">Type</th>
                    <th align="right" style="padding:12px 16px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#a3a3ad;">Qty</th>
                    <th align="left" style="padding:12px 16px;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#a3a3ad;">ID</th>
                  </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;background:#fafaf8;">
              <p style="margin:0;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#a3a3ad;text-align:center;">Sent from your site parts quote form</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildPlainText(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  lines: QuoteLine[];
}): string {
  const linesText = payload.lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.name ?? "?"} | #${l.partNumber ?? "?"} | ${l.category ?? "?"} | qty ${l.quantity ?? 0}`
    )
    .join("\n");
  return [
    `Parts quote from ${payload.firstName} ${payload.lastName}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : "",
    payload.company ? `Company: ${payload.company}` : "",
    "",
    "Line items:",
    linesText,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildCustomerEmailHtml(payload: {
  firstName: string;
  lines: QuoteLine[];
}): string {
  const { firstName, lines } = payload;
  const totalQty = lines.reduce((n, l) => n + (typeof l.quantity === "number" ? l.quantity : 0), 0);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eeece6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eeece6;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#fafaf8;border-radius:16px;border:1px solid #e4e2dc;overflow:hidden;">
        <tr><td style="background:linear-gradient(120deg,#D32F2F,#b71c1c);padding:24px 26px;">
          <h1 style="margin:0;font-family:Inter,Segoe UI,sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em;">Thanks, ${esc(firstName)}</h1>
          <p style="margin:12px 0 0;font-family:Inter,Segoe UI,sans-serif;font-size:14px;line-height:1.5;color:rgba(255,255,255,0.88);">We received your parts quote request and will follow up with pricing and availability.</p>
        </td></tr>
        <tr><td style="padding:22px 26px;font-family:Inter,Segoe UI,sans-serif;font-size:14px;color:#1a1a1f;line-height:1.6;">
          <p style="margin:0 0 8px;color:#6b6b75;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">Summary</p>
          <p style="margin:0;"><strong>${lines.length}</strong> line${lines.length !== 1 ? "s" : ""} · <strong>${totalQty}</strong> piece${totalQty !== 1 ? "s" : ""} total</p>
          <p style="margin:16px 0 0;font-size:13px;color:#6b6b75;">If you need to add anything, just reply to the email you&apos;ll get from our team.</p>
          <p style="margin:20px 0 0;font-size:12px;color:#a3a3ad;">— Our parts team</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildCustomerPlainText(payload: {
  firstName: string;
  lastName: string;
  lines: QuoteLine[];
}): string {
  const n = payload.lines.length;
  const q = payload.lines.reduce((a, l) => a + (typeof l.quantity === "number" ? l.quantity : 0), 0);
  return `Hi ${payload.firstName},\n\nWe received your parts quote (${n} line${n !== 1 ? "s" : ""}, ${q} pieces total). Our team will reply soon with pricing and availability.\n\nThank you.`;
}

function wantCustomerCopy(): boolean {
  const v = process.env.QUOTE_SEND_CUSTOMER_COPY?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
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
  const from = process.env.RESEND_FROM?.trim() || "Parts Quote <onboarding@resend.dev>";

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
  const lines = normalizeLines(body.lines).filter(
    (l) => l.name && typeof l.quantity === "number" && l.quantity > 0
  );

  if (!firstName || !lastName || !email || !emailOk(email)) {
    res.status(400).json({ error: "Please provide valid first name, last name, and email." });
    return;
  }
  if (lines.length === 0) {
    res.status(400).json({ error: "Your cart was empty when submitting." });
    return;
  }

  const payload = { firstName, lastName, email, phone, company, lines };
  const html = buildInternalEmailHtml(payload);
  const text = buildPlainText(payload);
  const subject = `Parts quote · ${firstName} ${lastName} · ${lines.length} line${lines.length !== 1 ? "s" : ""}`;

  try {
    const resend = new Resend(apiKey);
    const { error: teamErr } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject,
      html,
      text,
    });

    if (teamErr) {
      console.error("Resend error:", teamErr);
      res.status(502).json({ error: teamErr.message || "Could not send email." });
      return;
    }

    if (wantCustomerCopy()) {
      const custHtml = buildCustomerEmailHtml({
        firstName,
        lines,
      });
      const custText = buildCustomerPlainText({ firstName, lastName, lines });
      const { error: custErr } = await resend.emails.send({
        from,
        to: [email],
        replyTo: to,
        subject: "We received your parts quote request",
        html: custHtml,
        text: custText,
      });
      if (custErr) {
        console.error("Customer confirmation email failed:", custErr);
      }
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Unexpected error sending email." });
  }
}
