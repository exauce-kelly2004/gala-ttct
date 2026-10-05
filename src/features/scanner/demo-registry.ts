/**
 * DÉMONSTRATION UNIQUEMENT. Simule la base du back-end dans le navigateur : à l'achat, chaque billet reçoit un
 * jeton (contenu du QR) et un code court (imprimé sur le billet), puis est enregistré ici ; l'espace de contrôle
 * le retrouve par l'un ou l'autre, comme il le ferait avec le serveur.
 * Limite : ces données n'existent que dans CE navigateur. Le jeton et le code réels seront créés et enregistrés
 * par le back-end (jamais par le front-end : une valeur fabriquée côté client pourrait être falsifiée).
 * Ce fichier disparaît avec le passage de IS_DEMO à false.
 */
import type { ScanTicket } from "./api";

const KEY = "ttct-demo-tickets";

export type DemoEntry = {
  ticket: ScanTicket;
  status: "VALID" | "USED" | "CANCELLED";
  buyerEmail?: string;
  createdAt?: string;
};
type Registry = Record<string, DemoEntry>;

const read = (): Registry => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Registry;
  } catch {
    return {};
  }
};

const write = (registry: Registry) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(registry));
  } catch {
    // Stockage indisponible : le billet reste affichable, mais ne sera pas reconnu par le contrôle de démonstration
  }
};

// Alphabet sans caractères ambigus (0/O, 1/I) : lisible à voix haute et à la main
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const random = (length: number) => Array.from(crypto.getRandomValues(new Uint8Array(length)), (b) => ALPHABET[b % ALPHABET.length]).join("");

/** Jeton du QR : « TTCT-7K2M9QXH4PBD8R3F6WNA ». Long, imprévisible, jamais lu à voix haute. */
export const newDemoToken = () => "TTCT-" + random(20);

/** Code court imprimé sur le billet : « GALA-7K2M-9QXH ». */
export const newDemoCode = () => `GALA-${random(4)}-${random(4)}`;

/** Compare deux codes sans tenir compte de la casse, des espaces ni des tirets. */
export const sameCode = (a: string, b: string) => a.replace(/[^a-z0-9]/gi, "").toUpperCase() === b.replace(/[^a-z0-9]/gi, "").toUpperCase();

export function registerDemoTicket(token: string, ticket: ScanTicket, meta: { buyerEmail: string; createdAt: string }) {
  write({ ...read(), [token]: { ticket, status: "VALID", ...meta } });
}

/** Retrouve un billet par son jeton (QR) ou par son code court (saisie à la main). */
export function findDemoTicket(code: string): { key: string; entry: DemoEntry } | null {
  const registry = read();
  const trimmed = code.trim();
  if (registry[trimmed]) return { key: trimmed, entry: registry[trimmed] };
  const key = Object.keys(registry).find((k) => sameCode(registry[k].ticket.number, trimmed));
  return key ? { key, entry: registry[key] } : null;
}

export const listDemoEntries = (): [string, DemoEntry][] => Object.entries(read());

/** Marque un billet comme utilisé ; crée l'entrée si le billet vient du jeu de démonstration de base. */
export function markDemoUsed(key: string, ticket: ScanTicket, usedAt: string, extra?: Partial<DemoEntry>) {
  const registry = read();
  write({ ...registry, [key]: { ...registry[key], ...extra, status: "USED", ticket: { ...ticket, usedAt } } });
}
