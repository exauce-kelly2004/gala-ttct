import { LuArrowRight, LuCheck } from "react-icons/lu";
import { Motif } from "@/components/motifs/Motif";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatAmount } from "@/lib/format";

export type PassAvailability = "available" | "low" | "soldout";

export type PassTicketProps = {
  /** Identifiant stable (sert aussi aux identifiants des motifs SVG). */
  slug: string;
  name: string;
  /** Prix en unités entières. Viendra de la base de données (Étape back-end). */
  price: number;
  currency: string;
  /** Nombre de personnes couvertes par un pass (Duo = 2). */
  seats: number;
  perks: string[];
  availability: PassAvailability;
  maxPerOrder: number;
  /** Mention tant que le nom métier n'est pas confirmé par l'organisateur. */
  nameToConfirm?: boolean;
};

const availabilityBadge: Record<PassAvailability, { tone: "neutre" | "orange" | "alerte"; label: string }> = {
  available: { tone: "neutre", label: "Disponible" },
  low: { tone: "orange", label: "Dernières places" },
  soldout: { tone: "alerte", label: "Complet" },
};

/** Pass présenté comme un billet : corps + talon détachable daté. */
export function PassTicket({ slug, name, price, currency, seats, perks, availability, maxPerOrder, nameToConfirm }: PassTicketProps) {
  const soldOut = availability === "soldout";
  const badge = availabilityBadge[availability];

  return (
    <article data-tone="dark" className="group flex flex-col border border-terre bg-brun-soft text-(--fg) transition-transform duration-500 ease-gala hover:-translate-y-1">
      <div className="h-5 bg-brun text-rouille">
        <Motif name="losanges" id={`pass-${slug}-top`} scale={0.625} />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-sable">
            Gala TTCT · {seats > 1 ? `${seats} personnes` : "1 personne"}
          </p>
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </div>

        <h3 className="mt-5 font-display text-[2.3rem] font-black uppercase leading-[0.95]">{name}</h3>
        {nameToConfirm && <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-alerte">Nom à confirmer</p>}

        <p className="mt-5 flex items-baseline gap-2">
          <span className="font-display text-[3.6rem] font-black leading-none tabular-nums text-orange">{formatAmount(price)}</span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sable">{currency}</span>
        </p>

        <ul className="mt-6 space-y-2 border-t border-(--line) pt-5">
          {perks.map((perk) => (
            <li key={perk} className="flex items-start gap-2.5 text-[0.94rem] text-(--fg)/85">
              <LuCheck className="mt-1 size-3.5 shrink-0 text-orange" aria-hidden />
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-4 pt-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sable">Quantité</span>
            <QuantityStepper label={`Quantité, ${name}`} max={maxPerOrder} disabled={soldOut} />
          </div>
          <Button className="w-full" disabled={soldOut}>
            {soldOut ? "Complet" : "Réserver ce pass"}
            {!soldOut && <LuArrowRight className="size-4" aria-hidden />}
          </Button>
        </div>
      </div>

      {/* Talon : perforation + date */}
      <div className="relative border-t-2 border-dashed border-brun bg-rouille text-brun">
        <span aria-hidden className="absolute -left-2 -top-2 size-4 rounded-full bg-(--section-bg,var(--color-brun)) bg-grain" />
        <span aria-hidden className="absolute -right-2 -top-2 size-4 rounded-full bg-(--section-bg,var(--color-brun)) bg-grain" />
        <div className="absolute inset-0 text-brun/15">
          <Motif name="zigzag" id={`pass-${slug}-stub`} scale={0.6} />
        </div>
        <p className="relative flex items-center justify-between px-6 py-3 font-display text-[1.35rem] font-black uppercase leading-none">
          <span>19 · 12 · 2026</span>
          <span className="text-[0.95rem] tracking-[0.06em]">Soirée de Gala</span>
        </p>
      </div>
    </article>
  );
}
