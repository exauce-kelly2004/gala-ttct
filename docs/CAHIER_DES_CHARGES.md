# CAHIER DES CHARGES --- Plateforme de billetterie du Gala TTCT 2026

**Projet :** Soirée de Gala --- TTCT (La Team Télé Contre Télé)\
**Date de l'événement :** 19 décembre 2026\
**Positionnement :** événement de gala premium, élégant et caritatif\
**Stack imposée :** Next.js + React + TypeScript + Prisma\
**Document de référence :** ce cahier des charges doit être lu avant
toute décision de développement.

------------------------------------------------------------------------

## 1. Vision du projet

Le projet consiste à développer une plateforme web complète de
présentation, de vente et de contrôle de billets pour la Soirée de Gala
TTCT 2026.

La plateforme ne doit pas être conçue comme une simple landing page.
Elle doit réunir trois fonctions principales :

1.  **Espace public / visiteur**
    -   découvrir le Gala ;
    -   consulter les informations pratiques ;
    -   voir le compte à rebours ;
    -   consulter les formules de billets ;
    -   acheter rapidement et en sécurité ;
    -   recevoir ses billets par e-mail ;
    -   télécharger les billets au format PDF.
2.  **Espace organisateur**
    -   suivre les ventes ;
    -   consulter les commandes ;
    -   consulter les billets ;
    -   suivre les statistiques ;
    -   contrôler les accès et les données utiles à l'organisation.
3.  **Espace personnel de contrôle**
    -   scanner le QR Code d'un billet ;
    -   vérifier instantanément sa validité ;
    -   empêcher la réutilisation d'un billet ;
    -   consulter l'historique des contrôles selon les droits accordés.

------------------------------------------------------------------------

## 2. Identité de l'événement

### Informations connues

-   Nom : **Soirée de Gala**
-   Organisation : **TTCT --- La Team Télé Contre Télé**
-   Date : **19 décembre 2026**
-   Promesse visuelle : **Harmonie et ambiance, une soirée d'exception
    pour les veuves et orphelins**
-   Positionnement visuel : gala, prestige, élégance, nuit, or, ambiance
    cérémonielle.
-   Dress code indiqué sur le visuel : **chic**
-   Formules visibles sur le visuel :
    -   Pass Duo V.V.I.P : **50 000 FCFA**
    -   Pass Duo V.I.P : **25 000 FCFA**
    -   Pass Solo : **15 000 FCFA**

### Informations à ne pas inventer

Le lieu exact, l'heure exacte, le programme détaillé, les
artistes/intervenants, les conditions de remboursement, les coordonnées
officielles supplémentaires et le prestataire de paiement devront être
fournis ou validés par l'organisateur.

Si une information manque, l'application doit utiliser un état "à
compléter" ou une configuration administrable, et non inventer une
donnée.

------------------------------------------------------------------------

# 3. Objectifs

## Objectif principal

Permettre à une personne de découvrir l'événement, acheter son billet en
quelques étapes et recevoir un billet numérique vérifiable.

## Objectifs secondaires

-   créer une image premium de l'événement ;
-   réduire les frictions lors de l'achat ;
-   sécuriser la confirmation du paiement ;
-   générer un billet unique par place/pass ;
-   automatiser l'envoi des billets ;
-   permettre un contrôle rapide à l'entrée ;
-   fournir à l'organisation une vision claire des ventes.

------------------------------------------------------------------------

# 4. Parcours utilisateur principal

``` text
Visiteur
   ↓
Découverte du Gala
   ↓
Informations
   ↓
Compte à rebours
   ↓
Choix du pass
   ↓
Informations acheteur
   ↓
Paiement
   ↓
Confirmation réelle du paiement
   ↓
Génération du billet
   ↓
QR Code unique
   ↓
PDF
   ↓
E-mail
   ↓
Contrôle le jour J
   ↓
Scan QR
   ↓
Validation / refus
```

Le parcours d'achat doit être court, compréhensible et mobile-first.

------------------------------------------------------------------------

# 5. Fonction 1 --- Site public

## 5.1 Hero

Le Hero doit immédiatement communiquer :

-   identité TTCT ;
-   Soirée de Gala ;
-   date ;
-   ambiance premium ;
-   CTA d'achat ;
-   compte à rebours.

Éléments prioritaires :

-   logo TTCT ;
-   "Soirée de Gala" ;
-   "19 décembre 2026" ;
-   phrase de présentation ;
-   bouton "Réserver mon pass" ;
-   countdown.

## 5.2 Présentation

Créer une section éditoriale expliquant le sens du Gala et sa finalité.

Le texte définitif sera validé par l'organisateur.

## 5.3 Programme

Prévoir une structure permettant d'afficher :

-   heure ;
-   activité ;
-   intervenant/artiste ;
-   description.

Le contenu doit être facilement modifiable.

## 5.4 Billetterie

Présenter les trois formules :

### Pass Duo V.V.I.P

