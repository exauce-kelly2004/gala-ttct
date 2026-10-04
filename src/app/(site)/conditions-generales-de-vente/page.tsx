import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, ToComplete, Value, type LegalSection } from "@/components/legal/Legal";
import { event } from "@/config/event";
import { legal } from "@/config/legal";
import { passes } from "@/config/passes";
import { formatAmount, formatPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "Conditions générales de vente · Soirée de Gala TTCT 2026",
  description: "Conditions de vente des billets de la Soirée de Gala TTCT 2026 : commande, prix, paiement, billets, rétractation, remboursement et accès.",
};

const o = legal.organizer;

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "Objet et acceptation",
    content: (
      <>
        <p>
          Les présentes conditions générales de vente (CGV) régissent la vente en ligne des billets donnant accès à la {event.name} « {event.theme} », organisée par {o.name}, le{" "}
          {event.dateLabel} à {event.city}.
        </p>
        <p>
          Elles s’appliquent à toute commande passée sur ce site. Elles sont accessibles à tout moment depuis chaque page du site et peuvent être enregistrées ou imprimées. Pour
          valider votre commande, vous devez les avoir lues et acceptées en cochant la case prévue à cet effet.
        </p>
      </>
    ),
  },
  {
    id: "vendeur",
    title: "Identité de l’organisateur",
    content: (
      <ul>
        <li>
          <strong>{o.name}</strong>, <Value value={o.legalForm} label="forme juridique" />
        </li>
        <li>
          Enregistrement : <Value value={o.registration} label="récépissé d’association ou numéro RCCM" />
        </li>
        <li>
          IFU : <Value value={o.ifu} label="numéro IFU, si assujetti (sinon supprimer cette ligne)" />
        </li>
        <li>
          Adresse : <Value value={o.address} label="adresse complète du siège" />
        </li>
        <li>
          E-mail : <Value value={o.email} label="adresse e-mail" /> · Téléphone : {o.phones.map(formatPhone).join(" ou ")}
        </li>
      </ul>
    ),
  },
  {
    id: "offre",
    title: "Billets proposés",
    content: (
      <>
        <p>Les billets donnent accès à la soirée du {event.dateLabel}, à partir de {event.startTime}, à {event.city}. Les formules proposées sont :</p>
        <ul>
          {passes.map((p) => (
            <li key={p.slug}>
              <strong>{p.name}</strong> : {formatAmount(p.price)} {p.currency}, entrée pour {p.seats > 1 ? `${p.seats} personnes` : "1 personne"}.
            </li>
          ))}
        </ul>
        <p>
          Chaque pass donne lieu à un billet électronique unique, muni d’un QR code. Un Pass Duo est valable pour deux personnes se présentant ensemble à l’entrée. Les places sont
          vendues dans la limite des disponibilités, indiquées sur chaque formule.
        </p>
        <p>
          Lieu exact de la soirée : <Value value={event.venue} label="adresse du lieu" />.
        </p>
      </>
    ),
  },
  {
    id: "prix",
    title: "Prix",
    content: (
      <p>
        Les prix sont indiqués en francs CFA (FCFA), <strong>toutes taxes comprises</strong>. Aucun frais de livraison n’est appliqué : les billets sont envoyés par voie
        électronique. Frais de service éventuels : <ToComplete label="montant des frais de service ou de paiement, ou « aucun »" />. Le prix applicable est celui affiché au moment
        de la validation de la commande.
      </p>
    ),
  },
  {
    id: "commande",
    title: "Étapes de la commande",
    content: (
      <>
        <p>La commande se fait en français, sans création de compte, en quatre étapes :</p>
        <ul>
          <li>
            <strong>Choix des pass</strong> et des quantités ;
          </li>
          <li>
            <strong>Coordonnées</strong> : nom, prénom, e-mail et téléphone, après affichage du récapitulatif de la commande ;
          </li>
          <li>
            <strong>Vérification</strong> : vous pouvez contrôler le détail de votre commande et vos informations, les corriger ou interrompre la commande à tout moment avant de
            payer ;
          </li>
          <li>
            <strong>Paiement</strong> : la commande est définitive une fois le paiement confirmé par notre prestataire.
          </li>
        </ul>
        <p>
          Dès la confirmation du paiement, vous recevez par e-mail un accusé de réception contenant le récapitulatif détaillé de la commande, sa date et son heure, le justificatif
          de paiement et vos billets. Si vous ne recevez pas cet e-mail, vérifiez vos courriers indésirables puis contactez-nous.
        </p>
      </>
    ),
  },
  {
    id: "paiement",
    title: "Paiement",
    content: (
      <p>
        Le paiement s’effectue en ligne, en une seule fois, par : <Value value={legal.paymentMethods} label="moyens de paiement acceptés (Mobile Money, carte bancaire…)" />, via
        notre prestataire <Value value={legal.paymentProvider} label="nom du prestataire de paiement" />. Les opérations sont sécurisées par ce prestataire ; nous n’avons jamais
        accès à vos données bancaires. Une commande n’est validée qu’après confirmation du paiement par le prestataire : un simple retour sur le site ne vaut pas paiement.
      </p>
    ),
  },
  {
    id: "billets",
    title: "Billets et contrôle d’accès",
    content: (
      <>
        <ul>
          <li>Les billets sont envoyés par e-mail et téléchargeables au format PDF. Ils peuvent être présentés sur téléphone ou imprimés.</li>
          <li>Chaque billet porte un QR code unique, scanné à l’entrée. Une fois scanné, il ne permet plus aucune entrée : seul le premier présenté est accepté.</li>
          <li>Ne partagez pas votre billet et ne le publiez pas sur les réseaux sociaux : toute copie pourrait être utilisée avant vous.</li>
          <li>
            Revente : <Value value={legal.resalePolicy} label="revente entre particuliers autorisée ou interdite" />.
          </li>
          <li>
            Le code vestimentaire de la soirée est traditionnel. L’organisation peut refuser l’accès à toute personne dont le comportement compromet la sécurité ou le bon
            déroulement de l’événement, sans remboursement.
          </li>
          <li>
            Mineurs : <Value value={legal.minorsPolicy} label="âge minimum ou conditions d’accompagnement" />.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "retractation",
    title: "Droit de rétractation",
    content: (
      <>
        <p>
          Conformément aux articles 347 à 354 du Code du numérique, vous disposez d’un délai de <strong>quinze (15) jours ouvrables</strong> à compter du lendemain de votre
          commande pour exercer votre droit de rétractation, sans avoir à vous justifier et sans frais.
        </p>
        <p>
          Pour l’exercer, adressez-nous une demande claire mentionnant la référence de votre commande, par e-mail à <Value value={o.email} label="adresse e-mail" /> ou par
          téléphone au {formatPhone(o.phones[0])}. Les billets concernés sont alors annulés et ne permettent plus l’accès à la soirée.
        </p>
        <p>
          Nous vous remboursons l’intégralité des sommes versées dans un délai maximum de <strong>trente (30) jours ouvrables</strong> à compter de votre demande, par le même moyen
          de paiement, sauf accord de votre part pour un autre moyen sans frais supplémentaires (articles 351 et 353).
        </p>
        <p>Le droit de rétractation ne peut plus être exercé une fois la prestation entièrement fournie, c’est-à-dire après la tenue de la soirée (article 354).</p>
      </>
    ),
  },
  {
    id: "annulation",
    title: "Annulation, report ou modification",
    content: (
      <>
        <p>
          <strong>Annulation de la soirée par l’organisateur</strong> : les billets sont remboursés intégralement, dans un délai maximum de trente (30) jours ouvrables, par le même
          moyen de paiement.
        </p>
        <p>
          <strong>Report de la soirée</strong> : les billets restent valables pour la nouvelle date. Si vous ne pouvez pas y assister, vous pouvez demander le remboursement dans les
          conditions suivantes : <ToComplete label="délai pour demander le remboursement en cas de report" />.
        </p>
        <p>
          <strong>Modification d’une commande</strong> (changement de pass ou de titulaire) : <ToComplete label="possible ou non, et conditions" />.
        </p>
        <p>
          <strong>En dehors du délai de rétractation</strong>, un billet acheté n’est ni repris ni remboursé, sauf annulation de la soirée ou accord de l’organisateur.
        </p>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "Responsabilité",
    content: (
      <p>
        L’organisateur s’engage à mettre en œuvre tous les moyens nécessaires au bon déroulement de la soirée. Il ne saurait être tenu responsable de la perte ou du vol d’objets
        personnels, ni d’un empêchement résultant d’un cas de force majeure. Le titulaire du billet est responsable de sa conservation : un billet perdu peut être renvoyé à
        l’adresse e-mail utilisée lors de la commande.
      </p>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles",
    content: (
      <p>
        Les données collectées lors de la commande sont nécessaires à son traitement. Elles sont traitées conformément au Livre V du Code du numérique et à notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>, qui détaille vos droits.
      </p>
    ),
  },
  {
    id: "conservation",
    title: "Archivage du contrat",
    content: (
      <p>
        Le contrat conclu en ligne est archivé pendant dix (10) ans à compter de la tenue de la soirée (article 346 du Code du numérique). Vous pouvez en obtenir une copie sur
        simple demande.
      </p>
    ),
  },
  {
    id: "reclamations",
    title: "Réclamations et litiges",
    content: (
      <>
        <p>
          Pour toute réclamation, contactez-nous en priorité : <Value value={o.email} label="adresse e-mail" />, {o.phones.map(formatPhone).join(" ou ")}. Nous nous engageons à
          rechercher une solution amiable.
        </p>
        <p>
          Les présentes CGV sont soumises au droit béninois, notamment au Code du numérique et à la loi n° 2007-21 du 16 octobre 2007 portant protection du consommateur en
          République du Bénin. À défaut d’accord amiable, le litige sera porté devant : <Value value={legal.jurisdiction} label="juridiction compétente" />, sans préjudice des
          règles protectrices du consommateur.
        </p>
      </>
    ),
  },
];

export default function CgvPage() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Conditions générales de vente"
      intro={<p>Merci de lire attentivement ces conditions avant de réserver : elles précisent vos droits et nos engagements pour la vente des billets du gala.</p>}
      sections={sections}
    />
  );
}
