import type { CSSProperties } from "react";
import { LuShirt } from "react-icons/lu";
import { Motif, Rosace } from "@/components/motifs/Motif";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { event } from "@/config/event";

const pillars = [
  { title: "Plusieurs cultures", text: "Les traditions, les tenues et les rythmes du Bénin, du nord au sud." },
  { title: "Un même lieu", text: `Une seule nuit, à ${event.city}, pour les réunir.` },
  { title: "Une même cause", text: `Une soirée au profit ${event.cause}.` },
];

/** Quelques-unes des cultures du Bénin : la liste n'est pas exhaustive et le dit. */
const cultures = ["Fon", "Bariba", "Yoruba", "Peul", "Ditammari", "Dendi", "Adja", "Goun", "Mahi", "Yom", "Lokpa", "Mina"];

export function Intro() {
  return (
    <Section id="le-gala" tone="parchemin" className="overflow-hidden">
      <Motif name="filigrane" id="intro-bg" className="drift-scroll absolute inset-0 text-terre/10" />

      <Container size="wide" className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 lg:pt-4">
            <Eyebrow className="rise-on-view">Le Gala · {event.theme}</Eyebrow>
            <Heading className="mt-4 rise-on-view">
              Plusieurs cultures,
              <br />
              une seule nuit
            </Heading>
            <Lead className="mt-6 rise-on-view">
              {event.organizer} vous invite à une Soirée de Gala placée sous le signe du métissage culturel : les cultures du Bénin réunies dans un même lieu, pour une nuit d’harmonie et
              d’ambiance festive.
            </Lead>

            <ol className="mt-10 divide-y divide-(--line) border-y border-(--line)">
              {pillars.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[3rem_1fr] items-baseline gap-x-4 py-5 rise-on-view sm:grid-cols-[4rem_1fr]">
                  <span className="font-display text-[2.6rem] font-black leading-none text-rouille">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-display text-[1.7rem] font-black uppercase leading-none">{p.title}</p>
                    <p className="mt-1.5 text-[0.98rem] text-(--fg)/80">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Tenture : les cultures du Bénin tissées dans une même étoffe */}
          <div className="relative lg:col-span-6">
            <div aria-hidden className="absolute -right-3 -top-3 h-1/3 w-1/2 border-r-2 border-t-2 border-rouille sm:-right-4 sm:-top-4" />
            <div data-tone="dark" className="losange-reveal relative overflow-hidden bg-brun bg-grain text-(--fg)">
              <div aria-hidden className="h-5 text-rouille">
                <Motif name="losanges" id="tenture-top" scale={0.625} />
              </div>
              <div aria-hidden className="h-1.5 bg-rouille" />

              <div className="relative px-6 pb-10 pt-10 sm:px-10 sm:pt-12">
                <Rosace rings={5} className="pointer-events-none absolute -right-20 -top-16 size-72 text-terre/45 sm:-right-16 sm:size-80" />

                <p className="relative text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-orange">Le Bénin dans toute sa pluralité</p>

                <ul className="relative mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4">
                  {cultures.map((c, i) => (
                    <li key={c} className="flex items-center gap-3 rise-on-view sm:gap-4" style={{ animationRangeStart: `entry ${i * 2}%` } as CSSProperties}>
                      {i > 0 && <span aria-hidden className="size-2 rotate-45 bg-rouille" />}
                      <span
                        className={
                          i % 3 === 0
                            ? "font-display text-[clamp(2.3rem,9vw,3.4rem)] font-black uppercase leading-[1.05] text-ivoire"
                            : i % 3 === 1
                              ? "font-display text-[clamp(2.3rem,9vw,3.4rem)] font-light uppercase leading-[1.05] text-creme"
                              : "font-display text-[clamp(2.3rem,9vw,3.4rem)] font-black uppercase leading-[1.05] text-orange"
                        }
                      >
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="relative mt-5 text-sm text-sable">Et toutes les autres cultures qui font le Bénin.</p>

                <div className="relative mt-10 flex items-start gap-4 border-t border-(--line) pt-6">
                  <LuShirt className="mt-0.5 size-6 shrink-0 text-orange" strokeWidth={1.6} aria-hidden />
                  <p className="text-[0.98rem] leading-relaxed text-(--fg)/90">
                    <strong className="font-semibold text-ivoire">{event.dressCode}.</strong> Venez dans la tenue de votre culture : c’est elle qui fera la beauté du métissage.
                  </p>
                </div>
              </div>

              <div aria-hidden className="h-1.5 bg-rouille" />
              <div aria-hidden className="h-8 bg-brun-soft text-terre">
                <Motif name="entrelacs" id="tenture-bottom" scale={1.15} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
