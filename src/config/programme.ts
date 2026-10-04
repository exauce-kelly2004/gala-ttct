/**
 * Programme de la soirée. Vide tant que l'organisateur ne l'a pas transmis :
 * la section affiche alors un état « programme en préparation » au lieu d'inventer des horaires.
 */
export type ProgrammeItem = {
  /** « 19:00 » */
  time: string;
  title: string;
  /** Artiste, intervenant ou groupe. */
  host?: string;
  description?: string;
};

export const programme: ProgrammeItem[] = [];
