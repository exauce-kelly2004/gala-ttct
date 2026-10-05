# Contrat front-end / back-end : réservation et billets

Ce document décrit ce que le front-end attend du back-end pour le parcours d'achat.
**Répartition :** le front-end (formulaires, parcours, affichage, dessin du QR code, téléchargement du billet en PNG et PDF) est fait. Le back-end gère la base de données, le paiement, la création des billets et de leurs jetons uniques, la vérification au scan et les e-mails.

Le front-end ne génère **aucun** numéro de billet ni jeton (en démonstration seulement, un jeton local est créé). Il **dessine** le QR code à partir du jeton fourni.

## 1. Où brancher

Un seul fichier à modifier : [`src/features/checkout/api.ts`](../src/features/checkout/api.ts).

| Fonction | Rôle | Aujourd'hui |
| --- | --- | --- |
| `createOrder(request)` | crée la commande et lance le paiement | simulation (attente de 1,6 s, puis commande `PAID` en `sessionStorage`) |
| `getOrder(reference)` | renvoie la commande pour la page de confirmation | lit le `sessionStorage` |
| `IS_DEMO` | affiche les bandeaux « démonstration » | `true` |

Remplacez le corps des deux fonctions par vos appels (route API ou Server Action) **en gardant leurs signatures**, puis passez `IS_DEMO` à `false`. Aucun composant n'a besoin de changer.

Les types partagés sont dans [`src/features/checkout/order.ts`](../src/features/checkout/order.ts). La validation des coordonnées est dans [`src/features/checkout/buyer-schema.ts`](../src/features/checkout/buyer-schema.ts) : un schéma zod à réutiliser côté serveur.

## 2. Ce que le front envoie : `createOrder`

```ts
type CreateOrderRequest = {
  buyer: { firstName: string; lastName: string; email: string; phone: string };
  items: {
    passSlug: string; // "duo-vvip" | "duo-vip" | "solo"
    quantity: number;
    guestNames?: string[]; // Pass Duo uniquement : nom complet du 2e invité, un par pass (longueur = quantity)
  }[];
  termsAcceptedAt: string; // ISO 8601 : moment où l'acheteur a coché « J'accepte les CGV »
  termsVersion: string;    // version des CGV acceptées (date de mise à jour)
};
```

- Le téléphone arrive normalisé, sans espaces : `0197865758`, `+2290197865758` ou un numéro international `+33...`.
- Les quantités sont déjà bornées côté front (≥ 1, ≤ `maxPerOrder`), mais **le serveur doit tout revérifier** : prix, stock, quantités. Le front n'envoie volontairement aucun prix.

Réponse attendue :

```ts
{ reference: string; paymentUrl?: string }
```

- Avec `paymentUrl` (paiement hébergé par le prestataire) : le front redirige vers cette URL. Le prestataire doit ensuite renvoyer l'acheteur vers `/confirmation?ref=<reference>`.
- Sans `paymentUrl` : le front va directement sur `/confirmation?ref=<reference>`.
- En cas d'erreur, la fonction doit **lever une exception** : le front affiche « Le paiement n'a pas pu être lancé ».

## 3. Ce que le front affiche : `getOrder`

```ts
type Order = {
  reference: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string; // ISO 8601
  buyer: { firstName: string; lastName: string; email: string; phone: string };
  lines: { slug: string; name: string; price: number; seats: number; quantity: number }[];
  total: number;
  currency: "FCFA";
  tickets: Ticket[];
};

type Ticket = {
  number: string;   // numéro public, lisible à l'entrée
  passName: string; // ex. "Pass Duo V.I.P"
  seats: number;    // 2 pour un Pass Duo, 1 pour un Solo
  holders: string[]; // noms sur le billet : acheteur, puis invité pour un Duo
  status: "PENDING" | "VALID" | "USED" | "CANCELLED";
  qrToken: string | null; // jeton unique du billet, créé et enregistré par le back-end (lié au type de pass dans sa base)
  pdfUrl: string | null; // optionnel : PDF officiel généré par le back-end
};
```

- Retourner `null` si la référence est inconnue : le front affiche « Réservation introuvable ».
- `qrToken` : le front en dessine le QR code (carré clair de 176 px) et propose le téléchargement du billet complet (PNG par billet, PDF de tous les billets). Si la valeur est `null`, le billet montre « QR code délivré après paiement ». **Le jeton doit être imprévisible et unique** (au moins 20 caractères aléatoires, ex. `TTCT-7K2M9QXH4PBD8R3F6WNA`) ; la base y associe le type de pass (Solo, Duo V.I.P, Duo V.V.I.P), les titulaires et la commande.
- Le téléchargement du billet est fait par le front. Si `pdfUrl` est renseigné, un bouton « PDF officiel » s’ajoute.
- Choix actuel du front : **un billet par pass**. Un Pass Duo donne un billet valable pour 2 personnes. Si vous préférez un billet par personne, renvoyez simplement 2 billets avec `seats: 1`.
- Le statut `PENDING` est prévu, si le webhook n'a pas encore confirmé le paiement au moment où l'acheteur revient sur le site.

