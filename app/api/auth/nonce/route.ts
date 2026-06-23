// GET /api/auth/nonce — issue a one-time SIWE nonce, bound to an httpOnly cookie.
import { cookies } from "next/headers";
import { generateSiweNonce } from "viem/siwe";

export const dynamic = "force-dynamic";

const NONCE_COOKIE = "euphoria_siwe_nonce";

export async function GET() {
  const nonce = generateSiweNonce();
  const store = await cookies();
  store.set(NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes to sign
  });
  return Response.json({ nonce });
}
