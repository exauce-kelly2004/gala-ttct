import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/conditions-generales-de-vente`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/confidentialite`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
