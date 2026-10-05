/**
 * Point de branchement front-end / back-end pour le contrôle des billets.
 *
 * AUJOURD'HUI : implémentation SIMULÉE (aucun serveur). Elle reconnaît quelques codes de démonstration.
 *
 * À FAIRE PAR LE BACK-END : remplacer le corps de `verifyTicket` par un appel serveur (route API protégée
 * par la connexion du personnel), en gardant la signature. Le serveur doit, en UNE opération atomique :
 * trouver le billet par son jeton, vérifier son statut, le passer à USED s'il était VALID, journaliser le scan,
 * puis répondre. Deux scanners simultanés ne doivent jamais valider le même billet.
 * Contrat détaillé : docs/CONTRAT_FRONT_BACK.md (section « Contrôle à l'entrée »).
 */

import { allDemoTickets, findBaseDemoTicket, matchesQuery } from "@/features/dashboard/api";
import { findDemoTicket, markDemoUsed } from "./demo-registry";

/** Indique à l'interface qu'elle tourne sur des données simulées (bandeau « démonstration »). */
export const IS_DEMO = true;

export type ScanStatus = "VALID" | "USED" | "CANCELLED" | "INVALID";

export type ScanTicket = {
  /** Numéro public du billet. */
  number: string;
  passName: string;
  seats: number;
  /** Noms inscrits sur le billet : un ou deux (Pass Duo). */
  holders: string[];
  orderReference: string;
  /** Commande payée (confirmée côté serveur). */
  paid: boolean;
  /** ISO 8601 : premier passage, renseigné si le billet a déjà été utilisé. */
  usedAt?: string;
};

export type ScanResult = {
  status: ScanStatus;
  /** Absent si le billet est inconnu. */
  ticket?: ScanTicket;
  /** ISO 8601 : moment du contrôle. */
  scannedAt: string;
};

/** Codes de démonstration, à saisir ou à encoder dans un QR pour essayer l'écran. */
export const DEMO_CODES = [
  { code: "DEMO-SOLO", label: "Solo valide" },
  { code: "DEMO-DUO", label: "Duo valide" },
  { code: "DEMO-USED", label: "Déjà utilisé" },
  { code: "DEMO-CANCELLED", label: "Annulé" },
  { code: "DEMO-INCONNU", label: "Inconnu" },
] as const;

const demoTickets: Record<string, { status: "VALID" | "USED" | "CANCELLED"; ticket: ScanTicket }> = {
  "DEMO-SOLO": {
    status: "VALID",
    ticket: { number: "EXEMPLE-SOLO-1", passName: "Pass Solo", seats: 1, holders: ["Awa Sossou"], orderReference: "DEMO-0001", paid: true },
  },
  "DEMO-DUO": {
    status: "VALID",
    ticket: { number: "EXEMPLE-DUO-VIP-1", passName: "Pass Duo V.I.P", seats: 2, holders: ["Koffi Adjovi", "Mariam Adjovi"], orderReference: "DEMO-0002", paid: true },
  },
  "DEMO-USED": {
    status: "USED",
    ticket: {
      number: "EXEMPLE-DUO-VVIP-1",
      passName: "Pass Duo V.V.I.P",
      seats: 2,
      holders: ["Jean Tossou", "Agnès Tossou"],
      orderReference: "DEMO-0003",
      paid: true,
      usedAt: "2026-12-19T20:42:00+01:00",
    },
  },
  "DEMO-CANCELLED": {
    status: "CANCELLED",
    ticket: { number: "EXEMPLE-SOLO-2", passName: "Pass Solo", seats: 1, holders: ["Paul Dossou"], orderReference: "DEMO-0004", paid: true },
  },
};

// Billets « consommés » pendant la session de démonstration : un second scan doit être refusé
const consumed = new Map<string, string>();

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Vérifie un billet à partir du contenu de son QR code OU du code court imprimé sur le billet (saisi à la main).
 * Réel : le serveur valide ET marque le billet comme utilisé dans la même opération.
 */