## 4. Points de vigilance (cahier des charges)

- La redirection navigateur n'est **jamais** une preuve de paiement : seule la confirmation serveur (webhook) passe la commande à `PAID`.
- `/confirmation?ref=...` ne doit pas exposer une commande à n'importe qui. Prévoyez une référence non devinable ou un jeton signé dans l'URL.
- Le QR code ne contient qu'un jeton, aucune donnée personnelle.
- **Contrôle à l'entrée** : le back-end doit stocker `holders` avec le billet. En scannant le jeton, le contrôleur doit recevoir le ou les noms, le type de pass, la référence et le statut (payé / valide, déjà utilisé, annulé, inconnu). Un billet Duo se scanne une seule fois pour les deux personnes.

## 4 bis. Contrôle à l'entrée : `verifyTicket`

Écran : `/scanner` (smartphone, caméra arrière). Un seul fichier à brancher : [`src/features/scanner/api.ts`](../src/features/scanner/api.ts), fonction `verifyTicket(code)`, puis `IS_DEMO = false`.

```ts
verifyTicket(code: string): Promise<ScanResult>

type ScanResult = {
  status: "VALID" | "USED" | "CANCELLED" | "INVALID";
  ticket?: {                // absent si INVALID (billet inconnu)
    number: string;         // numéro public
    passName: string;
    seats: number;
    holders: string[];      // 1 nom (Solo) ou 2 noms (Duo)
    orderReference: string;
    paid: boolean;
    usedAt?: string;        // ISO 8601, si USED : heure du premier passage
  };
  scannedAt: string;        // ISO 8601
};
```

- `code` est le contenu brut du QR (le jeton), ou le numéro de billet saisi à la main en secours.
- Le serveur fait tout en **une opération atomique** : trouver le billet, vérifier le statut, passer `VALID` → `USED`, journaliser (billet, membre du personnel, résultat, heure), répondre. Un second scan, même simultané, reçoit `USED`.
- Un billet Duo se scanne une seule fois pour les deux personnes.
- La route doit exiger la connexion du personnel (rôle STAFF) : la page `/scanner` elle-même n'est pas protégée côté front.
- En cas d'erreur réseau, la fonction lève une exception : l'écran invite à rescanner (le billet n'est alors pas considéré comme validé).

## 5. Obligations légales côté back-end (Bénin)

Les pages `/conditions-generales-de-vente` et `/confidentialite` promettent ce qui suit. Le back-end doit le tenir :

- **Accusé de réception** (Code du numérique, art. 344) : l'e-mail de confirmation contient le récapitulatif détaillé de la commande, sa **date et son heure**, et le justificatif de paiement.
- **Preuve du consentement** (art. 341) : enregistrer `termsAcceptedAt` et `termsVersion` avec la commande.
- **Archivage** (art. 346) : conserver commandes et billets pendant 10 ans.
- **Rétractation** (art. 348 à 353) : il faut pouvoir annuler les billets d'une commande et la rembourser sous 30 jours ouvrables, par le même moyen de paiement.
- **Données bancaires** : ne jamais les stocker. Seule la référence de paiement est conservée.
- **Sécurité et violations** (art. 426 et 427) : notifier sans délai l'APDP et les personnes concernées en cas de violation.
- **Droits des personnes** (art. 437 à 441) : pouvoir exporter, rectifier ou supprimer les données d'un acheteur (réponse sous 45 jours).
- **Transferts hors du Bénin** (art. 391 et 392) : si la base est hébergée hors du Bénin (Neon, par exemple), renseigner le pays dans `src/config/legal.ts` (`databaseHost`).
- **Déclaration APDP** (art. 405) : à faire par l'organisateur avant la mise en ligne. Le numéro de récépissé va dans `src/config/legal.ts`.

## 6. Données encore en dur côté front

Ces données sont provisoires, en attendant la base :

| Fichier | Contenu | À remplacer par |
| --- | --- | --- |
| `src/config/passes.ts` | noms, prix, avantages, disponibilité, `maxPerOrder` | table `TicketType` |
| `src/config/event.ts` | date, ville, horaires et lieu (`null` = à confirmer) | table `Event` |
| `src/config/programme.ts` | programme (vide = « à annoncer ») | contenu administrable |

Les composants lisent ces fichiers via des types simples (`PassOffer`, `ProgrammeItem`). Il suffit de fournir les mêmes formes depuis la base.
