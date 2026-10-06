import { requireRole } from "@/server/auth";
import { getInsights } from "@/server/insights";

/** Ventes par jour, affluence à l'entrée, présence. ADMIN uniquement. */
export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;
  return Response.json(await getInsights(), { headers: { "Cache-Control": "no-store" } });
}
