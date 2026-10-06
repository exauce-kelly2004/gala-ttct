import { getOrder } from "@/server/orders";

/** Commande pour la page de confirmation. La référence est imprévisible : elle fait office de lien secret. */
export async function GET(_request: Request, ctx: RouteContext<"/api/orders/[reference]">) {
  const { reference } = await ctx.params;
  if (!/^CMD-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(reference)) return Response.json(null, { status: 404 });

  const order = await getOrder(reference);
  if (!order) return Response.json(null, { status: 404 });
  return Response.json(order, { headers: { "Cache-Control": "no-store" } });
}
