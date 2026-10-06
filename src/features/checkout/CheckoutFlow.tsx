"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LuArrowLeft, LuArrowRight, LuLock, LuPencil, LuShieldCheck } from "react-icons/lu";
import { Motif } from "@/components/motifs/Motif";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { event } from "@/config/event";
import { legal } from "@/config/legal";
import { passes } from "@/config/passes";
import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/format";
import { buyerSchema, type BuyerErrors, type BuyerInput } from "./buyer-schema";
import { createOrder, IS_DEMO } from "./api";
import { cartLines, linesSeats, linesTotal, type Buyer, type Cart } from "./order";

type Step = 1 | 2 | 3;

const steps: { n: Step; label: string }[] = [
  { n: 1, label: "Pass" },
  { n: 2, label: "Coordonnées" },
  { n: 3, label: "Paiement" },
];

type BuyerForm = BuyerInput;

const emptyBuyer: BuyerForm = { lastName: "", firstName: "", email: "", phone: "" };

/** Fil d'étapes : losanges reliés, comme le fil du programme. On peut revenir en arrière, pas sauter devant. */
function StepRail({ current, onGo }: { current: Step; onGo: (s: Step) => void }) {
  return (
    <ol className="flex items-center" aria-label="Étapes de la réservation">
      {steps.map((s, i) => {
        const done = s.n < current;
        const active = s.n === current;
        return (
          <li key={s.n} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
            <button
              type="button"
              onClick={() => done && onGo(s.n)}
              disabled={!done}
              aria-current={active ? "step" : undefined}
              className="group flex items-center gap-2.5 disabled:cursor-default"
            >
              <span
                className={cn(
                  "grid size-8 rotate-45 place-items-center border-2 transition-colors duration-300",
                  done && "border-orange bg-orange text-brun group-hover:bg-ivoire group-hover:border-ivoire",
                  active && "border-orange text-orange",
                  !done && !active && "border-terre text-sable",
                )}
              >
                <span className="-rotate-45 font-display text-[1.05rem] font-black leading-none">{s.n}</span>
              </span>
              <span
                className={cn(
                  "text-[0.66rem] font-semibold uppercase tracking-[0.16em] sm:text-[0.72rem] sm:tracking-[0.2em]",
                  active ? "text-ivoire" : done ? "text-orange" : "text-sable",
                  !active && "hidden sm:inline",
                )}
              >
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && <span aria-hidden className={cn("mx-3 h-0.5 flex-1 sm:mx-4", done ? "bg-orange" : "bg-terre")} />}
          </li>
        );
      })}
    </ol>
  );
}

