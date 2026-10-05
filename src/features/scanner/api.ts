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

/**
 * Vérifie un billet à partir du contenu de son QR code (ou de son numéro saisi à la main).
 * Réel : le serveur valide ET marque le billet comme utilisé dans la même opération.
 */
export async function verifyTicket(code: string): Promise<ScanResult> {
  await new Promise((r) => setTimeout(r, 450));
  const scannedAt = new Date().toISOString();
  const key = code.trim().toUpperCase();
  const found = demoTickets[key];

  if (!found) return { status: "INVALID", scannedAt };
  if (found.status === "VALID") {
    const firstPass = consumed.get(key);
    if (firstPass) return { status: "USED", ticket: { ...found.ticket, usedAt: firstPass }, scannedAt };
    consumed.set(key, scannedAt);
    return { status: "VALID", ticket: found.ticket, scannedAt };
  }
  return { status: found.status, ticket: found.ticket, scannedAt };
}
