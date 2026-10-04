import type { Metadata } from "next";
import { Confirmation } from "@/features/checkout/Confirmation";

export const metadata: Metadata = { title: "Réservation confirmée · Soirée de Gala TTCT 2026", robots: { index: false } };

export default async function ConfirmationPage({ searchParams }: PageProps<"/confirmation">) {
  const { ref } = await searchParams;
  return <Confirmation reference={typeof ref === "string" ? ref : null} />;
}
