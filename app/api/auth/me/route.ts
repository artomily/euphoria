// GET /api/auth/me — current verified wallet address, or null.
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  return Response.json({ address: session?.address ?? null });
}
