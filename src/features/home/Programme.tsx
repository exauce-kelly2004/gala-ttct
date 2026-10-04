import { Rosace } from "@/components/motifs/Motif";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { programme } from "@/config/programme";

/**
 * Programme de la soirée : un fil qui se dessine au défilement, des nœuds en losange.
 * La section (et son lien de navigation) n'existe que si le programme est renseigné dans config/programme.ts.
 */
export function Programme() {
  if (programme.length === 0) return null;

  return (
    <Section id="programme" tone="brun-soft" className="overflow-hidden">
      <Rosace rings={7} draw="view" className="pointer-events-none absolute -left-40 top-24 size-[30rem] text-terre/30 lg:-left-28 lg:size-[38rem]" />

      <Container size="wide" className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="rise-on-view">Programme</Eyebrow>
            <Heading className="mt-4 rise-on-view">Le fil de la soirée</Heading>
            <Lead className="mt-6 rise-on-view">De l’accueil à la dernière danse, voici le déroulé de la nuit.</Lead>
          </div>

          <ol className="relative lg:col-span-7 lg:pt-4">
            <span aria-hidden className="thread-reveal absolute bottom-3 left-[0.6875rem] top-3 w-0.5 bg-rouille sm:left-[7.6875rem]" />
            {programme.map((item) => (
              <li key={`${item.time}-${item.title}`} className="relative grid grid-cols-[1.5rem_1fr] gap-x-5 pb-10 last:pb-0 rise-on-view sm:grid-cols-[6rem_1.5rem_1fr] sm:gap-x-4">
                <p className="col-start-2 font-display text-[2rem] font-black leading-none tabular-nums text-orange sm:col-start-1 sm:row-start-1 sm:text-right">{item.time}</p>
                <span aria-hidden className="col-start-1 row-span-3 row-start-1 mt-2 flex justify-center sm:col-start-2">
                  <span className="size-3.5 rotate-45 border-2 border-orange bg-brun-soft" />
                </span>
                <div className="col-start-2 sm:col-start-3 sm:row-start-1">
                  <p className="font-display text-[1.7rem] font-black uppercase leading-none">{item.title}</p>
                  {item.host && <p className="mt-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-orange">{item.host}</p>}
                  {item.description && <p className="mt-2 max-w-prose text-(--fg)/80">{item.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
