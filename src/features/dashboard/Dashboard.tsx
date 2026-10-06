"use client";

import { useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { Button } from "@/components/ui/Button";
import { formatAmount } from "@/lib/format";
import { getInsights, getPassCapacity, getStats, setPassCapacity, type Insights, type PassCapacity, type Stats } from "./api";

const dayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
/** « 2026-10-06 » → « mar. 6 oct. » (la date est déjà en heure du Bénin, on évite tout décalage). */
const dayLabel = (day: string) => dayFormat.format(new Date(`${day}T00:00:00Z`));
const hourLabel = (hour: string) => `${dayLabel(hour.slice(0, 10))} · ${hour.slice(11, 13)} h`;

/** Ligne avec une barre proportionnelle : ventes d'un jour, entrées d'une heure. */
function BarRow({ label, value, max, right }: { label: string; value: number; max: number; right: string }) {
  return (
    <li className="grid grid-cols-[8.5rem_1fr_auto] items-center gap-3 py-3 text-sm">
      <span className="text-sable">{label}</span>
      <div className="h-2.5 bg-terre/60" role="img" aria-label={right}>
        <div className="h-full bg-orange" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%` }} />
      </div>
      <span className="text-right font-semibold tabular-nums">{right}</span>
    </li>
  );
}

/** Nombre de pass en vente, par type : au-delà, la commande est refusée (« n'est plus disponible »). */
function CapacitySection() {
  const [passes, setPasses] = useState<PassCapacity[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ slug: string; text: string; ok: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPassCapacity()
      .then((p) => !cancelled && setPasses(p))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!passes) return null;

  const save = async (p: PassCapacity) => {
    const raw = (drafts[p.slug] ?? (p.capacity === null ? "" : String(p.capacity))).trim();
    const value = raw === "" ? null : Number(raw);
    if (value !== null && (!Number.isInteger(value) || value < 0)) {
      setMessage({ slug: p.slug, text: "Saisissez un nombre entier, ou laissez vide pour illimité.", ok: false });
      return;
    }
    try {
      setPasses(await setPassCapacity(p.slug, value));
      setDrafts((d) => Object.fromEntries(Object.entries(d).filter(([slug]) => slug !== p.slug)));
      setMessage({ slug: p.slug, text: value === null ? "Vente illimitée." : `Capacité fixée à ${value}.`, ok: true });
    } catch (err) {
      setMessage({ slug: p.slug, text: err instanceof Error && err.message === "BELOW_RESERVED" ? `Impossible : ${p.reserved} pass sont déjà réservés.` : "L’enregistrement a échoué.", ok: false });
    }
  };

  return (
    <section aria-labelledby="capacity" className="mt-12">
      <h2 id="capacity" className="font-display text-[1.9rem] font-black uppercase leading-none">
        Capacité des pass
      </h2>
      <p className="mt-3 text-sm text-sable">Nombre de pass mis en vente par type. Une fois atteint, la commande est refusée. Laissez vide pour une vente illimitée.</p>
      <ul className="mt-6 divide-y divide-(--line) border-y border-(--line)">
        {passes.map((p) => (
          <li key={p.slug} className="grid gap-3 py-4 sm:grid-cols-[14rem_1fr_auto] sm:items-center">
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-sable">
                {p.reserved} réservé{p.reserved > 1 ? "s" : ""}
                {p.capacity !== null && ` sur ${p.capacity} · ${Math.max(p.capacity - p.reserved, 0)} restant${p.capacity - p.reserved > 1 ? "s" : ""}`}
              </p>
            </div>
            <label className="flex items-center gap-3">
              <span className="sr-only">Capacité du {p.name}</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={drafts[p.slug] ?? (p.capacity === null ? "" : String(p.capacity))}
                onChange={(e) => setDrafts((d) => ({ ...d, [p.slug]: e.target.value }))}
                placeholder="Illimitée"
                className="min-h-11 w-40 border border-(--line) bg-brun-soft px-3 text-(--fg) placeholder:text-(--fg)/40 focus:border-(--accent) focus:outline-none"
              />
              <Button type="button" variant="secondary" onClick={() => void save(p)}>
                Enregistrer
              </Button>
            </label>
            {message?.slug === p.slug && (
              <p role="status" className={`text-sm sm:col-span-3 ${message.ok ? "text-valide" : "text-alerte"}`}>
                {message.text}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

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

/** Tableau de bord : chiffres, ventes par jour, affluence et exports, tous calculés depuis la base. */
export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getStats()
      .then((s) => !cancelled && setStats(s))
      .catch(() => !cancelled && setError(true));
    // Les détails sont un plus : s'ils échouent, le reste du tableau de bord reste affiché
    getInsights()
      .then((i) => !cancelled && setInsights(i))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <h1 className="font-display text-[clamp(2.4rem,8vw,3.6rem)] font-black uppercase leading-none">Tableau de bord</h1>
      <p className="mt-2 text-sable">Ventes de billets du Gala TTCT.</p>

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

          {insights && (
            <>
              <section aria-labelledby="by-day" className="mt-12">
                <h2 id="by-day" className="font-display text-[1.9rem] font-black uppercase leading-none">
                  Ventes par jour
                </h2>
                {insights.salesByDay.length === 0 ? (
                  <p className="mt-6 text-sm text-sable">Aucune vente pour l’instant.</p>
                ) : (
                  <ul className="mt-6 divide-y divide-(--line) border-y border-(--line)">
                    {insights.salesByDay
                      .slice(-14)
                      .reverse()
                      .map((d) => (
                        <BarRow
                          key={d.day}
                          label={dayLabel(d.day)}
                          value={d.revenue}
                          max={Math.max(...insights.salesByDay.slice(-14).map((x) => x.revenue))}
                          right={`${d.tickets} billet${d.tickets > 1 ? "s" : ""} · ${formatAmount(d.revenue)} FCFA`}
                        />
                      ))}
                  </ul>
                )}
                <p className="mt-3 text-xs text-sable">Les 14 derniers jours avec des ventes, heure du Bénin.</p>
              </section>

              <section aria-labelledby="entries" className="mt-12">
                <h2 id="entries" className="font-display text-[1.9rem] font-black uppercase leading-none">
                  Affluence à l’entrée
                </h2>
                <p className="mt-3 text-sm text-sable">
                  <strong className="font-semibold text-ivoire">{insights.attendance.rate} %</strong> des billets valables sont déjà entrés ({insights.attendance.entered} sur {insights.attendance.expected}).
                </p>
                {insights.entriesByHour.length === 0 ? (
                  <p className="mt-6 text-sm text-sable">Aucune entrée enregistrée pour l’instant.</p>
                ) : (
                  <ul className="mt-6 divide-y divide-(--line) border-y border-(--line)">
                    {insights.entriesByHour.map((h) => (
                      <BarRow
                        key={h.hour}
                        label={hourLabel(h.hour)}
                        value={h.seats}
                        max={Math.max(...insights.entriesByHour.map((x) => x.seats))}
                        right={`${h.seats} pers. · ${h.tickets} billet${h.tickets > 1 ? "s" : ""}`}
                      />
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}

          <CapacitySection />

          <section aria-labelledby="exports" className="mt-12">
            <h2 id="exports" className="font-display text-[1.9rem] font-black uppercase leading-none">
              Exports
            </h2>
            <p className="mt-3 text-sm text-sable">Fichiers CSV à ouvrir dans Excel, pour la comptabilité. Ils contiennent les e-mails et téléphones des clients : à garder pour vous.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button href="/api/admin/export/commandes" variant="secondary" download>
                <LuDownload className="size-4" aria-hidden />
                Commandes (CSV)
              </Button>
              <Button href="/api/admin/export/billets" variant="secondary" download>
                <LuDownload className="size-4" aria-hidden />
                Billets (CSV)
              </Button>
            </div>
          </section>
        </>
      )}
    </>
  );
}
