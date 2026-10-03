import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/cn";

/** Petit label de section : Work Sans, capitales espacées, couleur d'accent du ton. */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-(--accent)", className)} {...props} />;
}

type HeadingProps = ComponentProps<"h2"> & {
  as?: ElementType;
  size?: "monumental" | "xl" | "lg" | "md";
};

const headingSizes = {
  monumental: "text-[clamp(6rem,26vw,15rem)] leading-[0.82] tracking-[0.01em]",
  xl: "text-[clamp(3rem,8vw,5.5rem)] leading-[0.92]",
  lg: "text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.98]",
  md: "text-[1.9rem] leading-none",
};

/** Titre Londrina Solid, capitales, graisse Black. */
export function Heading({ as: Tag = "h2", size = "lg", className, ...props }: HeadingProps) {
  return <Tag className={cn("font-display font-black uppercase text-balance", headingSizes[size], className)} {...props} />;
}

/** Accent fin Londrina Light : « Soirée de », sous-titres courts. */
export function Accent({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("font-display font-light uppercase tracking-[0.08em]", className)} {...props} />;
}

/** Paragraphe éditorial. */
export function Lead({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("max-w-prose text-[1.06rem] leading-[1.75] text-(--fg)/85 text-pretty", className)} {...props} />;
}
