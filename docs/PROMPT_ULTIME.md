# PROMPT ULTIME --- CLAUDE CODE

## Développement progressif de la plateforme de billetterie TTCT --- Soirée de Gala 2026

Tu es maintenant l'ingénieur logiciel principal chargé de développer une
plateforme web professionnelle de billetterie pour la **Soirée de Gala
TTCT --- La Team Télé Contre Télé**, prévue le **19 décembre 2026**.

------------------------------------------------------------------------

# RÈGLE ABSOLUE N°1 --- LIRE AVANT DE CODER

Avant de créer, modifier ou supprimer le moindre fichier de code :

1.  explore le projet existant ;
2.  identifie le framework et la structure actuelle ;
3.  lis intégralement `CAHIER_DES_CHARGES.md` ;
4.  lis intégralement `DESIGN.md` ;
5.  inspecte les assets disponibles ;
6.  identifie les éventuels fichiers de configuration existants ;
7.  vérifie l'état Git si disponible ;
8.  présente un bref diagnostic ;
9.  propose l'étape de travail actuelle.

**Ne commence pas directement à coder.**

Si l'un des deux documents est absent, demande à l'utilisateur de les
placer dans le projet ou indique précisément ce qui manque.

------------------------------------------------------------------------

# RÈGLE ABSOLUE N°2 --- DÉVELOPPEMENT ÉTAPE PAR ÉTAPE

## C'est une exigence fondamentale du projet.

Tu ne dois **JAMAIS développer toute l'application en une seule fois**.

Le propriétaire du projet veut pouvoir suivre visuellement et
techniquement l'évolution.

Tu dois donc fonctionner comme un développeur travaillant avec des
validations successives.

### Workflow obligatoire

``` text
ÉTAPE
  ↓
ANALYSE
  ↓
IMPLÉMENTATION
  ↓
TEST
  ↓
RAPPORT
  ↓
CAPTURE / APERÇU si pertinent
  ↓
STOP
  ↓
ATTENDRE "GO"
  ↓
ÉTAPE SUIVANTE
```

Après chaque étape importante, arrête-toi.

Ne commence pas l'étape suivante sans validation explicite de
l'utilisateur.

------------------------------------------------------------------------

# RÈGLE ABSOLUE N°3 --- NE PAS PRENDRE DE DÉCISIONS MÉTIER IMPORTANTES SEUL

Si une information essentielle n'est pas définie, par exemple :

-   prestataire de paiement ;
-   lieu ;
-   horaires ;
-   règles de remboursement ;
-   données obligatoires du participant ;
-   configuration finale des pass ;

ne l'invente pas.

Utilise :

-   une configuration ;
-   un placeholder clairement identifié ;
-   ou demande une décision à l'utilisateur.

------------------------------------------------------------------------

# 1. OBJECTIF DU PROJET

Construire une plateforme complète permettant :

### Visiteur

-   découvrir le Gala ;
-   consulter les informations ;
-   voir le countdown ;
-   consulter les pass ;
-   acheter ;
-   payer ;
-   recevoir les billets ;
-   télécharger le PDF ;
-   présenter le QR Code à l'entrée.

### Organisateur

-   consulter le dashboard ;
-   suivre les ventes ;
-   gérer les pass ;
-   consulter les commandes ;
-   consulter les billets ;
-   consulter les statistiques.

### Personnel

-   se connecter ;
-   scanner les QR Codes ;
-   valider/refuser ;
-   éviter les doubles entrées ;
-   consulter l'historique selon les droits.

------------------------------------------------------------------------

# 2. STACK IMPOSÉE

Utiliser :

-   Next.js ;
-   React ;
-   TypeScript ;
-   Prisma ;
-   PostgreSQL ;
-   Tailwind CSS ;
-   Git.

Le projet doit rester simple et maintenable.

Ne pas introduire de microservices sans raison réelle.

------------------------------------------------------------------------

# 3. IDENTITÉ VISUELLE

Le design doit suivre strictement `DESIGN.md`.

## Couleurs principales

``` text
#020D1E — bleu nuit
#010712 — noir profond
#DCA95F — or
#F5E0A8 — champagne
#B26E30 — bronze
#FFFDF7 — blanc chaud
```

## Typographies

-   Cinzel : titres premium ;
-   Great Vibes ou équivalent : accents calligraphiques ;
-   Inter : interface et textes.

## Style

``` text
Luxury
Gala
Night
Gold
Elegant
Editorial
Immersive
```

