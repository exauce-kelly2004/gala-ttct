/**
 * Catalogue provisoire des pass (prix de l'affiche officielle).
 * Source unique côté front-end tant que la base n'existe pas : à l'étape base de données,
 * ces valeurs viendront de la table TicketType et ce fichier disparaîtra.
 */
export type PassAvailability = "available" | "low" | "soldout";

export type PassOffer = {
  slug: string;
  name: string;
  price: number;
  currency: "FCFA";
  /** Personnes couvertes par un pass (Duo = 2). */
  seats: number;
  /** Avantages confirmés uniquement. */
  perks: string[];
  availability: PassAvailability;
  maxPerOrder: number;
  /** Pass mis en avant (le plus complet). */
  featured?: boolean;
};

const basePerks = ["Accès à la Soirée de Gala", "Billet numérique avec QR code"];

export const passes: PassOffer[] = [
  {
    slug: "duo-vvip",
    name: "Pass Duo V.V.I.P",
    price: 50000,
    currency: "FCFA",
    seats: 2,
    perks: ["Entrée pour deux personnes", ...basePerks],
    availability: "available",
    maxPerOrder: 5,
    featured: true,
  },
  {
    slug: "duo-vip",
    name: "Pass Duo V.I.P",
    price: 25000,
    currency: "FCFA",
    seats: 2,
    perks: ["Entrée pour deux personnes", ...basePerks],
    availability: "available",
    maxPerOrder: 5,
  },
  {
    slug: "solo",
    name: "Pass Solo",
    price: 15000,
    currency: "FCFA",
    seats: 1,
    perks: ["Entrée pour une personne", ...basePerks],
    availability: "available",
    maxPerOrder: 10,
  },
];

export const lowestPrice = Math.min(...passes.map((p) => p.price));

export const findPass = (slug: string | undefined) => passes.find((p) => p.slug === slug);
