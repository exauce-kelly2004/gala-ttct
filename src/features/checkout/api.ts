/**
 * Point de branchement front-end / back-end pour la commande.
 *
 * AUJOURD'HUI : implémentation SIMULÉE (aucun serveur, aucun paiement, aucun QR code).
 * Elle garde la commande dans le sessionStorage du navigateur pour que la page de confirmation l'affiche.
 *
 * À FAIRE PAR LE BACK-END : remplacer le corps de `createOrder` et `getOrder` par les appels réels
 * (route API ou Server Action), en gardant les signatures. Le reste du front-end ne bouge pas.
 * Contrat détaillé : docs/CONTRAT_FRONT_BACK.md
 */
import { findPass } from "@/config/passes";
import { newDemoToken, registerDemoTicket } from "@/features/scanner/demo-registry";
import type { CreateOrderRequest, Order } from "./order";

const STORAGE_KEY = "ttct-demo-order";

/** Indique à l'interface qu'elle tourne sur des données simulées (bandeau « démonstration »). */
export const IS_DEMO = true;

/**
 * Crée la commande et lance le paiement.
 * Réel : POST vers le back-end ; la commande ne passe PAID qu'après confirmation serveur du paiement (webhook).
 * Selon le prestataire, la réponse pourra contenir une URL de paiement vers laquelle rediriger.
 */
export async function createOrder(request: CreateOrderRequest): Promise<{ reference: string; paymentUrl?: string }> {
  await new Promise((r) => setTimeout(r, 1600));

  const lines = request.items.flatMap(({ passSlug, quantity }) => {
    const pass = findPass(passSlug);
    return pass ? [{ slug: pass.slug, name: pass.name, price: pass.price, seats: pass.seats, quantity }] : [];
  });

  const buyerName = `${request.buyer.firstName} ${request.buyer.lastName}`.trim();
  const guestsOf = (slug: string) => request.items.find((i) => i.passSlug === slug)?.guestNames ?? [];

  const order: Order = {
    reference: "DEMO-0001",
    status: "PAID",
    createdAt: new Date().toISOString(),
    buyer: request.buyer,
    lines,
    total: lines.reduce((s, l) => s + l.price * l.quantity, 0),
    currency: "FCFA",
    // Billets de démonstration : numéros factices, jeton local (réel : créé par le back-end)
    tickets: lines.flatMap((l) =>
      Array.from({ length: l.quantity }, (_, i) => {
        const ticket = {
          number: `EXEMPLE-${l.slug.toUpperCase()}-${i + 1}`,
          passName: l.name,
          seats: l.seats,
          holders: l.seats > 1 ? [buyerName, guestsOf(l.slug)[i] ?? ""].filter(Boolean) : [buyerName],
          status: "VALID" as const,
          qrToken: newDemoToken(),
          pdfUrl: null,
        };
        // Le « scanner » de démonstration retrouvera ce billet grâce à son jeton
        registerDemoTicket(ticket.qrToken, { number: ticket.number, passName: l.name, seats: l.seats, holders: ticket.holders, orderReference: "DEMO-0001", paid: true });
        return ticket;
      }),
    ),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Stockage indisponible : la confirmation affichera la commande d'exemple
  }
  return { reference: order.reference };
}

/** Récupère une commande payée pour la page de confirmation. Réel : GET sécurisé côté back-end. */
export async function getOrder(reference: string): Promise<Order | null> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const order = raw ? (JSON.parse(raw) as Order) : null;
    if (order && order.reference === reference) return order;
  } catch {
    // ignore
  }
  return reference === "DEMO-0001" ? exampleOrder : null;
}

/** Commande d'exemple : permet d'ouvrir /confirmation?ref=DEMO-0001 directement pour la relecture du design. */
const exampleOrder: Order = {
  reference: "DEMO-0001",
  status: "PAID",
  createdAt: "2026-10-04T12:00:00.000Z",
  buyer: { firstName: "Prénom", lastName: "Nom", email: "exemple@email.com", phone: "0197865758" },
  lines: [{ slug: "duo-vip", name: "Pass Duo V.I.P", price: 25000, seats: 2, quantity: 1 }],
  total: 25000,
  currency: "FCFA",
  tickets: [{ number: "EXEMPLE-DUO-VIP-1", passName: "Pass Duo V.I.P", seats: 2, holders: ["Prénom Nom", "Prénom Nom (invité)"], status: "VALID", qrToken: "TTCT-EXEMPLE", pdfUrl: null }],
};
