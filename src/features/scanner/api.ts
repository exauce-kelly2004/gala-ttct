/**
 * Contrôle des billets à l'entrée : appels aux routes serveur /api/scan et /api/checkin/*.
 *
 * Le serveur valide ET marque le billet comme utilisé en une seule opération atomique (voir src/server/checkin.ts) :
 * deux scanners simultanés ne peuvent jamais valider le même billet. Ces routes exigent une session ADMIN ou STAFF.
 * Contrat détaillé : docs/CONTRAT_FRONT_BACK.md (section « Contrôle à l'entrée »).
 */

export type ScanStatus = "VALID" | "USED" | "CANCELLED" | "INVALID";

export type ScanTicket = {
  /** Numéro public du billet. */
  number: string;
  /** Type de pass : "duo-vvip" | "duo-vip" | "solo". */
  passSlug: string;
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

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: init?.body ? { "Content-Type": "application/json" } : undefined, cache: "no-store" });
  if (!res.ok) throw new Error(`REQUEST_FAILED_${res.status}`);
  return (await res.json()) as T;
}

/**
 * Vérifie un billet à partir du contenu de son QR code OU du code court imprimé sur le billet (saisi à la main).
 * Lève une exception en cas d'erreur réseau : le billet n'est alors pas considéré comme validé.
 */
export function verifyTicket(code: string): Promise<ScanResult> {
  return call<ScanResult>("/api/scan", { method: "POST", body: JSON.stringify({ code }) });
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
  /** Même point, type de pass par type de pass. */
  byPass: { slug: string; name: string; tickets: number; entered: number; remaining: number; seats: number; seatsEntered: number }[];
};

/** « Point des billets » de l'entrée : comptages de billets et de personnes uniquement, aucun montant. */
export function getCheckinSummary(): Promise<CheckinSummary> {
  return call<CheckinSummary>("/api/checkin/summary");
}

export type TicketLookup = {
  number: string;
  passSlug: string;
  passName: string;
  seats: number;
  holders: string[];
  status: "VALID" | "USED" | "CANCELLED" | "PENDING";
  usedAt?: string;
};

/**
 * Retrouve des billets par code, nom ou numéro de commande, quand le QR code ne se scanne pas.
 * Ni e-mail, ni téléphone, ni montant dans la réponse. L'entrée se valide ensuite avec `verifyTicket(number)`.
 */
export async function searchTickets(query: string): Promise<TicketLookup[]> {
  if (query.trim().length < 3) return [];
  return call<TicketLookup[]>(`/api/checkin/search?q=${encodeURIComponent(query.trim())}`);
}
