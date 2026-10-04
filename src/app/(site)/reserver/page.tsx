import type { Metadata } from "next";
import { LuArrowLeft, LuPhone } from "react-icons/lu";
import { PageIntro } from "@/components/layout/PageIntro";
import { Button } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Layout";
import { Lead } from "@/components/ui/Typography";
import { event } from "@/config/event";
import { findPass } from "@/config/passes";
import { formatAmount, formatPhone, telHref } from "@/lib/format";

export const metadata: Metadata = { title: "Réserver · Soirée de Gala TTCT 2026" };

/**
 * Point d'arrivée des boutons « Réserver ce pass ». Le formulaire de réservation et le paiement
 * seront construits à l'étape checkout ; en attendant, la page récapitule le choix et donne les contacts.
 */
export default async function ReserverPage({ searchParams }: PageProps<"/reserver">) {
  const params = await searchParams;
  const pass = findPass(typeof params.pass === "string" ? params.pass : undefined);
  const wanted = Number(params.quantite);
  const quantity = pass && Number.isInteger(wanted) ? Math.min(Math.max(wanted, 1), pass.maxPerOrder) : 1;

  return (
    <>
      <PageIntro eyebrow="Réservation" title="Votre réservation">
        <Lead>La réservation en ligne ouvre très bientôt. En attendant, l’organisation prend vos réservations par téléphone.</Lead>
      </PageIntro>

      <Section tone="brun-soft" className="py-16 sm:py-20">
        <Container size="narrow" className="grid gap-10">
          {pass && (
            <div className="border border-terre bg-brun p-6 sm:p-8">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sable">Votre choix</p>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
                <p className="font-display text-[2.2rem] font-black uppercase leading-none">
                  {quantity} <span className="font-sans font-normal">×</span> {pass.name}
                </p>
                <p className="font-display text-[2.4rem] font-black leading-none text-orange tabular-nums">
                  {formatAmount(pass.price * quantity)} <span className="text-base text-sable">{pass.currency}</span>
                </p>
              </div>
              <p className="mt-3 text-sm text-sable">
                {pass.seats * quantity} {pass.seats * quantity > 1 ? "personnes" : "personne"} · {event.dateLabel} · {event.city}
              </p>
            </div>
          )}

          <ul className="grid gap-3 sm:grid-cols-2">
            {event.contacts.map((phone) => (
              <li key={phone}>
                <a href={telHref(phone)} className="flex min-h-16 items-center gap-4 border border-(--line) px-5 transition-colors hover:border-orange">
                  <LuPhone className="size-5 text-orange" aria-hidden />
                  <span className="font-display text-[1.9rem] font-black leading-none tabular-nums">{formatPhone(phone)}</span>
                </a>
              </li>
            ))}
          </ul>

          <Button href="/#pass" variant="secondary" className="justify-self-start">
            <LuArrowLeft className="size-4" aria-hidden />
            Revoir les pass
          </Button>
        </Container>
      </Section>
    </>
  );
}
