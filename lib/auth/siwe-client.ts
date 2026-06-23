// ─── Client-side Sign-In With Ethereum flow ──────────────────────────────────
// Bridges a connected wagmi wallet to the server session: fetch a nonce, build an
// EIP-4361 message, ask the wallet to sign it, and POST to /api/auth/verify.
// Returns the verified (lowercased) address on success.

import { createSiweMessage } from "viem/siwe";

interface SignInParams {
  address: `0x${string}`;
  chainId: number;
  signMessageAsync: (args: { message: string }) => Promise<string>;
}

export async function signInWithEthereum({
  address,
  chainId,
  signMessageAsync,
}: SignInParams): Promise<string> {
  const nonceRes = await fetch("/api/auth/nonce", { cache: "no-store" });
  if (!nonceRes.ok) throw new Error("Failed to obtain nonce");
  const { nonce } = (await nonceRes.json()) as { nonce: string };

  const message = createSiweMessage({
    address,
    chainId,
    domain: window.location.host,
    nonce,
    uri: window.location.origin,
    version: "1",
    statement: "Sign in to Euphoria to verify wallet ownership. This does not cost gas.",
  });

  const signature = await signMessageAsync({ message });

  const verifyRes = await fetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature }),
  });
  if (!verifyRes.ok) throw new Error("Signature verification failed");

  const { address: verified } = (await verifyRes.json()) as { address: string };
  return verified;
}

export async function fetchVerifiedAddress(): Promise<string | null> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return null;
  const { address } = (await res.json()) as { address: string | null };
  return address;
}

export async function signOut(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
