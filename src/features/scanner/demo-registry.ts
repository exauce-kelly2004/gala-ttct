/**
 * DÉMONSTRATION UNIQUEMENT. Simule la base du back-end dans le navigateur : à l'achat, chaque billet reçoit un
 * jeton et est enregistré ici ; `/scanner` le retrouve, comme il le ferait avec le serveur.
 * Limite : ces données n'existent que dans CE navigateur. Le jeton réel sera créé et enregistré par le
 * back-end (jamais par le front-end : un jeton fabriqué côté client pourrait être falsifié).
 * Ce fichier disparaît avec le passage de IS_DEMO à false.
 */
import type { ScanTicket } from "./api";

const KEY = "ttct-demo-tickets";

type Entry = { ticket: ScanTicket; status: "VALID" | "USED" | "CANCELLED" };
type Registry = Record<string, Entry>;

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
    // Stockage indisponible : le billet reste affichable, mais ne sera pas reconnu au scan de démonstration
  }
};

/** Jeton aléatoire, sans caractères ambigus (0/O, 1/I) : « TTCT-7K2M9QXH4PBD8R3F6WNA ». */
export function newDemoToken(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return "TTCT-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function registerDemoTicket(token: string, ticket: ScanTicket) {
  write({ ...read(), [token]: { ticket, status: "VALID" } });
}

export const findDemoTicket = (token: string): Entry | null => read()[token] ?? null;

export function markDemoUsed(token: string, usedAt: string) {
  const registry = read();
  const entry = registry[token];
  if (entry) write({ ...registry, [token]: { status: "USED", ticket: { ...entry.ticket, usedAt } } });
}
