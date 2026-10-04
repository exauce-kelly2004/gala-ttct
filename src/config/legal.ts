/**
 * Informations juridiques de l'organisateur.
 * Chaque valeur `null` s'affiche comme un encadré « À compléter » sur les pages légales :
 * il suffit de la renseigner ici pour qu'elle apparaisse partout.
 *
 * Références : loi n° 2017-20 portant Code du numérique en République du Bénin (et textes modificatifs)
 * (Livre III : commerce électronique ; Livre V : données à caractère personnel),
 * loi n° 2007-21 du 16 octobre 2007 portant protection du consommateur en République du Bénin.
 */
type Maybe = string | null;

export const legal = {
  /** Date de dernière mise à jour des pages légales. */
  updatedAt: "4 octobre 2026",

  organizer: {
    name: "La Team Télé Contre Télé (TTCT)",
    /** Forme juridique : association déclarée, entreprise individuelle, société… */
    legalForm: null as Maybe,
    /** Référence d'enregistrement (récépissé d'association, RCCM…). */
    registration: null as Maybe,
    /** Identifiant fiscal unique (IFU), si assujetti. */
    ifu: null as Maybe,
    /** Adresse géographique complète (siège). */
    address: null as Maybe,
    email: null as Maybe,
    phones: ["0197865758", "0196164348"],
    /** Directeur ou directrice de la publication du site. */
    publicationDirector: null as Maybe,
  },

  /** Hébergeur du site (nom, adresse, contact). */
  host: null as Maybe,

  /** Prestataire de paiement et moyens acceptés (Mobile Money, carte…). */
  paymentProvider: null as Maybe,
  paymentMethods: null as Maybe,

  /** Prestataire d'envoi des e-mails transactionnels. */
  emailProvider: null as Maybe,
  /** Hébergeur de la base de données et pays de localisation des serveurs. */
  databaseHost: null as Maybe,

  /** Récépissé de déclaration du traitement auprès de l'APDP (art. 405). */
  apdpDeclaration: null as Maybe,
  /** Délégué à la protection des données, s'il est désigné (art. 408 et 415). */
  dpo: null as Maybe,

  /** Choix de l'organisateur sur la revente des billets entre particuliers. */
  resalePolicy: null as Maybe,
  /** Âge minimum ou conditions d'accès des mineurs. */
  minorsPolicy: null as Maybe,
  /** Juridiction compétente en cas de litige (ex. tribunal de première instance de …). */
  jurisdiction: null as Maybe,
};

/** Autorité de protection des données (Bénin). */
export const apdp = {
  name: "Autorité de Protection des Données à caractère Personnel (APDP)",
  website: "https://apdp.bj",
};
