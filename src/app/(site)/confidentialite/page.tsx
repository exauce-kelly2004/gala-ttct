import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, ToComplete, Value, type LegalSection } from "@/components/legal/Legal";
import { event } from "@/config/event";
import { apdp, legal } from "@/config/legal";
import { formatPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "Politique de confidentialité · Soirée de Gala TTCT 2026",
  description: "Comment La Team Télé Contre Télé collecte, utilise et protège vos données personnelles lors de la réservation de vos billets.",
};

const o = legal.organizer;

const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "Responsable du traitement",
    content: (
      <>
        <p>Les données personnelles collectées sur ce site sont traitées par :</p>
        <ul>
          <li>
            <strong>{o.name}</strong>, <Value value={o.legalForm} label="forme juridique (association, entreprise…)" />
          </li>
          <li>
            Adresse : <Value value={o.address} label="adresse complète du siège" />
          </li>
          <li>
            E-mail : <Value value={o.email} label="adresse e-mail de contact" />
          </li>
          <li>Téléphone : {o.phones.map(formatPhone).join(" ou ")}</li>
          <li>
            Délégué à la protection des données : <Value value={legal.dpo} label="nom et contact du délégué, s’il est désigné (sinon supprimer cette ligne)" />
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Données collectées",
    content: (
      <>
        <p>Nous ne collectons que les données strictement nécessaires à la vente et au contrôle des billets.</p>
        <h3>Lors de la réservation</h3>
        <ul>
          <li>Nom et prénom de l’acheteur, qui figurent sur les billets ;</li>
          <li>Adresse e-mail, pour l’envoi de la confirmation et des billets ;</li>
          <li>Numéro de téléphone, pour vous joindre au sujet de votre commande ;</li>
          <li>Détail de la commande : pass choisis, quantités, montant, date et heure, référence.</li>
        </ul>
        <h3>Lors du paiement</h3>
        <p>
          Le paiement est traité par notre prestataire de paiement : <Value value={legal.paymentProvider} label="nom du prestataire de paiement" />. Vos données bancaires ou de
          Mobile Money sont saisies chez ce prestataire : <strong>nous ne les recevons pas et ne les conservons pas</strong>. Nous ne recevons que la confirmation du paiement et sa
          référence.
        </p>
        <h3>À l’entrée du gala</h3>
        <p>Lors du scan d’un billet, nous enregistrons la date, l’heure et le résultat du contrôle, afin d’empêcher qu’un même billet serve deux fois.</p>
        <h3>Données techniques</h3>
        <p>
          Comme tout site, nos serveurs enregistrent des journaux techniques (adresse IP, date, page consultée) nécessaires à la sécurité et au bon fonctionnement du service.
        </p>
        <p>
          Nous ne collectons <strong>aucune donnée sensible</strong> au sens de l’article 394 du Code du numérique (origine ethnique, religion, santé, opinions…). Le thème
          culturel du gala ne donne lieu à aucune collecte de ce type.
        </p>
      </>
    ),
  },
  {
    id: "finalites",
    title: "Pourquoi nous utilisons vos données",
    content: (
      <ul>
        <li>
          <strong>Vendre et délivrer vos billets</strong> : enregistrer la commande, confirmer le paiement, générer et envoyer les billets, répondre à vos demandes. Base : l’exécution
          du contrat de vente que vous concluez avec nous.
        </li>
        <li>
          <strong>Contrôler l’accès</strong> le jour du gala et prévenir la fraude (billets copiés ou réutilisés). Base : l’exécution du contrat et notre intérêt légitime à sécuriser
          l’événement.
        </li>
        <li>
          <strong>Respecter nos obligations légales</strong>, notamment la conservation des contrats conclus par voie électronique (article 346 du Code du numérique) et des pièces
          comptables.
        </li>
        <li>
          <strong>Vous informer sur le gala</strong> (changement d’horaire, informations pratiques) : uniquement au sujet de l’événement pour lequel vous avez acheté un billet.
        </li>
      </ul>
    ),
  },
  {
    id: "prospection",
    title: "Prospection et communications",
    content: (
      <p>
        Nous n’utilisons pas vos coordonnées à des fins de prospection commerciale ou caritative sans votre accord préalable, et nous ne les vendons ni ne les louons à des tiers.
        Si nous vous proposons un jour de recevoir nos actualités, vous pourrez vous y opposer à tout moment, gratuitement et sans justification (articles 334 et 440 du Code du
        numérique).
      </p>
    ),
  },
  {
    id: "destinataires",
    title: "Destinataires des données",
    content: (
      <>
        <p>Vos données sont accessibles uniquement aux personnes qui en ont besoin :</p>
        <ul>
          <li>les membres de l’équipe d’organisation habilités (gestion des commandes) ;</li>
          <li>le personnel de contrôle à l’entrée, limité au nom, au type de pass et au statut du billet ;</li>
          <li>
            nos prestataires techniques, qui agissent sur nos instructions : paiement (<Value value={legal.paymentProvider} label="prestataire de paiement" />), envoi des e-mails
            (<Value value={legal.emailProvider} label="prestataire d’e-mails" />), hébergement du site (<Value value={legal.host} label="hébergeur du site" />) et de la base de données
            (<Value value={legal.databaseHost} label="hébergeur de la base de données" />) ;
          </li>
          <li>les autorités, uniquement lorsque la loi l’exige.</li>
        </ul>
      </>
    ),
  },
  {
    id: "transferts",
    title: "Transferts hors du Bénin",
    content: (
      <>
        <p>
          Certains de nos prestataires techniques peuvent héberger des données hors du Bénin : <Value value={legal.databaseHost} label="pays de localisation des serveurs" />.
        </p>
        <p>
          Un tel transfert n’a lieu que vers un pays assurant un niveau de protection jugé suffisant par l’{apdp.name}, ou lorsqu’il est nécessaire à l’exécution du contrat
          que vous concluez avec nous (articles 391 et 392 du Code du numérique). Dans ce cas, nous exigeons de nos prestataires des garanties de sécurité et de confidentialité.
        </p>
      </>
    ),
  },
  {
    id: "conservation",
    title: "Durées de conservation",
    content: (
      <>
        <p>Vos données ne sont pas conservées au-delà de ce qui est nécessaire (article 433 du Code du numérique) :</p>
        <ul>
          <li>
            <strong>Commande et billets</strong> : 10 ans après le gala, durée de conservation des contrats conclus par voie électronique (article 346) ;
          </li>
          <li>
            <strong>Coordonnées de contact</strong> utilisées pour les informations sur l’événement : <ToComplete label="durée choisie, par exemple 12 mois après le gala" /> ;
          </li>
          <li>
            <strong>Historique des contrôles à l’entrée</strong> : <ToComplete label="durée choisie, par exemple 3 mois après le gala" /> ;
          </li>
          <li>
            <strong>Journaux techniques</strong> : <ToComplete label="durée choisie, par exemple 6 mois" />.
          </li>
        </ul>
        <p>À l’issue de ces délais, les données sont supprimées ou rendues anonymes.</p>
      </>
    ),
  },
  {
    id: "securite",
    title: "Sécurité",
    content: (
      <>
        <p>Conformément aux articles 424 et 426 du Code du numérique, nous mettons en œuvre des mesures techniques et organisationnelles adaptées :</p>
        <ul>
          <li>connexion chiffrée (HTTPS) sur l’ensemble du site ;</li>
          <li>accès à l’espace d’organisation protégé par identifiant et réservé aux personnes habilitées ;</li>
          <li>QR codes contenant un identifiant aléatoire, sans aucune donnée personnelle ;</li>
          <li>aucune conservation de données bancaires ;</li>
          <li>collecte limitée au strict nécessaire.</li>
        </ul>
        <p>En cas de violation de données susceptible de vous concerner, nous en informerons sans délai l’APDP et les personnes concernées (article 427).</p>
      </>
    ),
  },
  {
    id: "droits",
    title: "Vos droits",
    content: (
      <>
        <p>Le Code du numérique vous reconnaît les droits suivants sur vos données :</p>
        <ul>
          <li>
            <strong>Droit d’accès</strong> : savoir si nous traitons vos données et en obtenir une copie (article 437) ;
          </li>
          <li>
            <strong>Droit de rectification et de suppression</strong> des données inexactes, incomplètes ou dont la conservation n’est plus justifiée (article 441) ;
          </li>
          <li>
            <strong>Droit d’opposition</strong>, pour des motifs légitimes, et à tout moment pour la prospection (article 440) ;
          </li>
          <li>
            <strong>Droit à la portabilité</strong> : recevoir les données que vous nous avez fournies dans un format lisible par machine (article 438) ;
          </li>
          <li>
            <strong>Droit à l’effacement et à l’oubli numérique</strong> (article 443) ;
          </li>
          <li>
            <strong>Droit d’interrogation</strong> (article 439).
          </li>
        </ul>
        <h3>Comment exercer vos droits</h3>
        <p>
          Adressez votre demande, datée et signée, accompagnée d’un justificatif d’identité, par e-mail à <Value value={o.email} label="adresse e-mail dédiée" /> ou par courrier à{" "}
          <Value value={o.address} label="adresse postale" />. Nous vous répondons dans un délai maximum de <strong>45 jours</strong> à compter de la réception de votre demande
          (article 441).
        </p>
        <p>
          Certaines données doivent toutefois être conservées pour respecter une obligation légale (conservation des contrats) : dans ce cas, nous vous l’indiquons.
        </p>
      </>
    ),
  },
  {
    id: "reclamation",
    title: "Réclamation auprès de l’APDP",
    content: (
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir l’{apdp.name}, autorité de contrôle en République du Bénin :{" "}
        <a href={apdp.website} target="_blank" rel="noopener noreferrer">
          apdp.bj
        </a>
        .
      </p>
    ),
  },
  {
    id: "formalites",
    title: "Formalités auprès de l’APDP",
    content: (
      <p>
        Le traitement des données de la billetterie a fait l’objet d’une déclaration préalable auprès de l’APDP (article 405 du Code du numérique) :{" "}
        <Value value={legal.apdpDeclaration} label="numéro et date du récépissé de déclaration" />.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies et stockage local",
    content: (
      <>
        <p>
          Ce site <strong>n’utilise aucun cookie publicitaire ni outil de mesure d’audience</strong>. Les polices de caractères sont hébergées sur nos propres serveurs : aucune
          donnée n’est transmise à un service tiers lors de votre visite.
        </p>
        <p>
          Pendant une réservation, votre navigateur conserve temporairement le contenu de votre commande (stockage de session). Ces informations sont effacées à la fermeture de
          l’onglet et ne servent qu’au bon déroulement de l’achat.
        </p>
      </>
    ),
  },
  {
    id: "mineurs",
    title: "Mineurs",
    content: (
      <p>
        La réservation est réservée aux personnes majeures ou aux mineurs autorisés par leur représentant légal. Conditions d’accès des mineurs au gala :{" "}
        <Value value={legal.minorsPolicy} label="âge minimum ou conditions d’accompagnement" />.
      </p>
    ),
  },
  {
    id: "modifications",
    title: "Modifications",
    content: (
      <p>
        Nous pouvons mettre à jour cette politique, par exemple lorsque nos prestataires changent. La date de dernière mise à jour figure en haut de la page. Les conditions de
        vente applicables à votre commande sont détaillées dans nos <Link href="/conditions-generales-de-vente">conditions générales de vente</Link>.
      </p>
    ),
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Politique de confidentialité"
      intro={
        <p>
          La protection de vos données personnelles nous tient à cœur. Cette politique explique quelles données nous collectons lorsque vous réservez un billet pour la{" "}
          {event.name} du {event.dateLabel}, pourquoi, combien de temps nous les gardons et comment exercer vos droits. Elle s’appuie sur la loi n° 2017-20 portant Code du
          numérique en République du Bénin et ses textes modificatifs, notamment son Livre V relatif à la protection des données à caractère personnel.
        </p>
      }
      sections={sections}
    />
  );
}
