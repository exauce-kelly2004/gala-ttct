import "server-only";
import { event } from "@/config/event";
import { db } from "@/lib/db";
import { reminderEmail } from "./emails";
import { sendMail } from "./mail";

/** Le rappel part quand le gala est dans 3 jours ou moins. */
const REMINDER_DAYS = 3;
/** Au plus 40 e-mails par passage de la tâche programmée, pour rester dans le temps imparti. */
const BATCH = 40;

const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeZone: "Africa/Porto-Novo" });

/**
 * Envoie le rappel (une seule fois par commande) aux acheteurs de commandes payées.
 * Appelée chaque jour par la tâche programmée de l'hébergeur (route /api/cron/reminders).
 * `now` ne sert qu'aux tests.
 */
export async function sendDueReminders(now = new Date()): Promise<{ sent: number; failed: number; due: boolean }> {
  const eventDate = new Date(event.date);
  const msLeft = eventDate.getTime() - now.getTime();
  if (msLeft <= 0 || msLeft > REMINDER_DAYS * 86_400_000) return { sent: 0, failed: 0, due: false };

  const orders = await db.order.findMany({
    where: { status: "PAID", reminderSentAt: null },
    include: { tickets: { where: { status: "VALID" }, include: { pass: true }, orderBy: { createdAt: "asc" } } },
    orderBy: { paidAt: "asc" },
    take: BATCH,
  });

  let sent = 0;
  let failed = 0;
  for (const order of orders) {
    if (order.tickets.length === 0) {
      // Rien à rappeler (billets annulés) : on ne la reprend pas à chaque passage
      await db.order.update({ where: { id: order.id }, data: { reminderSentAt: now } });
      continue;
    }
    const where = event.venue ?? event.city;
    try {
      await sendMail({
        to: order.buyerEmail,
        subject: `Rappel : le Gala TTCT, ${event.dateLabel}`,
        ...reminderEmail({
          firstName: order.buyerFirstName,
          reference: order.reference,
          dateText: dateTime.format(eventDate),
          place: where,
          tickets: order.tickets.map((t) => ({ passName: t.pass.name, number: t.number, holders: t.holders })),
        }),
      });
      await db.order.update({ where: { id: order.id }, data: { reminderSentAt: now } });
      sent++;
    } catch (error) {
      // Pas marquée : elle sera retentée au prochain passage
      console.error("[reminders] envoi impossible", order.reference, error);
      failed++;
    }
  }
  return { sent, failed, due: true };
}
