import "server-only";
import { db } from "@/lib/db";

/** Exports CSV pour la comptabilité et le suivi. Réservés aux ADMIN (ils contiennent e-mails et téléphones). */

const when = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Porto-Novo" });
const fmt = (d: Date | null) => (d ? when.format(d) : "");

/**
 * Une cellule CSV entre guillemets. Une valeur qui commence par = + - @ serait lue comme une formule par Excel
 * (un nom d'acheteur malveillant pourrait s'y exécuter) : on la préfixe d'une apostrophe.
 */
function cell(value: string | number | null | undefined): string {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/** Séparateur « ; » et BOM UTF-8 : s'ouvre correctement dans Excel en français (accents compris). */
const toCsv = (header: string[], rows: (string | number | null | undefined)[][]) =>
  "﻿" + [header, ...rows].map((r) => r.map(cell).join(";")).join("\r\n") + "\r\n";

export async function ordersCsv(): Promise<string> {
  const orders = await db.order.findMany({ include: { lines: { include: { pass: true } } }, orderBy: { createdAt: "desc" } });
  return toCsv(
    ["Référence", "Date", "Nom", "Prénom", "E-mail", "Téléphone", "Commande", "Montant (FCFA)", "Statut", "Référence de paiement"],
    orders.map((o) => [
      o.reference,
      fmt(o.createdAt),
      o.buyerLastName,
      o.buyerFirstName,
      o.buyerEmail,
      o.buyerPhone,
      o.lines.map((l) => `${l.quantity} x ${l.pass.name}`).join(", "),
      o.total,
      o.status === "PAID" ? "Payée" : o.status === "PENDING" ? "En attente" : "Annulée",
      o.paymentReference,
    ]),
  );
}

export async function ticketsCsv(): Promise<string> {
  const tickets = await db.ticket.findMany({ include: { pass: true, order: { select: { reference: true, buyerEmail: true } } }, orderBy: { createdAt: "desc" } });
  const label = { PENDING: "En attente", VALID: "Valide", USED: "Utilisé", CANCELLED: "Annulé" } as const;
  return toCsv(
    ["Code du billet", "Pass", "Personnes", "Titulaires", "E-mail de l'acheteur", "Commande", "Statut", "Créé le", "Utilisé le"],
    tickets.map((t) => [t.number, t.pass.name, t.seats, t.holders.join(" / "), t.order.buyerEmail, t.order.reference, label[t.status], fmt(t.createdAt), fmt(t.usedAt)]),
  );
}
