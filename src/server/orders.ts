import "server-only";
import { createHmac } from "node:crypto";
import { after } from "next/server";
import { z } from "zod";
import { buyerSchema } from "@/features/checkout/buyer-schema";
import type { Order } from "@/features/checkout/order";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { newOrderReference, newQrToken, newTicketNumber } from "./codes";
import { sendMail } from "./mail";
import { renderTicketsPdf } from "./pdf";
import { startPayment } from "./payment";

/** Erreur dont le message est destiné à l'acheteur (la route la traduit en 400/409). */
export class OrderError extends Error {
  constructor(
    readonly code: "INVALID_ORDER" | "SOLD_OUT" | "RATE_LIMITED",
    message: string,
  ) {
    super(message);
  }
}

const requestSchema = z.object({
  buyer: buyerSchema,
  items: z
    .array(
      z.object({
        passSlug: z.string().max(40),
        quantity: z.number().int().min(1).max(50),
        guestNames: z.array(z.string().trim().max(120)).max(50).optional(),
      }),
    )
    .min(1)
    .max(10),
  termsAcceptedAt: z.iso.datetime({ offset: true }),
  termsVersion: z.string().min(1).max(100),
});

/** Au plus 5 commandes par adresse IP sur 15 minutes : freine les commandes en rafale (une famille qui achète reste loin de la limite). */
const MAX_ORDERS_PER_IP = 5;
const IP_WINDOW_MINUTES = 15;

/** Empreinte de l'adresse IP : on ne conserve jamais l'adresse elle-même. */
const hashIp = (ip: string) => createHmac("sha256", env.AUTH_SECRET).update(`ip:${ip}`).digest("hex");

/** Une commande en attente de paiement garde ses places 30 minutes, pas plus. */
const PENDING_HOLD_MINUTES = 30;

/**
 * Crée la commande puis lance le paiement. Le serveur ne fait confiance à rien du front : prix, quantités,
 * invités et stock sont revérifiés ici. Les billets n'existent qu'une fois le paiement confirmé.
 */
