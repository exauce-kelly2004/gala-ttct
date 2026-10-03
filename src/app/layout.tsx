import type { Metadata } from "next";
import "./globals.css";

// Typographies (Cormorant Garamond, Great Vibes, Inter) : ajoutées à l'Étape 2 — design system.
export const metadata: Metadata = {
  title: "Soirée de Gala TTCT 2026",
  description: "Soirée de Gala — La Team Télé Contre Télé — 19 décembre 2026",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
