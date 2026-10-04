import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { LuArrowRight, LuCalendarDays, LuCircleCheck, LuCircleX, LuMapPin, LuShirt, LuTicket } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Motif, MotifBand, Rosace, type MotifName } from "@/components/motifs/Motif";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Figure } from "@/components/ui/Figure";
import { Container, Section } from "@/components/ui/Layout";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Accent, Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { passes } from "@/config/passes";
import { PassTicket } from "@/features/ticketing/PassTicket";

export const metadata: Metadata = {
  title: "Design system · Gala TTCT",
  robots: { index: false },
};

const palette = [
  { name: "Brun", hex: "#2A0D08", cls: "bg-brun", ink: "text-ivoire", role: "Fond dominant" },
  { name: "Brun relevé", hex: "#3A160E", cls: "bg-brun-soft", ink: "text-ivoire", role: "Billets, champs, blocs" },
  { name: "Terre", hex: "#5E2E16", cls: "bg-terre", ink: "text-ivoire", role: "Motifs, filets, accents sur clair" },
  { name: "Rouille", hex: "#A9531F", cls: "bg-rouille", ink: "text-brun", role: "Orange décoratif : bandes, talons" },
  { name: "Orange", hex: "#C8722F", cls: "bg-orange", ink: "text-brun", role: "Action : boutons, prix" },
  { name: "Parchemin", hex: "#CDB48C", cls: "bg-parchemin", ink: "text-brun", role: "Sections de lecture" },
  { name: "Crème", hex: "#D8C09A", cls: "bg-creme", ink: "text-brun", role: "Logo, textes forts" },
  { name: "Ivoire", hex: "#E6D3B3", cls: "bg-ivoire", ink: "text-brun", role: "Texte principal sur brun" },
];

const contrasts = [
  ["Ivoire sur brun", "12,4 : 1"],
  ["Brun sur parchemin", "9,1 : 1"],
  ["Sable sur brun", "5,6 : 1"],
  ["Brun sur orange (boutons)", "5,1 : 1"],
  ["Orange sur brun (prix, accents)", "5,1 : 1"],
];

const motifs: { name: MotifName; title: string; text: string; cls: string; scale?: number }[] = [
  { name: "losanges", title: "Losanges", text: "Bordures de pagne : haut des billets, liserés.", cls: "bg-brun text-rouille" },
  { name: "rosaces", title: "Rosaces", text: "Cercles du tambour : compte à rebours, confirmation.", cls: "bg-brun-soft text-terre", scale: 0.8 },
  { name: "entrelacs", title: "Entrelacs", text: "La chaîne qui relie les cultures : bandes de section.", cls: "bg-brun text-terre" },
  { name: "zigzag", title: "Zigzag", text: "Le mouvement de la fête : talons, transitions fines.", cls: "bg-rouille text-brun/70" },
];

const infos: [IconType, string][] = [
  [LuCalendarDays, "19 décembre 2026"],
  [LuMapPin, "Lieu à confirmer"],
  [LuShirt, "Tenue : à confirmer"],
  [LuTicket, "Billet numérique avec QR code"],
];