export async function verifyTicket(code: string): Promise<ScanResult> {
  await pause(450);
  const scannedAt = new Date().toISOString();
  const trimmed = code.trim();

  // 1. Billets achetés dans ce navigateur pendant la démonstration (par jeton du QR ou code court)
  const bought = findDemoTicket(trimmed);
  if (bought) {
    const { key, entry } = bought;
    if (entry.status === "VALID") {
      markDemoUsed(key, entry.ticket, scannedAt);
      return { status: "VALID", ticket: entry.ticket, scannedAt };
    }
    return { status: entry.status, ticket: entry.ticket, scannedAt };
  }

  // 2. Billets du jeu de démonstration de base, par code court
  const base = findBaseDemoTicket(trimmed);
  if (base) {
    const ticket: ScanTicket = { number: base.number, passName: base.passName, seats: base.seats, holders: base.holders, orderReference: base.orderReference, paid: base.status !== "PENDING" };
    if (base.status === "VALID") {
      markDemoUsed(base.number, ticket, scannedAt);
      return { status: "VALID", ticket, scannedAt };
    }
    return { status: base.status === "CANCELLED" ? "CANCELLED" : "INVALID", ticket, scannedAt };
  }

  // 3. Codes d'essai fixes
  const found = demoTickets[trimmed.toUpperCase()];
  if (!found) return { status: "INVALID", scannedAt };
  if (found.status === "VALID") {
    const firstPass = consumed.get(trimmed.toUpperCase());
    if (firstPass) return { status: "USED", ticket: { ...found.ticket, usedAt: firstPass }, scannedAt };
    consumed.set(trimmed.toUpperCase(), scannedAt);
    return { status: "VALID", ticket: found.ticket, scannedAt };
  }
  return { status: found.status, ticket: found.ticket, scannedAt };
}

/* ---------------------------------------------------------------------- */
/* Vue du personnel de contrôle : billets et personnes, JAMAIS d'argent    */
/* ---------------------------------------------------------------------- */

export type CheckinSummary = {
  /** Billets payés et valables (utilisés compris). */
  tickets: number;
  ticketsEntered: number;
  ticketsRemaining: number;
  /** Personnes attendues / entrées (un Pass Duo = 2). */
  seats: number;
  seatsEntered: number;
  seatsRemaining: number;
};

/**
 * « Point des billets » de l'entrée. Accessible au rôle STAFF : le serveur ne doit renvoyer ici que des comptages
 * de billets et de personnes, aucun montant, aucune donnée de paiement.
 */
export async function getCheckinSummary(): Promise<CheckinSummary> {
  await pause(250);
  const admissible = allDemoTickets().filter((t) => t.status === "VALID" || t.status === "USED");
  const entered = admissible.filter((t) => t.status === "USED");
  const sum = (list: { seats: number }[]) => list.reduce((s, t) => s + t.seats, 0);
  return {
    tickets: admissible.length,
    ticketsEntered: entered.length,
    ticketsRemaining: admissible.length - entered.length,
    seats: sum(admissible),
    seatsEntered: sum(entered),
    seatsRemaining: sum(admissible) - sum(entered),
  };
}

export type TicketLookup = {
  number: string;
  passName: string;
  seats: number;
  holders: string[];
  status: "VALID" | "USED" | "CANCELLED" | "PENDING";
  usedAt?: string;
};

/**
 * Retrouve des billets par code, nom ou numéro de commande, quand le QR code ne se scanne pas.
 * Accessible au rôle STAFF : ni e-mail, ni téléphone, ni montant dans la réponse. L'entrée se valide ensuite
 * avec `verifyTicket(number)`. Réel : au moins 3 caractères exigés, résultats limités.
 */
export async function searchTickets(query: string): Promise<TicketLookup[]> {
  await pause(300);
  if (query.trim().length < 3) return [];
  return allDemoTickets()
    .filter((t) => matchesQuery(query, t.number, t.orderReference, ...t.holders))
    .slice(0, 12)
    .map((t) => ({ number: t.number, passName: t.passName, seats: t.seats, holders: t.holders, status: t.status, usedAt: t.usedAt }));
}
