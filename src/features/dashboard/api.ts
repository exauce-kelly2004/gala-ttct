/**
 * Point de branchement front-end / back-end pour le tableau de bord organisateur (réservé aux ADMIN).
 *
 * AUJOURD'HUI : DONNÉES DE DÉMONSTRATION générées localement (aucun serveur). Les chiffres affichés ne sont pas réels.
 *
 * À FAIRE PAR LE BACK-END : remplacer le corps des fonctions par des appels serveur protégés (rôle ADMIN),
 * en gardant les signatures et en calculant tout depuis la base. Contrat : docs/CONTRAT_FRONT_BACK.md.
 */
import { passes } from "@/config/passes";
import { listDemoEntries } from "@/features/scanner/demo-registry";

/** Indique à l'interface qu'elle tourne sur des données simulées (bandeau « démonstration »). */
export const IS_DEMO = true;

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";
export type TicketStatus = "PENDING" | "VALID" | "USED" | "CANCELLED";

export type Stats = {
  ticketsSold: number;
  /** Personnes couvertes (un Pass Duo = 2). */
  seatsSold: number;
  /** Montant encaissé, en FCFA (billets payés). */
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
  /** Code du billet, imprimé dessus : permet de retrouver l'acheteur sans scanner. */
  number: string;
  passSlug: string;
  passName: string;
  seats: number;
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
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const pick = <T,>(list: T[], i: number, step: number) => list[(i * step) % list.length];

/** Code de billet de démonstration, stable d'un chargement à l'autre : « GALA-7K2M-9QXH ». */
function demoCode(order: number, n: number) {
  // xorshift32 : bien mélangé, stable d'un chargement à l'autre
  let h = (Math.imul(order + 1, 2654435761) ^ Math.imul(n + 1, 40503)) >>> 0 || 1;
  const char = () => {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >>> 17;
    h ^= h << 5;
    h >>>= 0;
    return CODE_ALPHABET[h % CODE_ALPHABET.length];
  };
  return `GALA-${char()}${char()}${char()}${char()}-${char()}${char()}${char()}${char()}`;
}

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

const baseTickets: TicketRow[] = demoOrders.flatMap((o, oi) =>
  o.items.flatMap(({ slug, quantity }) => {
    const pass = passes.find((p) => p.slug === slug)!;
    return Array.from({ length: quantity }, (_, n): TicketRow => ({
      number: demoCode(oi, n),
      passSlug: pass.slug,
      passName: pass.name,
      seats: pass.seats,
      holders: pass.seats > 1 ? [o.buyerName, o.guests[n]] : [o.buyerName],
      buyerEmail: o.email,
      orderReference: o.reference,
      status: o.status === "PAID" ? "VALID" : o.status === "PENDING" ? "PENDING" : "CANCELLED",
      createdAt: o.createdAt,
    }));
  }),
);

const normCode = (s: string) => s.replace(/[^a-z0-9]/gi, "").toUpperCase();

/**
 * Tous les billets : le jeu de démonstration, plus ceux achetés dans ce navigateur, avec les passages
 * déjà enregistrés par le contrôle. Réel : une simple requête sur la table des billets.
 */
export function allDemoTickets(): TicketRow[] {
  const entries = listDemoEntries();
  const byNumber = new Map(entries.map(([, e]) => [normCode(e.ticket.number), e]));
  const baseNumbers = new Set(baseTickets.map((t) => normCode(t.number)));

  const base = baseTickets.map((t) => {
    const seen = byNumber.get(normCode(t.number));
    return seen?.status === "USED" ? { ...t, status: "USED" as const, usedAt: seen.ticket.usedAt } : t;
  });

  const local = entries
    .filter(([, e]) => !baseNumbers.has(normCode(e.ticket.number)))
    .map(([, e]): TicketRow => ({
      number: e.ticket.number,
      passSlug: e.ticket.passSlug,
      passName: e.ticket.passName,
      seats: e.ticket.seats,
      holders: e.ticket.holders,
      buyerEmail: e.buyerEmail ?? "—",
      orderReference: e.ticket.orderReference,
      status: e.status,
      createdAt: e.createdAt ?? new Date().toISOString(),
      usedAt: e.ticket.usedAt,
    }));

  return [...local, ...base];
}

/** Retrouve un billet du jeu de démonstration de base par son code (utilisé par le contrôle). */
export const findBaseDemoTicket = (code: string): TicketRow | undefined => baseTickets.find((t) => normCode(t.number) === normCode(code));

const pause = () => new Promise((r) => setTimeout(r, 350));
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
export const matchesQuery = (query: string | undefined, ...fields: string[]) =>
  !query?.trim() || fields.some((f) => norm(f).includes(norm(query.trim())) || (normCode(query).length >= 3 && normCode(f).includes(normCode(query))));

/* ---------------------------------------------------------------------- */
/* API                                                                     */
/* ---------------------------------------------------------------------- */

/** Chiffres du tableau de bord. Réel : calculés depuis la base. */
export async function getStats(): Promise<Stats> {
  await pause();
  const tickets = allDemoTickets();
  const sold = tickets.filter((t) => t.status === "VALID" || t.status === "USED");
  const byPass = passes.map((p) => {
    const n = sold.filter((t) => t.passName === p.name).length;
    return { slug: p.slug, name: p.name, sold: n, revenue: n * p.price };
  });
  const localOrders = new Set(tickets.filter((t) => !baseTickets.some((b) => b.number === t.number)).map((t) => t.orderReference)).size;
  return {
    ticketsSold: sold.length,
    seatsSold: sold.reduce((s, t) => s + t.seats, 0),
    revenue: byPass.reduce((s, p) => s + p.revenue, 0),
    orders: demoOrders.length + localOrders,
    ticketsValid: tickets.filter((t) => t.status === "VALID").length,
    ticketsUsed: tickets.filter((t) => t.status === "USED").length,
    ticketsCancelled: tickets.filter((t) => t.status === "CANCELLED").length,
    byPass,
  };
}

/** Liste des commandes, de la plus récente à la plus ancienne. Réel : pagination côté serveur. */
export async function listOrders({ query, status }: ListQuery<OrderStatus> = {}): Promise<OrderRow[]> {
  await pause();
  return demoOrders
    .filter((o) => (!status || status === "ALL" || o.status === status) && matchesQuery(query, o.reference, o.buyerName, o.email, o.phone, o.paymentReference))
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

/** Liste des billets, recherchable par code du billet, nom, e-mail ou commande. Réel : pagination côté serveur. */
export async function listTickets({ query, status }: ListQuery<TicketStatus> = {}): Promise<TicketRow[]> {
  await pause();
  return allDemoTickets()
    .filter((t) => (!status || status === "ALL" || t.status === status) && matchesQuery(query, t.number, t.buyerEmail, t.orderReference, ...t.holders))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
