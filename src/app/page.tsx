// Page technique temporaire (Étape 1). La vraie page d'accueil arrive à l'Étape 3.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-sm uppercase tracking-[0.3em] opacity-70">Étape 1 — Socle technique</p>
      <h1 className="text-3xl">Soirée de Gala TTCT 2026</h1>
      <p className="opacity-70">
        Vérification base de données : <a className="underline" href="/api/health">/api/health</a>
      </p>
    </main>
  );
}
