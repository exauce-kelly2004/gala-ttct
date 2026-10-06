import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ETicket } from "@/features/ticketing/ETicket";
import { getOrder } from "@/server/orders";

/**
 * Page d'impression des billets : sert uniquement à fabriquer le PDF côté serveur (src/server/pdf.ts).
 * Elle affiche le MÊME composant que le billet vu par le client, donc le PDF est fidèle au design.
 * Une page A5 par billet, fond du billet, sans en-tête ni pied de page du site.
 */
export const metadata: Metadata = { title: "Billets", robots: { index: false, follow: false } };

export default async function PrintPage({ params, searchParams }: PageProps<"/impression/[reference]">) {
  const { reference } = await params;
  const { billet } = await searchParams;
  const order = await getOrder(reference);
  if (!order || order.status !== "PAID") notFound();

  const only = typeof billet === "string" ? billet : null;
  const tickets = order.tickets.filter((t) => t.qrToken && (!only || t.number === only));
  if (tickets.length === 0) notFound();
  const holder = `${order.buyer.firstName} ${order.buyer.lastName}`.trim();

  return (
    <>
      <style>{"@page{size:148mm 210mm;margin:0}html,body{margin:0;background:#3a160e}"}</style>
      {tickets.map((ticket, i) => (
        <section key={ticket.number} data-page className="flex items-center justify-center overflow-hidden bg-[#3a160e]" style={{ width: "148mm", height: "210mm", breakAfter: i < tickets.length - 1 ? "page" : "auto" }}>
          <div data-fit className="flex justify-center" style={{ width: "24rem" }}>
            <ETicket ticket={ticket} holder={holder} id={`billet-${i}`} />
          </div>
        </section>
      ))}
    </>
  );
}
