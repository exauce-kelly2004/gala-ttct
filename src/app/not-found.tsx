import type { Metadata } from "next";
import { LuArrowLeft } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { MotifBand, Rosace } from "@/components/motifs/Motif";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page introuvable · Soirée de Gala TTCT 2026" };

/** Page 404 : le fil s'est rompu, on ramène vers l'accueil. */
export default function NotFound() {
  return (
    <main data-tone="dark" className="relative flex flex-1 flex-col overflow-hidden bg-brun bg-grain text-(--fg)">
      <MotifBand id="nf-top" reveal={false} />
      <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
        <Rosace rings={6} draw className="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 text-terre/35 sm:size-[40rem]" />
        <Logo variant="emblem" width={84} className="relative w-[84px] animate-rise" />
        <p className="relative mt-8 font-display text-[clamp(6rem,30vw,11rem)] font-black leading-[0.8] text-orange animate-rise [animation-delay:120ms]">404</p>
        <h1 className="relative mt-5 font-display text-[clamp(2rem,7vw,3rem)] font-black uppercase leading-none animate-rise [animation-delay:220ms]">Le fil s’est rompu</h1>
        <p className="relative mt-4 max-w-md text-sable animate-rise [animation-delay:320ms]">Cette page n’existe pas ou a été déplacée. La fête, elle, continue sur la page d’accueil.</p>
        <Button href="/" size="lg" className="relative mt-10 animate-rise [animation-delay:420ms]">
          <LuArrowLeft className="size-4" aria-hidden />
          Retour à l’accueil
        </Button>
      </div>
      <MotifBand id="nf-bottom" reveal={false} className="rotate-180" />
    </main>
  );
}
