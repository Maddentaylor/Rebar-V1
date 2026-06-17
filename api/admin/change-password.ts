import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readBearer, verifyAdminToken } from "../../server/auth";
import { getAdminPassword, setAdminPassword } from "../../server/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = verifyAdminToken(readBearer(req));
  if (!admin) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const body = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    const currentPassword =
      typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters." });
    }

    const stored = await getAdminPassword();
    if (currentPassword !== stored) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    await setAdminPassword(newPassword);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("admin/change-password error:", err);
    return res.status(500).json({ error: "Could not update password." });
  }
}
