import "server-only";
import { env } from "@/lib/env";
import { confirmOrderPaid } from "./orders";

/**
 * Point d'accroche du paiement. Le prestataire (FedaPay, KKiaPay, CinetPay…) n'est pas encore choisi.
 *
 * Pour brancher un prestataire :
 *  1. `startPayment` crée la transaction chez lui et renvoie `paymentUrl` (le front y redirige l'acheteur) ;
 *  2. une route webhook vérifie la signature du prestataire, puis appelle `confirmOrderPaid(orderId, paymentReference)`.
 *     La redirection du navigateur n'est JAMAIS une preuve de paiement : seul le webhook confirme.
 */
export type PaymentStart = { paymentUrl?: string };

export async function startPayment(order: { id: string; reference: string; total: number }): Promise<PaymentStart> {
  if (env.PAYMENT_PROVIDER === "simulated") {
    // Garde-fou : en production, le mode simulé distribuerait des billets gratuits.
    if (env.NODE_ENV === "production") throw new Error("Paiement simulé interdit en production : configurer PAYMENT_PROVIDER");
    await confirmOrderPaid(order.id, `SIMULE-${order.reference}`, "simulated");
    return {};
  }
  throw new Error(`Prestataire de paiement « ${env.PAYMENT_PROVIDER} » non branché`);
}