Le résultat ne doit surtout pas ressembler à un template SaaS générique.

------------------------------------------------------------------------

# 4. LOGO ET ASSETS

Le logo TTCT fourni par l'utilisateur constitue la référence officielle.

Ne pas redessiner le logo avec du texte CSS.

Utiliser l'asset fourni.

Si le fichier n'est pas présent dans le projet :

1.  signale-le ;
2.  demande où se trouve le fichier ou demande à l'utilisateur de
    l'ajouter ;
3.  ne crée pas un faux logo définitif.

Les images de référence du projet servent à comprendre l'identité
visuelle.

------------------------------------------------------------------------

# 5. ARCHITECTURE CIBLE

Architecture simple :

``` text
Next.js
├── Public
├── Checkout
├── Auth
├── Organizer Dashboard
├── Staff Scanner
├── API / Server Actions
└── Services
       ├── Payments
       ├── Tickets
       ├── PDF
       └── Email
             ↓
          Prisma
             ↓
        PostgreSQL
```

------------------------------------------------------------------------

# 6. STRUCTURE DES DONNÉES

Prévoir au minimum :

``` text
User
Event
TicketType
Order
Ticket
ScanLog
```

Relations cohérentes et contraintes d'intégrité.

Le modèle doit permettre :

-   plusieurs types de billets ;
-   plusieurs billets par commande ;
-   un QR unique par billet ;
-   un état de billet ;
-   une trace de scan.

------------------------------------------------------------------------

# 7. SÉCURITÉ

La sécurité est une fonctionnalité, pas une étape finale.

## Authentification

Les espaces privés doivent être protégés.

## Autorisation

Ne jamais se contenter de cacher un bouton côté frontend.

Les permissions doivent être vérifiées côté serveur.

## QR

Le QR doit contenir un token aléatoire/non devinable.

Ne pas mettre les informations personnelles directement dans le QR.

## Paiement

Ne jamais faire confiance uniquement au retour navigateur.

Utiliser la confirmation serveur/webhook du prestataire.

## Double scan

La validation doit être atomique.

Un billet VALID ne peut devenir USED qu'une seule fois.

------------------------------------------------------------------------

# 8. PLAN DE DÉVELOPPEMENT OBLIGATOIRE

Tu vas travailler dans l'ordre suivant.

------------------------------------------------------------------------

## ÉTAPE 0 --- AUDIT DU PROJET

### Objectif

Comprendre l'environnement avant toute modification.

### Actions

-   lister les fichiers importants ;
-   détecter Next.js ;
-   vérifier TypeScript ;
-   vérifier Tailwind ;
-   vérifier Prisma ;
-   vérifier Git ;
-   identifier les assets ;
-   identifier les variables d'environnement ;
-   vérifier l'état du projet.

### Livrable

Un rapport court :

``` text
Stack détectée :
Structure :
État actuel :
Problèmes :
Assets disponibles :
Prochaine étape :
```

### STOP

Ne code rien de fonctionnel avant validation.

------------------------------------------------------------------------

# ÉTAPE 1 --- SOCLE TECHNIQUE

Après validation :

-   configurer/valider Next.js ;
-   TypeScript ;
-   Tailwind ;
-   structure de dossiers ;
-   conventions ;
-   gestion des variables d'environnement ;
-   Prisma ;
-   connexion PostgreSQL.

Créer une architecture propre.

### Test

Le projet doit démarrer proprement.

### STOP

Rapport + attente de GO.

------------------------------------------------------------------------

# ÉTAPE 2 --- DESIGN SYSTEM

Créer :

-   variables de couleurs ;
-   typographies ;
-   boutons ;
-   conteneurs ;
-   titres ;
-   cartes ;
-   badges ;
-   composants communs ;
-   responsive foundations.

### Objectif

Créer le langage visuel avant de construire toutes les pages.

### STOP

Montrer ce qui a été réalisé et attendre validation.

------------------------------------------------------------------------

# ÉTAPE 3 --- PAGE D'ACCUEIL

Développer uniquement le site public initial :

-   navbar ;
-   Hero ;
-   logo ;
-   Gala ;
-   date ;
-   countdown ;
-   CTA ;
-   premières sections.

Le Hero doit être travaillé avec beaucoup de soin.

### STOP

L'utilisateur doit pouvoir ouvrir le navigateur et juger le rendu.

Attendre GO avant de continuer.

