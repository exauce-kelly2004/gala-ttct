import { requireRole } from "@/server/auth";
import { searchTickets } from "@/server/checkin";

/** Retrouve un billet par code, nom ou commande (sans e-mail ni téléphone ni montant). ADMIN ou STAFF. */
export async function GET(request: Request) {
  const auth = await requireRole("ADMIN", "STAFF");
  if (auth instanceof Response) return auth;
  const q = new URL(request.url).searchParams.get("q") ?? "";
  return Response.json(await searchTickets(q), { headers: { "Cache-Control": "no-store" } });
}
