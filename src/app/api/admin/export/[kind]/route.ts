import { requireRole } from "@/server/auth";
import { ordersCsv, ticketsCsv } from "@/server/export";

/** Export CSV des commandes ou des billets. ADMIN uniquement. */
export async function GET(_request: Request, ctx: RouteContext<"/api/admin/export/[kind]">) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;

  const { kind } = await ctx.params;
  if (kind !== "commandes" && kind !== "billets") return Response.json(null, { status: 404 });

  const csv = kind === "commandes" ? await ordersCsv() : await ticketsCsv();
  const day = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="gala-ttct-${kind}-${day}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
