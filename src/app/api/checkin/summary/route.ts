import { requireRole } from "@/server/auth";
import { getCheckinSummary } from "@/server/checkin";

/** Point des billets à l'entrée : comptages seulement, aucun montant. ADMIN ou STAFF. */
export async function GET() {
  const auth = await requireRole("ADMIN", "STAFF");
  if (auth instanceof Response) return auth;
  return Response.json(await getCheckinSummary(), { headers: { "Cache-Control": "no-store" } });
}