function SpecHeader({ index, title, children }: { index: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-12 flex max-w-3xl flex-col gap-3 sm:mb-14">
      <Eyebrow>{index}</Eyebrow>
      <Heading>{title}</Heading>
      {children && <Lead>{children}</Lead>}
    </div>
  );
}

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="flex-1">
      {/* Ouverture */}
      <Section className="overflow-hidden pb-16 pt-16 sm:pt-20">
        <Rosace rings={5} className="pointer-events-none absolute -right-32 top-6 size-[26rem] text-terre/35 sm:-right-24 sm:size-[34rem]" />
        <Container className="relative flex flex-col items-center text-center">
          <Eyebrow className="animate-rise">Étape 2 · Design system</Eyebrow>
          <Logo variant="emblem" width={150} priority className="mt-10 w-28 animate-rise [animation-delay:120ms] sm:w-[150px]" />
          <Accent className="mt-10 text-[clamp(1.8rem,6vw,3rem)] leading-none animate-rise [animation-delay:240ms]">Soirée de</Accent>
          <Heading as="h1" size="monumental" className="animate-rise [animation-delay:360ms]">
            Gala
          </Heading>
          <p className="mt-5 text-[0.78rem] font-semibold uppercase tracking-[0.32em] text-orange animate-rise [animation-delay:480ms]">
            Le métissage culturel
          </p>
          <Lead className="mt-5 text-center animate-rise [animation-delay:600ms]">
            Organisée par La Team Télé Contre Télé, la Soirée de Gala réunit plusieurs cultures dans un même lieu pour une nuit de fête, au profit des veuves et des orphelins.
          </Lead>
          <div className="mt-10 flex flex-col items-center gap-4 animate-rise [animation-delay:720ms] sm:flex-row">
            <Button size="lg" href="#pass">
              Réserver mon pass
              <LuArrowRight className="size-4" aria-hidden />
            </Button>
            <span className="text-sm text-sable">À partir de 15 000 FCFA</span>
          </div>
        </Container>
      </Section>
      <MotifBand id="band-open" />

      {/* 01 Palette */}
      <Section tone="brun-soft">
        <Container>
          <SpecHeader index="01 · Palette" title="Crème, brun, orange, en lumière basse">
            Luminosité fortement réduite : le brun domine, le crème porte le texte, l’orange ne sert qu’à l’action et aux accents.
          </SpecHeader>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {palette.map((c) => (
              <div key={c.hex} className={`flex min-h-36 flex-col justify-end p-4 ${c.cls} ${c.ink}`}>
                <p className="font-display text-2xl font-black uppercase leading-none">{c.name}</p>
                <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em]">{c.hex}</p>
                <p className="mt-1 text-[0.8rem] opacity-80">{c.role}</p>
              </div>
            ))}
          </div>
          <dl className="mt-10 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {contrasts.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-(--line) pb-2 text-sm">
                <dt className="text-sable">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* 02 Typographie, sur section claire */}
      <Section tone="parchemin">
        <Motif name="filigrane" id="typo-bg" className="absolute inset-0 text-terre/12" />
        <Container className="relative">
          <SpecHeader index="02 · Typographie (option A validée)" title="Des lettres taillées, un texte limpide" />
          <div className="divide-y divide-(--line) border-y border-(--line)">
            <SpecRow label="Londrina Solid Black">
              <Heading as="p" size="xl">Soirée de Gala</Heading>
            </SpecRow>
            <SpecRow label="Londrina Solid Black">
              <Heading as="p" size="lg">19 décembre 2026</Heading>
            </SpecRow>
            <SpecRow label="Londrina Solid Light">
              <Accent className="text-[2.4rem] leading-none">Le métissage culturel</Accent>
            </SpecRow>
            <SpecRow label="Work Sans">
              <div className="space-y-3">
                <Eyebrow>Label de section</Eyebrow>
                <Lead>
                  Une soirée de célébration, de transmission et de partage. Plusieurs cultures, un même lieu, une même cause : soutenir les veuves et les orphelins.
                </Lead>
              </div>
            </SpecRow>
          </div>
        </Container>
      </Section>

      {/* 03 Motifs */}
      <Section>
        <Container>
          <SpecHeader index="03 · Motifs" title="Le tissage des cultures">
            Losanges, rosaces, entrelacs et zigzags se retrouvent dans de nombreuses traditions textiles. Réunis dans une même bande, ils racontent le thème du gala : plusieurs cultures, un seul tissu. Toujours en arrière-plan du contenu.
          </SpecHeader>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {motifs.map((m) => (
              <div key={m.name}>
                <div className={`h-24 ${m.cls}`}>
                  <Motif name={m.name} id={`m-${m.name}`} scale={m.scale} />
                </div>
                <p className="mt-4 font-display text-2xl font-black uppercase leading-none">{m.title}</p>
                <p className="mt-1.5 text-sm text-sable">{m.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14">
            <Eyebrow>Bande signature « métissage » (se déroule au défilement)</Eyebrow>
            <MotifBand id="band-demo" className="mt-4" />
          </div>
          <div className="mt-10">
            <Eyebrow>Liseré fin</Eyebrow>
            <MotifBand id="band-fine" variant="fine" className="mt-4" />
          </div>
        </Container>
      </Section>

      {/* 04 Actions */}
      <Section tone="brun-soft">
        <Container>
          <SpecHeader index="04 · Actions et statuts" title="Un seul bouton qui compte : réserver" />
          <div className="flex flex-wrap items-center gap-5">
            <Button size="lg">
              Réserver mon pass
              <LuArrowRight className="size-4" aria-hidden />
            </Button>
            <Button>Réserver</Button>
            <Button variant="secondary">Voir le programme</Button>
            <Button variant="link">Questions fréquentes</Button>
            <Button disabled>Indisponible</Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Badge>Disponible</Badge>
            <Badge tone="orange">Dernières places</Badge>
            <Badge tone="alerte">Complet</Badge>
            <Badge tone="valide" icon={<LuCircleCheck className="size-3.5" aria-hidden />}>
              Billet valide
            </Badge>
            <Badge tone="alerte" icon={<LuCircleX className="size-3.5" aria-hidden />}>
              Déjà utilisé
            </Badge>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            {infos.map(([Icon, label]) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="size-5 text-orange" strokeWidth={1.6} aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 05 Compte à rebours */}
      <Section className="overflow-hidden">
        <Container className="flex flex-col items-center text-center">
          <SpecHeader index="05 · Compte à rebours" title="Le temps avant la fête" />
          <div className="flex items-start justify-center gap-3 sm:gap-8">
            {[
              ["76", "Jours"],
              ["04", "Heures"],
              ["32", "Minutes"],
              ["18", "Secondes"],
            ].map(([value, label], i) => (
              <div key={label} className="flex items-start gap-3 sm:gap-8">
                {i > 0 && <Rosace rings={2} className="mt-5 size-3.5 text-orange sm:mt-8" />}
                <Figure value={value} label={label} />
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-sable">Valeurs figées ici ; le vrai compte à rebours arrive avec la page d’accueil.</p>
        </Container>
      </Section>

      {/* 06 Billets */}
      <Section id="pass" tone="brun-soft">
        <Container>
          <SpecHeader index="06 · Billetterie" title="Chaque pass est un billet">
            Prix de l’affiche. Noms, avantages et disponibilités à confirmer : ils viendront des données validées.
          </SpecHeader>
          <div className="mx-auto grid max-w-md gap-8 lg:max-w-none lg:grid-cols-3 lg:gap-6">
            {passes.map((p) => (
              <PassTicket key={p.slug} {...p} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 07 Formulaire, section claire */}
      <Section tone="parchemin">
        <Container size="narrow">
          <SpecHeader index="07 · Formulaire" title="Le checkout : clair et rassurant" />
          <form className="grid gap-6 sm:grid-cols-2">
            <Field label="Nom" name="demo-lastname" autoComplete="family-name" placeholder="Votre nom" />
            <Field label="Prénom" name="demo-firstname" autoComplete="given-name" placeholder="Votre prénom" />
            <Field label="E-mail" name="demo-email" type="email" defaultValue="adresse-invalide" error="Saisissez une adresse e-mail valide." />
            <Field label="Téléphone" name="demo-phone" type="tel" hint="Utilisé uniquement pour votre commande." />
          </form>
        </Container>
      </Section>

      {/* 08 Photos et logo */}
      <Section>
        <Container>
          <SpecHeader index="08 · Photos et logo" title="Des cadres prêts pour vos photos">
            Aucune photo n’est encore validée : ces cadres réservés les remplaceront jusqu’à réception des photos officielles TTCT.
          </SpecHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            <PhotoFrame id="pf-1" label="Photo officielle à venir" className="aspect-[4/5]" />
            <PhotoFrame id="pf-2" label="Photo du lieu à venir" className="aspect-[4/5]" />
            <PhotoFrame id="pf-3" label="Photo d’ambiance à venir" className="aspect-[4/5]" />
          </div>
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <Logo variant="full" width={360} className="w-64 sm:w-[360px]" />
            <p className="max-w-md text-sm text-sable">Logo crème, toujours posé sur brun : navigation, footer, billets.</p>
          </div>
        </Container>
      </Section>
      <MotifBand id="band-close" />
    </main>
  );
}

function SpecRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 py-8 md:grid-cols-[13rem_1fr] md:items-center">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-terre">{label}</p>
      {children}
    </div>
  );
}
