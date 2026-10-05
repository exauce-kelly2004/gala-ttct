import { LuCalendarDays, LuClock, LuMapPin, LuQrCode } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Motif } from "@/components/motifs/Motif";
import { Badge } from "@/components/ui/Badge";
import { event } from "@/config/event";
import type { Ticket, TicketStatus } from "@/features/checkout/order";
import { TicketQr } from "./TicketQr";
import { tierOf } from "./tier";

const statusBadge: Record<TicketStatus, { tone: "neutre" | "valide" | "alerte" | "orange"; label: string }> = {
  PENDING: { tone: "orange", label: "En attente" },
  VALID: { tone: "valide", label: "Valide" },
  USED: { tone: "neutre", label: "Utilisé" },
  CANCELLED: { tone: "alerte", label: "Annulé" },
};

/**
 * Billet électronique affiché après paiement. Le jeton (`ticket.qrToken`) vient du back-end, qui l'enregistre
 * avec le type de pass ; le front en dessine le QR code. Sans jeton, un emplacement réservé l'annonce.
 * L'attribut `id` permet de capturer le billet pour le téléchargement (PNG / PDF).
 */
export function ETicket({ ticket, holder, id }: { ticket: Ticket; holder: string; id: string }) {
  const badge = statusBadge[ticket.status];
  const holders = ticket.holders.length > 0 ? ticket.holders : [holder];
  const tier = tierOf(ticket.passSlug);

  return (
    <article
      id={id}
      data-tone="dark"
      aria-label={`Billet ${ticket.number}`}
      className={`flex w-full max-w-sm flex-col border bg-brun-soft text-(--fg) [print-color-adjust:exact] print:break-inside-avoid ${tier.card}`}
    >
      <div aria-hidden className={`h-5 ${tier.band}`}>
        <Motif name="losanges" id={`${id}-top`} scale={0.625} />
      </div>

      {/* Ruban du type d'accès : se lit d'un coup d'œil, aussi une fois imprimé en noir et blanc */}
      <p className={`px-6 py-1.5 text-center font-display text-[1.25rem] font-black uppercase leading-none tracking-[0.2em] ${tier.ribbon}`}>
        {ticket.passSlug === "solo" ? "Accès Solo" : `Accès ${tier.label}`}
      </p>

      {/* Corps */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="emblem" width={44} className="w-11" />
            <div>
              <p className="font-display text-[1.25rem] font-black uppercase leading-none">{event.name}</p>
              <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-orange">{event.theme}</p>
            </div>
          </div>
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </div>

        <p className="mt-6 font-display text-[2.2rem] font-black uppercase leading-[0.95]">{ticket.passName}</p>
        <p className="mt-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-sable">
          Entrée {ticket.seats > 1 ? `pour ${ticket.seats} personnes` : "pour 1 personne"}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-(--line) pt-5 text-sm">
          <div className="col-span-2">
            <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">{holders.length > 1 ? "Titulaires" : "Titulaire"}</dt>
            {holders.map((name) => (
              <dd key={name} className="mt-1 font-semibold">
                {name}
              </dd>
            ))}
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">
              <LuCalendarDays className="size-3.5" aria-hidden />
              Date
            </dt>
            <dd className="mt-1 font-semibold">19 · 12 · 2026</dd>
          </div>
          {event.startTime && (
            <div>
              <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">
                <LuClock className="size-3.5" aria-hidden />
                Heure
              </dt>
              <dd className="mt-1 font-semibold">{event.startTime}</dd>
            </div>
          )}
          <div className="col-span-2">
            <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">
              <LuMapPin className="size-3.5" aria-hidden />
              Lieu
            </dt>
            <dd className="mt-1 font-semibold">{event.venue ? `${event.venue}, ${event.city}` : event.city}</dd>
          </div>
        </dl>
      </div>

      {/* Perforation */}
      <div aria-hidden className="relative h-0 border-t-2 border-dashed border-brun">
        <span className="absolute -left-2.5 -top-2.5 size-5 rounded-full bg-(--section-bg,var(--color-brun))" />
        <span className="absolute -right-2.5 -top-2.5 size-5 rounded-full bg-(--section-bg,var(--color-brun))" />
      </div>

      {/* Talon : QR code fourni par le back-end */}
      <div className="flex flex-col items-center px-6 pb-6 pt-7">
        <div className="grid size-44 place-items-center bg-ivoire p-3">
          {ticket.qrToken ? (
            <TicketQr token={ticket.qrToken} label={`QR code du billet ${ticket.number}`} />
          ) : (
            <div className="relative grid size-full place-items-center overflow-hidden border-2 border-dashed border-terre/60 text-center text-terre">
              <Motif name="filigrane" id={`${id}-qr`} scale={0.5} className="absolute inset-0 text-terre/15" />
              <div className="relative flex flex-col items-center gap-2 px-3">
                <LuQrCode className="size-8" strokeWidth={1.4} aria-hidden />
                <p className="text-[0.62rem] font-semibold uppercase leading-snug tracking-[0.14em]">QR code délivré après paiement</p>
              </div>
            </div>
          )}
        </div>
        <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sable">Code du billet</p>
        <p className="mt-1 border border-dashed border-terre px-3 py-1.5 font-mono text-[1.15rem] font-semibold tracking-[0.12em] text-ivoire">{ticket.number}</p>
        <p className="mt-3 max-w-[16rem] text-center text-xs text-sable">À présenter à l’entrée, sur téléphone ou imprimé. Si le QR code ne se lit pas, donnez ce code à l’accueil. Ne partagez pas ce billet.</p>
      </div>

      <div aria-hidden className={`h-3 ${tier.foot}`}>
        <Motif name="zigzag" id={`${id}-bottom`} scale={0.4} />
      </div>
    </article>
  );
}
