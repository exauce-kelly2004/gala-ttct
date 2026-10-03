import { LuImage } from "react-icons/lu";
import { Motif } from "@/components/motifs/Motif";
import { cn } from "@/lib/cn";

/**
 * Cadre réservé à une future photo officielle : motif + mention explicite.
 * Ne remplace jamais une photo par une image présentée comme réelle.
 */
export function PhotoFrame({ id, label, className }: { id: string; label: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden border border-(--line) bg-brun-soft", className)}>
      <Motif name="filigrane" id={id} className="absolute inset-0 text-terre/70" />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-sable">
        <LuImage className="size-6" aria-hidden />
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em]">{label}</p>
      </div>
    </div>
  );
}
