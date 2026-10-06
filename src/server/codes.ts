import "server-only";
import { randomInt } from "node:crypto";

/** Alphabet sans 0/O/1/I : ces codes se disent à voix haute et se tapent à la main à l'entrée. */
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function randomString(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

/** Code du billet imprimé dessus : GALA-XXXX-XXXX (32^8 combinaisons). */
export const newTicketNumber = () => `GALA-${randomString(4)}-${randomString(4)}`;

/** Jeton du QR code : TTCT- + 20 caractères aléatoires. Imprévisible, aucune donnée personnelle. */
export const newQrToken = () => `TTCT-${randomString(20)}`;

/** Référence de commande, imprévisible : elle sert aussi de lien vers /confirmation?ref=… */
export const newOrderReference = () => `CMD-${randomString(4)}-${randomString(4)}-${randomString(4)}`;

/** Retire tout sauf lettres et chiffres, en majuscules : « gala 7k2m-9qxh » → « GALA7K2M9QXH ». */
export const compactCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** Remet un code saisi à la main au format stocké (GALA-XXXX-XXXX), ou null s'il n'y ressemble pas. */
export function toTicketNumber(value: string): string | null {
  const c = compactCode(value);
  return /^GALA[A-Z0-9]{8}$/.test(c) ? `GALA-${c.slice(4, 8)}-${c.slice(8)}` : null;
}
