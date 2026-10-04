import Image from "next/image";
import { LuShirt } from "react-icons/lu";
import { Motif, Rosace } from "@/components/motifs/Motif";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { event } from "@/config/event";
import beninPluriel from "../../../public/illustrations/benin-pluriel.webp";

const pillars = [
  { title: "Plusieurs cultures", text: "Les traditions, les tenues et les rythmes du Bénin, du nord au sud." },
  { title: "Un même lieu", text: `Une seule nuit, à ${event.city}, pour les réunir.` },
  { title: "Une même cause", text: `Une soirée au profit ${event.cause}.` },
];

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

          {/* Le Bénin pluriel : photomontage dans la carte du pays, sur une planche brune */}
          <figure className="relative lg:col-span-6">
            <div aria-hidden className="absolute -right-3 -top-3 h-1/3 w-1/2 border-r-2 border-t-2 border-rouille sm:-right-4 sm:-top-4" />
            <div data-tone="dark" className="losange-reveal relative overflow-hidden bg-brun bg-grain text-(--fg)">
              <div aria-hidden className="h-5 text-rouille">
                <Motif name="losanges" id="planche-top" scale={0.625} />
              </div>
              <div aria-hidden className="h-1.5 bg-rouille" />

              <div className="relative flex justify-center px-6 pb-8 pt-10 sm:px-10">
                <Rosace rings={6} draw="view" className="pointer-events-none absolute -left-24 bottom-0 size-80 text-terre/40" />
                <Image
                  src={beninPluriel}
                  alt="Photomontage : la carte du Bénin habitée de femmes et d’hommes en tenue traditionnelle moderne, gèlè, foulard, agbada et fila, sur fond de soleil orange."
                  sizes="(min-width: 1024px) 26rem, 80vw"
                  className="relative h-auto w-[84%] max-w-[26rem] drift-scroll"
                />
              </div>

              <figcaption className="relative mx-6 flex items-start gap-4 border-t border-(--line) pb-8 pt-6 sm:mx-10">
                <LuShirt className="mt-0.5 size-6 shrink-0 text-orange" strokeWidth={1.6} aria-hidden />
                <p className="text-[0.98rem] leading-relaxed text-(--fg)/90">
                  <strong className="font-semibold text-ivoire">{event.dressCode}.</strong> Du nord au sud, venez dans la tenue de votre culture : c’est elle qui fera la beauté du
                  métissage.
                </p>
              </figcaption>

              <div aria-hidden className="h-1.5 bg-rouille" />
              <div aria-hidden className="h-8 bg-brun-soft text-terre">
                <Motif name="entrelacs" id="planche-bottom" scale={1.15} />
              </div>
            </div>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
