import "server-only";
import { existsSync } from "node:fs";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { env } from "@/lib/env";

/**
 * Fabrique le PDF des billets en imprimant la page /impression/[reference] avec un navigateur sans écran.
 * Cette page affiche le même composant que le billet du client : le PDF est donc identique au design.
 */

/** En développement, on utilise le Chrome ou l'Edge déjà installé ; en production, un Chromium allégé. */
const LOCAL_BROWSERS = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];

async function launch() {
  if (env.NODE_ENV === "production") {
    return puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
  }
  const executablePath = LOCAL_BROWSERS.find((p) => p && existsSync(p));
  if (!executablePath) throw new Error("Aucun Chrome trouvé : définir CHROME_PATH dans .env");
  return puppeteer.launch({ executablePath, headless: true });
}

// Au plus 2 PDF en même temps : chaque navigateur consomme beaucoup de mémoire.
let running = 0;
const waiting: (() => void)[] = [];
async function slot<T>(work: () => Promise<T>): Promise<T> {
  if (running >= 2) await new Promise<void>((resolve) => waiting.push(resolve));
  running++;
  try {
    return await work();
  } finally {
    running--;
    waiting.shift()?.();
  }
}

/** PDF A5 (une page par billet) d'une commande payée, ou d'un seul billet si `ticketNumber` est donné. */
export function renderTicketsPdf(origin: string, reference: string, ticketNumber?: string): Promise<Uint8Array> {
  return slot(async () => {
    const browser = await launch();
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
      const query = ticketNumber ? `?billet=${encodeURIComponent(ticketNumber)}` : "";
      const response = await page.goto(`${origin}/impression/${encodeURIComponent(reference)}${query}`, { waitUntil: "domcontentloaded", timeout: 45_000 });
      if (!response?.ok()) throw new Error(`Page d'impression introuvable (${response?.status()})`);

      // Attendre les polices et les QR codes (dessinés côté navigateur), puis faire tenir chaque billet dans sa page A5
      await page.evaluate(async () => {
        await document.fonts.ready;
        const pages = document.querySelectorAll("[data-page]").length;
        for (let i = 0; i < 300 && document.querySelectorAll("img[data-qr]").length < pages; i++) await new Promise((r) => setTimeout(r, 100));
        const MARGIN = 8 * 3.7795; // 8 mm en pixels, comme le PDF du navigateur
        for (const fit of document.querySelectorAll<HTMLElement>("[data-fit]")) {
          const sheet = fit.parentElement as HTMLElement;
          const ticket = fit.firstElementChild as HTMLElement;
          const scale = Math.min((sheet.clientWidth - 2 * MARGIN) / ticket.offsetWidth, (sheet.clientHeight - 2 * MARGIN) / ticket.offsetHeight);
          fit.style.zoom = String(scale);
        }
      });
      if ((await page.$$("img[data-qr]")).length === 0) throw new Error("QR code absent de la page d'impression");

      return await page.pdf({ width: "148mm", height: "210mm", printBackground: true, preferCSSPageSize: true });
    } finally {
      await browser.close();
    }
  });
}
