import "server-only";
import { event } from "@/config/event";
import { env } from "@/lib/env";

/**
 * Modèles d'e-mails aux couleurs du gala (brun, orange, ivoire). Chaque modèle renvoie une version HTML et une
 * version texte : les messageries qui n'affichent pas le HTML montrent le texte.
 * Le HTML suit les règles des e-mails : tableaux, styles en ligne, polices système (les polices du site ne passent pas).
 */

const C = {
  brun: "#2a0d08",
  brunSoft: "#3a160e",
  terre: "#5e2e16",
  rouille: "#a9531f",
  orange: "#c8722f",
  ivoire: "#e6d3b3",
  sable: "#a68a66",
  valide: "#9aab68",
};
const TITLE = "Impact, 'Arial Narrow Bold', 'Arial Black', sans-serif";
const BODY = "'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'Courier New', Consolas, Menlo, monospace";

/** Texte venant d'un utilisateur (noms, e-mails) : toujours échappé avant d'entrer dans le HTML. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const amount = (n: number) => new Intl.NumberFormat("fr-FR").format(n).replace(/[  ]/g, " ");

type Email = { html: string; text: string };

type Block =
  | { kind: "p"; text: string }
  | { kind: "code"; value: string }
  | { kind: "rows"; rows: { label: string; value: string; mono?: boolean }[] }
  | { kind: "note"; text: string };

type Layout = { preheader: string; heading: string; blocks: Block[]; cta?: { label: string; url: string } };

function render({ preheader, heading, blocks, cta }: Layout): string {
  const logo = `${env.APP_URL}/images/brand/ttct-logo-creme.png`;

  const body = blocks
    .map((b) => {
      if (b.kind === "p") return `<p style="margin:0 0 16px;font:16px/1.6 ${BODY};color:${C.ivoire};">${esc(b.text)}</p>`;
      if (b.kind === "note") return `<p style="margin:20px 0 0;font:13px/1.6 ${BODY};color:${C.sable};">${esc(b.text)}</p>`;
      if (b.kind === "code") {
        return `<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:8px auto 22px;"><tr><td style="background:${C.brun};border:1px dashed ${C.rouille};padding:18px 30px;text-align:center;font:700 38px/1 ${MONO};letter-spacing:12px;color:${C.orange};">${esc(b.value)}</td></tr></table>`;
      }
      const rows = b.rows
        .map(
          (r) =>
            `<tr><td style="padding:10px 0;border-top:1px solid ${C.terre};font:12px/1.4 ${BODY};letter-spacing:2px;text-transform:uppercase;color:${C.sable};width:38%;vertical-align:top;">${esc(r.label)}</td><td style="padding:10px 0;border-top:1px solid ${C.terre};font:${r.mono ? `600 15px/1.5 ${MONO}` : `15px/1.5 ${BODY}`};color:${C.ivoire};vertical-align:top;white-space:pre-line;">${esc(r.value)}</td></tr>`,
        )
        .join("");
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;border-bottom:1px solid ${C.terre};">${rows}</table>`;
    })
    .join("");

  const button = cta
    ? `<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:8px auto 4px;"><tr><td style="background:${C.orange};"><a href="${esc(cta.url)}" style="display:inline-block;padding:15px 30px;font:700 13px/1 ${BODY};letter-spacing:2.5px;text-transform:uppercase;color:${C.brun};text-decoration:none;">${esc(cta.label)}</a></td></tr></table>`
    : "";

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light"><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:${C.brun};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.brun};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.brun};"><tr><td align="center" style="padding:28px 14px;">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
    <tr><td align="center" style="padding:6px 0 22px;">
      <img src="${esc(logo)}" width="78" alt="TTCT" style="display:block;height:auto;border:0;margin:0 auto 12px;">
      <div style="font:700 11px/1.4 ${BODY};letter-spacing:4px;text-transform:uppercase;color:${C.sable};">${esc(event.name)} · ${esc(event.dateLabel)}</div>
    </td></tr>
    <tr><td style="background:${C.rouille};height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>
    <tr><td style="background:${C.brunSoft};border-left:1px solid ${C.terre};border-right:1px solid ${C.terre};padding:36px 34px 30px;">
      <h1 style="margin:0 0 20px;font:400 34px/1.05 ${TITLE};letter-spacing:1px;text-transform:uppercase;color:${C.ivoire};">${esc(heading)}</h1>
      ${body}
      ${button}
    </td></tr>
    <tr><td style="background:${C.rouille};height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>
    <tr><td align="center" style="padding:22px 10px 6px;font:12px/1.7 ${BODY};color:${C.sable};">
      ${esc(event.organizer)} · ${esc(event.theme)}<br>${esc(event.city)}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

/* ---------------------------------------------------------------------- */

export function loginCodeEmail(code: string, minutes: number): Email {
  const note = "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : sans ce code, personne ne peut se connecter.";
  return {
    html: render({
      preheader: `Votre code de connexion : ${code}`,
      heading: "Votre code de connexion",
      blocks: [
        { kind: "p", text: "Saisissez ce code pour ouvrir l'espace réservé du Gala TTCT." },
        { kind: "code", value: code },
        { kind: "p", text: `Il est valable ${minutes} minutes et ne s'utilise qu'une fois.` },
        { kind: "note", text: note },
      ],
    }),
    text: `Votre code de connexion : ${code}\n\nIl est valable ${minutes} minutes et ne s'utilise qu'une fois.\n${note}`,
  };
}

