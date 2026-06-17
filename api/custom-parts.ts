import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readBearer, verifyAdminToken } from "../server/auth";
import { deleteCustomPartById, insertCustomPart, listCustomParts } from "../server/db";
import { persistPartImage } from "../server/uploadImage";

function toClientPart(row: {
  id: string;
  name: string;
  part_number: string;
  parts_type_id: string;
  category: string;
  image: string;
  description: string | null;
  created_at: number;
}) {
  return {
    id: row.id,
    name: row.name,
    partNumber: row.part_number,
    partsTypeId: row.parts_type_id,
    category: row.category,
    image: row.image,
    description: row.description ?? undefined,
    createdAt: Number(row.created_at),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const rows = await listCustomParts();
      return res.status(200).json({ parts: rows.map(toClientPart) });
    }

    const admin = verifyAdminToken(readBearer(req));
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    if (req.method === "POST") {
      const body = req.body as {
        name?: string;
        partNumber?: string;
        partsTypeId?: string;
        category?: string;
        image?: string;
        description?: string;
      };

      const name = body.name?.trim() ?? "";
      const partNumber = body.partNumber?.trim() ?? "";
      const partsTypeId = body.partsTypeId?.trim() ?? "";
      const category = body.category?.trim() ?? "";

      if (!name || !partNumber || !partsTypeId || !category) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const image = await persistPartImage(id, body.image ?? "", "/parts/_missing.svg");
      const createdAt = Date.now();

      const row = {
        id,
        name,
        part_number: partNumber,
        parts_type_id: partsTypeId,
        category,
        image,
        description: body.description?.trim() || null,
        created_at: createdAt,
      };

      await insertCustomPart(row);
      return res.status(201).json({ part: toClientPart(row) });
    }

    if (req.method === "DELETE") {
      const id =
        typeof req.query.id === "string"
          ? req.query.id
          : typeof (req.body as { id?: string })?.id === "string"
            ? (req.body as { id: string }).id
            : "";

      if (!id) {
        return res.status(400).json({ error: "Part id is required." });
      }

      const deleted = await deleteCustomPartById(id);
      if (!deleted) {
        return res.status(404).json({ error: "Part not found." });
      }

      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("custom-parts error:", err);
    const message = err instanceof Error ? err.message : "Server error.";
    if (message.includes("POSTGRES_URL")) {
      return res.status(503).json({
        error: "Database not connected. Add Postgres storage in your Vercel project.",
      });
    }
    return res.status(500).json({ error: message });
  }
}
