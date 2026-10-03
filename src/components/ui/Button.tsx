import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "link";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 font-sans font-semibold uppercase tracking-[0.16em] " +
  "transition-[transform,background-color,border-color,color] duration-300 ease-gala " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variants: Record<Variant, string> = {
  // L'action d'achat : orange atténué, texte brun (5,1 : 1), angles droits
  primary: "bg-orange text-brun hover:bg-ivoire hover:-translate-y-px active:translate-y-0",
  // Action secondaire : filet, prend la couleur du ton de la section
  secondary: "border border-(--fg)/40 text-(--fg) hover:border-(--accent) hover:text-(--accent)",
  link: "text-(--accent) underline decoration-1 underline-offset-[6px] hover:decoration-2",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-6 text-[0.74rem]",
  lg: "min-h-14 px-9 text-[0.82rem]",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };
type AsButton = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className">;
type AsLink = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "className" | "href">;

export function Button({ variant = "primary", size = "md", className, children, ...rest }: AsButton | AsLink) {
  const classes = cn(base, variant !== "link" && sizes[size], variants[variant], className);

  if (rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<AsLink, keyof CommonProps>)} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" {...(rest as Omit<AsButton, keyof CommonProps>)} className={classes}>
      {children}
    </button>
  );
}
