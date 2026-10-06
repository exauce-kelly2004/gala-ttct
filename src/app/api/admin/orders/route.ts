import { z } from "zod";
import { listOrders } from "@/server/admin";
import { requireRole } from "@/server/auth";

const status = z.enum(["ALL", "PENDING", "PAID", "CANCELLED"]).catch("ALL");

/** Liste des commandes avec coordonnées des clients. ADMIN uniquement. */
export async function GET(request: Request) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;
  const params = new URL(request.url).searchParams;
  return Response.json(await listOrders({ query: params.get("q") ?? "", status: status.parse(params.get("status") ?? "ALL") }), {
    headers: { "Cache-Control": "no-store" },
  });
}
