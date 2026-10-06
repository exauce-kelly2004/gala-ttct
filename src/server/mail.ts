import "server-only";
import { env } from "@/lib/env";

type Mail = { to: string; subject: string; text: string; html?: string; attachments?: { filename: string; content: Buffer }[] };

/**
 * Envoie un e-mail via Resend (API HTTP, aucune dépendance).
 * En développement, le message est toujours écrit dans le terminal, même si Resend refuse l'envoi (compte sans domaine
 * vérifié) : on peut se connecter sans service d'envoi.
 * Lève une exception si l'envoi échoue : à l'appelant de décider si c'est bloquant.
 */
export async function sendMail({ to, subject, text, html, attachments }: Mail): Promise<void> {
  if (env.NODE_ENV !== "production") console.log(`\n[e-mail simulé] À : ${to}\n${subject}\n${text}\n`);
  if (!env.RESEND_API_KEY) {
    if (env.NODE_ENV === "production") throw new Error("RESEND_API_KEY manquante");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to, subject, text, html, attachments: attachments?.map((a) => ({ filename: a.filename, content: a.content.toString("base64") })) }),
  });
  if (!res.ok) throw new Error(`Resend a refusé l'envoi (${res.status}) : ${await res.text()}`);
}
