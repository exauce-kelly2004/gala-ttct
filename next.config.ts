import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pas de bulle de développement Next.js : elle s'incrustait dans les captures et exports d'affiche.
  devIndicators: false,
};

export default nextConfig;
