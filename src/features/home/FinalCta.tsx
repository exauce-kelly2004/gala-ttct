import { LuArrowRight } from "react-icons/lu";
import { Motif } from "@/components/motifs/Motif";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { event } from "@/config/event";
import { lowestPrice } from "@/config/passes";
import { formatAmount } from "@/lib/format";

/** Dernière invitation : grand aplat orange découpé en zigzag, comme une bande de pagne. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative bg-brun-soft">
      <div data-tone="light" className="edge-zigzag-y relative overflow-hidden bg-orange py-24 text-brun sm:py-28">
        <div aria-hidden className="drift-scroll absolute -inset-y-10 inset-x-0 text-brun/[0.08]">
          <Motif name="losanges" id="cta-bg" scale={2.2} />
        </div>
        <Container className="relative flex flex-col items-center text-center">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] rise-on-view">
            {event.dateLabel} · {event.city}
          </p>
          <h2 id="cta-title" className="mt-5 font-display text-[clamp(3.2rem,13vw,7rem)] font-black uppercase leading-[0.86] text-balance rise-on-view">
            Votre place
            <br />
            vous attend
          </h2>
          <p className="mt-6 max-w-md text-[1.05rem] rise-on-view">Plusieurs cultures, une seule nuit, une même cause. Réservez dès maintenant.</p>
          <div className="mt-10 flex w-full flex-col items-center gap-3 rise-on-view sm:w-auto">
            <Button href="#pass" size="lg" variant="dark" className="w-full sm:w-auto">
              Réserver mon pass
              <LuArrowRight className="size-4" aria-hidden />
            </Button>
            <span className="text-sm font-medium">À partir de {formatAmount(lowestPrice)} FCFA</span>
          </div>
        </Container>
      </div>
    </section>
  );
}
