/**
 * Téléchargement des billets côté navigateur : le billet affiché (avec son QR code) est capturé en image,
 * puis enregistré en PNG (pratique sur téléphone, WhatsApp) ou assemblé en PDF (une page par billet).
 * Les bibliothèques sont chargées à la demande : elles ne pèsent pas sur le site.
 */

const BACKGROUND = "#3a160e";

async function capture(el: HTMLElement, format: "png" | "jpeg" = "png"): Promise<string> {
  const { toPng, toJpeg } = await import("html-to-image");
  // Les polices et images sont lues avant la capture, sinon le billet sortirait sans ses lettres
  await document.fonts.ready;
  const options = { pixelRatio: 3, cacheBust: true, backgroundColor: BACKGROUND };
  return format === "png" ? toPng(el, options) : toJpeg(el, { ...options, quality: 0.95 });
}

function save(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Enregistre un billet en PNG. */
export async function downloadTicketPng(el: HTMLElement, filename: string) {
  save(await capture(el), `${filename}.png`);
}

/** Enregistre tous les billets dans un seul PDF A5 portrait, un billet par page. */
export async function downloadTicketsPdf(els: HTMLElement[], filename: string) {
  const [{ jsPDF }, images] = await Promise.all([import("jspdf"), Promise.all(els.map((el) => capture(el, "jpeg")))]);
  const pdf = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  for (const [i, src] of images.entries()) {
    const { width, height } = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
    if (i > 0) pdf.addPage();
    pdf.setFillColor(58, 22, 14);
    pdf.rect(0, 0, pageW, pageH, "F");
    // Le billet tient dans la page, centré, avec une marge
    const scale = Math.min((pageW - 16) / width, (pageH - 16) / height);
    const w = width * scale;
    const h = height * scale;
    pdf.addImage(src, "JPEG", (pageW - w) / 2, (pageH - h) / 2, w, h);
  }
  pdf.save(`${filename}.pdf`);
}