export function invitationEmail(roleLabel: string): Email {
  const url = `${env.APP_URL}/espace/connexion`;
  return {
    html: render({
      preheader: `Vous êtes invité(e) comme ${roleLabel}`,
      heading: "Vous êtes invité(e)",
      blocks: [
        { kind: "p", text: `Vous avez été invité(e) comme ${roleLabel} sur l'espace réservé du Gala TTCT 2026.` },
        { kind: "p", text: "Pour vous connecter, saisissez cette adresse e-mail : un code de connexion vous sera envoyé à chaque fois, sans mot de passe." },
      ],
      cta: { label: "Me connecter", url },
    }),
    text: `Vous avez été invité(e) comme ${roleLabel} sur l'espace réservé du Gala TTCT 2026.\n\nConnectez-vous avec cette adresse e-mail : ${url}\nUn code de connexion vous sera envoyé à chaque fois, sans mot de passe.`,
  };
}

type OrderForEmail = {
  reference: string;
  firstName: string;
  date: string;
  total: number;
  lines: { quantity: number; name: string; price: number }[];
  tickets: { passName: string; number: string; holders: string[] }[];
};

export function orderConfirmationEmail(o: OrderForEmail): Email {
  const url = `${env.APP_URL}/confirmation?ref=${o.reference}`;
  const lineText = o.lines.map((l) => `- ${l.quantity} × ${l.name} : ${amount(l.price * l.quantity)} FCFA`).join("\n");
  const ticketText = o.tickets.map((t) => `- ${t.passName} : ${t.number} (${t.holders.join(" et ")})`).join("\n");
  return {
    html: render({
      preheader: `Votre commande ${o.reference} est confirmée : vos billets sont joints.`,
      heading: `Merci ${o.firstName}`,
      blocks: [
        { kind: "p", text: `Votre commande ${o.reference} du ${o.date} est confirmée. Vos billets sont joints à ce message (PDF) et téléchargeables à tout moment.` },
        { kind: "rows", rows: [...o.lines.map((l) => ({ label: `${l.quantity} ×`, value: `${l.name} · ${amount(l.price * l.quantity)} FCFA` })), { label: "Total payé", value: `${amount(o.total)} FCFA` }] },
        { kind: "p", text: "Vos billets. Si le QR code ne se lit pas à l'entrée, donnez le code du billet à l'accueil :" },
        { kind: "rows", rows: o.tickets.map((t) => ({ label: t.passName, value: `${t.number}\n${t.holders.join(" · ")}`, mono: true })) },
      ],
      cta: { label: "Télécharger mes billets", url },
    }),
    text: [`Bonjour ${o.firstName},`, "", `Votre commande ${o.reference} du ${o.date} est confirmée.`, "", lineText, `Total payé : ${amount(o.total)} FCFA`, "", "Vos billets (le code se donne à l'entrée si le QR code ne se lit pas) :", ticketText, "", `Télécharger vos billets : ${url}`].join("\n"),
  };
}

export function reminderEmail(o: { firstName: string; reference: string; dateText: string; place: string; tickets: { passName: string; number: string; holders: string[] }[] }): Email {
  const url = `${env.APP_URL}/confirmation?ref=${o.reference}`;
  const when = `${o.dateText}${event.startTime ? ` à ${event.startTime}` : ""}`;
  return {
    html: render({
      preheader: `Le gala approche : ${when}, ${o.place}.`,
      heading: "Le gala approche",
      blocks: [
        { kind: "p", text: `Bonjour ${o.firstName}, on vous attend ${when}, ${o.place}.` },
        { kind: "rows", rows: [{ label: "Date", value: o.dateText }, ...(event.startTime ? [{ label: "Heure", value: event.startTime }] : []), { label: "Lieu", value: o.place }, { label: "Tenue", value: event.dressCode }] },
        { kind: "p", text: "Vos billets. Présentez le QR code à l'entrée, sur téléphone ou imprimé ; sinon, donnez le code du billet :" },
        { kind: "rows", rows: o.tickets.map((t) => ({ label: t.passName, value: `${t.number}\n${t.holders.join(" · ")}`, mono: true })) },
      ],
      cta: { label: "Retrouver mes billets", url },
    }),
    text: [`Bonjour ${o.firstName},`, "", `Le gala approche : ${when}, ${o.place}.`, "", "Vos billets :", ...o.tickets.map((t) => `- ${t.passName} : ${t.number} (${t.holders.join(" et ")})`), "", "Présentez le QR code à l'entrée, sur téléphone ou imprimé. S'il ne se lit pas, donnez le code du billet à l'accueil.", `Retrouver vos billets : ${url}`, "", `${event.name} · ${event.organizer}`].join("\n"),
  };
}

export function cancellationEmail(o: { firstName: string; reference: string; total: number }): Email {
  const refund = `Le montant de ${amount(o.total)} FCFA vous sera remboursé par le même moyen de paiement, sous 30 jours ouvrables.`;
  return {
    html: render({
      preheader: `Votre commande ${o.reference} a été annulée.`,
      heading: "Commande annulée",
      blocks: [
        { kind: "p", text: `Bonjour ${o.firstName}, votre commande ${o.reference} a été annulée. Ses billets ne sont plus valables.` },
        { kind: "p", text: refund },
        { kind: "note", text: "Pour toute question, répondez à ce message ou contactez l'organisation." },
      ],
    }),
    text: [`Bonjour ${o.firstName},`, "", `Votre commande ${o.reference} a été annulée. Ses billets ne sont plus valables.`, refund, "", "Pour toute question, répondez à ce message ou contactez l'organisation."].join("\n"),
  };
}
