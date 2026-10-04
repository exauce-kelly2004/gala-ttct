import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container, Section } from "@/components/ui/Layout";
import { Lead } from "@/components/ui/Typography";

export const metadata: Metadata = { title: "Conditions de vente · Soirée de Gala TTCT 2026" };

// Texte juridique à fournir par l'organisateur : rien n'est rédigé à sa place.
export default function Page() {
  return (
    <>
      <PageIntro eyebrow="Informations légales" title="Conditions de vente" />
      <Section tone="parchemin" className="py-16 sm:py-20">
        <Container size="narrow">
          <Lead>Les conditions de vente (prix, paiement, modification, annulation et remboursement) seront publiées ici après validation par l’organisateur.</Lead>
        </Container>
      </Section>
    </>
  );
}
