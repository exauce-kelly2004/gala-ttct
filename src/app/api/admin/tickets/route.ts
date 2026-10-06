import { z } from "zod";
import { listTickets } from "@/server/admin";
import { requireRole } from "@/server/auth";

const status = z.enum(["ALL", "PENDING", "VALID", "USED", "CANCELLED"]).catch("ALL");

/** Liste des billets avec l'e-mail de l'acheteur. ADMIN uniquement. */
export async function GET(request: Request) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;
  const params = new URL(request.url).searchParams;
  return Response.json(await listTickets({ query: params.get("q") ?? "", status: status.parse(params.get("status") ?? "ALL") }), {
    headers: { "Cache-Control": "no-store" },
  });
}
