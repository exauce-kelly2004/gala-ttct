import { z } from "zod";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { normalizeEmail, requireRole } from "@/server/auth";
import { sendMail } from "@/server/mail";

type InvitationRow = { email: string; role: "ADMIN" | "STAFF"; invitedAt: string; status: "PENDING" | "ACTIVE" };

async function listInvitations(): Promise<InvitationRow[]> {
  const users = await db.user.findMany({ where: { revokedAt: null }, orderBy: { createdAt: "asc" } });
  return users.map((u) => ({ email: u.email, role: u.role, invitedAt: u.createdAt.toISOString(), status: u.lastLoginAt ? "ACTIVE" : "PENDING" }));
}

/** Liste de l'équipe. Réservé aux ADMIN. */
export async function GET() {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;
  return Response.json(await listInvitations(), { headers: { "Cache-Control": "no-store" } });
}

const inviteBody = z.object({ email: z.string().trim().email().max(254), role: z.enum(["ADMIN", "STAFF"]) });

/** Invite une adresse. Réservé aux ADMIN. 409 si l'adresse est déjà invitée. */
export async function POST(request: Request) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;

  const parsed = inviteBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_INPUT" }, { status: 400 });

  const email = normalizeEmail(parsed.data.email);
  const existing = await db.user.findUnique({ where: { email } });
  if (existing && !existing.revokedAt) return Response.json({ error: "ALREADY_INVITED" }, { status: 409 });

  if (existing) {
    // Adresse précédemment révoquée : on la réactive avec le nouveau rôle.
    await db.user.update({ where: { id: existing.id }, data: { role: parsed.data.role, revokedAt: null, lastLoginAt: null, invitedById: auth.id } });
  } else {
    await db.user.create({ data: { email, role: parsed.data.role, invitedById: auth.id } });
  }

  const roleLabel = parsed.data.role === "ADMIN" ? "administrateur" : "personnel de contrôle";
  try {
    await sendMail({
      to: email,
      subject: "Invitation à l'espace TTCT Gala 2026",
      text: `Vous avez été invité(e) comme ${roleLabel} sur l'espace réservé du Gala TTCT 2026.\n\nConnectez-vous avec cette adresse e-mail : ${env.APP_URL}/espace/connexion\nUn code de connexion vous sera envoyé à chaque fois, sans mot de passe.`,
    });
  } catch (error) {
    // L'invitation est enregistrée même si l'e-mail n'est pas parti : l'invité peut quand même se connecter.
    console.error("[team] e-mail d'invitation non envoyé", error);
  }

  return Response.json(await listInvitations());
}

const revokeBody = z.object({ email: z.string().trim().email().max(254) });

/** Retire l'accès et ferme les sessions de la personne. Réservé aux ADMIN. */
export async function DELETE(request: Request) {
  const auth = await requireRole("ADMIN");
  if (auth instanceof Response) return auth;

  const parsed = revokeBody.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_INPUT" }, { status: 400 });

  const email = normalizeEmail(parsed.data.email);
  if (email === auth.email) return Response.json({ error: "CANNOT_REVOKE_SELF" }, { status: 400 });

  const target = await db.user.findUnique({ where: { email } });
  if (target && !target.revokedAt) {
    await db.$transaction([
      db.user.update({ where: { id: target.id }, data: { revokedAt: new Date() } }),
      db.session.deleteMany({ where: { userId: target.id } }),
    ]);
  }
  return Response.json(await listInvitations());
}
