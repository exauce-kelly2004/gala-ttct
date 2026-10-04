import Image from "next/image";
import { cn } from "@/lib/cn";
import emblem from "../../../public/images/brand/ttct-logo-creme.png";
import full from "../../../public/images/brand/ttct-logo-full-creme.png";

type LogoProps = {
  /** « emblem » : blason + cartouche TTCT · « full » : avec La Team Télé Contre Télé */
  variant?: "emblem" | "full";
  /** Largeur d'affichage en pixels ; la hauteur suit les proportions d'origine. */
  width: number;
  priority?: boolean;
  className?: string;
};

/**
 * Logo officiel TTCT, version crème validée : à poser uniquement sur fond brun.
 * Tracé et proportions d'origine, seules les couleurs sont adaptées.
 */
export function Logo({ variant = "emblem", width, priority, className }: LogoProps) {
  const src = variant === "full" ? full : emblem;
  return (
    <Image
      src={src}
      alt="TTCT, La Team Télé Contre Télé"
      width={width}
      height={Math.round((width * src.height) / src.width)}
      preload={priority}
      className={cn("h-auto select-none", className)}
    />
  );
}
