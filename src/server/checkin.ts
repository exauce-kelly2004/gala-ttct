import "server-only";
import type { CheckinSummary, ScanResult, ScanTicket, TicketLookup } from "@/features/scanner/api";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { compactCode, toTicketNumber } from "./codes";

/**
 * Contrôle à l'entrée. Le STAFF ne reçoit que des billets et des personnes : jamais e-mail, téléphone ni montant.
 */

const withContext = { pass: true, order: { select: { reference: true, status: true } } } satisfies Prisma.TicketInclude;
type TicketWithContext = Prisma.TicketGetPayload<{ include: typeof withContext }>;

const scanTicket = (t: TicketWithContext): ScanTicket => ({
  number: t.number,
  passSlug: t.passSlug,
  passName: t.pass.name,
  seats: t.seats,
  holders: t.holders,
  orderReference: t.order.reference,
  paid: t.order.status === "PAID",
  usedAt: t.usedAt?.toISOString(),
});

/**
 * Valide un billet à partir du contenu du QR (jeton) OU du code imprimé (saisi à la main).
 * UNE seule instruction fait passer VALID → USED : deux scans simultanés ne peuvent pas tous deux réussir.
 */
export async function verifyTicket(rawCode: string, userId: string): Promise<ScanResult> {
  const scannedAt = new Date();
  const code = rawCode.trim().slice(0, 100);
  const number = toTicketNumber(code);

  const ticket = await db.ticket.findFirst({
    where: { OR: [{ qrToken: code.toUpperCase() }, ...(number ? [{ number }] : [])] },
    include: withContext,
  });

  const log = (result: ScanResult["status"], ticketId?: string) => db.scanLog.create({ data: { ticketId: ticketId ?? null, userId, result, rawCode: code } });

  if (!ticket) {
    await log("INVALID");
    return { status: "INVALID", scannedAt: scannedAt.toISOString() };
  }

  if (ticket.order.status === "PAID") {
    const claimed = await db.ticket.updateMany({ where: { id: ticket.id, status: "VALID" }, data: { status: "USED", usedAt: scannedAt, usedById: userId } });
    if (claimed.count === 1) {
      await log("VALID", ticket.id);
      return { status: "VALID", ticket: scanTicket(ticket), scannedAt: scannedAt.toISOString() };
    }
  }

  // Pas validé : on relit l'état réel (un autre scan a pu passer entre-temps)
  const current = await db.ticket.findUniqueOrThrow({ where: { id: ticket.id }, include: withContext });
  const status: ScanResult["status"] =
    current.status === "USED" ? "USED" : current.status === "CANCELLED" || current.order.status === "CANCELLED" ? "CANCELLED" : "INVALID";
  await log(status, ticket.id);
  return { status, ticket: scanTicket(current), scannedAt: scannedAt.toISOString() };
}

/** Point des billets de l'entrée : billets payés et valables, par type de pass. */
export async function getCheckinSummary(): Promise<CheckinSummary> {
  const [passes, groups] = await Promise.all([
    db.passType.findMany({ orderBy: { price: "desc" } }),
    db.ticket.groupBy({ by: ["passSlug", "status"], where: { status: { in: ["VALID", "USED"] } }, _count: { _all: true }, _sum: { seats: true } }),
  ]);

  const byPass = passes.map((p) => {
    const valid = groups.find((g) => g.passSlug === p.slug && g.status === "VALID");
    const used = groups.find((g) => g.passSlug === p.slug && g.status === "USED");
    const entered = used?._count._all ?? 0;
    const tickets = entered + (valid?._count._all ?? 0);
    const seatsEntered = used?._sum.seats ?? 0;
    return { slug: p.slug, name: p.name, tickets, entered, remaining: tickets - entered, seats: seatsEntered + (valid?._sum.seats ?? 0), seatsEntered };
  });

  const sum = (key: "tickets" | "entered" | "seats" | "seatsEntered") => byPass.reduce((s, p) => s + p[key], 0);
  return {
    tickets: sum("tickets"),
    ticketsEntered: sum("entered"),
    ticketsRemaining: sum("tickets") - sum("entered"),
    seats: sum("seats"),
    seatsEntered: sum("seatsEntered"),
    seatsRemaining: sum("seats") - sum("seatsEntered"),
    byPass,
  };
}

const likeEscape = (s: string) => s.replace(/[\\%_]/g, "\\$&");

/** Retrouve des billets par code, nom ou commande. 3 caractères minimum, 12 résultats au plus. */
export async function searchTickets(query: string): Promise<TicketLookup[]> {
  const q = query.trim().slice(0, 60);
  if (q.length < 3) return [];

  const text = `%${likeEscape(q)}%`;
  const compact = compactCode(q);
  const code = compact.length >= 3 ? `%${likeEscape(compact)}%` : null;

  const rows = await db.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT t."id" FROM "Ticket" t JOIN "Order" o ON o."id" = t."orderId"
    WHERE t."status" IN ('VALID', 'USED', 'CANCELLED')
      AND (
        EXISTS (SELECT 1 FROM unnest(t."holders") h WHERE h ILIKE ${text})
        OR o."reference" ILIKE ${text}
        ${code ? Prisma.sql`OR replace(t."number", '-', '') ILIKE ${code} OR replace(o."reference", '-', '') ILIKE ${code}` : Prisma.empty}
      )
    ORDER BY t."createdAt" DESC
    LIMIT 12`);

  const tickets = await db.ticket.findMany({ where: { id: { in: rows.map((r) => r.id) } }, include: { pass: true }, orderBy: { createdAt: "desc" } });
  return tickets.map((t) => ({
    number: t.number,
    passSlug: t.passSlug,
    passName: t.pass.name,
    seats: t.seats,
    holders: t.holders,
    status: t.status,
    usedAt: t.usedAt?.toISOString(),
  }));
}
