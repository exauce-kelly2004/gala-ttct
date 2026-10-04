import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { MotifBand, Rosace } from "@/components/motifs/Motif";
import { event } from "@/config/event";
import { lowestPrice } from "@/config/passes";
import { formatAmount } from "@/lib/format";
import beninPluriel from "../../../public/illustrations/benin-pluriel.webp";

export const metadata: Metadata = { title: "Image de partage · Gala TTCT", robots: { index: false } };

/**
 * Image de partage (1200 × 630) : capturée dans src/app/opengraph-image.jpg.
 * Page outil, non publiée en production.
 */
export default function PartagePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex flex-1 justify-center bg-[#1a0704] p-10">
      <article id="partage" data-tone="dark" className="relative flex h-[630px] w-[1200px] shrink-0 flex-col overflow-hidden bg-brun bg-grain text-ivoire">
        <MotifBand id="og-top" reveal={false} />
        <div className="relative flex flex-1 items-center px-16">
          <Rosace rings={7} className="pointer-events-none absolute -left-40 -top-24 size-[620px] text-terre/30" />
          <div className="relative flex-1">
            <Logo variant="emblem" width={92} className="w-[92px]" />
            <p className="mt-5 font-display text-[40px] font-light uppercase leading-none tracking-[0.1em] text-creme">Soirée de</p>
            <p className="font-display text-[150px] font-black uppercase leading-[0.8]">Gala</p>
            <p className="mt-5 inline-block bg-orange px-5 py-2.5 font-display text-[34px] font-black uppercase leading-none text-brun">{event.theme}</p>
            <p className="mt-6 font-display text-[40px] font-black uppercase leading-none">
              <span className="text-orange">19</span> décembre 2026 <span className="text-terre">·</span> {event.startTime} <span className="text-terre">·</span> {event.city}
            </p>
            <p className="mt-4 text-[20px] font-semibold uppercase tracking-[0.2em] text-creme">Pass dès {formatAmount(lowestPrice)} FCFA</p>
          </div>
          <Image src={beninPluriel} alt="" className="relative -mb-8 h-[560px] w-auto self-end" preload />
        </div>
      </article>
    </main>
  );
}
