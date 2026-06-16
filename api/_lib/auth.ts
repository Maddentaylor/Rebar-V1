import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured.");
  }
  return secret;
}

export function getAdminCredentials(): { username: string; password: string } {
  return {
    username: process.env.ADMIN_USERNAME?.trim() || "rebarlegacy",
    password: process.env.ADMIN_PASSWORD?.trim() || "AKKNDiw!!938Mama#&",
  };
}

export function createAdminToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + TOKEN_TTL_MS })
  ).toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): string | null {
  if (!token) return null;
  const raw = token.startsWith("Bearer ") ? token.slice(7) : token;
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;

  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!payload || !sig) return null;

  let expected: string;
  try {
    expected = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  } catch {
    return null;
  }

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      u?: string;
      exp?: number;
    };
    if (!parsed.u || typeof parsed.exp !== "number" || Date.now() > parsed.exp) {
      return null;
    }
    return parsed.u;
  } catch {
    return null;
  }
}

export function readBearer(req: { headers?: { authorization?: string } }): string | undefined {
  return req.headers?.authorization;
}
