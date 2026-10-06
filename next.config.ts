import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pas de bulle de développement Next.js : elle s'incrustait dans les captures et exports d'affiche.
  devIndicators: false,
  // Navigateur sans écran utilisé pour fabriquer les PDF des billets : chargé tel quel, jamais empaqueté.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

export default nextConfig;
