import type { IconType } from "react-icons";
import { LuCalendarDays, LuClock, LuDoorOpen, LuMapPin, LuPhone, LuShirt } from "react-icons/lu";
import { Rosace } from "@/components/motifs/Motif";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading } from "@/components/ui/Typography";
import { event } from "@/config/event";
import { formatPhone, telHref } from "@/lib/format";

/** Seules les informations connues sont affichées : une donnée `null` dans event.ts fait disparaître sa ligne. */
type Info = { icon: IconType; label: string; value: string; note?: string };

const infos: Info[] = [
  { icon: LuCalendarDays, label: "Date", value: "Samedi 19 décembre 2026" },
  ...(event.startTime ? [{ icon: LuClock, label: "Horaires", value: event.startTime, note: "Début de la soirée." }] : []),
  { icon: LuMapPin, label: "Lieu", value: event.venue ?? event.city, note: event.venue ? event.city : undefined },
  { icon: LuShirt, label: "Tenue", value: "Traditionnelle", note: "Venez dans la tenue de votre culture." },
  {
    icon: LuDoorOpen,
    label: "Entrée",
    value: "Sur présentation du billet",
    note: "QR code scanné à l’entrée, une seule fois par billet. Sur téléphone ou imprimé.",
  },
];

export function Infos() {
  return (
    <Section id="infos" tone="parchemin" className="overflow-hidden">
      <Container size="wide">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow className="rise-on-view">Infos pratiques</Eyebrow>
            <Heading className="mt-4 rise-on-view">Tout pour venir sereinement</Heading>

            <dl className="mt-10 grid border-t border-(--line) sm:grid-cols-2 sm:gap-x-10">
              {infos.map(({ icon: Icon, label, value, note }) => (
                <div key={label} className="flex gap-4 border-b border-(--line) py-6 rise-on-view">
                  <Icon className="mt-1 size-6 shrink-0 text-rouille" strokeWidth={1.6} aria-hidden />
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-(--fg-muted)">{label}</dt>
                    <dd className="mt-1 font-display text-[1.75rem] font-black uppercase leading-[1.02]">{value}</dd>
                    {note && <dd className="mt-1.5 text-[0.94rem] text-(--fg)/75">{note}</dd>}
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* Contacts : bloc brun, la rosace se trace à l'arrivée */}
          <aside data-tone="dark" aria-labelledby="contact-title" className="relative self-start overflow-hidden bg-brun bg-grain p-7 text-(--fg) sm:p-10 lg:col-span-5 lg:mt-24">
            <Rosace rings={5} draw="view" className="pointer-events-none absolute -bottom-24 -right-24 size-72 text-terre/50" />
            <p className="relative text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-orange">Une question ?</p>
            <h3 id="contact-title" className="relative mt-3 font-display text-[2.4rem] font-black uppercase leading-[0.95]">
              Appelez
              <br />
              l’organisation
            </h3>
            <ul className="relative mt-8 space-y-3">
              {event.contacts.map((phone) => (
                <li key={phone}>
                  <a
                    href={telHref(phone)}
                    className="group flex min-h-14 items-center gap-4 border border-(--line) px-4 transition-colors duration-300 hover:border-orange"
                  >
                    <LuPhone className="size-5 text-orange" aria-hidden />
                    <span className="font-display text-[1.9rem] font-black leading-none tracking-[0.02em] tabular-nums group-hover:text-orange">{formatPhone(phone)}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="relative mt-6 text-sm text-sable">{event.organizer}</p>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
