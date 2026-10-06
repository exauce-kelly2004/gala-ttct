import { timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import { sendDueReminders } from "@/server/reminders";

export const maxDuration = 60;

/**
 * Appelée chaque jour par la tâche programmée de l'hébergeur (voir vercel.json), jamais par un visiteur :
 * sans le bon secret dans l'en-tête Authorization, la route répond 401 et n'envoie rien.
 */
export async function GET(request: Request) {
  const expected = env.CRON_SECRET ? Buffer.from(`Bearer ${env.CRON_SECRET}`) : null;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  if (!expected || expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  return Response.json(await sendDueReminders());
}
