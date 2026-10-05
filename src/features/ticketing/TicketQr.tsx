"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * QR code du billet, dessiné à partir du jeton fourni par le back-end.
 * Niveau de correction « Q », modules sombres sur fond ivoire avec zone de silence : lisible à l'écran, imprimé ou en PDF.
 */
export function TicketQr({ token, label }: { token: string; label: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(token, { errorCorrectionLevel: "Q", margin: 0, width: 512, color: { dark: "#2a0d08", light: "#e6d3b3" } }).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  // eslint-disable-next-line @next/next/no-img-element -- data URL générée localement
  return src ? <img src={src} alt={label} className="size-full object-contain [image-rendering:pixelated]" /> : <span className="sr-only">Chargement du QR code</span>;
}
