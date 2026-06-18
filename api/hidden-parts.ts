import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readBearer, verifyAdminToken } from "../server/auth";
import {
  hidePartById,
  listHiddenPartIds,
  unhidePartById,
} from "../server/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const ids = await listHiddenPartIds();
      return res.status(200).json({ ids });
    }

    const admin = verifyAdminToken(readBearer(req));
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const id =
      typeof req.query.id === "string"
        ? req.query.id
        : typeof (req.body as { id?: string })?.id === "string"
          ? (req.body as { id: string }).id
          : "";

    if (!id) {
      return res.status(400).json({ error: "Part id is required." });
    }

    if (req.method === "POST") {
      await hidePartById(id);
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const restored = await unhidePartById(id);
      if (!restored) {
        return res.status(404).json({ error: "Part was not hidden." });
      }
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("hidden-parts error:", err);
    const message = err instanceof Error ? err.message : "Server error.";
    if (message.includes("Database URL")) {
      return res.status(503).json({
        error: "Database not connected. Add Postgres storage in your Vercel project.",
      });
    }
    return res.status(500).json({ error: message });
  }
}
