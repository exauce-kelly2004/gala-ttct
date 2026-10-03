import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Largeur de lecture du site, gouttières mobiles de 20 px. */
export function Container({ className, size = "default", ...props }: ComponentProps<"div"> & { size?: "narrow" | "default" | "wide" }) {
  const widths = { narrow: "max-w-3xl", default: "max-w-6xl", wide: "max-w-7xl" };
  return <div className={cn("mx-auto w-full px-5 sm:px-8", widths[size], className)} {...props} />;
}

type SectionProps = ComponentProps<"section"> & {
  /**
   * brun : fond dominant · brun-soft : surface légèrement relevée
   * parchemin : section claire de lecture (texte brun)
   */
  tone?: "brun" | "brun-soft" | "parchemin";
};

const tones = {
  brun: { cls: "bg-brun bg-grain [--section-bg:var(--color-brun)]", data: "dark" },
  "brun-soft": { cls: "bg-brun-soft bg-grain [--section-bg:var(--color-brun-soft)]", data: "dark" },
  parchemin: { cls: "bg-parchemin bg-grain [--section-bg:var(--color-parchemin)]", data: "light" },
} as const;

/** Section principale : beaucoup d'air vertical (échelle 80 / 96 / 128). Fixe le ton des composants. */
export function Section({ tone = "brun", className, ...props }: SectionProps) {
  return (
    <section
      data-tone={tones[tone].data}
      className={cn("relative py-20 text-(--fg) sm:py-24 lg:py-32", tones[tone].cls, className)}
      {...props}
    />
  );
}
