/**
 * Informations de l'événement connues à ce jour (cahier des charges + organisateur).
 * Tout ce qui n'est pas confirmé reste `null` et s'affiche « à confirmer » : on n'invente rien.
 * Ces données migreront vers la table Event à l'étape base de données.
 */
export const event = {
  name: "Soirée de Gala",
  organizer: "La Team Télé Contre Télé",
  organizerShort: "TTCT",
  theme: "Le métissage culturel",
  tagline: "Harmonie et ambiance festive culturelle",
  /** Formulée pour suivre « au profit » : « au profit des veuves et des orphelins ». */
  cause: "des veuves et des orphelins",
  city: "Natitingou",
  dressCode: "Code vestimentaire traditionnel",
  /** Jour de l'événement. L'heure de début n'est pas encore connue : le compte à rebours vise minuit (heure du Bénin). */
  date: "2026-12-19T00:00:00+01:00",
  dateLabel: "19 décembre 2026",
  startTime: null as string | null,
  venue: null as string | null,
  contacts: ["0197865758", "0196164348"],
} as const;
