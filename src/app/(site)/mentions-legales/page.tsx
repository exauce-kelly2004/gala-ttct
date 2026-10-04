import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Value, type LegalSection } from "@/components/legal/Legal";
import { legal } from "@/config/legal";
import { formatPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "Mentions légales · Soirée de Gala TTCT 2026",
  description: "Éditeur, hébergeur et informations légales du site de billetterie de la Soirée de Gala TTCT 2026.",
};

const o = legal.organizer;

const sections: LegalSection[] = [
  {
    id: "editeur",
    title: "Éditeur du site",
    content: (
      <ul>
        <li>
          <strong>{o.name}</strong>
        </li>
        <li>
          Forme juridique : <Value value={o.legalForm} label="association déclarée, entreprise…" />
        </li>
        <li>
          Enregistrement : <Value value={o.registration} label="récépissé d’association ou numéro RCCM, capital social le cas échéant" />
        </li>
        <li>
          IFU : <Value value={o.ifu} label="numéro IFU, si assujetti (sinon supprimer cette ligne)" />
        </li>
        <li>
          Adresse : <Value value={o.address} label="adresse géographique complète" />
        </li>
        <li>
          E-mail : <Value value={o.email} label="adresse e-mail" />
        </li>
        <li>Téléphone : {o.phones.map(formatPhone).join(" ou ")}</li>
        <li>
          Directeur ou directrice de la publication : <Value value={o.publicationDirector} label="nom et fonction" />
        </li>
      </ul>
    ),
  },
  {
    id: "hebergement",
    title: "Hébergement",
    content: (
      <p>
        Le site est hébergé par : <Value value={legal.host} label="nom, adresse et contact de l’hébergeur" />.
      </p>
    ),
  },
  {
    id: "propriete",
    title: "Propriété intellectuelle",
    content: (
      <>
        <p>
          Le nom, le logo et l’identité visuelle de la Soirée de Gala TTCT, ainsi que les textes et les motifs graphiques du site, sont la propriété de {o.name}. Toute
          reproduction sans autorisation est interdite.
        </p>
        <p>
          Le visuel « Bénin pluriel » est un photomontage réalisé à partir de photographies publiées sous licence Unsplash, de McFollis, Babarinde Tosin, Ayo Ogunseinde, Sunday
          Oludare et Tunde Buremo. Ces photographies sont des illustrations : elles ne représentent pas des invités du gala. Le contour du Bénin provient de Natural Earth
          (domaine public).
        </p>
      </>
    ),
  },
  {
    id: "donnees",
    title: "Données personnelles et cookies",
    content: (
      <p>
        Le traitement de vos données est décrit dans notre <Link href="/confidentialite">politique de confidentialité</Link>. Le site n’utilise ni cookie publicitaire ni outil
        de mesure d’audience.
      </p>
    ),
  },
  {
    id: "vente",
    title: "Vente des billets",
    content: (
      <p>
        La vente des billets est régie par nos <Link href="/conditions-generales-de-vente">conditions générales de vente</Link>.
      </p>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      eyebrow="Informations légales"
      title="Mentions légales"
      intro={<p>Informations relatives à l’éditeur du site, conformément à l’article 328 du Code du numérique en République du Bénin.</p>}
      sections={sections}
    />
  );
}
