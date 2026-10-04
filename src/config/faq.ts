/**
 * Questions fréquentes. Les réponses ne décrivent que ce qui est déjà décidé (cahier des charges) ;
 * les points non tranchés par l'organisateur le disent clairement.
 */
export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "Comment acheter mon pass ?",
    answer:
      "Choisissez votre pass et la quantité, renseignez votre nom, votre e-mail et votre téléphone, puis payez en ligne. Aucun compte n’est nécessaire.",
  },
  {
    question: "Quels moyens de paiement sont acceptés ?",
    answer: "Les moyens de paiement seront précisés à l’ouverture de la billetterie en ligne.",
  },
  {
    question: "Quand vais-je recevoir mon billet ?",
    answer: "Dès que votre paiement est confirmé, votre billet vous est envoyé par e-mail. Il s’affiche aussi sur la page de confirmation.",
  },
  {
    question: "Puis-je télécharger mon billet ?",
    answer: "Oui. Chaque billet est disponible en PDF : vous pouvez le garder sur votre téléphone ou l’imprimer.",
  },
  {
    question: "À quoi sert le QR code ?",
    answer:
      "Chaque billet porte un QR code unique, scanné à l’entrée. Une fois scanné, il ne peut plus être utilisé : ne le partagez pas.",
  },
  {
    question: "Un Pass Duo couvre combien de personnes ?",
    answer: "Un Pass Duo donne accès à deux personnes. Le Pass Solo donne accès à une personne.",
  },
  {
    question: "Comment se passe l’accès le jour du gala ?",
    answer: `Présentez votre billet, sur téléphone ou imprimé, à l’entrée. Le lieu exact et l’heure d’ouverture des portes seront communiqués prochainement.`,
  },
  {
    question: "Puis-je modifier ou annuler ma réservation ?",
    answer: "Les conditions de modification et d’annulation seront précisées par l’organisateur. En attendant, contactez-nous par téléphone.",
  },
];
