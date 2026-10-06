/**
 * Billets de démonstration : un par type de pass, pour essayer le contrôle sans passer par un achat.
 *
 *   npm run db:demo          crée la commande de démonstration et ses 3 billets (sans effet s'ils existent déjà)
 *   npm run db:demo:reset    remet les 3 billets à « valide » pour recommencer les essais
 *   npm run db:demo:pdf      télécharge le PDF des 3 billets dans demo/billets-demo.pdf
 *   npm run db:demo:remove   supprime la commande de démonstration (À FAIRE avant l'ouverture des ventes)
 *
 * La commande est facturée aux vrais prix des pass (90 000 FCFA) pour que le tableau de bord montre des chiffres réalistes :
 * elle est donc comptée dans les ventes, le montant encaissé et le contrôle tant qu'elle existe. À SUPPRIMER avant l'ouverture des ventes.
 */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { newQrToken } from "../src/server/codes";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const REFERENCE = "CMD-DEMO-TEST-GALA";
const SITE = process.env.DEMO_URL ?? "https://gala-ttct.vercel.app";

const TICKETS = [
  { number: "GALA-DEMO-VVIP", passSlug: "duo-vvip", seats: 2, holders: ["Awa Démo", "Koffi Démo"] },
  { number: "GALA-DEMO-VIPP", passSlug: "duo-vip", seats: 2, holders: ["Marie Démo", "Paul Démo"] },
  { number: "GALA-DEMO-SOLO", passSlug: "solo", seats: 1, holders: ["Jean Démo"] },
];

async function create() {
  if (await db.order.findUnique({ where: { reference: REFERENCE } })) return console.log("La commande de démonstration existe déjà.");
  const prices = new Map((await db.passType.findMany()).map((p) => [p.slug, p.price]));
  const price = (slug: string) => prices.get(slug) ?? 0;
  await db.order.create({
    data: {
      reference: REFERENCE,
      status: "PAID",
      paidAt: new Date(),
      buyerFirstName: "Démo",
      buyerLastName: "Billets",
      buyerEmail: "demo@ttct-gala.test",
      buyerPhone: "0100000000",
      total: TICKETS.reduce((sum, t) => sum + price(t.passSlug), 0),
      termsAcceptedAt: new Date(),
      termsVersion: "demo",
      paymentProvider: "demo",
      paymentReference: "DEMO",
      // Évite qu'un rappel avant le gala parte vers cette fausse adresse
      reminderSentAt: new Date(),
      lines: { create: TICKETS.map((t) => ({ passSlug: t.passSlug, quantity: 1, unitPrice: price(t.passSlug), guestNames: t.seats > 1 ? [t.holders[1]] : [] })) },
      tickets: { create: TICKETS.map((t) => ({ ...t, qrToken: newQrToken(), status: "VALID" as const })) },
    },
  });
  console.log("Commande de démonstration créée :", REFERENCE);
}

async function reset() {
  const order = await db.order.findUnique({ where: { reference: REFERENCE } });
  if (!order) return console.log("Aucune commande de démonstration : lancez d'abord npm run db:demo");
  const r = await db.ticket.updateMany({ where: { orderId: order.id }, data: { status: "VALID", usedAt: null, usedById: null } });
  console.log(`${r.count} billets de démonstration remis à « valide ».`);
}

async function remove() {
  const order = await db.order.findUnique({ where: { reference: REFERENCE } });
  if (!order) return console.log("Rien à supprimer.");
  const tickets = await db.ticket.findMany({ where: { orderId: order.id }, select: { id: true } });
  await db.scanLog.deleteMany({ where: { ticketId: { in: tickets.map((t) => t.id) } } });
  await db.ticket.deleteMany({ where: { orderId: order.id } });
  await db.orderLine.deleteMany({ where: { orderId: order.id } });
  await db.order.delete({ where: { id: order.id } });
  console.log("Commande de démonstration supprimée.");
}

async function pdf() {
  const res = await fetch(`${SITE}/api/orders/${REFERENCE}/pdf`);
  if (!res.ok) throw new Error(`PDF indisponible (${res.status}) : la commande de démonstration existe-t-elle ?`);
  mkdirSync("demo", { recursive: true });
  writeFileSync("demo/billets-demo.pdf", Buffer.from(await res.arrayBuffer()));
  console.log("PDF enregistré : demo/billets-demo.pdf");
}

const commands = { create, reset, remove, pdf } as const;
const command = (process.argv[2] ?? "create") as keyof typeof commands;

(commands[command] ?? (() => Promise.reject(new Error(`Commande inconnue : ${command}`))))()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
