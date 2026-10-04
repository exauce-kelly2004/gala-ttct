import { LuCalendarDays, LuClock, LuMapPin, LuQrCode } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Motif } from "@/components/motifs/Motif";
import { Badge } from "@/components/ui/Badge";
import { event } from "@/config/event";
import type { Ticket, TicketStatus } from "@/features/checkout/order";

const statusBadge: Record<TicketStatus, { tone: "neutre" | "valide" | "alerte" | "orange"; label: string }> = {
  PENDING: { tone: "orange", label: "En attente" },
  VALID: { tone: "valide", label: "Valide" },
  USED: { tone: "neutre", label: "Utilisé" },
  CANCELLED: { tone: "alerte", label: "Annulé" },
};

/**
 * Billet électronique affiché après paiement. Le QR code n'est PAS généré ici :
 * le back-end fournit `ticket.qrCode` (URL ou data URL) ; à défaut, un emplacement réservé l'annonce.
 */
export function ETicket({ ticket, holder, id }: { ticket: Ticket; holder: string; id: string }) {
  const badge = statusBadge[ticket.status];

  return (
    <article
      data-tone="dark"
      aria-label={`Billet ${ticket.number}`}
      className="flex w-full max-w-sm flex-col border border-terre bg-brun-soft text-(--fg) [print-color-adjust:exact] print:break-inside-avoid"
    >
      <div aria-hidden className="h-5 bg-brun text-rouille">
        <Motif name="losanges" id={`${id}-top`} scale={0.625} />
      </div>

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
            <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">Titulaire</dt>
            <dd className="mt-1 font-semibold">{holder}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">
              <LuCalendarDays className="size-3.5" aria-hidden />
              Date
            </dt>
            <dd className="mt-1 font-semibold">19 · 12 · 2026</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">
              <LuClock className="size-3.5" aria-hidden />
              Heure
            </dt>
            <dd className="mt-1 font-semibold">{event.startTime ?? "À confirmer"}</dd>
          </div>
          <div className="col-span-2">
            <dt className="flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">
              <LuMapPin className="size-3.5" aria-hidden />
              Lieu
            </dt>
            <dd className="mt-1 font-semibold">{event.venue ? `${event.venue}, ${event.city}` : `${event.city} · adresse à confirmer`}</dd>
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
          {ticket.qrCode ? (
            // eslint-disable-next-line @next/next/no-img-element -- image fournie par le back-end (data URL ou URL signée)
            <img src={ticket.qrCode} alt={`QR code du billet ${ticket.number}`} className="size-full object-contain [image-rendering:pixelated]" />
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
        <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-sable">Numéro de billet</p>
        <p className="mt-1 font-mono text-[0.95rem] font-semibold tracking-[0.06em] text-ivoire">{ticket.number}</p>
        <p className="mt-3 max-w-[16rem] text-center text-xs text-sable">À présenter à l’entrée, sur téléphone ou imprimé. Ne partagez pas ce billet.</p>
      </div>

      <div aria-hidden className="h-3 bg-rouille text-brun/60">
        <Motif name="zigzag" id={`${id}-bottom`} scale={0.4} />
      </div>
    </article>
  );
}