export async function createOrder(input: unknown, clientIp?: string): Promise<{ reference: string; paymentUrl?: string }> {
  const clientIpHash = clientIp ? hashIp(clientIp) : null;
  if (clientIpHash) {
    const recent = await db.order.count({ where: { clientIpHash, createdAt: { gte: new Date(Date.now() - IP_WINDOW_MINUTES * 60_000) } } });
    if (recent >= MAX_ORDERS_PER_IP) throw new OrderError("RATE_LIMITED", "Trop de commandes en peu de temps. Réessayez dans quelques minutes.");
  }

  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) throw new OrderError("INVALID_ORDER", "Commande invalide.");
  const { buyer, items, termsAcceptedAt, termsVersion } = parsed.data;

  const slugs = items.map((i) => i.passSlug);
  if (new Set(slugs).size !== slugs.length) throw new OrderError("INVALID_ORDER", "Un même pass apparaît deux fois.");

  const passes = await db.passType.findMany({ where: { slug: { in: slugs }, active: true } });
  const lines = items.map((item) => {
    const pass = passes.find((p) => p.slug === item.passSlug);
    if (!pass) throw new OrderError("INVALID_ORDER", "Pass inconnu.");
    if (item.quantity > pass.maxPerOrder) throw new OrderError("INVALID_ORDER", `Maximum ${pass.maxPerOrder} par commande.`);

    let guestNames: string[] = [];
    if (pass.seats > 1) {
      guestNames = item.guestNames ?? [];
      if (guestNames.length !== item.quantity || guestNames.some((n) => n.length < 2)) {
        throw new OrderError("INVALID_ORDER", "Le nom du second invité est obligatoire pour chaque Pass Duo.");
      }
    }
    return { pass, quantity: item.quantity, guestNames };
  });
  const total = lines.reduce((sum, l) => sum + l.pass.price * l.quantity, 0);

  const order = await db.$transaction(
    async (tx) => {
      // Stock : places déjà vendues, plus les commandes en attente encore valables
      for (const l of lines) {
        if (l.pass.capacity === null) continue;
        const held = await tx.orderLine.aggregate({
          _sum: { quantity: true },
          where: {
            passSlug: l.pass.slug,
            order: {
              OR: [{ status: "PAID" }, { status: "PENDING", createdAt: { gte: new Date(Date.now() - PENDING_HOLD_MINUTES * 60_000) } }],
            },
          },
        });
        if ((held._sum.quantity ?? 0) + l.quantity > l.pass.capacity) {
          throw new OrderError("SOLD_OUT", `Le ${l.pass.name} n'est plus disponible en cette quantité.`);
        }
      }
      return tx.order.create({
        data: {
          reference: newOrderReference(),
          buyerFirstName: buyer.firstName,
          buyerLastName: buyer.lastName,
          buyerEmail: buyer.email.toLowerCase(),
          buyerPhone: buyer.phone,
          clientIpHash,
          total,
          termsAcceptedAt: new Date(termsAcceptedAt),
          termsVersion,
          lines: { create: lines.map((l) => ({ passSlug: l.pass.slug, quantity: l.quantity, unitPrice: l.pass.price, guestNames: l.guestNames })) },
        },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  try {
    const payment = await startPayment(order);
    return { reference: order.reference, ...payment };
  } catch (error) {
    await db.order.updateMany({ where: { id: order.id, status: "PENDING" }, data: { status: "CANCELLED", cancelledAt: new Date() } });
    throw error;
  }
}

/**
 * Passe la commande à PAYÉE et crée ses billets, une seule fois (un webhook rejoué ne fait rien de plus).
 * À appeler UNIQUEMENT depuis une confirmation de paiement vérifiée côté serveur.
 */
export async function confirmOrderPaid(orderId: string, paymentReference: string, paymentProvider: string): Promise<void> {
  const confirmed = await db.$transaction(async (tx) => {
    const claimed = await tx.order.updateMany({
      where: { id: orderId, status: "PENDING" },
      data: { status: "PAID", paidAt: new Date(), paymentReference, paymentProvider },
    });
    if (claimed.count === 0) return null;

    const order = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { lines: { include: { pass: true } } } });
    const buyerName = `${order.buyerFirstName} ${order.buyerLastName}`.trim();
    for (const line of order.lines) {
      for (let i = 0; i < line.quantity; i++) {
        await tx.ticket.create({
          data: {
            number: newTicketNumber(),
            qrToken: newQrToken(),
            orderId: order.id,
            passSlug: line.passSlug,
            seats: line.pass.seats,
            holders: line.pass.seats > 1 ? [buyerName, line.guestNames[i] ?? ""].filter(Boolean) : [buyerName],
            status: "VALID",
          },
        });
      }
    }
    return order.reference;
  });

  if (confirmed) {
    // L'accusé de réception ne doit jamais faire échouer une commande déjà payée.
    // `after` garde le travail en vie après la réponse (indispensable sur un hébergement serverless)
    after(() => sendOrderConfirmation(confirmed).catch((error) => console.error("[orders] e-mail de confirmation non envoyé", error)));
  }
}

/** Commande telle que la page de confirmation l'affiche, ou null si la référence est inconnue. */
export async function getOrder(reference: string): Promise<Order | null> {
  const order = await db.order.findUnique({
    where: { reference },
    include: { lines: { include: { pass: true } }, tickets: { include: { pass: true }, orderBy: { createdAt: "asc" } } },
  });
  if (!order) return null;

  return {
    reference: order.reference,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    buyer: { firstName: order.buyerFirstName, lastName: order.buyerLastName, email: order.buyerEmail, phone: order.buyerPhone },
    lines: order.lines.map((l) => ({ slug: l.passSlug, name: l.pass.name, price: l.unitPrice, seats: l.pass.seats, quantity: l.quantity })),
    total: order.total,
    currency: "FCFA",
    tickets: order.tickets.map((t) => ({
      number: t.number,
      passSlug: t.passSlug,
      passName: t.pass.name,
      seats: t.seats,
      holders: t.holders,
      status: t.status,
      qrToken: t.qrToken,
      pdfUrl: order.status === "PAID" && t.qrToken ? `/api/orders/${order.reference}/pdf?billet=${t.number}` : null,
    })),
  };
}

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Porto-Novo" });
const amount = (n: number) => new Intl.NumberFormat("fr-FR").format(n).replace(/[  ]/g, " ");

/** Accusé de réception : récapitulatif, date et heure, codes des billets (Code du numérique, art. 344). */
async function sendOrderConfirmation(reference: string) {
  const order = await getOrder(reference);
  if (!order) return;
  const lines = order.lines.map((l) => `- ${l.quantity} × ${l.name} : ${amount(l.price * l.quantity)} FCFA`).join("\n");
  const tickets = order.tickets.map((t) => `- ${t.passName} : ${t.number} (${t.holders.join(" et ")})`).join("\n");
  // Billets en pièce jointe (PDF identique au billet du site) ; si la fabrication échoue, l'e-mail part quand même
  const pdf = await renderTicketsPdf(env.APP_URL, reference).catch((error) => {
    console.error("[orders] PDF non joint", error);
    return null;
  });
  await sendMail({
    to: order.buyer.email,
    subject: `Vos billets du Gala TTCT 2026 (${order.reference})`,
    text: [
      `Bonjour ${order.buyer.firstName},`,
      "",
      `Votre commande ${order.reference} du ${dateTime.format(new Date(order.createdAt))} est confirmée.`,
      "",
      lines,
      `Total payé : ${amount(order.total)} FCFA`,
      "",
      "Vos billets (le code se donne à l'entrée si le QR code ne se lit pas) :",
      tickets,
      "",
      `Télécharger vos billets : ${env.APP_URL}/confirmation?ref=${order.reference}`,
    ].join("\n"),
    attachments: pdf ? [{ filename: `billets-gala-ttct-${order.reference}.pdf`, content: Buffer.from(pdf) }] : undefined,
  });
}

export type CancelResult = "CANCELLED" | "NOT_FOUND" | "ALREADY_CANCELLED" | "TICKETS_USED";

/**
 * Annule une commande et tous ses billets (rétractation, erreur, remboursement). Les places sont libérées.
 * Refusée si un billet a déjà servi à entrer. Le remboursement lui-même se fait chez le prestataire de paiement,
 * sous 30 jours ouvrables par le même moyen de paiement (Code du numérique) : la commande garde sa référence de paiement.
 */
export async function cancelOrder(reference: string, cancelledBy: string): Promise<CancelResult> {
  const result = await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { reference }, include: { tickets: { select: { status: true } } } });
    if (!order) return "NOT_FOUND" as const;
    if (order.status === "CANCELLED") return "ALREADY_CANCELLED" as const;
    if (order.tickets.some((t) => t.status === "USED")) return "TICKETS_USED" as const;

    await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED", cancelledAt: new Date(), cancelledBy } });
    await tx.ticket.updateMany({ where: { orderId: order.id }, data: { status: "CANCELLED" } });
    return order.status === "PAID" ? ({ done: true, paid: true } as const) : ({ done: true, paid: false } as const);
  });

  if (typeof result === "string") return result;
  if (result.paid) after(() => sendCancellationNotice(reference).catch((error) => console.error("[orders] e-mail d'annulation non envoyé", error)));
  return "CANCELLED";
}

async function sendCancellationNotice(reference: string) {
  const order = await getOrder(reference);
  if (!order) return;
  await sendMail({
    to: order.buyer.email,
    subject: `Annulation de votre commande ${order.reference}`,
    text: [
      `Bonjour ${order.buyer.firstName},`,
      "",
      `Votre commande ${order.reference} a été annulée. Ses billets ne sont plus valables.`,
      `Le montant de ${amount(order.total)} FCFA vous sera remboursé par le même moyen de paiement, sous 30 jours ouvrables.`,
      "",
      "Pour toute question, répondez à ce message ou contactez l'organisation.",
    ].join("\n"),
  });
}
