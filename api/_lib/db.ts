import { neon } from "@neondatabase/serverless";

export type DbCustomPart = {
  id: string;
  name: string;
  part_number: string;
  parts_type_id: string;
  category: string;
  image: string;
  description: string | null;
  created_at: number;
};

function getSql() {
  const url = process.env.POSTGRES_URL?.trim();
  if (!url) {
    throw new Error("POSTGRES_URL is not configured. Add a Postgres database in Vercel.");
  }
  return neon(url);
}

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS custom_parts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          part_number TEXT NOT NULL,
          parts_type_id TEXT NOT NULL,
          category TEXT NOT NULL,
          image TEXT NOT NULL,
          description TEXT,
          created_at BIGINT NOT NULL
        )
      `;
    })();
  }
  return schemaReady;
}

export async function listCustomParts(): Promise<DbCustomPart[]> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT id, name, part_number, parts_type_id, category, image, description, created_at
    FROM custom_parts
    ORDER BY created_at DESC
  `;
  return rows as DbCustomPart[];
}

export async function insertCustomPart(part: DbCustomPart): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO custom_parts (id, name, part_number, parts_type_id, category, image, description, created_at)
    VALUES (
      ${part.id},
      ${part.name},
      ${part.part_number},
      ${part.parts_type_id},
      ${part.category},
      ${part.image},
      ${part.description},
      ${part.created_at}
    )
  `;
}

export async function deleteCustomPartById(id: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM custom_parts WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}
