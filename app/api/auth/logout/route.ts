// POST /api/auth/logout — clear the session cookie.
import { clearSession } from "@/lib/auth/session";

export async function POST() {
  await clearSession();
  return Response.json({ ok: true });
}
