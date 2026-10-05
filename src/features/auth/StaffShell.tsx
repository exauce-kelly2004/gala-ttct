"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LuLogOut, LuScanLine } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import { Rosace } from "@/components/motifs/Motif";
import { cn } from "@/lib/cn";
import { getSession, IS_DEMO, ROLE_LABEL, signOut, type Role, type Session } from "./api";

const SessionContext = createContext<Session | null>(null);

/** Session de la personne connectée, disponible dans toutes les pages de l'espace réservé. */
export const useStaffSession = () => useContext(SessionContext) as Session;

const nav: { href: string; label: string; roles: Role[] }[] = [
  { href: "/espace/controle", label: "Contrôle", roles: ["ADMIN", "STAFF"] },
  { href: "/espace", label: "Tableau de bord", roles: ["ADMIN"] },
  { href: "/espace/commandes", label: "Commandes", roles: ["ADMIN"] },
  { href: "/espace/billets", label: "Billets", roles: ["ADMIN"] },
  { href: "/espace/equipe", label: "Équipe", roles: ["ADMIN"] },
];

/** Message affiché à une personne connectée qui n'a pas le droit d'ouvrir la page demandée. */
function Forbidden() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="font-display text-[2.4rem] font-black uppercase leading-none">Accès réservé</h1>
      <p className="mt-4 text-sable">Cette page est réservée aux administrateurs. Le contrôle des billets reste disponible pour le personnel.</p>
      <Link href="/espace/controle" className="mt-8 inline-flex min-h-11 items-center bg-orange px-6 text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-brun">
        Aller au contrôle
      </Link>
    </div>
  );
}

/**
 * Enveloppe de l'espace réservé : attend la session, renvoie vers la connexion si elle manque,
 * puis affiche la navigation adaptée au rôle. Cette garde est un confort d'affichage :
 * la vraie protection est celle du serveur (voir features/auth/api.ts).
 */
export function StaffShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSession().then((s) => {
      if (cancelled) return;
      if (!s) router.replace(`/espace/connexion?retour=${encodeURIComponent(pathname)}`);
      else setSession(s);
      setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (!checked || !session) {
    return (
      <div role="status" className="grid min-h-svh place-items-center text-sable">
        <div className="flex flex-col items-center gap-4">
          <Rosace rings={4} draw className="size-16 text-orange" />
          Vérification de l’accès
        </div>
      </div>
    );
  }

  const links = nav.filter((n) => n.roles.includes(session.role));
  const allowed = links.some((l) => (l.href === "/espace" ? pathname === "/espace" : pathname.startsWith(l.href)));

  const logout = async () => {
    await signOut();
    router.replace("/espace/connexion");
  };

  return (
    <SessionContext.Provider value={session}>
      <header className="border-b border-terre bg-brun-soft print:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href={session.role === "ADMIN" ? "/espace" : "/espace/controle"} className="flex items-center gap-3" aria-label="Espace organisateur">
            <Logo variant="emblem" width={36} className="w-9" />
            <span className="hidden font-display text-[1.35rem] font-black uppercase leading-none sm:block">
              Espace <span className="text-orange">organisateur</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{session.email}</p>
              <p className="text-[0.66rem] uppercase tracking-[0.18em] text-sable">{ROLE_LABEL[session.role]}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-11 items-center gap-2 border border-(--line) px-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] hover:border-orange hover:text-orange"
            >
              <LuLogOut className="size-4" aria-hidden />
              <span className="hidden sm:inline">Déconnexion</span>
              <span className="sr-only sm:hidden">Déconnexion</span>
            </button>
          </div>
        </div>
        <nav aria-label="Espace organisateur" className="mx-auto w-full max-w-6xl overflow-x-auto px-4 sm:px-6">
          <ul className="flex gap-1">
            {links.map((l) => {
              const active = l.href === "/espace" ? pathname === "/espace" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                      active ? "border-orange text-orange" : "border-transparent text-(--fg)/80 hover:text-orange",
                    )}
                  >
                    {l.href === "/espace/controle" && <LuScanLine className="size-4" aria-hidden />}
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {IS_DEMO && (
        <p className="border-b border-orange/40 bg-brun px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-orange print:hidden">
          Démonstration : accès et données simulés, rien n’est réel
        </p>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6">{allowed ? children : <Forbidden />}</main>
    </SessionContext.Provider>
  );
}

/** Petit badge de rôle réutilisable. */
export function RoleBadge({ role }: { role: Role }) {
  return <Badge tone={role === "ADMIN" ? "orange" : "neutre"}>{ROLE_LABEL[role]}</Badge>;
}
