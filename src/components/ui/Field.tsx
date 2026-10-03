import type { ComponentProps } from "react";
import { LuCircleAlert } from "react-icons/lu";
import { cn } from "@/lib/cn";

type FieldProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

/** Champ de formulaire sobre : label explicite, erreur lisible, cible tactile de 48 px. S'adapte au ton. */
export function Field({ label, error, hint, id, className, ...props }: FieldProps) {
  const inputId = id ?? props.name;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={inputId} className="text-[0.74rem] font-semibold uppercase tracking-[0.14em]">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "min-h-12 border bg-brun-soft px-4 text-[1rem] text-(--fg) placeholder:text-(--fg)/40",
          "transition-colors duration-200 focus:outline-none focus-visible:outline-none",
          error ? "border-alerte focus:border-alerte" : "border-(--line) hover:border-(--fg)/50 focus:border-(--accent)",
          "[[data-tone=light]_&]:bg-ivoire/55",
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="flex items-center gap-1.5 text-sm font-medium text-alerte [[data-tone=light]_&]:text-[#8e2a17]">
          <LuCircleAlert className="size-4 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-(--fg-muted)">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
