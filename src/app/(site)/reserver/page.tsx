import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Layout";
import { CheckoutFlow } from "@/features/checkout/CheckoutFlow";
import { cartFromParams } from "@/features/checkout/order";

export const metadata: Metadata = { title: "Réserver · Soirée de Gala TTCT 2026", robots: { index: false } };

/** Checkout en 3 étapes (pass, coordonnées, paiement). Arrive pré-rempli depuis « Réserver ce pass ». */
export default async function ReserverPage({ searchParams }: PageProps<"/reserver">) {
  const { pass, quantite } = await searchParams;
  const initialCart = cartFromParams(typeof pass === "string" ? pass : undefined, typeof quantite === "string" ? quantite : undefined);

  return (
    <Section className="pb-16 pt-28 sm:pt-32 lg:pb-24">
      <Container size="wide">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-orange">Réservation</p>
        <h1 className="mt-3 font-display text-[clamp(2.6rem,9vw,4.5rem)] font-black uppercase leading-[0.9]">Réservez votre nuit</h1>
        <div className="mt-10">
          <CheckoutFlow initialCart={initialCart} />
        </div>
      </Container>
    </Section>
  );
}
