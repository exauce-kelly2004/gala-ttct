import { Rosace } from "@/components/motifs/Motif";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { programme, type ProgrammeItem } from "@/config/programme";

/** Créneaux fantômes : montrent la forme du programme sans inventer son contenu. */
const ghostSlots = 4;

function Timeline({ items }: { items: (ProgrammeItem | null)[] }) {
  return (
    <ol className="relative">
      {/* Le fil : se dessine au défilement */}
      <span aria-hidden className="thread-reveal absolute bottom-3 left-[0.6875rem] top-3 w-0.5 bg-rouille sm:left-[7.6875rem]" />
      {items.map((item, i) => (
        <li key={i} className="relative grid grid-cols-[1.5rem_1fr] gap-x-5 pb-10 last:pb-0 rise-on-view sm:grid-cols-[6rem_1.5rem_1fr] sm:gap-x-4">
          <p className={`col-start-2 font-display text-[2rem] font-black leading-none tabular-nums sm:col-start-1 sm:row-start-1 sm:text-right ${item ? "text-orange" : "text-terre"}`}>
            {item ? item.time : <span aria-hidden className="inline-block h-[3px] w-12 bg-terre align-middle sm:w-14" />}
          </p>
          {/* Nœud du fil : losange */}
          <span aria-hidden className="col-start-1 row-span-3 row-start-1 mt-2 flex justify-center sm:col-start-2">
            <span className={`size-3.5 rotate-45 border-2 ${item ? "border-orange bg-brun-soft" : "border-terre bg-brun-soft"}`} />
          </span>
          <div className="col-start-2 sm:col-start-3 sm:row-start-1">
            <p className={`font-display text-[1.7rem] font-black uppercase leading-none ${item ? "" : "text-sable/60"}`}>{item?.title ?? "À annoncer"}</p>
            {item?.host && <p className="mt-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-orange">{item.host}</p>}
            {item?.description && <p className="mt-2 max-w-prose text-(--fg)/80">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Programme() {
  const ready = programme.length > 0;

  return (
    <Section id="programme" tone="brun-soft" className="overflow-hidden">
      <Rosace rings={7} draw="view" className="pointer-events-none absolute -left-40 top-24 size-[30rem] text-terre/30 lg:-left-28 lg:size-[38rem]" />

      <Container size="wide" className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Eyebrow className="rise-on-view">Programme</Eyebrow>
            <Heading className="mt-4 rise-on-view">Le fil de la soirée</Heading>
            {ready ? (
              <Lead className="mt-6 rise-on-view">De l’accueil à la dernière danse, voici le déroulé de la nuit.</Lead>
            ) : (
              <>
                <Lead className="mt-6 rise-on-view">
                  Le programme est en préparation. Horaires, prestations et artistes seront annoncés ici dès leur confirmation par l’organisateur.
                </Lead>
                <p className="mt-8 inline-flex items-center gap-3 border border-(--line) px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-orange rise-on-view">
                  <span aria-hidden className="size-2 rotate-45 bg-orange" />
                  Annonce à venir
                </p>
              </>
            )}
          </div>

          <div className="lg:col-span-7 lg:pt-4">
            <Timeline items={ready ? programme : Array.from({ length: ghostSlots }, () => null)} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
