import "server-only";
import type { ListQuery, OrderRow, OrderStatus, PassCapacity, Stats, TicketRow, TicketStatus } from "@/features/dashboard/api";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { compactCode } from "./codes";

/** Données de l'administration : montants, commandes et coordonnées des clients. Réservé aux ADMIN. */

/** Au plus 200 lignes par liste ; au-delà, une recherche plus précise est demandée. */
const LIMIT = 200;

const words = (query: string | undefined) =>
  (query ?? "")
    .trim()
    .slice(0, 80)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);

const likeEscape = (s: string) => s.replace(/[\\%_]/g, "\\$&");

export async function getStats(): Promise<Stats> {
  const [passes, tickets, lines, orders, paidOrders] = await Promise.all([
    db.passType.findMany({ orderBy: { price: "desc" } }),
    db.ticket.groupBy({ by: ["passSlug", "status"], _count: { _all: true }, _sum: { seats: true } }),
    db.orderLine.findMany({ where: { order: { status: "PAID" } }, select: { passSlug: true, quantity: true, unitPrice: true } }),
    db.order.count(),
    db.order.aggregate({ where: { status: "PAID" }, _sum: { total: true } }),
  ]);

  const sold = tickets.filter((g) => g.status === "VALID" || g.status === "USED");
  const countOf = (status: TicketStatus) => tickets.filter((g) => g.status === status).reduce((s, g) => s + g._count._all, 0);

  return {
    ticketsSold: sold.reduce((s, g) => s + g._count._all, 0),
    seatsSold: sold.reduce((s, g) => s + (g._sum.seats ?? 0), 0),
    revenue: paidOrders._sum.total ?? 0,
    orders,
    ticketsValid: countOf("VALID"),
    ticketsUsed: countOf("USED"),
    ticketsCancelled: countOf("CANCELLED"),
    byPass: passes.map((p) => ({
      slug: p.slug,
      name: p.name,
      sold: sold.filter((g) => g.passSlug === p.slug).reduce((s, g) => s + g._count._all, 0),
      revenue: lines.filter((l) => l.passSlug === p.slug).reduce((s, l) => s + l.quantity * l.unitPrice, 0),
    })),
  };
}

export async function listOrders({ query, status }: ListQuery<OrderStatus> = {}): Promise<OrderRow[]> {
  const where: Prisma.OrderWhereInput = {
    ...(status && status !== "ALL" ? { status } : {}),
    AND: words(query).map((w) => ({
      OR: [
        { reference: { contains: w, mode: "insensitive" } },
        { buyerFirstName: { contains: w, mode: "insensitive" } },
        { buyerLastName: { contains: w, mode: "insensitive" } },
        { buyerEmail: { contains: w, mode: "insensitive" } },
        { buyerPhone: { contains: w } },
        { paymentReference: { contains: w, mode: "insensitive" } },
      ],
    })),
  };

  const orders = await db.order.findMany({ where, include: { lines: { include: { pass: true } } }, orderBy: { createdAt: "desc" }, take: LIMIT });
  return orders.map((o) => ({
    reference: o.reference,
    createdAt: o.createdAt.toISOString(),
    buyerName: `${o.buyerFirstName} ${o.buyerLastName}`.trim(),
    email: o.buyerEmail,
    phone: o.buyerPhone,
    total: o.total,
    status: o.status,
    paymentReference: o.paymentReference ?? "—",
    summary: o.lines.map((l) => `${l.quantity} × ${l.pass.name}`).join(", "),
  }));
}

export async function listTickets({ query, status }: ListQuery<TicketStatus> = {}): Promise<TicketRow[]> {
  let ids: string[] | null = null;

  const terms = words(query);
  if (terms.length > 0) {
    // Chaque mot doit se retrouver quelque part : code du billet, titulaire, e-mail ou commande.
    const conditions = terms.map((w) => {
      const text = `%${likeEscape(w)}%`;
      const compact = compactCode(w);
      const code = compact.length >= 3 ? `%${likeEscape(compact)}%` : null;
      return Prisma.sql`(
        EXISTS (SELECT 1 FROM unnest(t."holders") h WHERE h ILIKE ${text})
        OR o."buyerEmail" ILIKE ${text}
        OR o."reference" ILIKE ${text}
        ${code ? Prisma.sql`OR replace(t."number", '-', '') ILIKE ${code} OR replace(o."reference", '-', '') ILIKE ${code}` : Prisma.empty}
      )`;
    });
    const rows = await db.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT t."id" FROM "Ticket" t JOIN "Order" o ON o."id" = t."orderId"
      WHERE ${Prisma.join(conditions, " AND ")}
      ORDER BY t."createdAt" DESC LIMIT ${LIMIT}`);
    ids = rows.map((r) => r.id);
  }

  const tickets = await db.ticket.findMany({
    where: { ...(ids ? { id: { in: ids } } : {}), ...(status && status !== "ALL" ? { status } : {}) },
    include: { pass: true, order: { select: { reference: true, buyerEmail: true } } },
    orderBy: { createdAt: "desc" },
    take: LIMIT,
  });
  return tickets.map((t) => ({
    number: t.number,
    passSlug: t.passSlug,
    passName: t.pass.name,
    seats: t.seats,
    holders: t.holders,
    buyerEmail: t.order.buyerEmail,
    orderReference: t.order.reference,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
    usedAt: t.usedAt?.toISOString(),
  }));
}

/** Pass réservés par type : commandes payées, plus les commandes en attente encore valables (30 minutes). */
export async function listPassCapacity(): Promise<PassCapacity[]> {
  const [passes, lines] = await Promise.all([
    db.passType.findMany({ orderBy: { price: "desc" } }),
    db.orderLine.groupBy({
      by: ["passSlug"],
      _sum: { quantity: true },
      where: { order: { OR: [{ status: "PAID" }, { status: "PENDING", createdAt: { gte: new Date(Date.now() - 30 * 60_000) } }] } },
    }),
  ]);
  return passes.map((p) => ({ slug: p.slug, name: p.name, price: p.price, capacity: p.capacity, reserved: lines.find((l) => l.passSlug === p.slug)?._sum.quantity ?? 0 }));
}

export type SetCapacityResult = "OK" | "NOT_FOUND" | "BELOW_RESERVED";

/** Fixe le nombre de pass en vente (null = illimité). Refusé en dessous du nombre déjà réservé. */
export async function setPassCapacity(slug: string, capacity: number | null): Promise<SetCapacityResult> {
  const current = (await listPassCapacity()).find((p) => p.slug === slug);
  if (!current) return "NOT_FOUND";
  if (capacity !== null && capacity < current.reserved) return "BELOW_RESERVED";
  await db.passType.update({ where: { slug }, data: { capacity } });
  return "OK";
}
