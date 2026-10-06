import { env } from "@/lib/env";
import { renderTicketsPdf } from "@/server/pdf";
import { getOrder } from "@/server/orders";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * PDF officiel des billets d'une commande payée (tous), ou d'un seul avec ?billet=GALA-XXXX-XXXX.
 * Comme la page de confirmation, la référence imprévisible fait office de lien secret.
 */
export async function GET(request: Request, ctx: RouteContext<"/api/orders/[reference]/pdf">) {
  const { reference } = await ctx.params;
  if (!/^CMD-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(reference)) return Response.json(null, { status: 404 });

  const url = new URL(request.url);
  const ticket = url.searchParams.get("billet") ?? undefined;
  if (ticket && !/^GALA-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(ticket)) return Response.json(null, { status: 404 });

  const order = await getOrder(reference);
  if (!order || order.status !== "PAID" || (ticket && !order.tickets.some((t) => t.number === ticket))) return Response.json(null, { status: 404 });

  try {
    // En production, l'adresse vient de la configuration (jamais de l'en-tête de la requête, que l'on pourrait falsifier)
    const origin = env.NODE_ENV === "production" ? env.APP_URL : url.origin;
    const pdf = await renderTicketsPdf(origin, reference, ticket);
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${ticket ?? `billets-${reference}`}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[pdf] fabrication impossible", error);
    return Response.json({ error: "PDF_FAILED" }, { status: 500 });
  }
}
