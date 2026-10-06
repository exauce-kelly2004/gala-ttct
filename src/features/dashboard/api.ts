/**
 * Tableau de bord organisateur (réservé aux ADMIN) : appels aux routes serveur /api/admin/*.
 * Tout est calculé depuis la base (voir src/server/admin.ts). Contrat : docs/CONTRAT_FRONT_BACK.md.
 */

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";
export type TicketStatus = "PENDING" | "VALID" | "USED" | "CANCELLED";

export type Stats = {
  ticketsSold: number;
  /** Personnes couvertes (un Pass Duo = 2). */
  seatsSold: number;
  /** Montant encaissé, en FCFA (commandes payées). */
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

async function get<T>(path: string, params: Record<string, string | undefined> = {}): Promise<T> {
  const search = new URLSearchParams(Object.entries(params).flatMap(([k, v]) => (v ? [[k, v]] : [])));
  const res = await fetch(`${path}${search.size ? `?${search}` : ""}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`REQUEST_FAILED_${res.status}`);
  return (await res.json()) as T;
}

export const getStats = () => get<Stats>("/api/admin/stats");

export type Insights = {
  /** Commandes payées par jour (heure du Bénin), du plus ancien au plus récent. `day` : AAAA-MM-JJ. */
  salesByDay: { day: string; orders: number; tickets: number; revenue: number }[];
  /** Entrées enregistrées au contrôle, par heure. `hour` : « AAAA-MM-JJ HH:00 ». */
  entriesByHour: { hour: string; tickets: number; seats: number }[];
  /** Présence : billets payés et valables (utilisés compris) et part déjà entrée, en %. */
  attendance: { expected: number; entered: number; rate: number };
};

export const getInsights = () => get<Insights>("/api/admin/insights");

/** Commandes, de la plus récente à la plus ancienne (200 au plus : affiner la recherche au-delà). */
export const listOrders = ({ query, status }: ListQuery<OrderStatus> = {}) => get<OrderRow[]>("/api/admin/orders", { q: query, status });

/** Billets, recherchables par code du billet, nom, e-mail ou commande. */
export const listTickets = ({ query, status }: ListQuery<TicketStatus> = {}) => get<TicketRow[]>("/api/admin/tickets", { q: query, status });

export type PassCapacity = {
  slug: string;
  name: string;
  price: number;
  /** Nombre de pass en vente ; `null` = illimité. */
  capacity: number | null;
  /** Pass déjà vendus ou en cours de paiement. */
  reserved: number;
};

export const getPassCapacity = () => get<PassCapacity[]>("/api/admin/passes");

async function send<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data as { error?: string } | null)?.error ?? "REQUEST_FAILED");
  return data as T;
}

/** Fixe le nombre de pass en vente (`null` = illimité). Lève `BELOW_RESERVED` si c'est moins que le nombre déjà réservé. */
export const setPassCapacity = (slug: string, capacity: number | null) => send<PassCapacity[]>("PATCH", "/api/admin/passes", { slug, capacity });

/** Annule une commande et ses billets. Lève `TICKETS_USED` si un billet a déjà servi, `ALREADY_CANCELLED` si c'est déjà fait. */
export const cancelOrder = (reference: string) => send<{ ok: true }>("POST", `/api/admin/orders/${encodeURIComponent(reference)}/cancel`);
