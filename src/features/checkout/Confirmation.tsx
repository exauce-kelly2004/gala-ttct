"use client";

import { useEffect, useState } from "react";
import { LuArrowLeft, LuCircleCheck, LuDownload, LuImageDown, LuMail, LuPrinter } from "react-icons/lu";
import { Rosace } from "@/components/motifs/Motif";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { event } from "@/config/event";
import { ETicket } from "@/features/ticketing/ETicket";
import { formatAmount } from "@/lib/format";
import { downloadTicketPng, downloadTicketsPdf } from "@/features/ticketing/download";
import { getOrder, IS_DEMO } from "./api";
import type { Order } from "./order";

type State = { status: "loading" } | { status: "missing" } | { status: "ready"; order: Order };

export function Confirmation({ reference }: { reference: string | null }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const order = reference ? await getOrder(reference) : null;
      if (!cancelled) setState(order ? { status: "ready", order } : { status: "missing" });
    })();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const run = async (job: () => Promise<void>) => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await job();
    } catch {
      setDownloadError("Le téléchargement a échoué. Utilisez « Imprimer mes billets » pour enregistrer en PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const ticketEls = () => (state.status === "ready" ? state.order.tickets.map((_, i) => document.getElementById(`billet-${i}`)!) : []);

  if (state.status === "loading") {
    return (
      <Section className="grid min-h-[70svh] place-items-center pt-32">
        <div className="flex flex-col items-center gap-4 text-sable" role="status">
          <Rosace rings={4} draw className="size-20 text-orange" />
          Chargement de votre réservation
        </div>
      </Section>
    );
  }

  if (state.status === "missing") {
    return (
      <Section className="pt-36">
        <Container size="narrow" className="text-center">
          <h1 className="font-display text-[clamp(2.4rem,9vw,4rem)] font-black uppercase leading-none">Réservation introuvable</h1>
          <p className="mx-auto mt-5 max-w-md text-sable">Le lien est peut-être incomplet. Vos billets restent disponibles dans l’e-mail de confirmation.</p>
          <Button href="/" variant="secondary" className="mt-8">
            <LuArrowLeft className="size-4" aria-hidden />
            Retour à l’accueil
          </Button>
        </Container>
      </Section>
    );
  }

  const { order } = state;
  const holder = `${order.buyer.firstName} ${order.buyer.lastName}`.trim();
  const pdfTickets = order.tickets.filter((t) => t.pdfUrl);

  return (
    <>
      {/* Ouverture : la rosace se trace autour du sceau de validation */}
      <section data-tone="dark" className="relative overflow-hidden bg-brun bg-grain pb-14 pt-32 text-(--fg) sm:pt-40 print:hidden">
        <Container size="narrow" className="relative flex flex-col items-center text-center">
          <div className="relative grid size-40 place-items-center">
            <Rosace rings={5} draw className="absolute inset-0 text-terre" />
            <LuCircleCheck className="relative size-14 text-orange animate-rise [animation-delay:900ms]" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-orange">Merci {order.buyer.firstName}</p>
          <h1 className="mt-3 font-display text-[clamp(2.8rem,11vw,5rem)] font-black uppercase leading-[0.9]">Réservation confirmée</h1>
          <p className="mt-5 text-(--fg)/85">
            <LuMail className="-mt-0.5 mr-2 inline size-4 text-orange" aria-hidden />
            Vos billets ont été envoyés à <strong className="font-semibold text-ivoire">{order.buyer.email}</strong>.
          </p>
          {IS_DEMO && (
            <p className="mt-6 border border-orange/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange">
              Démonstration : aucun paiement réel, aucun e-mail envoyé
            </p>
          )}
        </Container>
      </section>

      <Section tone="brun-soft" className="py-14 sm:py-20">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Récapitulatif */}
            <div className="lg:col-span-4 print:hidden">
              <div className="border border-terre bg-brun p-6 lg:sticky lg:top-28">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sable">Commande</p>
                  <Badge tone="valide">{order.status === "PAID" ? "Payée" : order.status === "PENDING" ? "En attente" : "Annulée"}</Badge>
                </div>
                <p className="mt-2 font-mono text-lg font-semibold tracking-[0.06em]">{order.reference}</p>
                <ul className="mt-5 space-y-2 border-t border-(--line) pt-5 text-sm">
                  {order.lines.map((l) => (
                    <li key={l.slug} className="flex justify-between gap-4">
                      <span>
                        {l.quantity} <span className="text-sable">×</span> {l.name}
                      </span>
                      <span className="tabular-nums">{formatAmount(l.price * l.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 flex items-baseline justify-between border-t border-(--line) pt-5">
                  <span className="text-sm text-sable">Total payé</span>
                  <span className="font-display text-[2.2rem] font-black leading-none text-orange tabular-nums">
                    {formatAmount(order.total)} <span className="text-sm text-sable">{order.currency}</span>
                  </span>
                </p>
                <p className="mt-4 text-xs text-sable">
                  {event.name} · {event.dateLabel} · {event.city}
                </p>

                <div className="mt-6 grid gap-3">
                  <Button onClick={() => void run(async () => downloadTicketsPdf(ticketEls(), `billets-gala-ttct-${order.reference}`))} disabled={downloading} className="w-full">
                    <LuDownload className="size-4" aria-hidden />
                    {downloading ? "Préparation…" : order.tickets.length > 1 ? "Télécharger mes billets (PDF)" : "Télécharger mon billet (PDF)"}
                  </Button>
                  {pdfTickets.map((t) => (
                    <Button key={t.number} href={t.pdfUrl!} variant="secondary" className="w-full" download>
                      <LuDownload className="size-4" aria-hidden />
                      PDF officiel · {t.number}
                    </Button>
                  ))}
                  <Button onClick={() => window.print()} variant="secondary" className="w-full">
                    <LuPrinter className="size-4" aria-hidden />
                    Imprimer mes billets
                  </Button>
                  {downloadError && (
                    <p role="alert" className="text-sm font-medium text-alerte">
                      {downloadError}
                    </p>
                  )}
                  <Button href="/" variant="secondary" className="w-full">
                    Retour à l’accueil
                  </Button>
                </div>
              </div>
            </div>

            {/* Billets */}
            <div className="lg:col-span-8">
              <h2 className="font-display text-[2rem] font-black uppercase leading-none print:hidden">
                {order.tickets.length > 1 ? `Vos ${order.tickets.length} billets` : "Votre billet"}
              </h2>
              <div className="mt-8 grid justify-items-center gap-8 sm:grid-cols-2 sm:justify-items-start print:mt-0 print:grid-cols-2">
                {order.tickets.map((t, i) => (
                  <div key={t.number} className="flex w-full max-w-sm flex-col gap-3 print:max-w-none">
                    <ETicket ticket={t} holder={holder} id={`billet-${i}`} />
                    <Button
                      variant="secondary"
                      disabled={downloading || !t.qrToken}
                      onClick={() => void run(async () => downloadTicketPng(document.getElementById(`billet-${i}`)!, `billet-${t.number}`))}
                      className="w-full print:hidden"
                    >
                      <LuImageDown className="size-4" aria-hidden />
                      Enregistrer en image
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
