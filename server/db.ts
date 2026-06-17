import { neon } from "@neondatabase/serverless";
import { getDefaultAdminPassword } from "./auth";

const ADMIN_PASSWORD_KEY = "admin_password";

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

function getDatabaseUrl(): string {
  return (
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL_NON_POOLING?.trim() ||
    ""
  );
}

function getSql() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "Database URL is not configured. Connect Postgres in Vercel (POSTGRES_URL or DATABASE_URL)."
    );
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
      await sql`
        CREATE TABLE IF NOT EXISTS admin_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
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

export async function getAdminPassword(): Promise<string> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT value FROM admin_settings WHERE key = ${ADMIN_PASSWORD_KEY} LIMIT 1
  `;
  const stored = rows[0]?.value;
  return typeof stored === "string" && stored.length > 0
    ? stored
    : getDefaultAdminPassword();
}

export async function setAdminPassword(password: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO admin_settings (key, value)
    VALUES (${ADMIN_PASSWORD_KEY}, ${password})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
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
