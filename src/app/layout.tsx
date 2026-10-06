import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Londrina_Solid, Work_Sans } from "next/font/google";
import { siteUrl } from "@/config/site";
import "./globals.css";

// Typographie validée (option A) : Londrina Solid pour les titres, Work Sans pour tout le reste.
const londrina = Londrina_Solid({
  variable: "--font-londrina",
  subsets: ["latin"],
  weight: ["300", "400", "900"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

// Chasse fixe pour les codes de billet (GALA-XXXX-XXXX) : embarquée, car un serveur sans polices système (PDF) la remplacerait par la police normale.
const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Soirée de Gala TTCT 2026 · Billetterie",
  description:
    "Réservez votre pass pour la Soirée de Gala de La Team Télé Contre Télé, le 19 décembre 2026 à Natitingou : une soirée de métissage culturel au profit des veuves et des orphelins.",
  // Aperçu lors du partage (WhatsApp, Facebook…) : l'image vient de app/opengraph-image.jpg
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    siteName: "Soirée de Gala TTCT 2026",
    title: "Soirée de Gala TTCT · 19 décembre 2026 · Natitingou",
    description: "Le métissage culturel : plusieurs cultures, une seule nuit. Réservez votre pass dès 15 000 FCFA.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a0d08",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${londrina.variable} ${workSans.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
