"use client";

import { useEffect, useState, type FormEvent } from "react";
import { LuMailPlus, LuUserMinus } from "react-icons/lu";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { invite, listInvitations, revokeInvitation, ROLE_LABEL, type Invitation, type Role } from "@/features/auth/api";
import { useStaffSession } from "@/features/auth/StaffShell";

/** Gestion des invitations : seules les adresses de cette liste peuvent se connecter à l'espace. */
export function Team() {
  const me = useStaffSession();
  const [list, setList] = useState<Invitation[] | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("STAFF");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listInvitations()
      .then((l) => !cancelled && setList(l))
      .catch(() => !cancelled && setError("La liste n’a pas pu être chargée."));
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Saisissez une adresse e-mail valide.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      setList(await invite(email, role));
      setEmail("");
    } catch (err) {
      setError(err instanceof Error && err.message === "ALREADY_INVITED" ? "Cette adresse est déjà invitée." : "L’invitation n’a pas pu être envoyée.");
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (address: string) => {
    if (!window.confirm(`Retirer l’accès de ${address} ? Cette personne sera déconnectée.`)) return;
    try {
      setList(await revokeInvitation(address));
    } catch {
      setError("L’accès n’a pas pu être retiré.");
    }
  };

  return (
    <>
      <h1 className="font-display text-[clamp(2.4rem,8vw,3.6rem)] font-black uppercase leading-none">Équipe</h1>
      <p className="mt-2 max-w-2xl text-sable">
        Seules les adresses e-mail invitées ici peuvent se connecter à l’espace organisateur. Un administrateur voit tout ; le personnel de contrôle n’a accès qu’au scanner.
      </p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-4 border border-terre bg-brun-soft p-5 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
        <Field label="Inviter une adresse e-mail" name="invite-email" type="email" inputMode="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} error={error ?? undefined} />
        <label className="flex flex-col gap-2">
          <span className="text-[0.74rem] font-semibold uppercase tracking-[0.14em]">Rôle</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="min-h-12 border border-(--line) bg-brun-soft px-4 text-[1rem] text-(--fg) focus:border-(--accent) focus:outline-none"
          >
            <option value="STAFF">{ROLE_LABEL.STAFF}</option>
            <option value="ADMIN">{ROLE_LABEL.ADMIN}</option>
          </select>
        </label>
        <Button type="submit" size="lg" disabled={busy} className="sm:mb-px">
          <LuMailPlus className="size-4" aria-hidden />
          {busy ? "Envoi…" : "Inviter"}
        </Button>
      </form>

      <h2 className="mt-12 font-display text-[1.9rem] font-black uppercase leading-none">Personnes invitées</h2>
      {!list ? (
        <p role="status" className="mt-5 text-sable">
          Chargement…
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-(--line) border-y border-(--line)">
          {list.map((i) => (
            <li key={i.email} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {i.email}
                  {i.email === me.email && <span className="ml-2 text-xs font-normal text-sable">(vous)</span>}
                </p>
                <p className="text-xs text-sable">{i.status === "ACTIVE" ? "Déjà connectée" : "Invitée, jamais connectée"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={i.role === "ADMIN" ? "orange" : "neutre"}>{ROLE_LABEL[i.role]}</Badge>
                {i.email !== me.email && (
                  <button
                    type="button"
                    onClick={() => void revoke(i.email)}
                    className="inline-flex min-h-10 items-center gap-1.5 border border-(--line) px-3 text-xs font-semibold uppercase tracking-[0.1em] hover:border-alerte hover:text-alerte"
                  >
                    <LuUserMinus className="size-4" aria-hidden />
                    Retirer
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
