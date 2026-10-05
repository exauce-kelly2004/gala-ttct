"use client";

import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { tierOf } from "@/features/ticketing/tier";
import { cn } from "@/lib/cn";
import { getCheckinSummary, searchTickets, type CheckinSummary, type TicketLookup } from "./api";

function Count({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <div className="border border-terre bg-brun-soft p-3">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-sable">{label}</p>
      <p className="mt-1 font-display text-[2.1rem] font-black leading-none tabular-nums text-orange">{value}</p>
      <p className="mt-1 text-[0.7rem] text-sable">{sub}</p>
    </div>
  );
}

/** Point des billets à l'entrée : comptages de billets et de personnes uniquement, jamais d'argent. */
export function CheckinSummaryPanel({ refreshKey }: { refreshKey: number }) {
  const [summary, setSummary] = useState<CheckinSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCheckinSummary()
      .then((s) => !cancelled && setSummary(s))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <section aria-labelledby="point-title" className="mt-6">
      <h2 id="point-title" className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-sable">
        Point des billets
      </h2>
      {summary ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Count label="Attendues" value={summary.seats} sub={`${summary.tickets} billets`} />
          <Count label="Entrées" value={summary.seatsEntered} sub={`${summary.ticketsEntered} billets`} />
          <Count label="Restantes" value={summary.seatsRemaining} sub={`${summary.ticketsRemaining} billets`} />
        </div>
      ) : (
        <p role="status" className="mt-3 text-sm text-sable">
          Chargement…
        </p>
      )}
      {summary && (
        <ul className="mt-2 divide-y divide-(--line) border-y border-(--line)">
          {summary.byPass.map((p) => (
            <li key={p.slug} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 py-2.5 text-sm">
              <span className={cn("px-2 py-1 text-center font-display text-[1.05rem] font-black uppercase leading-none tracking-[0.1em]", tierOf(p.slug).banner)}>{tierOf(p.slug).label}</span>
              <span className="text-sable">
                {p.entered} / {p.tickets} billets
              </span>
              <span className="font-semibold tabular-nums">
                {p.seatsEntered} / {p.seats} pers.
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-sable">Personnes (un Pass Duo = 2) et billets payés. Entrées / attendues.</p>
    </section>
  );
}

const statusBadge: Record<TicketLookup["status"], { label: string; tone: "valide" | "neutre" | "alerte" | "orange" }> = {
  VALID: { label: "Valide", tone: "valide" },
  USED: { label: "Déjà entré", tone: "neutre" },
  CANCELLED: { label: "Annulé", tone: "alerte" },
  PENDING: { label: "Non payé", tone: "orange" },
};

/**
 * Recherche d'un billet par code, nom ou commande, pour le cas où le QR code ne se scanne pas.
 * Les résultats ne montrent ni e-mail ni téléphone ni montant. L'entrée se valide en un geste.
 */
export function TicketSearch({ onValidate, busy, refreshKey }: { onValidate: (code: string) => void; busy: boolean; refreshKey: number }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TicketLookup[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (query.trim().length < 3) {
      // Pas de recherche en dessous de 3 caractères : on remet l'affichage à zéro au prochain tour
      const reset = setTimeout(() => !cancelled && setResults(null), 0);
      return () => {
        cancelled = true;
        clearTimeout(reset);
      };
    }
    const timer = setTimeout(() => {
      searchTickets(query)
        .then((r) => !cancelled && setResults(r))
        .catch(() => !cancelled && setResults([]));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, refreshKey]);

  return (
    <section aria-labelledby="search-title" className="mt-6 border-t border-(--line) pt-5">
      <h2 id="search-title" className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
        <LuSearch className="size-4 text-orange" aria-hidden />
        Retrouver une personne
      </h2>
      <p className="mt-1 text-xs text-sable">Le QR code ne se lit pas ? Tapez le code du billet (GALA-…) ou le nom.</p>
      <label className="mt-3 block">
        <span className="sr-only">Code du billet ou nom</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="GALA-7K2M-9QXH ou nom"
          className="min-h-12 w-full border border-(--line) bg-brun-soft px-4 text-[1rem] text-(--fg) placeholder:text-(--fg)/40 focus:border-(--accent) focus:outline-none"
        />
      </label>

      {results && results.length === 0 && <p className="mt-3 text-sm text-sable">Aucun billet trouvé.</p>}
      {results && results.length > 0 && (
        <ul className="mt-3 divide-y divide-(--line) border-y border-(--line)">
          {results.map((t) => (
            <li key={t.number} className="py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {t.holders.map((h) => (
                    <p key={h} className="font-semibold">
                      {h}
                    </p>
                  ))}
                  <p className="mt-0.5 text-xs text-sable">
                    <span className="font-semibold uppercase tracking-[0.08em] text-orange">{tierOf(t.passSlug).label}</span> · {t.passName} · <span className="font-mono">{t.number}</span>
                  </p>
                </div>
                <Badge tone={statusBadge[t.status].tone}>{statusBadge[t.status].label}</Badge>
              </div>
              {t.status === "VALID" && (
                <Button onClick={() => onValidate(t.number)} disabled={busy} className="mt-3 w-full">
                  Valider l’entrée
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
