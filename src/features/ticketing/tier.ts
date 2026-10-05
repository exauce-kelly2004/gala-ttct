/**
 * Identité visuelle de chaque type de pass : le billet, le bandeau du contrôle et les comptages
 * s'y réfèrent pour qu'un V.V.I.P, un V.I.P et un Solo se reconnaissent au premier coup d'œil.
 * Palette du site uniquement ; le texte porte toujours le sens (jamais la couleur seule).
 */
export type TierStyle = {
  /** Étiquette courte, en grand. */
  label: string;
  /** Cadre du billet. */
  card: string;
  /** Bande de losanges du haut. */
  band: string;
  /** Ruban « type d'accès » sous la bande. */
  ribbon: string;
  /** Bandeau du type au contrôle. */
  banner: string;
  /** Talon du bas. */
  foot: string;
};

const tiers: Record<string, TierStyle> = {
  "duo-vvip": {
    label: "V.V.I.P",
    card: "border-orange",
    band: "bg-orange text-brun/70",
    ribbon: "bg-orange text-brun",
    banner: "bg-orange text-brun",
    foot: "bg-orange text-brun/60",
  },
  "duo-vip": {
    label: "V.I.P",
    card: "border-rouille",
    band: "bg-rouille text-brun/70",
    ribbon: "border-y-2 border-rouille bg-terre text-creme",
    banner: "border-2 border-rouille bg-terre text-creme",
    foot: "bg-rouille text-brun/60",
  },
  solo: {
    label: "Solo",
    card: "border-terre",
    band: "bg-brun text-rouille",
    ribbon: "border-y border-terre bg-brun text-creme",
    banner: "border-2 border-creme text-creme",
    foot: "bg-terre text-brun/60",
  },
};

export const tierOf = (passSlug: string): TierStyle => tiers[passSlug] ?? tiers.solo;
