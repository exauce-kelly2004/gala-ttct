"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import jsQR from "jsqr";
import { LuCamera, LuCircleCheck, LuCircleX, LuKeyboard, LuTriangleAlert } from "react-icons/lu";
import type { IconType } from "react-icons";
import { Logo } from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { DEMO_CODES, IS_DEMO, verifyTicket, type ScanResult, type ScanStatus } from "./api";

/** Le texte et l'icône portent toujours le sens : la couleur n'est qu'un renfort. */
const verdicts: Record<ScanStatus, { title: string; sub: string; Icon: IconType; panel: string; tone: "valide" | "alerte" | "orange" }> = {
  VALID: { title: "Billet valide", sub: "Accès autorisé", Icon: LuCircleCheck, panel: "border-valide bg-valide/15", tone: "valide" },
  USED: { title: "Billet déjà utilisé", sub: "Accès refusé", Icon: LuCircleX, panel: "border-alerte bg-alerte/15", tone: "alerte" },
  CANCELLED: { title: "Billet annulé", sub: "Accès refusé", Icon: LuCircleX, panel: "border-alerte bg-alerte/15", tone: "alerte" },
  INVALID: { title: "Billet invalide", sub: "Accès refusé", Icon: LuTriangleAlert, panel: "border-alerte bg-alerte/15", tone: "alerte" },
};

const timeFormat = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Africa/Porto-Novo" });
const time = (iso: string) => timeFormat.format(new Date(iso));

type HistoryItem = { id: number; result: ScanResult };

