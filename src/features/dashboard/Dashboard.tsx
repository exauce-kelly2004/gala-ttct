"use client";

import { useEffect, useState } from "react";
import { IS_DEMO, getStats, type Stats } from "./api";
import { formatAmount } from "@/lib/format";

function Stat({ label, value, unit, note }: { label: string; value: string; unit?: string; note?: string }) {
  return (
    <div className="border border-terre bg-brun-soft p-5">
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-sable">{label}</p>
      <p className="mt-2 font-display text-[clamp(2.4rem,7vw,3.2rem)] font-black leading-none tabular-nums text-orange">
        {value}
        {unit && <span className="ml-1.5 text-sm font-semibold text-sable">{unit}</span>}
      </p>
      {note && <p className="mt-2 text-xs text-sable">{note}</p>}
    </div>
  );
}

/** Tableau de bord : chiffres issus de la base (simulés tant que le back-end n'est pas branché). */
export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((s) => !cancelled && setStats(s))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <h1 className="font-display text-[clamp(2.4rem,8vw,3.6rem)] font-black uppercase leading-none">Tableau de bord</h1>
      <p className="mt-2 text-sable">Ventes de billets du Gala TTCT.{IS_DEMO && " Chiffres de démonstration."}</p>

      {error && (
        <p role="alert" className="mt-8 text-sm font-medium text-alerte">
          Les chiffres n’ont pas pu être chargés. Rechargez la page.
        </p>
      )}

      {!stats && !error && (
        <p role="status" className="mt-10 text-sable">
          Chargement des chiffres…
        </p>
      )}

      {stats && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Billets vendus" value={String(stats.ticketsSold)} note={`${stats.seatsSold} personnes couvertes`} />
            <Stat label="Montant encaissé" value={formatAmount(stats.revenue)} unit="FCFA" note="Commandes payées" />
            <Stat label="Commandes" value={String(stats.orders)} />
            <Stat label="Billets valides" value={String(stats.ticketsValid)} />
            <Stat label="Billets utilisés" value={String(stats.ticketsUsed)} note="Scannés à l’entrée" />
            <Stat label="Billets annulés" value={String(stats.ticketsCancelled)} />
          </div>

          <section aria-labelledby="by-pass" className="mt-12">
            <h2 id="by-pass" className="font-display text-[1.9rem] font-black uppercase leading-none">
              Ventes par pass
            </h2>
            <ul className="mt-6 divide-y divide-(--line) border-y border-(--line)">
              {stats.byPass.map((p) => {
                const share = stats.ticketsSold > 0 ? (p.sold / stats.ticketsSold) * 100 : 0;
                return (
                  <li key={p.slug} className="grid gap-3 py-5 sm:grid-cols-[14rem_1fr_9rem] sm:items-center">
                    <p className="font-semibold">{p.name}</p>
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 flex-1 bg-terre/60" role="img" aria-label={`${Math.round(share)} % des billets vendus`}>
                        <div className="h-full bg-orange" style={{ width: `${share}%` }} />
                      </div>
                      <span className="w-20 text-right text-sm tabular-nums text-sable">
                        {p.sold} billet{p.sold > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-right font-semibold tabular-nums sm:text-right">{formatAmount(p.revenue)} FCFA</p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-sable">La part indiquée est celle de chaque pass dans les billets vendus. La capacité de la salle n’est pas encore renseignée.</p>
          </section>
        </>
      )}
    </>
  );
}
