/**
 * Commande : appels aux routes serveur /api/orders.
 *
 * Le serveur recalcule les prix, revérifie quantités, invités et stock, puis crée les billets (code, jeton du QR,
 * titulaires) une fois la commande payée. Contrat détaillé : docs/CONTRAT_FRONT_BACK.md
 */
import type { CreateOrderRequest, Order } from "./order";

/**
 * Le paiement est encore SIMULÉ côté serveur (aucun argent, PAYMENT_PROVIDER="simulated", refusé en production).
 * Passer à `false` quand le prestataire de paiement est branché (src/server/payment.ts).
 */
export const IS_DEMO = true;

/**
 * Crée la commande et lance le paiement. Avec un prestataire, la réponse contient `paymentUrl` vers laquelle rediriger.
 * Lève une exception si la commande est refusée (le message du serveur est repris quand il existe).
 */
export async function createOrder(request: CreateOrderRequest): Promise<{ reference: string; paymentUrl?: string }> {
  const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
  const data = (await res.json().catch(() => null)) as { reference?: string; paymentUrl?: string; message?: string } | null;
  if (!res.ok || !data?.reference) throw new Error(data?.message ?? "ORDER_FAILED");
  return { reference: data.reference, paymentUrl: data.paymentUrl };
}

/** Récupère une commande pour la page de confirmation, ou `null` si la référence est inconnue. */
export async function getOrder(reference: string): Promise<Order | null> {
  const res = await fetch(`/api/orders/${encodeURIComponent(reference)}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("ORDER_FETCH_FAILED");
  return (await res.json()) as Order;
}