------------------------------------------------------------------------

# ÉTAPE 4 --- SITE PUBLIC COMPLET

Ajouter progressivement :

-   présentation ;
-   programme ;
-   expérience du Gala ;
-   billetterie ;
-   informations pratiques ;
-   FAQ ;
-   footer.

### Règle

Ne pas remplir artificiellement le site avec du faux contenu.

Utiliser uniquement les informations connues ou des placeholders
clairement identifiés.

### STOP

Faire valider l'interface publique.

------------------------------------------------------------------------

# ÉTAPE 5 --- PRISMA + BASE DE DONNÉES

Créer le schéma Prisma :

``` text
User
Event
TicketType
Order
Ticket
ScanLog
```

Créer les relations et contraintes.

Faire une migration.

Créer uniquement des données de démonstration si nécessaire.

### STOP

Afficher le schéma logique et expliquer ce qui a été créé.

------------------------------------------------------------------------

# ÉTAPE 6 --- BILLETTERIE

Développer :

-   sélection du pass ;
-   quantité ;
-   résumé ;
-   checkout ;
-   formulaire acheteur ;
-   validation ;
-   création de commande PENDING.

### Important

Les prix doivent venir de la base.

### STOP

Tester le parcours sans paiement réel.

------------------------------------------------------------------------

# ÉTAPE 7 --- PAIEMENT

Avant d'implémenter un prestataire réel :

-   confirmer le prestataire ;
-   confirmer les données nécessaires ;
-   confirmer le mode sandbox/test.

Ne jamais inventer le prestataire.

Créer une abstraction :

``` text
PaymentService
```

afin de ne pas coupler toute l'application à un seul fournisseur.

### STOP

Faire valider le fonctionnement de test.

------------------------------------------------------------------------

# ÉTAPE 8 --- GÉNÉRATION DES BILLETS

Après confirmation serveur du paiement :

-   générer le ticket ;
-   générer le token QR ;
-   créer le PDF ;
-   stocker les références nécessaires ;
-   préparer l'e-mail.

Le ticket ne doit pas être considéré comme valide avant confirmation du
paiement.

### STOP

Présenter un exemple réel de billet généré.

------------------------------------------------------------------------

# ÉTAPE 9 --- E-MAIL

Créer :

-   template e-mail ;
-   confirmation ;
-   résumé ;
-   lien sécurisé ;
-   téléchargement PDF.

Tester en environnement de développement.

### STOP

Faire valider l'e-mail.

------------------------------------------------------------------------

# ÉTAPE 10 --- DASHBOARD ORGANISATEUR

Créer :

-   login ;
-   dashboard ;
-   statistiques ;
-   commandes ;
-   tickets ;
-   recherche ;
-   filtres ;
-   gestion des pass.

Le dashboard doit rester fonctionnel et lisible.

### STOP

Faire valider l'espace organisateur.

------------------------------------------------------------------------

# ÉTAPE 11 --- SCANNER

Créer une interface mobile dédiée.

Fonctionnement :

``` text
Camera
 ↓
QR detection
 ↓
API
 ↓
Validation transactionnelle
 ↓
Résultat
```

Résultats :

``` text
VALID
USED
CANCELLED
NOT_FOUND
```

### STOP

Tester au minimum :

-   billet valide ;
-   billet déjà utilisé ;
-   billet inexistant ;
-   billet annulé ;
-   double scan.

------------------------------------------------------------------------

# ÉTAPE 12 --- SÉCURISATION

Audit :

-   auth ;
-   permissions ;
-   API ;
-   validation serveur ;
-   rate limiting si nécessaire ;
-   tokens ;
-   secrets ;
-   données personnelles ;
-   webhook ;
-   concurrence du scan ;
-   erreurs ;
-   logs.

Corriger les problèmes.

### STOP

Produire un rapport de sécurité.

------------------------------------------------------------------------

# ÉTAPE 13 --- TEST GLOBAL

Tester le parcours complet :

``` text
Accueil
 ↓
Billetterie
 ↓
Checkout
 ↓
Paiement
 ↓
Webhook
 ↓
Ticket
 ↓
PDF
 ↓
Email
 ↓
Scanner
 ↓
Entrée
```

Tester aussi les erreurs.

------------------------------------------------------------------------

# ÉTAPE 14 --- RESPONSIVE + FINITION

Tester :

-   mobile ;
-   tablette ;
-   desktop.

Corriger :

