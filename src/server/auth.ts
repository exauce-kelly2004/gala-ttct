import "server-only";
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { Role } from "@/generated/prisma/enums";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { sendMail } from "./mail";

/**
 * Connexion sans mot de passe : e-mail invité → code à 6 chiffres → session par cookie httpOnly.
 * Le code et le jeton de session ne sont jamais stockés en clair (HMAC avec AUTH_SECRET).
 */

const SESSION_COOKIE = "ttct_session";
const SESSION_HOURS = 12;
const CODE_MINUTES = 10;
const MAX_ATTEMPTS = 5;
/** Au plus 3 codes demandés pour la même adresse sur 10 minutes. */
const MAX_CODES_PER_WINDOW = 3;

export type SessionUser = { id: string; email: string; role: Role };

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

const hmac = (value: string) => createHmac("sha256", env.AUTH_SECRET).update(value).digest("hex");

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Envoie un code si l'adresse est invitée. Ne révèle jamais si elle l'est : la route répond pareil dans tous les cas.
 */
export async function requestLoginCode(rawEmail: string): Promise<void> {
  const email = normalizeEmail(rawEmail);
  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.revokedAt) return;

  const since = new Date(Date.now() - CODE_MINUTES * 60_000);
  const recent = await db.loginCode.count({ where: { email, createdAt: { gte: since } } });
  if (recent >= MAX_CODES_PER_WINDOW) return;

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await db.loginCode.create({
    data: { email, codeHash: hmac(`${email}:${code}`), expiresAt: new Date(Date.now() + CODE_MINUTES * 60_000) },
  });

  await sendMail({
    to: email,
    subject: `Votre code de connexion TTCT Gala : ${code}`,
    text: `Votre code de connexion : ${code}\n\nIl est valable ${CODE_MINUTES} minutes et ne s'utilise qu'une fois.\nSi vous n'êtes pas à l'origine de cette demande, ignorez ce message.`,
  });
}

/** Vérifie le code ; en cas de succès ouvre la session (cookie). Renvoie null si le code est faux, expiré ou épuisé. */
export async function verifyLoginCode(rawEmail: string, rawCode: string): Promise<SessionUser | null> {
  const email = normalizeEmail(rawEmail);
  const code = rawCode.replace(/\D/g, "");

  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.revokedAt || code.length !== 6) return null;

  const entry = await db.loginCode.findFirst({
    where: { email, consumedAt: null, expiresAt: { gt: new Date() }, attempts: { lt: MAX_ATTEMPTS } },
    orderBy: { createdAt: "desc" },
  });
  if (!entry) return null;

  if (!safeEqual(entry.codeHash, hmac(`${email}:${code}`))) {
    await db.loginCode.update({ where: { id: entry.id }, data: { attempts: { increment: 1 } } });
    return null;
  }

  // Usage unique : seul le premier appel qui marque le code comme consommé gagne.
  const claimed = await db.loginCode.updateMany({ where: { id: entry.id, consumedAt: null }, data: { consumedAt: new Date() } });
  if (claimed.count === 0) return null;

  const token = randomBytes(32).toString("hex");
  await db.$transaction([
    db.session.create({ data: { tokenHash: hmac(token), userId: user.id, expiresAt: new Date(Date.now() + SESSION_HOURS * 3_600_000) } }),
    db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
  ]);

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
  return { id: user.id, email: user.email, role: user.role };
}

/** Utilisateur de la session en cours, ou null. Une invitation révoquée ou une session expirée ne passe pas. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({ where: { tokenHash: hmac(token) }, include: { user: true } });
  if (!session || session.expiresAt <= new Date() || session.user.revokedAt) return null;
  return { id: session.user.id, email: session.user.email, role: session.user.role };
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { tokenHash: hmac(token) } });
  store.delete(SESSION_COOKIE);
}

/**
 * Garde des routes serveur : renvoie l'utilisateur, ou une réponse 401/403 à retourner telle quelle.
 *   const auth = await requireRole("ADMIN");
 *   if (auth instanceof Response) return auth;
 */
export async function requireRole(...roles: Role[]): Promise<SessionUser | Response> {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  if (!roles.includes(user.role)) return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  return user;
}
