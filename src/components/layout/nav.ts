import { programme } from "@/config/programme";

/** Ancres de la page d'accueil, partagées par la navigation et le footer. Le programme n'apparaît que s'il est connu. */
export const navLinks = [
  { href: "#le-gala", label: "Le Gala" },
  ...(programme.length > 0 ? [{ href: "#programme", label: "Programme" }] : []),
  { href: "#pass", label: "Pass" },
  { href: "#infos", label: "Infos pratiques" },
  { href: "#faq", label: "FAQ" },
];
