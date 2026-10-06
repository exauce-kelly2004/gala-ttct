import { z } from "zod";
import { requestLoginCode } from "@/server/auth";

const body = z.object({ email: z.string().trim().email().max(254) });

/** Demande d'un code. Réponse identique que l'adresse soit invitée ou non. */
export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "INVALID_EMAIL" }, { status: 400 });

  try {
    await requestLoginCode(parsed.data.email);
  } catch (error) {
    // L'échec d'envoi est journalisé, mais la réponse reste la même : on ne révèle rien sur la liste des invités.
    console.error("[auth] envoi du code impossible", error);
  }
  return Response.json({ ok: true });
}
