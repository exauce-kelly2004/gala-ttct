"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LuArrowLeft, LuArrowRight, LuMail } from "react-icons/lu";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { DEMO_CODE, DEMO_INVITED, IS_DEMO, requestCode, verifyCode } from "./api";

/** Connexion en deux temps : l'e-mail, puis le code reçu. Aucun mot de passe. */
export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submitEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Saisissez une adresse e-mail valide.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await requestCode(email);
      setStep("code");
    } catch {
      setError("L’envoi du code a échoué. Réessayez dans un instant.");
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await verifyCode(email, code);
      const back = params.get("retour");
      // Seuls les chemins internes sont acceptés comme destination de retour
      const safe = back && back.startsWith("/espace") && !back.startsWith("//") ? back : null;
      router.replace(safe && (session.role === "ADMIN" || safe.startsWith("/espace/controle")) ? safe : session.role === "ADMIN" ? "/espace" : "/espace/controle");
    } catch {
      setError("Code incorrect ou expiré. Vérifiez le code reçu ou demandez-en un nouveau.");
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center px-5 py-12">
      <div className="flex flex-col items-center text-center">
        <Logo variant="emblem" width={72} priority className="w-[72px]" />
        <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-orange">Espace organisateur</p>
        <h1 className="mt-2 font-display text-[clamp(2.6rem,11vw,3.4rem)] font-black uppercase leading-[0.92]">Connexion</h1>
        <p className="mt-3 text-sable">Réservé aux administrateurs et au personnel invités par l’organisation.</p>
      </div>

      {step === "email" ? (
        <form onSubmit={submitEmail} noValidate className="mt-8 grid gap-5">
          <Field
            label="Votre adresse e-mail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error ?? undefined}
            hint="Nous vous envoyons un code de connexion si cette adresse est invitée."
          />
          <Button type="submit" size="lg" disabled={busy} className="w-full">
            {busy ? "Envoi…" : "Recevoir mon code"}
            {!busy && <LuArrowRight className="size-4" aria-hidden />}
          </Button>
        </form>
      ) : (
        <form onSubmit={submitCode} noValidate className="mt-8 grid gap-5">
          <p className="flex items-start gap-3 border border-(--line) p-4 text-sm">
            <LuMail className="mt-0.5 size-5 shrink-0 text-orange" aria-hidden />
            <span>
              Si <strong className="font-semibold">{email.trim()}</strong> est invitée, un code à 6 chiffres vient d’y être envoyé. Il expire rapidement.
            </span>
          </p>
          <Field
            label="Code de connexion"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={6}
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            error={error ?? undefined}
            className="[&_input]:text-center [&_input]:font-mono [&_input]:text-2xl [&_input]:tracking-[0.5em]"
          />
          <Button type="submit" size="lg" disabled={busy || code.length < 6} className="w-full">
            {busy ? "Vérification…" : "Me connecter"}
          </Button>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
            className="inline-flex items-center justify-center gap-2 text-sm text-sable hover:text-ivoire"
          >
            <LuArrowLeft className="size-4" aria-hidden />
            Changer d’adresse
          </button>
        </form>
      )}

      {IS_DEMO && (
        <div className="mt-8 border border-orange/60 p-4 text-sm">
          <p className="font-semibold uppercase tracking-[0.14em] text-orange">Démonstration</p>
          <p className="mt-2 text-(--fg)/85">
            Aucun e-mail n’est envoyé. Adresses invitées : {DEMO_INVITED.map((i) => `${i.email} (${i.role === "ADMIN" ? "administrateur" : "personnel"})`).join(" · ")}. Code :{" "}
            <span className="font-mono font-semibold">{DEMO_CODE}</span>.
          </p>
        </div>
      )}

      <Link href="/" className="mt-8 text-center text-sm text-sable hover:text-ivoire">
        Retour au site
      </Link>
    </div>
  );
}
