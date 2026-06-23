// ─── SIWE session (signed httpOnly cookie) ───────────────────────────────────
// The "real auth" layer behind the wagmi connection. After a wallet proves
// ownership via Sign-In With Ethereum (see app/api/auth/verify), we mint a
// compact HMAC-signed token carrying the verified address and an expiry, stored
// in an httpOnly cookie. No database and no external store — serverless-friendly
// (the project runs "No Redis"). Server routes call getSession() to gate access.
//
// Privy's packages/env stay in place for a future swap; this is the active path.

import { cookies } from "next/headers";

const SESSION_COOKIE = "euphoria_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface Session {
  address: string;
  /** Unix seconds. */
  exp: number;
}

// Encode to a freshly-allocated (ArrayBuffer-backed) Uint8Array so the Web Crypto
// types accept it as a BufferSource under the current lib's strict typings.
function utf8(value: string): Uint8Array<ArrayBuffer> {
  const src = new TextEncoder().encode(value);
  const out = new Uint8Array(src.length);
  out.set(src);
  return out;
}

function secretKeyMaterial(): Uint8Array<ArrayBuffer> {
  // AUTH_SECRET is server-only. Fall back to a clearly-marked dev default so the
  // app boots locally without config; production must set a real secret.
  const secret = process.env.AUTH_SECRET ?? "euphoria-dev-secret-change-me";
  return utf8(secret);
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    secretKeyMaterial(),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, utf8(data));
  return new Uint8Array(sig);
}

/** Constant-time-ish comparison to avoid signature timing leaks. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function signToken(session: Session): Promise<string> {
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify(session)));
  const sig = toBase64Url(await hmac(payload));
  return `${payload}.${sig}`;
}

async function verifyToken(token: string): Promise<Session | null> {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = toBase64Url(await hmac(payload));
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const session = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payload))
    ) as Session;
    if (typeof session.exp !== "number" || session.exp * 1000 < Date.now()) return null;
    if (typeof session.address !== "string") return null;
    return session;
  } catch {
    return null;
  }
}

/** Read and verify the current session, or null if absent/invalid/expired. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Issue a session cookie for a verified wallet address (lowercased). */
export async function setSession(address: string): Promise<void> {
  const session: Session = {
    address: address.toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const store = await cookies();
  store.set(SESSION_COOKIE, await signToken(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

/** Clear the session cookie (logout). */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
