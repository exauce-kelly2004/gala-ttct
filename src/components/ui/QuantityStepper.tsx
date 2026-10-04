"use client";

import { useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";

type QuantityStepperProps = {
  label: string;
  min?: number;
  max: number;
  defaultValue?: number;
  /** Mode contrôlé : la valeur vient du parent (panier du checkout). */
  value?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
};

/** Sélecteur de quantité : boutons tactiles de 44 px, valeur annoncée aux lecteurs d'écran. */
export function QuantityStepper({ label, min = 0, max, defaultValue = min, value: controlled, disabled, onChange }: QuantityStepperProps) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;

  const update = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    setInternal(clamped);
    onChange?.(clamped);
  };

  const buttonClass =
    "grid size-11 place-items-center transition-colors duration-200 hover:bg-(--fg)/10 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div role="group" aria-label={label} className="inline-flex items-center border border-(--line)">
      <button type="button" className={buttonClass} onClick={() => update(value - 1)} disabled={disabled || value <= min} aria-label="Retirer un pass">
        <LuMinus className="size-4" aria-hidden />
      </button>
      <output aria-live="polite" className="w-11 text-center font-display text-[1.7rem] font-black leading-none tabular-nums">
        {value}
      </output>
      <button type="button" className={buttonClass} onClick={() => update(value + 1)} disabled={disabled || value >= max} aria-label="Ajouter un pass">
        <LuPlus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