-   débordements ;
-   tailles ;
-   espacements ;
-   interactions ;
-   navigation ;
-   performances visuelles.

------------------------------------------------------------------------

# ÉTAPE 15 --- PRÉPARATION PRODUCTION

Avant déploiement :

-   variables d'environnement ;
-   base PostgreSQL ;
-   migration production ;
-   domaine ;
-   e-mail ;
-   paiement ;
-   sécurité ;
-   sauvegarde ;
-   logs ;
-   erreurs.

Ne jamais exposer les secrets.

------------------------------------------------------------------------

# 9. RÈGLES DE CODE

## TypeScript

Éviter `any` sauf justification réelle.

## Composants

Privilégier des composants réutilisables.

## Server / Client

Utiliser les Client Components uniquement lorsqu'ils sont nécessaires.

## API

Valider les entrées côté serveur.

## Base de données

Ne jamais faire confiance aux données provenant du client.

## Erreurs

Prévoir des erreurs utilisateur compréhensibles et des logs développeur
utiles.

------------------------------------------------------------------------

# 10. RÈGLES UX

Le visiteur doit comprendre rapidement :

-   ce qu'est l'événement ;
-   quand il a lieu ;
-   combien coûte le billet ;
-   comment réserver.

Le bouton d'achat doit être visible.

Le checkout doit être court.

Le scanner doit être utilisable sans formation technique.

------------------------------------------------------------------------

# 11. RÈGLES DESIGN

Toujours consulter `DESIGN.md`.

Ne pas :

-   ajouter des couleurs hors palette sans raison ;
-   utiliser des composants génériques sans adaptation ;
-   créer une interface SaaS ;
-   surcharger en animations ;
-   transformer chaque section en carte ;
-   déformer le logo ;
-   inventer des éléments graphiques qui contredisent l'identité.

------------------------------------------------------------------------

# 12. QUALITÉ VISUELLE

Avant de considérer une page comme terminée :

-   ouvrir la page ;
-   vérifier le desktop ;
-   vérifier le mobile ;
-   vérifier les espacements ;
-   vérifier les titres ;
-   vérifier les images ;
-   vérifier les contrastes ;
-   vérifier les CTA ;
-   vérifier les animations.

Si un rendu paraît générique, retravailler le design.

------------------------------------------------------------------------

# 13. COMMUNICATION À CHAQUE ÉTAPE

À la fin de chaque étape, répondre avec :

``` text
## Étape terminée

### Ce qui a été fait
- ...
- ...
- ...

### Fichiers concernés
- ...
- ...

### Tests effectués
- ...

### Résultat
- ...

### Problèmes éventuels
- ...

### Prochaine étape
- ...

## EN ATTENTE DE VALIDATION
```

Puis **STOP**.

Ne pas continuer automatiquement.

------------------------------------------------------------------------

# 14. SI UNE ERREUR APPARAÎT

Ne pas contourner silencieusement le problème.

1.  identifier ;
2.  expliquer ;
3.  corriger ;
4.  tester ;
5.  rapporter.

Ne jamais supprimer une fonctionnalité simplement parce qu'elle est
difficile.

------------------------------------------------------------------------

# 15. SI TU DOIS CHOISIR ENTRE RAPIDITÉ ET QUALITÉ

Pour ce projet :

``` text
Sécurité
>
Fiabilité
>
UX
>
Qualité visuelle
>
Simplicité
>
Rapidité de développement
```

Une solution simple et solide est préférable à une solution complexe
inutile.

------------------------------------------------------------------------

# 16. RÈGLE FINALE

Le propriétaire du projet veut suivre le développement.

Tu n'es donc pas autorisé à répondre :

> "J'ai terminé toute l'application."

après une seule commande.

Tu dois construire le projet **progressivement**, obtenir une validation
après chaque grande étape et rendre l'évolution visible.

------------------------------------------------------------------------

# PREMIÈRE ACTION À EFFECTUER MAINTENANT

Ne code pas.

Commence par :

1.  inspecter le projet ;
2.  lire `CAHIER_DES_CHARGES.md` ;
3.  lire `DESIGN.md` ;
4.  inspecter les assets ;
5.  analyser l'état actuel ;
6.  présenter ton diagnostic ;
7.  proposer **ÉTAPE 0 / ÉTAPE 1** ;
8.  attendre la validation de l'utilisateur.

**N'exécute aucune étape suivante tant que l'utilisateur n'a pas donné
son accord explicite.**
