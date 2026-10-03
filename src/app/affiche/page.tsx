import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LuMapPin, LuPhone, LuShirt } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Motif, MotifBand, Rosace } from "@/components/motifs/Motif";

export const metadata: Metadata = {
  title: "Affiche · Soirée de Gala TTCT 2026",
  robots: { index: false },
};

// Informations reprises de l'affiche officielle (docs/references/affiche-gala.jpeg) + thème du gala.
const passes = [
  { name: "Pass Duo V.V.I.P", price: "50 000" },
  { name: "Pass Duo V.I.P", price: "25 000" },
  { name: "Pass Solo", price: "15 000" },
];

/**
 * Affiche de présentation, format portrait 2:3 (1080 × 1620 px, exportée en x2).
 * Page outil, non publiée en production : sert uniquement à générer l'image et le PDF.
 */
export default function AffichePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex flex-1 items-start justify-center bg-[#1a0704] p-10">
      <article
        id="affiche"
        data-tone="dark"
        className="relative flex h-[1620px] w-[1080px] shrink-0 flex-col overflow-hidden bg-brun bg-grain text-ivoire"
      >
        <MotifBand id="aff-top" reveal={false} />

        <div className="relative flex min-h-0 flex-1">
          {/* Lisières textiles latérales */}
          <div aria-hidden className="w-12 shrink-0 border-r border-terre bg-brun-soft text-terre">
            <Motif name="rosaces" id="aff-side-l" scale={0.5} />
          </div>

          <div className="relative flex flex-1 flex-col items-center px-10 pb-8 pt-8 text-center">
            {/* Grande rosace derrière le blason */}
            <Rosace rings={7} className="pointer-events-none absolute left-1/2 top-[-170px] size-[760px] -translate-x-1/2 text-terre/35" />

            <Logo variant="emblem" width={136} priority className="relative w-[136px]" />

            <p className="relative mt-5 font-display text-[56px] font-light uppercase leading-none tracking-[0.1em] text-creme">Soirée de</p>
            <h1 className="relative -mt-1 font-display text-[236px] font-black uppercase leading-[0.8] tracking-[0.01em] text-ivoire">Gala</h1>
            <p className="relative mt-5 text-[25px] font-semibold uppercase tracking-[0.36em] text-creme">La Team Télé Contre Télé</p>

            {/* Thème du gala */}
            <div className="relative mt-8 flex w-full items-stretch">
              <div aria-hidden className="relative w-16 bg-rouille text-brun/60">
                <Motif name="zigzag" id="aff-theme-l" scale={0.7} className="absolute inset-0" />
              </div>
              <div className="flex flex-1 items-center justify-center bg-orange px-6 py-4 text-brun">
                <span className="font-display text-[56px] font-black uppercase leading-none">Le métissage culturel</span>
              </div>
              <div aria-hidden className="relative w-16 bg-rouille text-brun/60">
                <Motif name="zigzag" id="aff-theme-r" scale={0.7} className="absolute inset-0" />
              </div>
            </div>

            {/* Date */}
            <div className="relative mt-8 flex items-center gap-7">
              <span className="font-display text-[160px] font-black leading-[0.8] text-orange">19</span>
              <span aria-hidden className="h-[120px] w-[3px] bg-terre" />
              <span className="text-left font-display text-[70px] font-black uppercase leading-[0.86]">
                Décembre
                <br />
                <span className="text-creme">2026</span>
              </span>
            </div>

            {/* Promesse */}
            <p className="relative mt-9 max-w-[900px] font-display text-[42px] font-light uppercase leading-[1.12] tracking-[0.04em] text-creme">
              Harmonie et ambiance festive culturelle
            </p>

            {/* Pass */}
            <div className="relative mt-10 grid w-full grid-cols-3 gap-4">
              {passes.map((p, i) => (
                <div key={p.name} className="flex flex-col border border-terre bg-brun-soft">
                  <div aria-hidden className="h-3.5 bg-brun text-rouille">
                    <Motif name="losanges" id={`aff-pass-${i}`} scale={0.44} />
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center px-3 pb-4 pt-4">
                    <p className="font-display text-[29px] font-black uppercase leading-none text-ivoire">{p.name}</p>
                    <p className="mt-3 flex items-baseline gap-2">
                      <span className="font-display text-[62px] font-black leading-none text-orange">{p.price}</span>
                      <span className="text-[15px] font-bold uppercase tracking-[0.16em] text-sable">FCFA</span>
                    </p>
                  </div>
                  <div className="border-t-2 border-dashed border-brun bg-rouille py-1.5 font-display text-[19px] font-black uppercase leading-none text-brun">
                    19 · 12 · 2026
                  </div>
                </div>
              ))}
            </div>

            {/* Réservation */}
            <div className="relative mt-10 flex w-full flex-col items-center">
              <p className="bg-ivoire px-10 py-3.5 font-display text-[44px] font-black uppercase leading-none text-brun">
                Réservez vos places dès maintenant
              </p>
              <p className="mt-6 flex items-center gap-4 font-display text-[50px] font-black leading-none tracking-[0.03em] text-ivoire">
                <LuPhone className="size-10 text-orange" strokeWidth={2.2} aria-hidden />
                0197865758
                <span className="text-terre">/</span>
                0196164348
              </p>
            </div>

            {/* Pied */}
            <div className="relative mt-auto flex w-full items-center gap-5 pt-6 text-[20px] font-semibold uppercase tracking-[0.2em] text-creme">
              <span aria-hidden className="h-px flex-1 bg-terre" />
              <span className="flex items-center gap-2.5"><LuMapPin className="size-5 text-orange" aria-hidden />Natitingou</span>
              <span aria-hidden className="size-2 rotate-45 bg-orange" />
              <span className="flex items-center gap-2.5"><LuShirt className="size-5 text-orange" aria-hidden />Code vestimentaire traditionnel</span>
              <span aria-hidden className="h-px flex-1 bg-terre" />
            </div>
          </div>

          <div aria-hidden className="w-12 shrink-0 border-l border-terre bg-brun-soft text-terre">
            <Motif name="rosaces" id="aff-side-r" scale={0.5} />
          </div>
        </div>

        <MotifBand id="aff-bottom" reveal={false} className="rotate-180" />
      </article>
    </main>
  );
}
