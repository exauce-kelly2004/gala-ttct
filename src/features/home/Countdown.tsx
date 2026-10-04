"use client";

import { useSyncExternalStore } from "react";
import { Rosace } from "@/components/motifs/Motif";

// Horloge partagée : une seule mise à jour par seconde, rien côté serveur (évite tout décalage d'hydratation).
function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000);
const noTimeOnServer = () => null;

const pad = (n: number) => String(n).padStart(2, "0");

/** Compte à rebours vers le gala. Les rosaces séparent les unités, comme les cercles du tambour. */
export function Countdown({ target }: { target: string }) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, noTimeOnServer);
  const left = now === null ? null : Math.max(0, Math.floor(new Date(target).getTime() / 1000) - now);

  if (left === 0) {
    return <p className="font-display text-[clamp(2.4rem,9vw,4rem)] font-black uppercase leading-none text-orange">C’est le jour du gala</p>;
  }

  const units: [string, string][] = [
    [left === null ? "--" : String(Math.floor(left / 86400)), "Jours"],
    [left === null ? "--" : pad(Math.floor((left % 86400) / 3600)), "Heures"],
    [left === null ? "--" : pad(Math.floor((left % 3600) / 60)), "Minutes"],
    [left === null ? "--" : pad(left % 60), "Secondes"],
  ];

  return (
    <div role="timer" aria-label="Temps restant avant le gala" className="flex items-start justify-center gap-2.5 sm:gap-6">
      {units.map(([value, label], i) => (
        <div key={label} className="flex items-start gap-2.5 sm:gap-6">
          {i > 0 && <Rosace rings={2} className="mt-4 size-3 shrink-0 text-orange sm:mt-7 sm:size-3.5" />}
          <div className="flex min-w-14 flex-col items-center text-center sm:min-w-20">
            <span className={`font-display text-[clamp(2.6rem,11vw,4.75rem)] font-black leading-none tabular-nums ${i === 3 ? "text-creme" : ""}`}>
              <span key={value} className={value === "--" ? undefined : "tick-in"}>
                {value}
              </span>
            </span>
            <span className="mt-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-(--fg-muted) sm:text-[0.64rem] sm:tracking-[0.26em]">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
