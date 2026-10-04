/**
 * Programme de la soirée. Tant qu'il est vide, la section Programme et son lien
 * ne s'affichent pas : on n'invente pas d'horaires.
 */
export type ProgrammeItem = {
  /** « 20h00 » */
  time: string;
  title: string;
  /** Artiste, intervenant ou groupe. */
  host?: string;
  description?: string;
};

export const programme: ProgrammeItem[] = [];
