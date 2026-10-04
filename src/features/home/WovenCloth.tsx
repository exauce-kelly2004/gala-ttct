import type { CSSProperties } from "react";
import { Motif, type MotifName } from "@/components/motifs/Motif";
import { cn } from "@/lib/cn";

type Block = {
  /** Motif du bloc ; absent = aplat de couleur. */
  motif?: MotifName;
  /** Part de la hauteur du lé (flex-grow). */
  grow: number;
  /** Classes de fond et de couleur du motif (currentColor). */
  tone: string;
  scale?: number;
};

/**
 * Chaque lé est une bande étroite tissée, composée de blocs différents : aucune n'est identique,
 * comme les cultures réunies au gala. Cousues côte à côte, elles forment une seule étoffe.
 */
const strips: Block[][] = [
  [
    { motif: "losanges", grow: 3, tone: "bg-brun text-rouille", scale: 0.9 },
    { grow: 0.35, tone: "bg-orange" },
    { motif: "zigzag", grow: 2, tone: "bg-terre text-brun/70", scale: 0.8 },
    { grow: 0.2, tone: "bg-creme" },
    { motif: "rosaces", grow: 3.4, tone: "bg-brun-soft text-rouille/80", scale: 0.6 },
  ],
  [
    { motif: "entrelacs", grow: 2.6, tone: "bg-rouille text-brun/75", scale: 1.1 },
    { grow: 0.25, tone: "bg-brun" },
    { motif: "filigrane", grow: 2.2, tone: "bg-creme text-terre/70", scale: 0.6 },
    { grow: 0.25, tone: "bg-brun" },
    { motif: "losanges", grow: 3.4, tone: "bg-brun text-orange/85", scale: 0.7 },
  ],
  [
    { motif: "rosaces", grow: 2.2, tone: "bg-brun text-terre", scale: 0.75 },
    { grow: 0.3, tone: "bg-orange" },
    { motif: "losanges", grow: 4, tone: "bg-orange text-brun/80", scale: 1.1 },
    { grow: 0.3, tone: "bg-orange" },
    { motif: "zigzag", grow: 2, tone: "bg-brun text-rouille", scale: 0.8 },
  ],
  [
    { motif: "zigzag", grow: 3, tone: "bg-creme text-rouille", scale: 0.9 },
    { grow: 0.2, tone: "bg-brun" },
    { motif: "entrelacs", grow: 2.6, tone: "bg-brun-soft text-rouille", scale: 0.9 },
    { grow: 0.2, tone: "bg-brun" },
    { motif: "filigrane", grow: 2.6, tone: "bg-terre text-creme/45", scale: 0.5 },
  ],
  [
    { motif: "filigrane", grow: 2, tone: "bg-brun text-rouille/70", scale: 0.55 },
    { grow: 0.3, tone: "bg-creme" },
    { motif: "rosaces", grow: 3, tone: "bg-rouille text-brun/70", scale: 0.6 },
    { grow: 0.3, tone: "bg-creme" },
    { motif: "losanges", grow: 3, tone: "bg-brun-soft text-creme/70", scale: 0.8 },
  ],
];

/** L'étoffe du hero : cinq lés tissés qui se déroulent l'un après l'autre, reliés par des points de couture. */
export function WovenCloth({ id, className }: { id: string; className?: string }) {
  return (
    <div aria-hidden className={cn("relative flex gap-1.5 sm:gap-2", className)}>
      {strips.map((blocks, i) => (
        <div key={i} className={cn("relative min-h-0 flex-1", i % 2 === 1 ? "lg:mt-12" : "lg:mb-12")} style={{ "--strip": i } as CSSProperties}>
          {i > 0 && (
            <span className="absolute left-[-9px] top-1/3 z-10 size-3 rotate-45 border-2 border-brun bg-orange animate-rise [animation-delay:calc(var(--strip)*160ms+1000ms)] sm:left-[-10px]" />
          )}
          {i > 0 && (
            <span className="absolute left-[-9px] top-2/3 z-10 size-3 rotate-45 border-2 border-brun bg-creme animate-rise [animation-delay:calc(var(--strip)*160ms+1100ms)] sm:left-[-10px]" />
          )}
          <div className="strip-reveal flex h-full flex-col overflow-hidden">
            {blocks.map((b, j) => (
              <div key={j} className={cn("relative min-h-0", b.tone)} style={{ flexGrow: b.grow, flexBasis: 0 }}>
                {b.motif && <Motif name={b.motif} id={`${id}-${i}-${j}`} scale={b.scale} className="absolute inset-0" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
