/**
 * Point de branchement front-end / back-end pour le tableau de bord organisateur.
 *
 * AUJOURD'HUI : DONNÉES DE DÉMONSTRATION générées localement (aucun serveur). Les chiffres affichés ne sont pas réels.
 *
 * À FAIRE PAR LE BACK-END : remplacer le corps des trois fonctions par des appels serveur protégés (rôle ADMIN),
 * en gardant les signatures et en calculant tout depuis la base. Contrat : docs/CONTRAT_FRONT_BACK.md.
 */
import { passes } from "@/config/passes";

/** Indique à l'interface qu'elle tourne sur des données simulées (bandeau « démonstration »). */
export const IS_DEMO = true;

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";
export type TicketStatus = "PENDING" | "VALID" | "USED" | "CANCELLED";

export type Stats = {
  ticketsSold: number;
  /** Personnes couvertes (un Pass Duo = 2). */
  seatsSold: number;
  /** Montant encaissé, en FCFA (commandes payées uniquement). */
  revenue: number;
  orders: number;
  ticketsValid: number;
  ticketsUsed: number;
  ticketsCancelled: number;
  byPass: { slug: string; name: string; sold: number; revenue: number }[];
};

export type OrderRow = {
  reference: string;
  createdAt: string;
  buyerName: string;
  email: string;
  phone: string;
  total: number;
  status: OrderStatus;
  /** Référence de paiement chez le prestataire. */
  paymentReference: string;
  summary: string;
};

export type TicketRow = {
  number: string;
  passName: string;
  holders: string[];
  buyerEmail: string;
  orderReference: string;
  status: TicketStatus;
  createdAt: string;
  usedAt?: string;
};

export type ListQuery<S extends string> = { query?: string; status?: S | "ALL" };

/* ---------------------------------------------------------------------- */
/* Jeu de démonstration                                                    */
/* ---------------------------------------------------------------------- */

const firstNames = ["Awa", "Koffi", "Mariam", "Jean", "Agnès", "Paul", "Rose", "Ibrahim", "Fatou", "Luc", "Estelle", "Bruno", "Nadège", "Yves", "Carine", "Thierry"];
const lastNames = ["Sossou", "Adjovi", "Tossou", "Dossou", "Gbaguidi", "Agbo", "Houngbo", "Kpadonou", "Lokonon", "Zannou", "Ahouansou", "Bio"];

const pick = <T,>(list: T[], i: number, step: number) => list[(i * step) % list.length];

type DemoOrder = OrderRow & { items: { slug: string; quantity: number }[]; guests: string[] };

const demoOrders: DemoOrder[] = Array.from({ length: 34 }, (_, i) => {
  const first = pick(firstNames, i, 7);
  const last = pick(lastNames, i, 5);
  const slugs = ["solo", "duo-vip", "solo", "duo-vvip", "duo-vip", "solo"];
  const slug = slugs[i % slugs.length];
  const quantity = (i % 4) + 1 > 2 && slug !== "solo" ? 1 : (i % 3) + 1;
  const pass = passes.find((p) => p.slug === slug)!;
  const status: OrderStatus = i % 11 === 7 ? "CANCELLED" : i % 13 === 5 ? "PENDING" : "PAID";
  return {
    reference: `GALA-${String(1001 + i)}`,
    createdAt: new Date(Date.UTC(2026, 8, 1 + i, 8 + (i % 9), (i * 7) % 60)).toISOString(),
    buyerName: `${first} ${last}`,
    email: `${first}.${last}@exemple.test`.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""),
    phone: `019${String(7000000 + i * 91357).slice(0, 7)}`,
    total: pass.price * quantity,
    status,
    paymentReference: status === "PENDING" ? "—" : `PAY-${String(48200 + i * 17)}`,
    summary: `${quantity} × ${pass.name}`,
    items: [{ slug, quantity }],
    guests: pass.seats > 1 ? Array.from({ length: quantity }, (_, g) => `${pick(firstNames, i + g + 3, 3)} ${last}`) : [],
  };
});

const demoTickets: TicketRow[] = demoOrders.flatMap((o) =>
  o.items.flatMap(({ slug, quantity }) => {
    const pass = passes.find((p) => p.slug === slug)!;
    return Array.from({ length: quantity }, (_, n): TicketRow => ({
      number: `${o.reference}-${slug.toUpperCase()}-${n + 1}`,
      passName: pass.name,
      holders: pass.seats > 1 ? [o.buyerName, o.guests[n]] : [o.buyerName],
      buyerEmail: o.email,
      orderReference: o.reference,
      status: o.status === "PAID" ? "VALID" : o.status === "PENDING" ? "PENDING" : "CANCELLED",
      createdAt: o.createdAt,
    }));
  }),
);

const pause = () => new Promise((r) => setTimeout(r, 350));
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const matches = (query: string | undefined, ...fields: string[]) => !query?.trim() || fields.some((f) => norm(f).includes(norm(query.trim())));

/* ---------------------------------------------------------------------- */
/* API                                                                     */
/* ---------------------------------------------------------------------- */

/** Chiffres du tableau de bord. Réel : calculés depuis la base. */
export async function getStats(): Promise<Stats> {
  await pause();
  const paid = demoOrders.filter((o) => o.status === "PAID");
  const byPass = passes.map((p) => {
    const sold = paid.flatMap((o) => o.items).filter((i) => i.slug === p.slug).reduce((s, i) => s + i.quantity, 0);
    return { slug: p.slug, name: p.name, sold, revenue: sold * p.price };
  });
  const ticketsSold = byPass.reduce((s, p) => s + p.sold, 0);
  return {
    ticketsSold,
    seatsSold: byPass.reduce((s, p) => s + p.sold * (passes.find((x) => x.slug === p.slug)?.seats ?? 1), 0),
    revenue: byPass.reduce((s, p) => s + p.revenue, 0),
    orders: demoOrders.length,
    ticketsValid: demoTickets.filter((t) => t.status === "VALID").length,
    ticketsUsed: demoTickets.filter((t) => t.status === "USED").length,
    ticketsCancelled: demoTickets.filter((t) => t.status === "CANCELLED").length,
    byPass,
  };
}

/** Liste des commandes, de la plus récente à la plus ancienne. Réel : pagination côté serveur. */
export async function listOrders({ query, status }: ListQuery<OrderStatus> = {}): Promise<OrderRow[]> {
  await pause();
  return demoOrders
    .filter((o) => (!status || status === "ALL" || o.status === status) && matches(query, o.reference, o.buyerName, o.email, o.phone, o.paymentReference))
    .map((o): OrderRow => ({
      reference: o.reference,
      createdAt: o.createdAt,
      buyerName: o.buyerName,
      email: o.email,
      phone: o.phone,
      total: o.total,
      status: o.status,
      paymentReference: o.paymentReference,
      summary: o.summary,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Liste des billets, recherchable par numéro, e-mail ou nom. Réel : pagination côté serveur. */
export async function listTickets({ query, status }: ListQuery<TicketStatus> = {}): Promise<TicketRow[]> {
  await pause();
  return demoTickets
    .filter((t) => (!status || status === "ALL" || t.status === status) && matches(query, t.number, t.buyerEmail, t.orderReference, ...t.holders))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
