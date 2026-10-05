import { findPass, passes, type PassOffer } from "@/config/passes";

/**
 * Types partagés avec le back-end : voir docs/CONTRAT_FRONT_BACK.md.
 * Le front-end ne génère ni billet, ni numéro, ni QR code : tout cela vient du back-end.
 */

export type Buyer = { firstName: string; lastName: string; email: string; phone: string };

/** Envoyé par le front-end au moment de payer. */
export type CreateOrderRequest = {
  buyer: Buyer;
  items: {
    passSlug: string;
    quantity: number;
    /** Pass Duo uniquement : nom complet du second invité, un par pass (même longueur que `quantity`). */
    guestNames?: string[];
  }[];
  /** Preuve du consentement aux CGV (la charge de la preuve incombe au vendeur, Code du numérique art. 341). */
  termsAcceptedAt: string;
  /** Version des CGV acceptées (date de mise à jour affichée sur la page). */
  termsVersion: string;
};

export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";
export type TicketStatus = "PENDING" | "VALID" | "USED" | "CANCELLED";

export type OrderLine = Pick<PassOffer, "slug" | "name" | "price" | "seats"> & { quantity: number };

/** Billet tel que le back-end le renvoie. */
export type Ticket = {
  /** Numéro public lisible à l'entrée. */
  number: string;
  passName: string;
  seats: number;
  /** Noms inscrits sur le billet : l'acheteur, puis son invité pour un Pass Duo. À renvoyer aussi lors du scan. */
  holders: string[];
  status: TicketStatus;
  /**
   * Jeton unique du billet, créé et enregistré par le back-end (lié au type de pass dans sa base).
   * Le front-end en dessine le QR code et le rend téléchargeable. Aucune donnée personnelle dedans.
   * `null` tant que le billet n'existe pas.
   */
  qrToken: string | null;
  /** Lien de téléchargement sécurisé du PDF, produit par le back-end. */
  pdfUrl: string | null;
};

/** Commande telle que le back-end la renvoie (page de confirmation). */
export type Order = {
  reference: string;
  status: OrderStatus;
  createdAt: string;
  buyer: Buyer;
  lines: OrderLine[];
  total: number;
  currency: "FCFA";
  tickets: Ticket[];
};

/* ---------------------------------------------------------------------- */
/* Panier : logique purement front-end                                     */
/* ---------------------------------------------------------------------- */

export type Cart = Record<string, number>;

/** Panier initial depuis l'URL (?pass=duo-vip&quantite=2), borné aux quantités autorisées. */
export function cartFromParams(pass: string | undefined, quantity: string | undefined): Cart {
  const cart: Cart = Object.fromEntries(passes.map((p) => [p.slug, 0]));
  const chosen = findPass(pass);
  if (chosen) {
    const n = Number(quantity);
    cart[chosen.slug] = Number.isInteger(n) ? Math.min(Math.max(n, 1), chosen.maxPerOrder) : 1;
  }
  return cart;
}

export function cartLines(cart: Cart): OrderLine[] {
  return passes
    .filter((p) => (cart[p.slug] ?? 0) > 0)
    .map((p) => ({ slug: p.slug, name: p.name, price: p.price, seats: p.seats, quantity: cart[p.slug] }));
}

export const linesTotal = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
export const linesSeats = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + l.seats * l.quantity, 0);
