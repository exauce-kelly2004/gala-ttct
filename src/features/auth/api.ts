/**
 * Espace réservé (administrateurs et personnel) : appels aux routes serveur /api/auth et /api/team.
 *
 * La session est un cookie httpOnly posé par le serveur ; le front ne manipule jamais de secret.
 * Masquer un écran selon le rôle n'est qu'un confort : chaque route serveur revérifie la session et le rôle
 * (voir src/server/auth.ts). Contrat : docs/CONTRAT_FRONT_BACK.md (section « Espace réservé »).
 */

export type Role = "ADMIN" | "STAFF";

export type Session = { email: string; role: Role };

export type Invitation = {
  email: string;
  role: Role;
  /** ISO 8601 */
  invitedAt: string;
  /** PENDING : jamais connectée · ACTIVE : s'est déjà connectée. */
  status: "PENDING" | "ACTIVE";
};

export const ROLE_LABEL: Record<Role, string> = { ADMIN: "Administrateur", STAFF: "Personnel de contrôle" };

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data as { error?: string } | null)?.error ?? "REQUEST_FAILED");
  return data as T;
}

const post = <T>(url: string, body: unknown) => call<T>(url, { method: "POST", body: JSON.stringify(body) });

/** Demande l'envoi d'un code. Réponse identique que l'adresse soit invitée ou non. */
export async function requestCode(email: string): Promise<void> {
  await post("/api/auth/code", { email });
}

/** Vérifie le code et ouvre la session. Lève une exception si le code est faux, expiré ou l'adresse non invitée. */
export function verifyCode(email: string, code: string): Promise<Session> {
  return post<Session>("/api/auth/verify", { email, code });
}

/** Session en cours, ou `null`. */
export async function getSession(): Promise<Session | null> {
  try {
    return await call<Session | null>("/api/auth/session");
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  await post("/api/auth/logout", {}).catch(() => undefined);
}

/** Réservé aux ADMIN. */
export function listInvitations(): Promise<Invitation[]> {
  return call<Invitation[]>("/api/team");
}

/** Réservé aux ADMIN. Lève `ALREADY_INVITED` si l'adresse est déjà invitée. */
export function invite(email: string, role: Role): Promise<Invitation[]> {
  return post<Invitation[]>("/api/team", { email, role });
}

/** Réservé aux ADMIN. Retire l'accès, y compris la session en cours de cette personne. */
export function revokeInvitation(email: string): Promise<Invitation[]> {
  return call<Invitation[]>("/api/team", { method: "DELETE", body: JSON.stringify({ email }) });
}