**50 000 FCFA**

### Pass Duo V.I.P

**25 000 FCFA**

### Pass Solo

**15 000 FCFA**

Chaque formule doit afficher :

-   nom ;
-   prix ;
-   description ;
-   avantages ;
-   disponibilité ;
-   quantité sélectionnée ;
-   CTA.

Les prix ne doivent pas être écrits en dur dans plusieurs composants.
Ils doivent provenir de la base de données.

## 5.5 Informations pratiques

Prévoir :

-   date ;
-   horaires ;
-   lieu ;
-   accès ;
-   dress code ;
-   contacts ;
-   règles d'entrée.

## 5.6 FAQ

Prévoir des questions sur :

-   achat ;
-   paiement ;
-   réception du billet ;
-   téléchargement ;
-   QR Code ;
-   accès ;
-   modification/annulation ;
-   accompagnants.

## 5.7 Footer

Contenir :

-   logo ;
-   identité de l'événement ;
-   liens utiles ;
-   contact ;
-   conditions ;
-   confidentialité.

------------------------------------------------------------------------

# 6. Fonction 2 --- Achat et billetterie

## 6.1 Principe

L'achat doit être réalisé en très peu d'étapes.

Parcours recommandé :

``` text
1. Choisir le pass
2. Renseigner les coordonnées
3. Payer
4. Confirmation
```

Éviter la création obligatoire d'un compte pour l'acheteur si le
prestataire de paiement et les exigences métier permettent un achat
invité.

## 6.2 Informations acheteur

Minimum :

-   nom ;
-   prénom ;
-   e-mail ;
-   téléphone.

Les informations des accompagnants ne doivent être demandées que si
elles sont réellement nécessaires.

## 6.3 Paiement

Le prestataire de paiement sera choisi séparément.

Architecture attendue :

``` text
Checkout
   ↓
Création commande PENDING
   ↓
Paiement
   ↓
Webhook / confirmation serveur
   ↓
Commande PAID
   ↓
Création billet(s)
```

Ne jamais considérer une simple redirection navigateur comme preuve de
paiement.

Les données bancaires sensibles ne doivent pas être stockées dans la
base de données.

## 6.4 Confirmation

Après paiement réellement confirmé :

-   commande passée à PAID ;
-   billet(s) généré(s) ;
-   QR Code(s) généré(s) ;
-   PDF créé ;
-   e-mail envoyé ;
-   page de confirmation affichée.

------------------------------------------------------------------------

# 7. Billets

Chaque billet doit être unique.

Chaque billet possède notamment :

-   identifiant interne ;
-   numéro public de billet ;
-   token QR unique ;
-   type de pass ;
-   commande ;
-   statut ;
-   date de création ;
-   date d'utilisation éventuelle.

## Statuts recommandés

``` text
PENDING
VALID
USED
CANCELLED
REFUNDED
```

Le MVP peut commencer avec :

``` text
PENDING
VALID
USED
CANCELLED
```

## QR Code

Le QR Code doit contenir un identifiant/token non devinable.

Ne pas placer directement les données personnelles dans le QR Code.

Exemple conceptuel :

``` text
TTCT-8F7K2M9QX...
```

------------------------------------------------------------------------

# 8. PDF du billet

Le PDF doit être élégant, imprimable et lisible sur smartphone.

Contenu minimal :

-   logo TTCT ;
-   nom du Gala ;
-   type de pass ;
-   date ;
-   lieu lorsqu'il sera défini ;
-   nom de l'acheteur ;
-   numéro de billet ;
-   QR Code ;
-   informations essentielles ;
-   consignes d'accès.

Le billet PDF doit reprendre l'identité graphique du site sans devenir
une copie de l'affiche.

------------------------------------------------------------------------

# 9. E-mail

Après confirmation du paiement, l'acheteur reçoit un e-mail comprenant :

-   remerciement ;
-   confirmation de commande ;
-   résumé ;
-   nombre de billets ;
-   montant ;
-   bouton de téléchargement ;
-   éventuellement les PDF en pièces jointes.

Le lien de téléchargement doit être sécurisé et ne doit pas exposer
inutilement des données sensibles.

------------------------------------------------------------------------

# 10. Fonction 3 --- Espace organisateur

## 10.1 Authentification

L'espace d'administration doit être protégé.

Rôles minimum :

``` text
ADMIN / ORGANIZER
STAFF
```

Les permissions doivent être contrôlées côté serveur.

## 10.2 Dashboard

Afficher au minimum :

-   billets vendus ;
-   montant encaissé ;
-   commandes ;
-   billets valides ;
-   billets utilisés ;
-   billets annulés ;
-   progression des ventes.

Les statistiques doivent être calculées à partir des données réelles.

## 10.3 Commandes

Fonctions :

-   liste ;
-   recherche ;
-   filtres ;
-   détail ;
-   statut ;
-   référence paiement ;
-   client ;
-   montant ;
-   date.

