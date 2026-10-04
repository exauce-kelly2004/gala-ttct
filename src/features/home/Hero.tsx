import type { CSSProperties } from "react";
import { LuArrowRight, LuMapPin, LuShirt } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Motif, MotifBand, Rosace } from "@/components/motifs/Motif";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { event } from "@/config/event";
import { lowestPrice } from "@/config/passes";
import { formatAmount } from "@/lib/format";
import { Countdown } from "./Countdown";
import { WovenCloth } from "./WovenCloth";

/**
 * Hero en affiche culturelle : blason sur rosace qui se trace, titre monumental, bandeau du thème,
 * date, réservation, puis l'étoffe tissée (plusieurs lés, un seul tissu) et le compte à rebours.
 * Mobile : une colonne, le bouton de réservation arrive avant les visuels.
 */
export function Hero() {
  return (
    <section data-tone="dark" aria-labelledby="hero-title" className="relative overflow-hidden bg-brun bg-grain text-(--fg)">
      {/* Lisières textiles latérales (desktop) */}
      <div aria-hidden className="absolute inset-y-0 left-0 hidden w-10 border-r border-terre/60 bg-brun-soft text-terre/70 xl:block">
        <Motif name="rosaces" id="hero-side-l" scale={0.42} />
      </div>
      <div aria-hidden className="absolute inset-y-0 right-0 hidden w-10 border-l border-terre/60 bg-brun-soft text-terre/70 xl:block">
        <Motif name="rosaces" id="hero-side-r" scale={0.42} />
      </div>

      <Container size="wide" className="relative pb-14 pt-28 sm:pt-32 lg:pb-20 lg:pt-36 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-10">
          {/* Texte */}
          <div className="relative flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <Rosace
              rings={6}
              draw
              className="pointer-events-none absolute left-1/2 top-[-4.5rem] size-[22rem] -translate-x-1/2 text-terre/40 sm:size-[28rem] lg:left-[-6rem] lg:top-[-6rem] lg:translate-x-0"
            />

            <p className="relative text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-sable animate-rise sm:text-[0.72rem]">
              {event.organizer} présente
            </p>

            <Logo variant="emblem" width={128} priority className="relative mt-7 w-24 animate-rise [animation-delay:120ms] sm:w-28 lg:w-32" />

            <h1 id="hero-title" className="relative mt-6 flex flex-col items-center lg:items-start">
              <span className="font-display text-[clamp(1.9rem,7vw,3.2rem)] font-light uppercase leading-none tracking-[0.1em] text-creme animate-rise [animation-delay:240ms]">
                Soirée de
              </span>
              <span className="-mt-1 flex overflow-hidden pb-[0.04em] font-display text-[clamp(7rem,34vw,13.5rem)] font-black uppercase leading-[0.8] tracking-[0.01em]">
                {"Gala".split("").map((letter, i) => (
                  <span key={i} className="letter-reveal" style={{ "--letter": i } as CSSProperties}>
                    {letter}
                  </span>
                ))}
              </span>
            </h1>

            {/* Bandeau du thème : les extrémités en zigzag s'ouvrent depuis le centre */}
            <div className="relative mt-7 flex w-full max-w-xl items-stretch animate-rise [animation-delay:460ms]">
              <div aria-hidden className="side-reveal relative w-8 origin-right bg-rouille text-brun/60 sm:w-12">
                <Motif name="zigzag" id="hero-theme-l" scale={0.5} className="absolute inset-0" />
              </div>
              <p className="flex flex-1 items-center justify-center bg-orange px-4 py-3 text-brun">
                <span className="font-display text-[clamp(1.45rem,6vw,2.25rem)] font-black uppercase leading-none">{event.theme}</span>
              </p>
              <div aria-hidden className="side-reveal relative w-8 origin-left bg-rouille text-brun/60 sm:w-12">
                <Motif name="zigzag" id="hero-theme-r" scale={0.5} className="absolute inset-0" />
              </div>
            </div>

            {/* Date */}
            <p className="relative mt-7 flex items-center gap-4 animate-rise [animation-delay:560ms] sm:gap-5">
              <span className="font-display text-[clamp(4.5rem,18vw,6.5rem)] font-black leading-[0.8] text-orange">19</span>
              <span aria-hidden className="h-16 w-[3px] bg-terre sm:h-20" />
              <span className="text-left font-display text-[clamp(1.9rem,7.5vw,2.75rem)] font-black uppercase leading-[0.88]">
                Décembre
                <br />
                <span className="text-creme">2026</span>
              </span>
            </p>

            <ul className="relative mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-creme animate-rise [animation-delay:640ms] lg:justify-start">
              <li className="flex items-center gap-2">
                <LuMapPin className="size-4 text-orange" aria-hidden />
                {event.city}
              </li>
              <li className="flex items-center gap-2">
                <LuShirt className="size-4 text-orange" aria-hidden />
                {event.dressCode}
              </li>
            </ul>

            <div className="relative mt-9 flex w-full flex-col items-center gap-3 animate-rise [animation-delay:740ms] sm:w-auto sm:flex-row sm:gap-5">
              <Button href="#pass" size="lg" className="w-full sm:w-auto">
                Réserver mon pass
                <LuArrowRight className="size-4" aria-hidden />
              </Button>
              <span className="text-sm text-sable">
                À partir de <strong className="font-semibold text-ivoire">{formatAmount(lowestPrice)} FCFA</strong>
              </span>
            </div>
          </div>

          {/* L'étoffe : plusieurs lés différents cousus en un seul tissu */}
          <figure className="flex flex-col lg:col-span-5">
            <WovenCloth id="hero-cloth" className="h-64 sm:h-80 lg:h-auto lg:min-h-[34rem] lg:flex-1" />
            <figcaption className="mt-4 flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-sable">
              <span aria-hidden className="h-px flex-1 bg-terre" />
              Plusieurs cultures, un seul tissu
              <span aria-hidden className="h-px flex-1 bg-terre" />
            </figcaption>
          </figure>
        </div>

        {/* Compte à rebours */}
        <div className="mt-14 flex flex-col items-center border-t border-(--line) pt-10 lg:mt-16">
          <p className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-orange">Le gala commence dans</p>
          <Countdown target={event.date} />
          {event.startTime && <p className="mt-5 text-xs text-sable">Samedi 19 décembre, début à {event.startTime}</p>}
        </div>
      </Container>

      <MotifBand id="hero-band" />
    </section>
  );
}
