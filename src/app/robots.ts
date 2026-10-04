import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Parcours d'achat personnel et pages outils : pas d'indexation
      disallow: ["/reserver", "/confirmation", "/design-system", "/affiche", "/identite", "/partage", "/affiche-benin-pluriel", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
