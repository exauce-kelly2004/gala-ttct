/**
 * Point de branchement front-end / back-end pour l'espace réservé (administrateurs et personnel).
 *
 * AUJOURD'HUI : implémentation SIMULÉE dans le navigateur (localStorage). Elle n'offre AUCUNE sécurité réelle.
 *
 * À FAIRE PAR LE BACK-END : remplacer le corps de chaque fonction par un appel serveur, en gardant les signatures.
 * Règles non négociables :
 *  - la session est un cookie httpOnly posé par le serveur ; le front ne manipule jamais de secret ;
 *  - seules les adresses invitées reçoivent un code ; `requestCode` répond toujours pareil (on ne révèle pas
 *    si une adresse est invitée) ;
 *  - le code est à usage unique, expire vite (ex. 10 min), tentatives limitées ;
 *  - CHAQUE route serveur d'administration et de contrôle revérifie la session et le rôle : masquer un écran
 *    côté front ne protège rien ;
 *  - seuls les ADMIN peuvent inviter ou révoquer.
 * Contrat détaillé : docs/CONTRAT_FRONT_BACK.md (section « Espace réservé »).
 */

/** Indique à l'interface qu'elle tourne sur des données simulées (bandeau « démonstration »). */
export const IS_DEMO = true;

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

/** Démonstration : adresses fictives déjà invitées et code de connexion unique. */
export const DEMO_CODE = "123456";
export const DEMO_INVITED = [
  { email: "admin@ttct-demo.test", role: "ADMIN" as Role },
  { email: "controle@ttct-demo.test", role: "STAFF" as Role },
];

const INVITES_KEY = "ttct-demo-invitations";
const SESSION_KEY = "ttct-demo-session";

const normalize = (email: string) => email.trim().toLowerCase();

function readInvites(): Invitation[] {
  try {
    const raw = localStorage.getItem(INVITES_KEY);
    if (raw) return JSON.parse(raw) as Invitation[];
  } catch {
    // ignore
  }
  return DEMO_INVITED.map((i) => ({ ...i, invitedAt: "2026-10-01T09:00:00.000Z", status: "PENDING" as const }));
}

function writeInvites(list: Invitation[]) {
  try {
    localStorage.setItem(INVITES_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

const pause = () => new Promise((r) => setTimeout(r, 500));

/**
 * Demande l'envoi d'un code de connexion. Réponse identique que l'adresse soit invitée ou non.
 * Réel : le serveur envoie le code par e-mail uniquement si l'adresse est invitée.
 */
export async function requestCode(email: string): Promise<void> {
  await pause();
  void normalize(email);
}

/** Vérifie le code et ouvre la session. Lève une exception si le code est faux, expiré ou l'adresse non invitée. */
export async function verifyCode(email: string, code: string): Promise<Session> {
  await pause();
  const invite = readInvites().find((i) => i.email === normalize(email));
  if (!invite || code.trim() !== DEMO_CODE) throw new Error("INVALID_CODE");
  writeInvites(readInvites().map((i) => (i.email === invite.email ? { ...i, status: "ACTIVE" as const } : i)));
  const session: Session = { email: invite.email, role: invite.role };
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
  return session;
}

/** Session en cours, ou `null`. Réel : le serveur lit le cookie de session. */
export async function getSession(): Promise<Session | null> {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    const session = raw ? (JSON.parse(raw) as Session) : null;
    // Une invitation révoquée ferme la session
    if (session && readInvites().some((i) => i.email === session.email)) return session;
  } catch {
    // ignore
  }
  return null;
}

export async function signOut(): Promise<void> {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

/** Réservé aux ADMIN. */
export async function listInvitations(): Promise<Invitation[]> {
  await pause();
  return readInvites();
}

/** Réservé aux ADMIN. Réel : le serveur envoie l'e-mail d'invitation. Lève une exception si l'adresse est déjà invitée. */
export async function invite(email: string, role: Role): Promise<Invitation[]> {
  await pause();
  const address = normalize(email);
  const list = readInvites();
  if (list.some((i) => i.email === address)) throw new Error("ALREADY_INVITED");
  const next = [...list, { email: address, role, invitedAt: new Date().toISOString(), status: "PENDING" as const }];
  writeInvites(next);
  return next;
}

/** Réservé aux ADMIN. Retire l'accès, y compris la session en cours de cette personne. */
export async function revokeInvitation(email: string): Promise<Invitation[]> {
  await pause();
  const next = readInvites().filter((i) => i.email !== normalize(email));
  writeInvites(next);
  return next;
}
