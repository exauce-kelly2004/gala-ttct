import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Système de motifs TTCT : « le tissage des cultures ».
 * Losanges, rosaces, zigzags et entrelacs sont des géométries partagées par de nombreuses
 * traditions textiles ; réunies dans une même bande, elles racontent le métissage du gala.
 * Motifs originaux en SVG, colorés par `currentColor`.
 */
export type MotifName = "losanges" | "rosaces" | "zigzag" | "entrelacs" | "filigrane";

type Tile = { w: number; h: number; body: ReactNode };

const tiles: Record<MotifName, Tile> = {
  losanges: {
    w: 32,
    h: 32,
    body: (
      <>
        <rect x="0" y="1" width="32" height="2" fill="currentColor" />
        <rect x="0" y="29" width="32" height="2" fill="currentColor" />
        <path d="M16 7 25 16 16 25 7 16Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 13 19 16 16 19 13 16Z" fill="currentColor" />
        <path d="M0 13 3 16 0 19ZM32 13 29 16 32 19Z" fill="currentColor" />
      </>
    ),
  },
  rosaces: {
    w: 48,
    h: 48,
    body: (
      <>
        <circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="24" cy="24" r="9.5" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="24" cy="24" r="3.5" fill="currentColor" />
      </>
    ),
  },
  zigzag: {
    w: 24,
    h: 24,
    body: (
      <>
        <path d="M0 9 6 3 12 9 18 3 24 9" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M0 21 6 15 12 21 18 15 24 21" fill="none" stroke="currentColor" strokeWidth="2.5" />
      </>
    ),
  },
  entrelacs: {
    w: 40,
    h: 28,
    body: (
      <>
        <path d="M10 2 22 14 10 26-2 14Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M30 2 42 14 30 26 18 14Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="10" cy="14" r="2.5" fill="currentColor" />
        <circle cx="30" cy="14" r="2.5" fill="currentColor" />
      </>
    ),
  },
  filigrane: {
    w: 56,
    h: 56,
    body: (
      <>
        <path d="M28 0 56 28 28 56 0 28Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M28 14 42 28 28 42 14 28Z" fill="none" stroke="currentColor" strokeWidth="1" />
      </>
    ),
  },
};

type MotifProps = {
  name: MotifName;
  /** Identifiant unique du pattern dans la page. */
  id: string;
  scale?: number;
  className?: string;
  style?: CSSProperties;
};

/** Surface remplie par un motif répété ; la taille vient du conteneur. Purement décoratif. */
export function Motif({ name, id, scale = 1, className, style }: MotifProps) {
  const tile = tiles[name];
  return (
    <svg aria-hidden focusable="false" className={cn("block h-full w-full", className)} style={style}>
      <defs>
        <pattern id={id} width={tile.w} height={tile.h} patternUnits="userSpaceOnUse" patternTransform={`scale(${scale})`}>
          {tile.body}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Rosace isolée (cercles concentriques), élément de composition à grande échelle. */
export function Rosace({ rings = 4, className }: { rings?: number; className?: string }) {
  const step = 88 / rings;
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 200 200" className={className}>
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx="100" cy="100" r={96 - i * step} fill="none" stroke="currentColor" strokeWidth={step / 2.2} />
      ))}
      <circle cx="100" cy="100" r={step / 2} fill="currentColor" />
    </svg>
  );
}

type BandProps = {
  /** Préfixe unique pour les patterns de la bande. */
  id: string;
  /**
   * metissage : bande composite (losanges + entrelacs + zigzag), signature du site
   * fine : simple liseré losanges, pour séparer sans alourdir
   */
  variant?: "metissage" | "fine";
  /** Déroulement à l'entrée dans l'écran. */
  reveal?: boolean;
  className?: string;
};

/** Bande textile horizontale : séparateur structurant entre les grandes sections. */
export function MotifBand({ id, variant = "metissage", reveal = true, className }: BandProps) {
  if (variant === "fine") {
    return (
      <div aria-hidden className={cn("h-5 bg-brun text-terre", reveal && "band-reveal", className)}>
        <Motif name="losanges" id={`${id}-l`} scale={0.625} />
      </div>
    );
  }
  return (
    <div aria-hidden className={cn(reveal && "band-reveal", className)}>
      <div className="h-6 bg-brun text-rouille">
        <Motif name="losanges" id={`${id}-l`} scale={0.75} />
      </div>
      <div className="h-1.5 bg-rouille" />
      <div className="h-8 bg-brun-soft text-terre">
        <Motif name="entrelacs" id={`${id}-e`} scale={1.15} />
      </div>
      <div className="h-1.5 bg-terre" />
      <div className="h-4 bg-brun text-rouille/70">
        <Motif name="zigzag" id={`${id}-z`} scale={0.66} />
      </div>
    </div>
  );
}
