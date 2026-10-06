import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pas de bulle de développement Next.js : elle s'incrustait dans les captures et exports d'affiche.
  devIndicators: false,
  // Navigateur sans écran utilisé pour fabriquer les PDF des billets : chargé tel quel, jamais empaqueté.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  // Les fichiers du navigateur ne sont pas détectés automatiquement : on les joint aux routes qui fabriquent un PDF
  // (téléchargement, et création de commande qui envoie le PDF par e-mail).
  outputFileTracingIncludes: {
    "/api/orders": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "/api/orders/\\[reference\\]/pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
};

export default nextConfig;
