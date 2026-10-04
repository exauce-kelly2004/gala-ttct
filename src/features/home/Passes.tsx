import { LuQrCode, LuMail, LuFileDown } from "react-icons/lu";
import type { IconType } from "react-icons";
import { Motif } from "@/components/motifs/Motif";
import { Container, Section } from "@/components/ui/Layout";
import { Eyebrow, Heading, Lead } from "@/components/ui/Typography";
import { passes } from "@/config/passes";
import { PassTicket } from "@/features/ticketing/PassTicket";

const reassurance: [IconType, string][] = [
  [LuMail, "Billet envoyé par e-mail dès le paiement confirmé"],
  [LuFileDown, "Téléchargeable en PDF, sur téléphone ou imprimé"],
  [LuQrCode, "Un QR code unique par billet, scanné à l’entrée"],
];

export function Passes() {
  return (
    <Section id="pass" className="overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-80 text-terre/30 [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <Motif name="filigrane" id="pass-bg" scale={1.4} className="drift-scroll" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="rise-on-view">Billetterie</Eyebrow>
          <Heading className="mt-4 rise-on-view">Choisissez votre pass</Heading>
          <Lead className="mx-auto mt-5 text-center rise-on-view">Seul ou à deux, réservez votre place pour la nuit du métissage culturel.</Lead>
        </div>

        <div className="mx-auto mt-14 grid max-w-md gap-8 lg:max-w-none lg:grid-cols-3 lg:gap-6">
          {passes.map((p) => (
            <div key={p.slug} className="h-full rise-on-view">
              <PassTicket {...p} />
            </div>
          ))}
        </div>

        <ul className="mt-14 grid gap-5 border-t border-(--line) pt-10 sm:grid-cols-3 sm:gap-8">
          {reassurance.map(([Icon, text]) => (
            <li key={text} className="flex items-start gap-3 text-[0.94rem] text-(--fg)/85">
              <Icon className="mt-0.5 size-5 shrink-0 text-orange" strokeWidth={1.6} aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