export function Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const busy = useRef(false);
  const nextId = useRef(1);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [manual, setManual] = useState("");

  const check = useCallback(async (code: string) => {
    if (busy.current || !code.trim()) return;
    busy.current = true;
    setChecking(true);
    try {
      const res = await verifyTicket(code);
      setResult(res);
      setHistory((h) => [{ id: nextId.current++, result: res }, ...h].slice(0, 30));
      // Retour haptique : un coup bref = valide, deux = refusé
      navigator.vibrate?.(res.status === "VALID" ? 80 : [120, 80, 120]);
    } catch {
      setCameraError("Le contrôle n’a pas pu aboutir. Vérifiez la connexion et rescannez.");
    } finally {
      setChecking(false);
      busy.current = false;
    }
  }, []);

  // Caméra arrière + lecture d'une image sur ~7 pendant qu'aucun résultat n'est affiché
  useEffect(() => {
    if (!cameraOn || result) return;
    let stream: MediaStream | undefined;
    let timer = 0;
    let cancelled = false;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (cancelled) return stream.getTracks().forEach((t) => t.stop());
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();

        const tick = () => {
          const canvas = canvasRef.current;
          if (video.readyState >= 2 && canvas && !busy.current) {
            const w = video.videoWidth;
            const h = video.videoHeight;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(video, 0, 0, w, h);
              const code = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: "dontInvert" });
              if (code?.data) void check(code.data);
            }
          }
          timer = window.setTimeout(tick, 140);
        };
        tick();
      } catch {
        setCameraOn(false);
        setCameraError("Caméra inaccessible. Autorisez-la dans le navigateur, ou saisissez le code du billet.");
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraOn, result, check]);

  const startCamera = () => {
    setCameraError(null);
    setCameraOn(true);
  };

  const next = () => setResult(null);

  const submitManual = (e: FormEvent) => {
    e.preventDefault();
    void check(manual);
    setManual("");
  };

  const verdict = result ? verdicts[result.status] : null;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col px-4 pb-10 pt-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Logo variant="emblem" width={36} priority className="w-9" />
          <div>
            <h1 className="font-display text-[1.5rem] font-black uppercase leading-none">Contrôle des billets</h1>
            <p className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-sable">Gala TTCT · 19 décembre 2026</p>
          </div>
        </div>
      </header>

      {IS_DEMO && (
        <p className="mt-4 border border-orange/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange">
          Démonstration : codes d’essai uniquement, aucun billet réel
        </p>
      )}

      {result && verdict ? (
        /* Résultat : plein écran utile, une seule action */
        <section aria-live="assertive" className={cn("mt-5 flex flex-1 flex-col border-2 p-5", verdict.panel)}>
          <div className="flex flex-col items-center text-center">
            <verdict.Icon className="size-20" strokeWidth={1.4} aria-hidden />
            <h2 className="mt-3 font-display text-[clamp(2.6rem,13vw,3.6rem)] font-black uppercase leading-[0.9]">{verdict.title}</h2>
            <p className="mt-2 text-[0.8rem] font-semibold uppercase tracking-[0.28em]">{verdict.sub}</p>
          </div>

          {result.ticket ? (
            <dl className="mt-7 border-t border-(--line) pt-5 text-left">
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">{result.ticket.holders.length > 1 ? "Titulaires" : "Titulaire"}</dt>
              {result.ticket.holders.map((name) => (
                <dd key={name} className="mt-1 font-display text-[1.9rem] font-black uppercase leading-none">
                  {name}
                </dd>
              ))}
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">Pass</dt>
                  <dd className="mt-1 font-semibold">{result.ticket.passName}</dd>
                  <dd className="text-sable">{result.ticket.seats > 1 ? `${result.ticket.seats} personnes` : "1 personne"}</dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">Paiement</dt>
                  <dd className="mt-1 font-semibold">{result.ticket.paid ? "Payé" : "Non payé"}</dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">Billet</dt>
                  <dd className="mt-1 break-all font-mono text-[0.85rem]">{result.ticket.number}</dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sable">Commande</dt>
                  <dd className="mt-1 break-all font-mono text-[0.85rem]">{result.ticket.orderReference}</dd>
                </div>
              </div>
              {result.status === "USED" && result.ticket.usedAt && (
                <p className="mt-5 border border-alerte/60 px-3 py-2 text-sm font-semibold">Déjà scanné à {time(result.ticket.usedAt)}</p>
              )}
            </dl>
          ) : (
            <p className="mt-7 text-center text-(--fg)/85">Ce code ne correspond à aucun billet du gala. Ne laissez pas entrer sans vérification auprès de l’organisation.</p>
          )}

          <Button size="lg" onClick={next} autoFocus className="mt-auto w-full">
            Scanner le suivant
          </Button>
          <p className="mt-3 text-center text-xs text-sable">Contrôle à {time(result.scannedAt)}</p>
        </section>
      ) : (
        <>
          {/* Viseur */}
          <section aria-label="Scanner un billet" className="mt-5">
            <div className="relative aspect-square w-full overflow-hidden border border-terre bg-brun-soft">
              <video ref={videoRef} playsInline muted className={cn("absolute inset-0 size-full object-cover", !cameraOn && "hidden")} />
              <canvas ref={canvasRef} className="hidden" />
              {cameraOn ? (
                <div aria-hidden className="pointer-events-none absolute inset-[14%] border-2 border-orange">
                  <span className="absolute inset-x-0 top-1/2 h-0.5 bg-orange/70" />
                </div>
              ) : (
                <div className="absolute inset-0 grid place-items-center p-6 text-center">
                  <div className="flex flex-col items-center gap-3 text-sable">
                    <LuCamera className="size-10" strokeWidth={1.4} aria-hidden />
                    <p className="text-sm">Activez la caméra, puis présentez le QR code du billet dans le cadre.</p>
                  </div>
                </div>
              )}
              {checking && (
                <div role="status" className="absolute inset-0 grid place-items-center bg-brun/80 text-sm font-semibold uppercase tracking-[0.2em]">
                  Vérification…
                </div>
              )}
            </div>

            {cameraError && (
              <p role="alert" className="mt-3 text-sm font-medium text-alerte">
                {cameraError}
              </p>
            )}

            <Button size="lg" onClick={cameraOn ? () => setCameraOn(false) : startCamera} variant={cameraOn ? "secondary" : "primary"} className="mt-4 w-full">
              <LuCamera className="size-4" aria-hidden />
              {cameraOn ? "Arrêter la caméra" : "Activer la caméra"}
            </Button>
          </section>

          {/* Secours : saisie du code ou du numéro de billet */}
          <form onSubmit={submitManual} className="mt-6 border-t border-(--line) pt-5">
            <label htmlFor="manual-code" className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em]">
              <LuKeyboard className="size-4 text-orange" aria-hidden />
              Saisir un code manuellement
            </label>
            <div className="mt-3 flex gap-2">
              <input
                id="manual-code"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="Numéro de billet"
                className="min-h-12 min-w-0 flex-1 border border-(--line) bg-brun-soft px-4 font-mono text-[1rem] text-(--fg) placeholder:text-(--fg)/40 focus:border-(--accent) focus:outline-none"
              />
              <Button type="submit" disabled={checking || !manual.trim()}>
                Vérifier
              </Button>
            </div>
          </form>

          {IS_DEMO && (
            <div className="mt-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sable">Codes d’essai</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {DEMO_CODES.map((d) => (
                  <li key={d.code}>
                    <button
                      type="button"
                      onClick={() => void check(d.code)}
                      disabled={checking}
                      className="min-h-10 border border-(--line) px-3 text-xs font-semibold uppercase tracking-[0.1em] hover:border-orange hover:text-orange disabled:opacity-45"
                    >
                      {d.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Historique de la session */}
          <section aria-labelledby="history-title" className="mt-8">
            <h2 id="history-title" className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-sable">
              Derniers contrôles
            </h2>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-sable">Aucun contrôle pour l’instant.</p>
            ) : (
              <ul className="mt-3 divide-y divide-(--line) border-y border-(--line)">
                {history.map(({ id, result: r }) => (
                  <li key={id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{r.ticket ? r.ticket.holders.join(" · ") : "Code inconnu"}</p>
                      <p className="text-xs text-sable">
                        {time(r.scannedAt)}
                        {r.ticket && ` · ${r.ticket.passName}`}
                      </p>
                    </div>
                    <Badge tone={verdicts[r.status].tone}>{verdicts[r.status].title.replace("Billet ", "")}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
