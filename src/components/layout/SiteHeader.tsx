"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { LuArrowRight, LuMenu, LuX } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Motif } from "@/components/motifs/Motif";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { navLinks } from "./nav";

/**
 * Navigation : transparente sur le hero, brune avec un liseré de losanges dès qu'on défile.
 * Mobile : le menu se déroule comme une étoffe depuis le haut.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu ouvert : page figée, Échap pour fermer
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const solid = scrolled || open;

  return (
    <header data-tone="dark" className="fixed inset-x-0 top-0 z-50 text-(--fg)">
      <div className={cn("transition-colors duration-500 ease-gala", solid ? "bg-brun" : "bg-transparent")}>
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
          <Link href="/" onClick={close} className="flex items-center gap-3" aria-label="Accueil, Soirée de Gala TTCT">
            <Logo variant="emblem" width={44} priority className="w-9 sm:w-11" />
            <span className="font-display text-[1.35rem] font-black uppercase leading-none tracking-[0.02em] sm:text-[1.5rem]">
              Gala <span className="text-orange">TTCT</span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={`/${l.href}`} className="link-zigzag text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-(--fg)/85 transition-colors hover:text-orange">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button href="/#pass" className="hidden px-5 sm:inline-flex">
              Réserver
            </Button>
            <button
              type="button"
              className="grid size-11 place-items-center border border-(--line) lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <LuX className="size-5" aria-hidden /> : <LuMenu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* Liseré : se tisse sous la barre quand elle devient opaque */}
      <div
        aria-hidden
        className={cn(
          "h-2.5 bg-brun text-rouille transition-[clip-path] duration-700 ease-gala",
          solid ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]",
        )}
      >
        <Motif name="losanges" id="nav-band" scale={0.3125} />
      </div>

      {open && (
        <div id="menu-mobile" className="menu-unroll fixed inset-x-0 bottom-0 top-[4.625rem] overflow-y-auto bg-brun bg-grain sm:top-[5.625rem] lg:hidden">
          <nav aria-label="Navigation mobile" className="flex min-h-full flex-col px-5 pb-10 pt-8 sm:px-8">
            <ul className="flex flex-col">
              {navLinks.map((l, i) => (
                <li key={l.href} className="animate-rise border-b border-(--line)" style={{ animationDelay: `${120 + i * 60}ms` } as CSSProperties}>
                  <a href={`/${l.href}`} onClick={close} className="flex items-center justify-between py-4 font-display text-[2.2rem] font-black uppercase leading-none">
                    {l.label}
                    <span aria-hidden className="size-2.5 rotate-45 bg-rouille" />
                  </a>
                </li>
              ))}
            </ul>
            <Button href="/#pass" size="lg" onClick={close} className="mt-10 w-full animate-rise [animation-delay:480ms]">
              Réserver mon pass
              <LuArrowRight className="size-4" aria-hidden />
            </Button>
            <div aria-hidden className="mt-auto h-16 pt-10 text-terre">
              <Motif name="entrelacs" id="menu-foot" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
