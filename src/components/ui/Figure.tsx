import { cn } from "@/lib/cn";

/** Chiffre massif + label : compte à rebours, chiffres clés réels. */
export function Figure({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <span className="font-display text-[clamp(2.8rem,9vw,4.75rem)] font-black leading-none tabular-nums">{value}</span>
      <span className="mt-2 text-[0.64rem] font-semibold uppercase tracking-[0.26em] text-(--fg-muted)">{label}</span>
    </div>
  );
}
