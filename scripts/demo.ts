/**
 * Billets de démonstration et de test, pour essayer le contrôle sans passer par un achat.
 *
 *   npm run db:demo            crée les 3 billets de démonstration (un par pass)
 *   npm run db:test15          crée 15 billets de test (5 par pass)
 *   npm run db:demo:reset      remet les billets de démonstration à « valide » (db:test15:reset pour les 15)
 *   npm run db:demo:pdf        télécharge leur PDF dans demo/ (db:test15:pdf pour les 15)
 *   npm run db:demo:remove     supprime la commande (db:test15:remove pour les 15) : À FAIRE avant l'ouverture des ventes
 *
 * Chaque groupe est une commande à part, facturée aux vrais prix des pass : elle est comptée dans les ventes, le montant
 * encaissé et le contrôle tant qu'elle existe. Création sans effet si la commande existe déjà.
 */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { newQrToken } from "../src/server/codes";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const SITE = process.env.DEMO_URL ?? "https://gala-ttct.vercel.app";

type Ticket = { number: string; passSlug: string; seats: number; holders: string[] };
type Group = { reference: string; file: string; tickets: Ticket[] };

const TAG: Record<string, string> = { "duo-vvip": "VVIP", "duo-vip": "VIPP", solo: "SOLO" };
const SEATS: Record<string, number> = { "duo-vvip": 2, "duo-vip": 2, solo: 1 };

/** 5 billets par type de pass, codes lisibles GALA-TS01-VVIP, titulaires « Testeur 01 A / B ». */
const lots: Ticket[] = ["duo-vvip", "duo-vip", "solo"].flatMap((passSlug, p) =>
  Array.from({ length: 5 }, (_, i) => {
    const n = String(p * 5 + i + 1).padStart(2, "0");
    return { number: `GALA-TS${n}-${TAG[passSlug]}`, passSlug, seats: SEATS[passSlug], holders: SEATS[passSlug] > 1 ? [`Testeur ${n} A`, `Testeur ${n} B`] : [`Testeur ${n}`] };
  }),
);

const GROUPS: Record<string, Group> = {
  demo: {
    reference: "CMD-DEMO-TEST-GALA",
    file: "demo/billets-demo.pdf",
    tickets: [
      { number: "GALA-DEMO-VVIP", passSlug: "duo-vvip", seats: 2, holders: ["Awa Démo", "Koffi Démo"] },
      { number: "GALA-DEMO-VIPP", passSlug: "duo-vip", seats: 2, holders: ["Marie Démo", "Paul Démo"] },
      { number: "GALA-DEMO-SOLO", passSlug: "solo", seats: 1, holders: ["Jean Démo"] },
    ],
  },
  test15: { reference: "CMD-LOTS-TEST-GALA", file: "demo/billets-test-15.pdf", tickets: lots },
};

async function create(g: Group) {
  if (await db.order.findUnique({ where: { reference: g.reference } })) return console.log("La commande existe déjà :", g.reference);
  const prices = new Map((await db.passType.findMany()).map((p) => [p.slug, p.price]));
  const price = (slug: string) => prices.get(slug) ?? 0;
  const slugs = [...new Set(g.tickets.map((t) => t.passSlug))];

  await db.order.create({
    data: {
      reference: g.reference,
      status: "PAID",
      paidAt: new Date(),
      buyerFirstName: "Démo",
      buyerLastName: "Billets",
      buyerEmail: "demo@ttct-gala.test",
      buyerPhone: "0100000000",
      total: g.tickets.reduce((sum, t) => sum + price(t.passSlug), 0),
      termsAcceptedAt: new Date(),
      termsVersion: "demo",
      paymentProvider: "demo",
      paymentReference: `DEMO-${g.reference}`,
      // Évite qu'un rappel avant le gala parte vers cette fausse adresse
      reminderSentAt: new Date(),
      lines: {
        create: slugs.map((slug) => {
          const mine = g.tickets.filter((t) => t.passSlug === slug);
          return { passSlug: slug, quantity: mine.length, unitPrice: price(slug), guestNames: mine.flatMap((t) => (t.seats > 1 ? [t.holders[1]] : [])) };
        }),
      },
      tickets: { create: g.tickets.map((t) => ({ ...t, qrToken: newQrToken(), status: "VALID" as const })) },
    },
  });
  console.log(`Commande ${g.reference} créée : ${g.tickets.length} billets.`);
}

async function reset(g: Group) {
  const order = await db.order.findUnique({ where: { reference: g.reference } });
  if (!order) return console.log("Aucune commande :", g.reference);
  const r = await db.ticket.updateMany({ where: { orderId: order.id }, data: { status: "VALID", usedAt: null, usedById: null } });
  console.log(`${r.count} billets remis à « valide ».`);
}

async function remove(g: Group) {
  const order = await db.order.findUnique({ where: { reference: g.reference } });
  if (!order) return console.log("Rien à supprimer :", g.reference);
  const tickets = await db.ticket.findMany({ where: { orderId: order.id }, select: { id: true } });
  await db.scanLog.deleteMany({ where: { ticketId: { in: tickets.map((t) => t.id) } } });
  await db.ticket.deleteMany({ where: { orderId: order.id } });
  await db.orderLine.deleteMany({ where: { orderId: order.id } });
  await db.order.delete({ where: { id: order.id } });
  console.log(`Commande ${g.reference} supprimée (${tickets.length} billets).`);
}

async function pdf(g: Group) {
  const res = await fetch(`${SITE}/api/orders/${g.reference}/pdf`);
  if (!res.ok) throw new Error(`PDF indisponible (${res.status}) : la commande existe-t-elle ?`);
  mkdirSync("demo", { recursive: true });
  writeFileSync(g.file, Buffer.from(await res.arrayBuffer()));
  console.log("PDF enregistré :", g.file);
}

const commands = { create, reset, remove, pdf } as const;
const command = (process.argv[2] ?? "create") as keyof typeof commands;
const group = GROUPS[process.argv[3] ?? "demo"];

(group && commands[command] ? commands[command](group) : Promise.reject(new Error(`Commande inconnue : ${process.argv.slice(2).join(" ")}`)))
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
