type SqlClient = ReturnType<typeof import("@neondatabase/serverless").neon>;

const ADMIN_PASSWORD_KEY = "admin_password";
const DEFAULT_ADMIN_PASSWORD = "Madden19!";

function defaultAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

/** Previous defaults — migrated to current default on read. */
const LEGACY_ADMIN_PASSWORDS = new Set(["mashcnehish11254fhsc", "your-secure-password"]);

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

let sqlClient: SqlClient | null = null;

function getSql(): SqlClient {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "Database URL is not configured. Connect Postgres in Vercel (POSTGRES_URL or DATABASE_URL)."
    );
  }
  if (!sqlClient) {
    // Lazy load so API routes that don't need Postgres can still start on Vercel.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { neon } = require("@neondatabase/serverless") as typeof import("@neondatabase/serverless");
    sqlClient = neon(url);
  }
  return sqlClient;
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
      await sql`
        CREATE TABLE IF NOT EXISTS hidden_parts (
          part_id TEXT PRIMARY KEY,
          hidden_at BIGINT NOT NULL
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
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;

  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`
      SELECT value FROM admin_settings WHERE key = ${ADMIN_PASSWORD_KEY} LIMIT 1
    `;
    const stored = rows[0]?.value;
    if (typeof stored === "string" && stored.length > 0) {
      if (LEGACY_ADMIN_PASSWORDS.has(stored)) {
        const next = defaultAdminPassword();
        await setAdminPassword(next);
        return next;
      }
      return stored;
    }
  } catch (err) {
    console.warn("getAdminPassword: using default", err);
  }
  return defaultAdminPassword();
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

export async function listHiddenPartIds(): Promise<string[]> {
  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql`SELECT part_id FROM hidden_parts ORDER BY hidden_at DESC`;
    return rows.map((r) => String(r.part_id));
  } catch (err) {
    console.error("listHiddenPartIds:", err);
    return [];
  }
}

export async function hidePartById(id: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO hidden_parts (part_id, hidden_at)
    VALUES (${id}, ${Date.now()})
    ON CONFLICT (part_id) DO NOTHING
  `;
}

export async function unhidePartById(id: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM hidden_parts WHERE part_id = ${id} RETURNING part_id
  `;
  return rows.length > 0;
}
