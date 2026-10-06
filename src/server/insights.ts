import "server-only";
import type { Insights } from "@/features/dashboard/api";
import { db } from "@/lib/db";

/**
 * Statistiques détaillées de l'administration : ventes par jour, affluence à l'entrée, présence, en heure du Bénin.
 * Les dates sont stockées en UTC sans fuseau : on les déclare d'abord UTC, puis on les convertit (sans cela, PostgreSQL
 * les lirait comme déjà locales et décalerait les heures).
 */
export async function getInsights(): Promise<Insights> {
  const [orders, tickets, entries, status] = await Promise.all([
    db.$queryRaw<{ day: string; orders: bigint; revenue: bigint }[]>`
      SELECT to_char(("paidAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Africa/Porto-Novo', 'YYYY-MM-DD') AS day, count(*) AS orders, COALESCE(sum("total"), 0) AS revenue
      FROM "Order" WHERE "status" = 'PAID' AND "paidAt" IS NOT NULL GROUP BY 1 ORDER BY 1`,
    db.$queryRaw<{ day: string; tickets: bigint }[]>`
      SELECT to_char((o."paidAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Africa/Porto-Novo', 'YYYY-MM-DD') AS day, count(*) AS tickets
      FROM "Ticket" t JOIN "Order" o ON o."id" = t."orderId"
      WHERE o."status" = 'PAID' AND o."paidAt" IS NOT NULL AND t."status" <> 'CANCELLED' GROUP BY 1`,
    db.$queryRaw<{ hour: string; tickets: bigint; seats: bigint }[]>`
      SELECT to_char(("usedAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Africa/Porto-Novo', 'YYYY-MM-DD HH24:00') AS hour, count(*) AS tickets, COALESCE(sum("seats"), 0) AS seats
      FROM "Ticket" WHERE "status" = 'USED' AND "usedAt" IS NOT NULL GROUP BY 1 ORDER BY 1`,
    db.ticket.groupBy({ by: ["status"], where: { status: { in: ["VALID", "USED"] } }, _count: { _all: true } }),
  ]);

  const ticketsOf = new Map(tickets.map((t) => [t.day, Number(t.tickets)]));
  const used = status.find((s) => s.status === "USED")?._count._all ?? 0;
  const expected = used + (status.find((s) => s.status === "VALID")?._count._all ?? 0);

  return {
    salesByDay: orders.map((o) => ({ day: o.day, orders: Number(o.orders), tickets: ticketsOf.get(o.day) ?? 0, revenue: Number(o.revenue) })),
    entriesByHour: entries.map((e) => ({ hour: e.hour, tickets: Number(e.tickets), seats: Number(e.seats) })),
    attendance: { expected, entered: used, rate: expected > 0 ? Math.round((used / expected) * 100) : 0 },
  };
}
