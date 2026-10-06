import { getStats } from "@/server/admin";
import { requireRole } from "@/server/auth";

/** Chiffres du tableau de bord. ADMIN uniquement : montants et ventes. */
export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;
  return Response.json(await getStats(), { headers: { "Cache-Control": "no-store" } });
}
