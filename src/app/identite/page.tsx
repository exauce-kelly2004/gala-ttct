import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LuArrowRight, LuCalendarDays, LuClock, LuMapPin, LuPhone, LuShirt } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Motif, MotifBand, Rosace, type MotifName } from "@/components/motifs/Motif";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { event } from "@/config/event";
import { passes } from "@/config/passes";
import { PassTicket } from "@/features/ticketing/PassTicket";
import { ETicket } from "@/features/ticketing/ETicket";
import { formatPhone } from "@/lib/format";
import beninPluriel from "../../../public/illustrations/benin-pluriel.webp";
import affiche from "../../../docs/affiche/affiche-gala-ttct-2026-benin-pluriel.jpg";

export const metadata: Metadata = { title: "Identité visuelle · Gala TTCT", robots: { index: false } };

const palette = [
  { name: "Brun", hex: "#2A0D08", cls: "bg-brun text-ivoire", role: "Fond dominant" },
  { name: "Brun relevé", hex: "#3A160E", cls: "bg-brun-soft text-ivoire", role: "Billets, blocs" },
  { name: "Terre", hex: "#5E2E16", cls: "bg-terre text-ivoire", role: "Motifs, filets" },
  { name: "Rouille", hex: "#A9531F", cls: "bg-rouille text-brun", role: "Bandes, talons" },
  { name: "Orange", hex: "#C8722F", cls: "bg-orange text-brun", role: "Action, prix" },
  { name: "Parchemin", hex: "#CDB48C", cls: "bg-parchemin text-brun", role: "Sections claires" },
  { name: "Crème", hex: "#D8C09A", cls: "bg-creme text-brun", role: "Logo, accents" },
  { name: "Ivoire", hex: "#E6D3B3", cls: "bg-ivoire text-brun", role: "Texte sur brun" },
];

const motifs: { name: MotifName; title: string; cls: string; scale?: number }[] = [
  { name: "losanges", title: "Losanges", cls: "bg-brun text-rouille" },
  { name: "rosaces", title: "Rosaces", cls: "bg-brun-soft text-terre", scale: 0.8 },
  { name: "entrelacs", title: "Entrelacs", cls: "bg-brun text-terre" },
  { name: "zigzag", title: "Zigzag", cls: "bg-rouille text-brun/70" },
];

