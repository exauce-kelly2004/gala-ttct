import type { Metadata } from "next";
import { Scanner } from "@/features/scanner/Scanner";

export const metadata: Metadata = { title: "Contrôle des billets · Gala TTCT", robots: { index: false, follow: false } };

/** Espace personnel de contrôle, pensé pour smartphone. L'accès sera réservé au personnel par le back-end. */
export default function ScannerPage() {
  return (
    <div data-tone="dark" className="flex-1 bg-brun bg-grain text-(--fg)">
      <Scanner />
    </div>
  );
}