export function CheckoutFlow({ initialCart }: { initialCart: Cart }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [cart, setCart] = useState<Cart>(initialCart);
  const [buyer, setBuyer] = useState<BuyerForm>(emptyBuyer);
  const [errors, setErrors] = useState<BuyerErrors>({});
  const [cartError, setCartError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [acceptError, setAcceptError] = useState(false);
  const [guests, setGuests] = useState<Record<string, string>>({});
  const [guestErrors, setGuestErrors] = useState<Record<string, string>>({});
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const lines = cartLines(cart);
  // Un Pass Duo = un billet pour deux personnes : on demande le nom du second invité, pass par pass
  const guestSlots = lines.flatMap((l) =>
    l.seats > 1 ? Array.from({ length: l.quantity }, (_, i) => ({ key: `${l.slug}-${i}`, slug: l.slug, name: l.name, n: i + 1, of: l.quantity })) : [],
  );
  const total = linesTotal(lines);
  const seats = linesSeats(lines);

  // À chaque changement d'étape : retour en haut et focus sur le titre (lecteurs d'écran, clavier)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    titleRef.current?.focus({ preventScroll: true });
  }, [step]);

  const setQuantity = (slug: string, quantity: number) => {
    setCart((c) => ({ ...c, [slug]: quantity }));
    setCartError(null);
  };

  const updateBuyer = (key: keyof BuyerForm, value: string) => {
    setBuyer((b) => ({ ...b, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateBuyer = () => {
    const result = buyerSchema.safeParse(buyer);
    if (result.success) return result.data;
    const next: BuyerErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof BuyerInput;
      next[key] ??= issue.message;
    }
    setErrors(next);
    // Focus sur le premier champ en erreur
    const first = (["lastName", "firstName", "email", "phone"] as const).find((k) => next[k]);
    if (first) document.getElementById(`buyer-${first}`)?.focus();
    return null;
  };

  const validateGuests = () => {
    const next: Record<string, string> = {};
    for (const s of guestSlots) {
      if ((guests[s.key] ?? "").trim().length < 2) next[s.key] = "Saisissez le nom complet de votre invité, il figurera sur le billet.";
    }
    setGuestErrors(next);
    const first = guestSlots.find((s) => next[s.key]);
    if (first) document.getElementById(`guest-${first.key}`)?.focus();
    return Object.keys(next).length === 0;
  };

  const pay = async (data: Buyer) => {
    setPaying(true);
    try {
      const { reference, paymentUrl } = await createOrder({
        buyer: data,
        items: lines.map((l) => ({
          passSlug: l.slug,
          quantity: l.quantity,
          ...(l.seats > 1 && { guestNames: Array.from({ length: l.quantity }, (_, i) => (guests[`${l.slug}-${i}`] ?? "").trim()) }),
        })),
        termsAcceptedAt: new Date().toISOString(),
        termsVersion: legal.updatedAt,
      });
      // Prestataire avec page de paiement hébergée : on y redirige ; sinon, confirmation directe
      if (paymentUrl) window.location.assign(paymentUrl);
      else router.push(`/confirmation?ref=${encodeURIComponent(reference)}`);
    } catch (err) {
      setPaying(false);
      // Le serveur explique les refus utiles à l'acheteur (pass épuisé, trop de commandes) ; sinon message général
      const reason = err instanceof Error && err.message !== "ORDER_FAILED" ? err.message : null;
      setPayError(reason ?? "Le paiement n’a pas pu être lancé. Vérifiez votre connexion et réessayez.");
    }
  };

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    if (step === 1) {
      if (lines.length === 0) {
        setCartError("Choisissez au moins un pass pour continuer.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const buyerOk = validateBuyer();
      // Les deux validations s'exécutent pour afficher toutes les erreurs d'un coup
      if (validateGuests() && buyerOk) setStep(3);
    } else {
      const data = validateBuyer();
      // Acceptation des CGV obligatoire avant paiement (Code du numérique, art. 338 et 343)
      if (data && !accepted) {
        setAcceptError(true);
        document.getElementById("accept-cgv")?.focus();
        return;
      }
      if (data)
        void pay({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        });
    }
  };

  const actionLabel = step === 1 ? "Continuer" : step === 2 ? "Vers le paiement" : `Payer ${formatAmount(total)} FCFA`;

  const action = (
    <Button type="submit" form="checkout-form" size="lg" className="w-full" disabled={paying}>
      {paying ? (
        <>
          <span className="flex gap-1.5" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-2 rotate-45 animate-pulse bg-brun" style={{ animationDelay: `${i * 160}ms` }} />
            ))}
          </span>
          Paiement en cours
        </>
      ) : (
        <>
          {step === 3 && <LuLock className="size-4" aria-hidden />}
          {actionLabel}
          {step < 3 && <LuArrowRight className="size-4" aria-hidden />}
        </>
      )}
    </Button>
  );

  return (
    <div className="pb-28 lg:pb-0">
      <StepRail current={step} onGo={setStep} />

      <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
        <form id="checkout-form" noValidate onSubmit={next} className="lg:col-span-7">
          {step === 1 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" ref={titleRef} tabIndex={-1} className="font-display text-[2.2rem] font-black uppercase leading-none outline-none">
                Vos pass
              </h2>
              <p className="mt-2 text-sable">Ajustez les quantités. Un Pass Duo vaut pour deux personnes.</p>

              <ul className="mt-8 divide-y divide-(--line) border-y border-(--line)">
                {passes.map((p) => {
                  const soldOut = p.availability === "soldout";
                  return (
                    <li key={p.slug} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-6">
                      <div className="min-w-0">
                        <p className="font-display text-[1.7rem] font-black uppercase leading-none">{p.name}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-sable">
                          <span className="font-semibold text-orange tabular-nums">{formatAmount(p.price)} FCFA</span>
                          <span aria-hidden className="size-1.5 rotate-45 bg-terre" />
                          {p.seats > 1 ? `${p.seats} personnes` : "1 personne"}
                          {p.availability !== "available" && <Badge tone={soldOut ? "alerte" : "orange"}>{soldOut ? "Complet" : "Dernières places"}</Badge>}
                        </p>
                      </div>
                      <QuantityStepper
                        label={`Quantité, ${p.name}`}
                        min={0}
                        max={p.maxPerOrder}
                        value={cart[p.slug] ?? 0}
                        disabled={soldOut}
                        onChange={(q) => setQuantity(p.slug, q)}
                      />
                    </li>
                  );
                })}
              </ul>
              {cartError && (
                <p role="alert" className="mt-4 text-sm font-medium text-alerte">
                  {cartError}
                </p>
              )}
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="step-title">
              {/* La commande d'abord : l'acheteur voit ce qu'il réserve avant de remplir le formulaire */}
              <h2 id="step-title" ref={titleRef} tabIndex={-1} className="font-display text-[2.2rem] font-black uppercase leading-none outline-none">
                Votre commande
              </h2>
              <div className="mt-6 border border-terre bg-brun-soft">
                <div aria-hidden className="h-3 bg-brun text-rouille">
                  <Motif name="losanges" id="step2-recap" scale={0.4} />
                </div>
                <div className="p-5 sm:p-6">
                  <ul className="space-y-3">
                    {lines.map((l) => (
                      <li key={l.slug} className="flex items-baseline justify-between gap-4">
                        <span>
                          <span className="font-display text-[1.5rem] font-black tabular-nums">{l.quantity}</span> <span className="text-sable">×</span>{" "}
                          <span className="font-semibold">{l.name}</span>
                          <span className="block text-xs text-sable">
                            {formatAmount(l.price)} FCFA · {l.seats > 1 ? `${l.seats} personnes` : "1 personne"} par pass
                          </span>
                        </span>
                        <span className="shrink-0 tabular-nums text-(--fg)/85">{formatAmount(l.price * l.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-(--line) pt-5">
                    <div>
                      <p className="text-xs text-sable">
                        Total · {seats} {seats > 1 ? "personnes" : "personne"}
                      </p>
                      <p className="mt-1 font-display text-[2.2rem] font-black leading-none text-orange tabular-nums">
                        {formatAmount(total)} <span className="text-sm text-sable">FCFA</span>
                      </p>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange hover:text-ivoire">
                      <LuPencil className="size-3.5" aria-hidden />
                      Modifier
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="mt-12 font-display text-[2rem] font-black uppercase leading-none">Vos coordonnées</h3>
              <p className="mt-2 text-sable">Vos billets seront envoyés à cette adresse e-mail. Aucun compte à créer.</p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field
                  id="buyer-lastName"
                  label="Nom"
                  autoComplete="family-name"
                  value={buyer.lastName}
                  onChange={(e) => updateBuyer("lastName", e.target.value)}
                  error={errors.lastName}
                />
                <Field
                  id="buyer-firstName"
                  label="Prénom"
                  autoComplete="given-name"
                  value={buyer.firstName}
                  onChange={(e) => updateBuyer("firstName", e.target.value)}
                  error={errors.firstName}
                />
                <Field
                  id="buyer-email"
                  label="E-mail"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={buyer.email}
                  onChange={(e) => updateBuyer("email", e.target.value)}
                  error={errors.email}
                  className="sm:col-span-2"
                />
                <Field
                  id="buyer-phone"
                  label="Téléphone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="01 97 86 57 58"
                  value={buyer.phone}
                  onChange={(e) => updateBuyer("phone", e.target.value)}
                  error={errors.phone}
                  hint="Utilisé uniquement pour votre commande."
                  className="sm:col-span-2"
                />
              </div>
              {guestSlots.length > 0 && (
                <>
                  <h3 className="mt-12 font-display text-[2rem] font-black uppercase leading-none">Vos invités</h3>
                  <p className="mt-2 text-sable">Chaque Pass Duo est nominatif : les deux noms sont inscrits sur le billet et affichés au contrôle à l’entrée.</p>
                  <div className="mt-8 grid gap-6">
                    {guestSlots.map((s) => (
                      <Field
                        key={s.key}
                        id={`guest-${s.key}`}
                        label={`Invité · ${s.name}${s.of > 1 ? ` n° ${s.n}` : ""}`}
                        autoComplete="off"
                        placeholder="Prénom et nom"
                        value={guests[s.key] ?? ""}
                        onChange={(e) => {
                          setGuests((g) => ({ ...g, [s.key]: e.target.value }));
                          if (guestErrors[s.key]) setGuestErrors((er) => ({ ...er, [s.key]: "" }));
                        }}
                        error={guestErrors[s.key] || undefined}
                      />
                    ))}
                  </div>
                </>
              )}
              {/* Information à la collecte (Code du numérique, art. 415) */}
              <p className="mt-6 text-sm leading-relaxed text-sable">
                Vos données servent uniquement à traiter votre commande, à vous envoyer vos billets et à contrôler l’accès au gala. Elles ne sont ni vendues ni utilisées pour de la
                prospection. Pour en savoir plus et exercer vos droits, consultez notre{" "}
                <Link href="/confidentialite" target="_blank" className="text-orange underline underline-offset-4">
                  politique de confidentialité
                </Link>
                .
              </p>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="step-title">
              <h2 id="step-title" ref={titleRef} tabIndex={-1} className="font-display text-[2.2rem] font-black uppercase leading-none outline-none">
                Paiement
              </h2>
              <p className="mt-2 text-sable">Vérifiez vos informations, puis payez en toute sécurité.</p>

              <div className="mt-8 border border-(--line) p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sable">Acheteur</p>
                    <p className="mt-2 font-semibold">
                      {buyer.firstName} {buyer.lastName}
                    </p>
                    <p className="text-sm text-(--fg)/80">{buyer.email}</p>
                    <p className="text-sm text-(--fg)/80">{buyer.phone}</p>
                    {guestSlots.length > 0 && (
                      <>
                        <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sable">{guestSlots.length > 1 ? "Invités" : "Invité"}</p>
                        {guestSlots.map((s) => (
                          <p key={s.key} className="mt-1 text-sm text-(--fg)/80">
                            {(guests[s.key] ?? "").trim()} <span className="text-sable">· {s.name}</span>
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange hover:text-ivoire">
                    <LuPencil className="size-3.5" aria-hidden />
                    Modifier
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="accept-cgv" className="flex cursor-pointer items-start gap-3 text-[0.95rem]">
                  <input
                    id="accept-cgv"
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => {
                      setAccepted(e.target.checked);
                      setAcceptError(false);
                    }}
                    aria-invalid={acceptError || undefined}
                    aria-describedby={acceptError ? "accept-cgv-error" : undefined}
                    className="mt-0.5 size-5 shrink-0 accent-(--color-orange)"
                  />
                  <span className="text-(--fg)/85">
                    J’ai lu et j’accepte les{" "}
                    <Link href="/conditions-generales-de-vente" target="_blank" className="text-orange underline underline-offset-4">
                      conditions générales de vente
                    </Link>{" "}
                    et la{" "}
                    <Link href="/confidentialite" target="_blank" className="text-orange underline underline-offset-4">
                      politique de confidentialité
                    </Link>
                    .
                  </span>
                </label>
                {acceptError && (
                  <p id="accept-cgv-error" role="alert" className="mt-2 text-sm font-medium text-alerte">
                    Acceptez les conditions générales de vente pour finaliser votre réservation.
                  </p>
                )}
              </div>

              {payError && (
                <p role="alert" className="mt-6 text-sm font-medium text-alerte">
                  {payError}
                </p>
              )}

              {/* Mode démonstration : explicite, pour ne jamais laisser croire à un vrai débit */}
              {IS_DEMO && (
                <div className="relative mt-6 overflow-hidden border border-orange/60 bg-brun-soft">
                  <div aria-hidden className="h-3 bg-rouille text-brun/60">
                    <Motif name="zigzag" id="demo-pay" scale={0.4} />
                  </div>
                  <div className="flex gap-4 p-5 sm:p-6">
                    <LuShieldCheck className="mt-0.5 size-6 shrink-0 text-orange" strokeWidth={1.6} aria-hidden />
                    <div>
                      <p className="font-semibold text-ivoire">Paiement de démonstration</p>
                      <p className="mt-1 text-sm leading-relaxed text-(--fg)/80">
                        Le prestataire de paiement n’est pas encore branché. Aucun montant ne sera débité : le bouton simule un paiement réussi pour présenter la suite du parcours.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </form>

        {/* Récapitulatif : colonne collante sur desktop, résumé compact sur mobile */}
        <aside aria-label="Récapitulatif de la commande" className="lg:col-span-5">
          <div className="border border-terre bg-brun-soft lg:sticky lg:top-28">
            <div aria-hidden className="h-4 bg-brun text-rouille">
              <Motif name="losanges" id="recap-top" scale={0.5} />
            </div>
            <div className="p-5 sm:p-6">
              {/* À l'étape 2, le détail est déjà affiché au-dessus du formulaire : ici, seulement le total */}
              <div className={step === 2 ? "hidden" : undefined}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sable">Votre commande</p>
                {lines.length === 0 ? (
                  <p className="mt-4 text-sm text-sable">Aucun pass sélectionné.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {lines.map((l) => (
                      <li key={l.slug} className="flex items-baseline justify-between gap-4">
                        <span>
                          <span className="font-semibold tabular-nums">{l.quantity}</span> <span className="text-sable">×</span> {l.name}
                        </span>
                        <span className="shrink-0 tabular-nums text-(--fg)/85">{formatAmount(l.price * l.quantity)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={step === 2 ? "flex items-baseline justify-between" : "mt-5 flex items-baseline justify-between border-t border-(--line) pt-5"}>
                <span className="text-sm text-sable">
                  Total
                  {seats > 0 && ` · ${seats} ${seats > 1 ? "personnes" : "personne"}`}
                </span>
                <span className="font-display text-[2.4rem] font-black leading-none text-orange tabular-nums">
                  {formatAmount(total)} <span className="text-sm text-sable">FCFA</span>
                </span>
              </div>
              <p className="mt-3 text-xs text-sable">
                {event.name} · {event.dateLabel} · {event.city}
              </p>
              <div className="mt-6 hidden lg:block">{action}</div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="mt-4 hidden items-center gap-2 text-sm text-sable hover:text-ivoire lg:inline-flex"
                >
                  <LuArrowLeft className="size-4" aria-hidden />
                  Étape précédente
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Barre d'action mobile : total et bouton toujours sous le pouce */}
      <div data-tone="dark" className="fixed inset-x-0 bottom-0 z-40 border-t border-terre bg-brun px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <div className="mb-2.5 flex items-baseline justify-between text-sm">
          {step > 1 ? (
            <button type="button" onClick={() => setStep((s) => (s - 1) as Step)} className="inline-flex items-center gap-1.5 text-sable">
              <LuArrowLeft className="size-4" aria-hidden />
              Retour
            </button>
          ) : (
            <span className="text-sable">Total</span>
          )}
          <span className="font-display text-[1.6rem] font-black leading-none text-orange tabular-nums">{formatAmount(total)} FCFA</span>
        </div>
        {action}
      </div>
    </div>
  );
}
