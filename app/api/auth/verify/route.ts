// POST /api/auth/verify — verify a SIWE signature and open a session.
// Body: { message, signature }. We recover the signer from the signed EIP-4361
// message, confirm it matches the message's stated address and the issued nonce,
// then mint a session cookie. EOA-only verification (recoverMessageAddress) keeps
// this free of any RPC/public-client dependency.
import { cookies } from "next/headers";
import { z } from "zod";
import { recoverMessageAddress } from "viem";
import { parseSiweMessage, validateSiweMessage } from "viem/siwe";
import { setSession } from "@/lib/auth/session";

const NONCE_COOKIE = "euphoria_siwe_nonce";

const verifySchema = z.object({
  message: z.string().min(1).max(4000),
  signature: z.string().regex(/^0x[0-9a-fA-F]+$/),
});

export async function POST(request: Request) {
  try {
    const { message, signature } = verifySchema.parse(await request.json());

    const store = await cookies();
    const nonce = store.get(NONCE_COOKIE)?.value;
    if (!nonce) {
      return Response.json({ error: "Missing or expired nonce" }, { status: 400 });
    }

    const parsed = parseSiweMessage(message);
    if (!parsed.address) {
      return Response.json({ error: "Invalid SIWE message" }, { status: 400 });
    }

    const recovered = await recoverMessageAddress({
      message,
      signature: signature as `0x${string}`,
    });

    // validateSiweMessage confirms the message's stated address equals the
    // recovered signer and the nonce matches the one we issued.
    const valid = validateSiweMessage({ message: parsed, address: recovered, nonce });
    if (!valid) {
      return Response.json({ error: "Signature verification failed" }, { status: 401 });
    }

    await setSession(recovered);
    store.delete(NONCE_COOKIE);
    return Response.json({ ok: true, address: recovered.toLowerCase() });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
