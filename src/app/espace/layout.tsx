import type { Metadata } from "next";

export const metadata: Metadata = { title: "Espace organisateur · Gala TTCT", robots: { index: false, follow: false } };

/** Espace réservé aux administrateurs et au personnel invités : tout y est hors index. */
export default function EspaceLayout({ children }: LayoutProps<"/espace">) {
  return (
    <div data-tone="dark" className="flex min-h-svh flex-1 flex-col bg-brun bg-grain text-(--fg)">
      {children}
    </div>
  );
}