## 10.4 Billets

Fonctions :

-   liste ;
-   recherche par numéro ;
-   recherche par e-mail ;
-   recherche par client ;
-   statut ;
-   date de création ;
-   date d'utilisation.

## 10.5 Configuration des pass

Prévoir la possibilité de gérer :

-   nom ;
-   description ;
-   prix ;
-   quantité ;
-   disponibilité ;
-   avantages ;
-   statut actif/inactif.

------------------------------------------------------------------------

# 11. Espace personnel de contrôle

Interface optimisée smartphone.

## Fonction principale

``` text
Ouvrir scanner
   ↓
Scanner QR
   ↓
Vérification serveur
   ↓
Résultat
```

## Billet valide

Afficher très clairement :

``` text
BILLET VALIDE

Nom
Type de pass
Référence

ACCÈS AUTORISÉ
```

## Billet déjà utilisé

``` text
BILLET DÉJÀ UTILISÉ

Accès refusé
```

## Billet inexistant

``` text
BILLET INVALIDE

Accès refusé
```

## Billet annulé

``` text
BILLET ANNULÉ

Accès refusé
```

------------------------------------------------------------------------

# 12. Sécurité du scan

La validation doit être effectuée côté serveur.

La logique doit être transactionnelle/atomique :

``` text
Recevoir token
   ↓
Trouver ticket
   ↓
Vérifier statut
   ↓
Si VALID :
    passer à USED
    enregistrer le scan
    autoriser
Sinon :
    refuser
```

Deux scanners ne doivent pas pouvoir valider simultanément le même
ticket.

Chaque scan doit idéalement être journalisé :

-   ticket ;
-   personnel ;
-   résultat ;
-   date/heure.

------------------------------------------------------------------------

# 13. Modèle de données

Architecture initiale recommandée :

### User

``` text
id
name
email
passwordHash / provider
role
createdAt
updatedAt
```

### Event

``` text
id
name
description
date
startTime
endTime
location
heroImage
logo
createdAt
updatedAt
```

### TicketType

``` text
id
eventId
name
description
price
quantity
availableQuantity
active
createdAt
updatedAt
```

### Order

``` text
id
customerName
customerEmail
customerPhone
totalAmount
currency
status
paymentReference
createdAt
updatedAt
```

### Ticket

``` text
id
orderId
ticketTypeId
ticketNumber
qrToken
status
usedAt
createdAt
updatedAt
```

### ScanLog

``` text
id
ticketId
staffId
result
scannedAt
```

Le schéma pourra être adapté après choix du prestataire de paiement et
clarification des règles métier.

------------------------------------------------------------------------

# 14. Stack technique

-   Next.js
-   React
-   TypeScript
-   Prisma
-   PostgreSQL
-   Tailwind CSS
-   système d'authentification sécurisé
-   bibliothèque QR Code
-   bibliothèque de génération PDF
-   service e-mail transactionnel
-   prestataire de paiement à définir
-   Git/GitHub

------------------------------------------------------------------------

# 15. Architecture recommandée

Pour le MVP, conserver une architecture monolithique Next.js :

``` text
Next.js
├── UI publique
├── Checkout
├── API / Server Actions
├── Authentification
├── Dashboard
└── Scanner
        ↓
      Prisma
        ↓
    PostgreSQL
```

Ne pas introduire de microservices inutilement.

------------------------------------------------------------------------

# 16. Responsive

Priorité :

1.  smartphone ;
2.  tablette ;
3.  desktop.

Le parcours d'achat et le scanner doivent être particulièrement
efficaces sur mobile.

------------------------------------------------------------------------

# 17. Critères de réussite

Le projet sera considéré comme fonctionnel lorsque :

-   un visiteur peut découvrir l'événement ;
-   le countdown fonctionne ;
-   les prix viennent de la base ;
-   un visiteur peut commander ;
-   le paiement est confirmé côté serveur ;
-   les billets sont générés uniquement après confirmation ;
-   chaque billet possède un QR unique ;
-   le PDF est généré ;
-   l'e-mail est envoyé ;
-   l'organisateur voit les ventes ;
-   le personnel peut scanner ;
-   un billet valide est accepté ;
-   un billet déjà utilisé est refusé ;
-   deux scans concurrents ne permettent pas une double entrée ;
-   les accès sont protégés selon les rôles ;
-   le site est responsive.

------------------------------------------------------------------------

# 18. Méthode de développement obligatoire

Le projet doit être développé **étape par étape**.

Il est interdit de générer tout le projet en une seule fois.

Chaque étape doit :

1.  être annoncée ;
2.  être développée ;
3.  être testée ;
4.  être expliquée ;
5.  faire l'objet d'un résumé ;
6.  attendre l'autorisation explicite de l'utilisateur avant de passer à
    l'étape suivante.

Le but est de permettre au propriétaire du projet de suivre l'évolution
et de valider progressivement les choix.
