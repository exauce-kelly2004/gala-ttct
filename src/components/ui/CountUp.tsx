"use client";

import { useEffect, useRef, useState } from "react";
import { formatAmount } from "@/lib/format";

/**
 * Montant qui « compte » jusqu'à sa valeur la première fois qu'il entre dans l'écran.
 * Le rendu serveur affiche directement la valeur finale (lisible sans JavaScript) ;
 * aucune animation si l'utilisateur préfère réduire les mouvements.
 */
export function CountUp({ value, duration = 1100, className }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          // Arrondi au millier pendant le compte, valeur exacte à la fin
          setShown(t < 1 ? Math.round((value * eased) / 1000) * 1000 : value);
          if (t < 1) frame = requestAnimationFrame(step);
        };
        setShown(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {formatAmount(shown)}
    </span>
  );
}
