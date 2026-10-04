import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LuClock, LuMapPin, LuPhone, LuShirt } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Motif, MotifBand, Rosace } from "@/components/motifs/Motif";
import { event } from "@/config/event";
import { passes } from "@/config/passes";
import { formatAmount, formatPhone } from "@/lib/format";
import beninPluriel from "../../../docs/identite/benin-pluriel-photomontage-fondu.png";

export const metadata: Metadata = { title: "Affiche Bénin pluriel · Soirée de Gala TTCT 2026", robots: { index: false } };

/**
 * Affiche « Bénin pluriel », format portrait 2:3 (1080 × 1620 px, exportée en x2).
 * Reprend toutes les informations de l'affiche d'origine (src/app/affiche) + l'horaire,
 * avec le photomontage en pièce maîtresse. Page outil, non publiée en production.
 */
export default function AfficheBeninPlurielPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex flex-1 items-start justify-center bg-[#1a0704] p-10">
      <article id="affiche" data-tone="dark" className="relative flex h-[1620px] w-[1080px] shrink-0 flex-col overflow-hidden bg-brun bg-grain text-ivoire">
        <MotifBand id="abp-top" reveal={false} />

        <div className="relative flex min-h-0 flex-1">
          {/* Lisières textiles latérales */}
          <div aria-hidden className="relative z-10 w-12 shrink-0 border-r border-terre bg-brun-soft text-terre">
            <Motif name="rosaces" id="abp-side-l" scale={0.5} />
          </div>

          <div className="relative flex min-w-0 flex-1 flex-col">
            {/* ===== Bénin pluriel, fondu dans l'affiche ===== */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* Halo chaud et anneaux du soleil qui traversent la carte */}
              <div className="absolute right-[20px] top-[40px] size-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,114,47,0.38),rgba(200,114,47,0)_68%)]" />
              <Rosace rings={9} className="absolute right-[-280px] top-[-300px] size-[1080px] text-terre/45" />
              <Image
                src={beninPluriel}
                alt=""
                unoptimized
                preload
                className="absolute right-[-58px] top-[6px] h-[1110px] w-auto max-w-none [mask-image:linear-gradient(to_bottom,black_72%,transparent_96%)]"
              />
              {/* Fondu vers la gauche : le titre se pose sur la carte sans rupture */}
              <div className="absolute inset-y-0 left-0 w-[520px] bg-[linear-gradient(to_right,var(--color-brun)_45%,transparent)] opacity-80" />
            </div>

            {/* ===== Partie haute : titre à gauche, Bénin pluriel à droite ===== */}
            <div className="relative h-[900px]">
              <div className="relative flex w-[540px] flex-col items-start pl-12 pt-10">
                <Logo variant="emblem" width={104} className="w-[104px]" />
                <p className="mt-6 font-display text-[50px] font-light [text-shadow:0_4px_20px_rgba(20,4,2,0.7)] uppercase leading-none tracking-[0.1em] text-creme">Soirée de</p>
                <h1 className="-ml-1 mt-1 font-display text-[236px] font-black uppercase leading-[0.8] tracking-[0.01em] [text-shadow:0_12px_40px_rgba(20,4,2,0.75)]">Gala</h1>
                <p className="mt-5 text-[20px] font-semibold uppercase tracking-[0.32em] text-creme">La Team Télé Contre Télé</p>

                {/* Thème */}
                <div className="mt-8 flex w-[500px] items-stretch">
                  <div aria-hidden className="relative w-10 bg-rouille text-brun/60">
                    <Motif name="zigzag" id="abp-theme-l" scale={0.6} className="absolute inset-0" />
                  </div>
                  <p className="flex flex-1 items-center justify-center whitespace-nowrap bg-orange px-3 py-3 font-display text-[35px] font-black uppercase leading-none text-brun">
                    {event.theme}
                  </p>
                  <div aria-hidden className="relative w-10 bg-rouille text-brun/60">
                    <Motif name="zigzag" id="abp-theme-r" scale={0.6} className="absolute inset-0" />
                  </div>
                </div>

                {/* Date */}
                <div className="mt-8 flex items-center gap-6">
                  <span className="font-display text-[176px] font-black leading-[0.78] text-orange">19</span>
                  <span aria-hidden className="h-[150px] w-[3px] bg-terre" />
                  <span className="flex flex-col font-display font-black uppercase">
                    <span className="text-[62px] leading-[0.88]">Décembre</span>
                    <span className="text-[62px] leading-[0.88] text-creme">2026</span>
                    <span className="mt-2.5 flex items-center gap-2.5 text-[34px] leading-none">
                      Samedi
                      <span aria-hidden className="size-2 rotate-45 bg-orange" />
                      <LuClock className="size-7 text-orange" strokeWidth={2.4} aria-hidden />
                      {event.startTime}
                    </span>
                  </span>
                </div>

                <p className="mt-8 max-w-[430px] font-display text-[34px] font-light uppercase leading-[1.12] tracking-[0.04em] text-creme">{event.tagline}</p>
              </div>
            </div>

            {/* ===== Partie basse : pass, réservation, contacts ===== */}
            <div className="relative z-10 mt-auto px-10 pb-8">
              <div className="grid grid-cols-3 gap-4">
                {passes.map((p, i) => (
                  <div key={p.slug} className={`flex flex-col border bg-brun-soft/92 shadow-[0_18px_40px_rgba(10,2,1,0.45)] ${i === 0 ? "border-rouille" : "border-terre"}`}>
                    <div aria-hidden className={`h-3.5 ${i === 0 ? "bg-rouille text-brun/60" : "bg-brun text-rouille"}`}>
                      <Motif name="losanges" id={`abp-pass-${i}`} scale={0.44} />
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center px-3 pb-4 pt-4 text-center">
                      <p className="font-display text-[29px] font-black uppercase leading-none">{p.name}</p>
                      <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.2em] text-sable">{p.seats > 1 ? `${p.seats} personnes` : "1 personne"}</p>
                      <p className="mt-3 flex items-baseline gap-2">
                        <span className="font-display text-[60px] font-black leading-none text-orange">{formatAmount(p.price)}</span>
                        <span className="text-[15px] font-bold uppercase tracking-[0.16em] text-sable">FCFA</span>
                      </p>
                    </div>
                    <div className="border-t-2 border-dashed border-brun bg-rouille py-1.5 text-center font-display text-[19px] font-black uppercase leading-none text-brun">
                      19 · 12 · 2026
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-col items-center">
                <p className="bg-ivoire px-10 py-3.5 font-display text-[44px] font-black uppercase leading-none text-brun">Réservez vos places dès maintenant</p>
                <p className="mt-6 flex items-center gap-4 font-display text-[50px] font-black leading-none tracking-[0.02em]">
                  <LuPhone className="size-10 text-orange" strokeWidth={2.2} aria-hidden />
                  {formatPhone(event.contacts[0])}
                  <span className="text-terre">/</span>
                  {formatPhone(event.contacts[1])}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-5 text-[19px] font-semibold uppercase tracking-[0.2em] text-creme">
                <span aria-hidden className="h-px flex-1 bg-terre" />
                <span className="flex items-center gap-2.5">
                  <LuMapPin className="size-5 text-orange" aria-hidden />
                  {event.city}
                </span>
                <span aria-hidden className="size-2 rotate-45 bg-orange" />
                <span className="flex items-center gap-2.5">
                  <LuShirt className="size-5 text-orange" aria-hidden />
                  {event.dressCode}
                </span>
                <span aria-hidden className="h-px flex-1 bg-terre" />
              </div>
            </div>
          </div>

          <div aria-hidden className="relative z-10 w-12 shrink-0 border-l border-terre bg-brun-soft text-terre">
            <Motif name="rosaces" id="abp-side-r" scale={0.5} />
          </div>
        </div>

        <MotifBand id="abp-bottom" reveal={false} className="rotate-180" />
      </article>
    </main>
  );
}
