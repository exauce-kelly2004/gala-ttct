import Link from "next/link";

// Page technique temporaire. La vraie page d'accueil arrive à l'Étape 3.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 bg-brun bg-grain p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange">Étape 2 · Design system</p>
      <h1 className="font-display text-5xl font-black uppercase">Soirée de Gala TTCT</h1>
      <p className="text-sable">
        Aperçu du langage visuel :{" "}
        <Link className="text-orange underline underline-offset-4" href="/design-system">
          /design-system
        </Link>
      </p>
    </main>
  );
}
