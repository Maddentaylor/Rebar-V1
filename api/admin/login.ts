import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createAdminToken, getAdminCredentials } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.ADMIN_SECRET?.trim()) {
      return res.status(503).json({
        error: "Admin login is not configured. Set ADMIN_SECRET in Vercel environment variables.",
      });
    }

    const body = req.body as { username?: string; password?: string } | undefined;
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const creds = getAdminCredentials();
    if (
      username.toLowerCase() !== creds.username.toLowerCase() ||
      password !== creds.password
    ) {
      return res.status(401).json({ error: "Incorrect username or password." });
    }

    const token = createAdminToken(creds.username);
    return res.status(200).json({ token, username: creds.username });
  } catch (err) {
    console.error("admin/login error:", err);
    return res.status(500).json({ error: "Login failed." });
  }
}
