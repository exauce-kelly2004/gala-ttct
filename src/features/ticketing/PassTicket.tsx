"use client";

import { useState } from "react";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import { Motif } from "@/components/motifs/Motif";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { PassAvailability, PassOffer } from "@/config/passes";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/format";

const availabilityBadge: Record<PassAvailability, { tone: "neutre" | "orange" | "alerte"; label: string }> = {
  available: { tone: "neutre", label: "Disponible" },
  low: { tone: "orange", label: "Dernières places" },
  soldout: { tone: "alerte", label: "Complet" },
};

/** Pass présenté comme un billet : corps + talon détachable daté. La quantité choisie part avec la réservation. */
export function PassTicket({ slug, name, price, currency, seats, perks, availability, maxPerOrder, nameToConfirm, featured }: PassOffer) {
  const [quantity, setQuantity] = useState(1);
  const soldOut = availability === "soldout";
  const badge = availabilityBadge[availability];

  return (
    <article
      data-tone="dark"
      className={cn(
        "group flex h-full flex-col border bg-brun-soft text-(--fg) transition-transform duration-500 ease-gala hover:-translate-y-1",
        featured ? "border-rouille" : "border-terre",
      )}
    >
      <div className={cn("h-5", featured ? "bg-rouille text-brun/70" : "bg-brun text-rouille")}>
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
            <QuantityStepper label={`Quantité, ${name}`} min={1} max={maxPerOrder} defaultValue={1} disabled={soldOut} onChange={setQuantity} />
          </div>
          <p className="flex items-baseline justify-between text-sm text-sable" aria-live="polite">
            <span>Total</span>
            <span className="font-semibold text-ivoire tabular-nums">
              {formatAmount(price * quantity)} {currency}
            </span>
          </p>
          {soldOut ? (
            <Button className="w-full" disabled>
              Complet
            </Button>
          ) : (
            <Button className="w-full" href={`/reserver?pass=${slug}&quantite=${quantity}`}>
              Réserver ce pass
              <LuArrowRight className="size-4" aria-hidden />
            </Button>
          )}
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
