import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminLoginAccepted, createAdminToken, getAdminUsername, getDefaultAdminPassword } from "../../server/auth";

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

    const expectedUser = getAdminUsername();
    // Prefer env/default password so login works even when Postgres is not connected yet.
    let expectedPassword = getDefaultAdminPassword();
    try {
      const { getAdminPassword } = await import("../../server/db");
      expectedPassword = await getAdminPassword();
    } catch (err) {
      console.warn("admin/login: using default password", err);
    }

    if (!adminLoginAccepted(username, password, expectedUser, expectedPassword)) {
      return res.status(401).json({ error: "Incorrect username or password." });
    }

    const token = createAdminToken(getAdminUsername());
    return res.status(200).json({ token, username: getAdminUsername() });
  } catch (err) {
    console.error("admin/login error:", err);
    return res.status(500).json({ error: "Login failed." });
  }
}