function Block({ index, title, children, className }: { index: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-orange">{index}</p>
      <h2 className="mt-2 font-display text-[44px] font-black uppercase leading-none">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

/**
 * Planche d'identité visuelle (1600 px de large), exportée en PNG et PDF dans docs/identite/.
 * Page outil, non publiée en production. Le QR code du billet est un SPÉCIMEN visuel :
 * sur le site, les QR codes réels sont produits par le back-end.
 */
export default function IdentitePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex flex-1 justify-center bg-[#1a0704] p-10">
      <article id="identite" data-tone="dark" className="w-[1600px] shrink-0 bg-brun bg-grain text-ivoire">
        <MotifBand id="id-top" reveal={false} />

        {/* En-tête */}
        <header className="relative flex items-end justify-between overflow-hidden px-20 pb-14 pt-16">
          <Rosace rings={7} className="pointer-events-none absolute -right-40 -top-40 size-[640px] text-terre/30" />
          <div className="relative flex items-center gap-10">
            <Logo variant="full" width={300} className="w-[300px]" />
            <div className="h-40 w-[3px] bg-terre" />
            <div>
              <p className="text-[15px] font-semibold uppercase tracking-[0.34em] text-orange">Identité visuelle</p>
              <h1 className="mt-3 font-display text-[96px] font-black uppercase leading-[0.85]">
                Soirée de Gala
                <br />
                <span className="font-light text-creme">TTCT 2026</span>
              </h1>
            </div>
          </div>
          <div className="relative text-right">
            <p className="inline-block bg-orange px-6 py-3 font-display text-[34px] font-black uppercase leading-none text-brun">{event.theme}</p>
            <p className="mt-4 text-[15px] font-semibold uppercase tracking-[0.24em] text-creme">Tradition contemporaine · Bénin</p>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-x-16 gap-y-20 px-20 pb-20">
          {/* Illustration */}
          <Block index="01 · Visuel clé" title="Le Bénin pluriel" className="col-span-5">
            <div className="relative flex justify-center bg-brun-soft py-10">
              <Image src={beninPluriel} alt="" className="h-[680px] w-auto" />
            </div>
            <p className="mt-5 text-[17px] leading-relaxed text-sable">
              La carte du Bénin habitée de femmes et d’hommes en tenue traditionnelle moderne : gèlè, foulard, agbada, fila. Portraits détourés, étalonnage cuivré commun, coiffe qui sort du cadre.
            </p>
          </Block>

          <div className="col-span-7 flex flex-col gap-20">
            {/* Palette */}
            <Block index="02 · Palette" title="Crème, brun, orange">
              <div className="grid grid-cols-4">
                {palette.map((c) => (
                  <div key={c.hex} className={`flex h-36 flex-col justify-end p-4 ${c.cls}`}>
                    <p className="font-display text-[26px] font-black uppercase leading-none">{c.name}</p>
                    <p className="mt-1.5 text-[12px] font-semibold uppercase tracking-[0.14em]">{c.hex}</p>
                    <p className="mt-0.5 text-[13px] opacity-80">{c.role}</p>
                  </div>
                ))}
              </div>
            </Block>

            {/* Typographie */}
            <Block index="03 · Typographie" title="Taillée et limpide">
              <div className="grid grid-cols-2 gap-10 border-y border-(--line) py-8">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-sable">Titres · Londrina Solid</p>
                  <p className="mt-3 font-display text-[88px] font-black uppercase leading-[0.85]">Gala</p>
                  <p className="font-display text-[40px] font-light uppercase leading-none tracking-[0.08em] text-creme">Soirée de</p>
                </div>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-sable">Texte et interface · Work Sans</p>
                  <p className="mt-4 text-[19px] leading-relaxed text-ivoire/90">
                    Plusieurs cultures, un même lieu, une même cause : une nuit d’harmonie et d’ambiance festive au profit {event.cause}.
                  </p>
                  <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.28em] text-orange">Label de section</p>
                </div>
              </div>
            </Block>

            {/* Motifs */}
            <Block index="04 · Motifs" title="Le tissage des cultures">
              <div className="grid grid-cols-4 gap-5">
                {motifs.map((m) => (
                  <div key={m.name}>
                    <div className={`h-24 ${m.cls}`}>
                      <Motif name={m.name} id={`id-m-${m.name}`} scale={m.scale} />
                    </div>
                    <p className="mt-3 font-display text-[24px] font-black uppercase leading-none">{m.title}</p>
                  </div>
                ))}
              </div>
              <MotifBand id="id-band" reveal={false} className="mt-8" />
            </Block>
          </div>

          {/* Composants */}
          <Block index="05 · Éléments d’interface" title="Un seul geste : réserver" className="col-span-12">
            <div className="grid grid-cols-12 items-start gap-12">
              <div className="col-span-4 flex flex-col gap-8">
                <div className="flex flex-col items-start gap-4">
                  <Button size="lg">
                    Réserver mon pass
                    <LuArrowRight className="size-4" aria-hidden />
                  </Button>
                  <Button variant="secondary">Infos pratiques</Button>
                  <div className="bg-orange p-4">
                    <Button variant="dark">
                      Réserver mon pass
                      <LuArrowRight className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge>Disponible</Badge>
                  <Badge tone="orange">Dernières places</Badge>
                  <Badge tone="valide">Valide</Badge>
                  <Badge tone="alerte">Complet</Badge>
                </div>
                <ul className="space-y-3 text-[16px]">
                  {[
                    [LuCalendarDays, "Samedi 19 décembre 2026"],
                    [LuClock, `Début à ${event.startTime}`],
                    [LuMapPin, event.city],
                    [LuShirt, event.dressCode],
                  ].map(([Icon, label]) => {
                    const I = Icon as typeof LuMapPin;
                    return (
                      <li key={label as string} className="flex items-center gap-3">
                        <I className="size-5 text-orange" strokeWidth={1.6} aria-hidden />
                        {label as string}
                      </li>
                    );
                  })}
                </ul>
                <div className="flex items-start gap-3">
                  {[
                    ["75", "Jours"],
                    ["20", "Heures"],
                    ["00", "Min"],
                  ].map(([v, l], i) => (
                    <div key={l} className="flex items-start gap-3">
                      {i > 0 && <Rosace rings={2} className="mt-6 size-3 text-orange" />}
                      <div className="text-center">
                        <p className="font-display text-[64px] font-black leading-none">{v}</p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sable">{l}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-8 grid grid-cols-2 gap-8 [--section-bg:var(--color-brun)]">
                <PassTicket {...passes[1]} />
                <PassTicket {...passes[2]} />
              </div>
            </div>
          </Block>

          {/* Billet */}
          <Block index="06 · Billet électronique" title="Le billet, avec son code" className="col-span-12">
            <div className="grid grid-cols-12 items-center gap-12">
              <div className="col-span-5 flex justify-center bg-brun-soft py-12 [--section-bg:var(--color-brun-soft)]">
                <ETicket
                  id="id-billet"
                  holder="Prénom Nom"
                  ticket={{ number: "TTCT26-SPECIMEN", passSlug: "duo-vip", passName: "Pass Duo V.I.P", seats: 2, holders: ["Prénom Nom", "Prénom Nom"], status: "VALID", qrToken: "TTCT-SPECIMEN", pdfUrl: null }}
                />
              </div>
              <div className="col-span-7">
                <p className="max-w-xl text-[19px] leading-relaxed text-ivoire/90">
                  Le billet prolonge l’identité du site : bande de losanges, blason, typographie Londrina, talon perforé et liseré en zigzag. Il reste parfaitement lisible à l’écran comme à
                  l’impression.
                </p>
                <ul className="mt-8 space-y-3 text-[16px] text-sable">
                  <li>· Un QR code unique par billet, scanné une seule fois à l’entrée.</li>
                  <li>· Le QR code ne contient qu’un identifiant, aucune donnée personnelle.</li>
                  <li>· Numéro public lisible, pour un contrôle manuel en secours.</li>
                </ul>
                <p className="mt-8 inline-block border border-orange/60 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-orange">
                  Spécimen : QR code de démonstration
                </p>
              </div>
            </div>
          </Block>
        </div>

        {/* Affiche */}
        <div className="px-20 pb-20">
          <Block index="07 · Affiche" title="Le Bénin pluriel à l’affiche">
            <div className="grid grid-cols-12 items-center gap-12">
              <div className="col-span-6 flex justify-center bg-brun-soft py-12">
                <Image src={affiche} alt="" className="h-[960px] w-auto shadow-[0_30px_60px_rgba(10,2,1,0.6)]" />
              </div>
              <div className="col-span-6">
                <p className="max-w-xl text-[19px] leading-relaxed text-ivoire/90">
                  Format portrait 2:3, exporté en 2160 × 3240 px pour l’impression et le partage. Toutes les informations de l’affiche d’origine sont conservées (pass et prix,
                  contacts, lieu, code vestimentaire), l’horaire de 20h est ajouté, et la carte du Bénin pluriel devient la pièce maîtresse : sans bordure, auréolée de lumière, traversée par les anneaux du soleil et fondue dans le décor jusqu’aux pass.
                </p>
                <ul className="mt-8 space-y-3 text-[16px] text-sable">
                  <li>· docs/affiche/affiche-gala-ttct-2026-benin-pluriel.png (impression)</li>
                  <li>· docs/affiche/affiche-gala-ttct-2026-benin-pluriel.jpg (réseaux sociaux, WhatsApp)</li>
                  <li>· docs/affiche/affiche-gala-ttct-2026-benin-pluriel.pdf (imprimeur)</li>
                </ul>
              </div>
            </div>
          </Block>
        </div>

        {/* Pied */}
        <footer className="flex items-center gap-8 border-t border-terre px-20 py-8 text-[15px] font-semibold uppercase tracking-[0.2em] text-creme">
          <span>{event.dateLabel}</span>
          <span aria-hidden className="size-2 rotate-45 bg-orange" />
          <span>
            {event.city} · {event.startTime}
          </span>
          <span aria-hidden className="h-px flex-1 bg-terre" />
          <span className="flex items-center gap-3 font-display text-[28px] font-black normal-case tracking-[0.02em] text-ivoire">
            <LuPhone className="size-5 text-orange" aria-hidden />
            {event.contacts.map(formatPhone).join("  /  ")}
          </span>
        </footer>
        <MotifBand id="id-bottom" reveal={false} className="rotate-180" />
      </article>
    </main>
  );
}
