import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutre" | "orange" | "valide" | "alerte";

const tones: Record<Tone, string> = {
  neutre: "border-(--fg)/35 text-(--fg)/80",
  orange: "border-orange/70 text-orange",
  valide: "border-valide/70 text-valide",
  alerte: "border-alerte/70 text-alerte",
};

/** Étiquette de statut, angles droits. Le texte porte toujours l'information (jamais la couleur seule). */
export function Badge({ tone = "neutre", icon, children, className }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
