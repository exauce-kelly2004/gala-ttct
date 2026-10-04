/**
 * Informations de l'événement connues à ce jour (cahier des charges + organisateur).
 * Tout ce qui n'est pas encore connu reste `null` et n'est PAS affiché sur le site (consigne de l'organisateur).
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
  /** Début de la soirée, heure du Bénin (UTC+1) : cible du compte à rebours. */
  date: "2026-12-19T20:00:00+01:00",
  dateLabel: "19 décembre 2026",
  startTime: "20h" as string | null,
  venue: null as string | null,
  contacts: ["0197865758", "0196164348"],
} as const;
