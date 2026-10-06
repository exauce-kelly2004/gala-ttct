import { requireRole } from "@/server/auth";
import { cancelOrder } from "@/server/orders";

/** Annule une commande et ses billets (rétractation, erreur). ADMIN uniquement. */
export async function POST(_request: Request, ctx: RouteContext<"/api/admin/orders/[reference]/cancel">) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;

  const { reference } = await ctx.params;
  if (!/^CMD-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(reference)) return Response.json({ error: "NOT_FOUND" }, { status: 404 });

  const result = await cancelOrder(reference, auth.email);
  if (result === "NOT_FOUND") return Response.json({ error: "NOT_FOUND" }, { status: 404 });
  if (result === "ALREADY_CANCELLED") return Response.json({ error: "ALREADY_CANCELLED" }, { status: 409 });
  if (result === "TICKETS_USED") return Response.json({ error: "TICKETS_USED" }, { status: 409 });
  return Response.json({ ok: true });
}
