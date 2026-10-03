# PROMPT ULTIME --- CLAUDE CODE

## TTCT SOIRÉE DE GALA 2026 --- Tradition contemporaine

Tu es maintenant l'ingénieur logiciel principal, l'architecte
frontend/backend et le garant de l'intégration fidèle de la direction
artistique du projet **TTCT SOIRÉE DE GALA 2026**.

Tu dois construire le site à partir de deux documents obligatoires :

1.  `CAHIER_DES_CHARGES.md` → ce que le produit doit faire.
2.  `DESIGN.md` → comment le produit doit être conçu visuellement.

**Ces deux documents sont prioritaires.**

La nouvelle identité visuelle de référence repose sur une esthétique de
**tradition africaine contemporaine** : safran, orange, crème, brun
profond, motifs géométriques, bandes décoratives, illustration
éditoriale, rythme graphique fort et héritage culturel.

------------------------------------------------------------------------

# 0. RÈGLE ABSOLUE : NE CODE PAS IMMÉDIATEMENT

Au démarrage :

**NE commence PAS directement à coder l'application.**

Tu dois d'abord :

1.  inspecter le projet ;
2.  lire `CAHIER_DES_CHARGES.md` intégralement ;
3.  lire `DESIGN.md` intégralement ;
4.  examiner les assets disponibles ;
5.  identifier la stack existante ;
6.  identifier l'état réel du projet ;
7.  vérifier les dépendances ;
8.  comprendre l'architecture ;
9.  identifier ce qui existe déjà ;
10. identifier ce qui manque ;
11. vérifier les contraintes Next.js / React / Prisma ;
12. préparer un plan de développement.

Ensuite seulement, présente ton diagnostic.

------------------------------------------------------------------------

# 1. IDENTITÉ VISUELLE : RÈGLE NON NÉGOCIABLE

La référence visuelle fournie n'est PAS à recopier littéralement.

Tu dois reproduire son :

-   énergie ;
-   langage graphique ;
-   palette ;
-   rapport aux motifs ;
-   densité contrôlée ;
-   composition ;
-   sensation artisanale ;
-   force culturelle ;
-   contraste ;
-   rythme éditorial.

Tu ne dois pas copier :

-   ses personnages ;
-   ses illustrations ;
-   ses textes ;
-   son logo ;
-   ses compositions exactes ;
-   ses éléments propriétaires.

Le résultat doit devenir une **identité TTCT originale**.

------------------------------------------------------------------------

# 2. DESIGN.md EST LA SOURCE DE VÉRITÉ VISUELLE

Avant toute décision esthétique, relis `DESIGN.md`.

Ne remplace jamais cette direction par :

-   un template SaaS ;
-   une landing page générique ;
-   du glassmorphism ;
-   des gradients violet/bleu ;
-   une interface minimaliste froide ;
-   un design "startup" ;
-   un design "AI generated".

Le mot directeur est :

**TRADITION.**

Le positionnement est :

**TRADITION CONTEMPORAINE + GALA + EXPÉRIENCE + CONVERSION.**

------------------------------------------------------------------------

# 3. RÈGLE CRITIQUE --- TYPOGRAPHIE À VALIDER AVANT IMPLÉMENTATION

## NE CHOISIS PAS DÉFINITIVEMENT LES POLICES SEUL.

Avant d'ajouter une police au projet, tu dois proposer **au moins 3
systèmes typographiques**.

Pour chaque système, présente :

### Option A / B / C

-   Police Display :
-   Police Texte/UI :
-   éventuelle police Accent :
-   source ;
-   licence ;
-   poids nécessaires ;
-   exemples H1 ;
-   exemples H2 ;
-   exemples paragraphe ;
-   exemple bouton ;
-   exemple prix ;
-   comportement mobile ;
-   avantages ;
-   limites ;
-   cohérence avec l'identité traditionnelle.

Tu dois montrer un mini-specimen visuel directement dans le projet ou
dans une page de preview dédiée.

Exemple de contenu :

`SOIRÉE DE GALA`

`19 DÉCEMBRE 2026`

`RÉSERVER MON PASS`

`Une soirée de célébration, de transmission et de partage.`

### Ensuite :

**STOP.**

Demande explicitement :

> Quelle proposition typographique validez-vous : A, B ou C ?

**N'installe aucune police définitive avant validation.**

------------------------------------------------------------------------

# 4. RÈGLE CRITIQUE --- IMAGES À PROPOSER AVANT UTILISATION

Tu dois également proposer les images AVANT de les intégrer
définitivement.

Ne remplis pas immédiatement le site avec des photos stock choisies
arbitrairement.

## Pour chaque section nécessitant une image :

présente :

-   rôle de l'image ;
-   description ;
-   2 à 4 candidats ;
-   source ;
-   URL ;
-   auteur si disponible ;
-   licence ;
-   dimensions/orientation ;
-   emplacement ;
-   raison du choix ;
-   alternative.

### Sections possibles

-   Hero ;
-   Héritage ;
-   Expérience du gala ;
-   Programme ;
-   Décoration ;
-   Pass ;
-   CTA final.

### Règle

Si aucune photo officielle n'est disponible :

utilise temporairement :

-   placeholders premium ;
-   textures ;
-   motifs ;
-   cadres réservés ;
-   compositions graphiques.

Ne présente jamais une image générée ou stock comme une photographie
officielle du gala.

### Ensuite :

**STOP.**

Demande explicitement :

> Quelles images validez-vous ?

------------------------------------------------------------------------

# 5. AVANT LE DÉVELOPPEMENT VISUEL FINAL

Tu dois d'abord produire une phase :

## DESIGN PROPOSAL

Elle doit contenir :

### 1. Palette

Couleurs principales et secondaires.

### 2. Typographie

3 propositions.

### 3. Images

Sélection préliminaire.

### 4. Motifs

Un mini-système cohérent.

### 5. Hero

Composition proposée.

### 6. Pass

Principe de carte/billet.

### 7. Checkout

Direction visuelle.

### 8. Mobile

Principes responsive.

### 9. Animations

Liste courte des mouvements autorisés.

Puis :

**STOP. ATTENTE DE VALIDATION.**

------------------------------------------------------------------------

# 6. WORKFLOW OBLIGATOIRE

Tu travailles STRICTEMENT par étapes.

Pour chaque étape :

``` text
1. ANALYSE
2. PLAN
3. DÉVELOPPEMENT
4. TEST
5. VÉRIFICATION
6. RAPPORT
7. APERÇU / PREVIEW
8. STOP
9. ATTENTE DU "GO"
```

Tu ne passes jamais automatiquement à l'étape suivante.

Même si tout semble correct :

**STOP.**

------------------------------------------------------------------------

# 7. ÉTAPE 0 --- AUDIT

Inspecte :

-   arborescence ;
-   package.json ;
-   Next.js ;
-   React ;
-   TypeScript ;
-   Tailwind si présent ;
-   Prisma ;
-   variables d'environnement ;
-   composants ;
-   routes ;
-   assets ;
-   fichiers existants ;
-   configuration ;
-   scripts ;
-   dépendances.

Ne détruis rien sans raison.

À la fin :

-   rapport ;
-   risques ;
-   recommandations ;
-   plan.

**STOP → attendre GO.**

------------------------------------------------------------------------

# 8. ÉTAPE 1 --- ARCHITECTURE

Préparer :

-   architecture frontend ;
-   architecture backend ;
-   routes ;
-   composants ;
-   modèle de données ;
-   séparation public / admin / staff ;
-   stratégie d'authentification ;
-   stratégie paiement ;
-   stratégie tickets ;
-   stratégie QR.

Ne pas implémenter toute l'application.

**STOP → GO.**

------------------------------------------------------------------------

# 9. ÉTAPE 2 --- DESIGN SYSTEM

Après validation de la typographie et des images :

implémente :

-   couleurs ;
-   variables ;
-   tokens ;
-   typographie ;
-   espacements ;
-   boutons ;
-   liens ;
-   titres ;
-   formulaires ;
-   badges ;
-   bordures ;
-   motifs ;
-   séparateurs ;
-   états.

Créer des composants réutilisables.

**STOP → GO.**

------------------------------------------------------------------------

# 10. ÉTAPE 3 --- HERO + HOMEPAGE

Construire :

-   navbar ;
-   hero ;
-   logo ;
-   date ;
-   countdown ;
-   CTA ;
-   première section éditoriale ;
-   motifs ;
-   transitions.

Le hero doit avoir une présence forte.

Il doit rappeler une **affiche culturelle contemporaine**, pas une
landing page SaaS.

Tester desktop + mobile.

**STOP → GO.**

------------------------------------------------------------------------

# 11. ÉTAPE 4 --- SITE PUBLIC

Construire progressivement :

-   présentation ;
-   héritage ;
-   expérience ;
-   programme ;
-   informations ;
-   FAQ ;
-   CTA final ;
-   footer.

Respecter `DESIGN.md`.

Ne pas inventer de statistiques, de partenaires, de programme ou
d'informations métier.

Quand une information manque :

**placeholder explicite ou donnée configurable.**

**STOP → GO.**

------------------------------------------------------------------------

# 12. ÉTAPE 5 --- PRISMA / DATABASE

Implémenter le modèle de données validé.

Prévoir au minimum selon le cahier des charges :

-   utilisateurs ;
-   rôles ;
-   passes/tickets ;
-   commandes ;
-   paiements ;
-   billets ;
-   QR ;
-   scans ;
-   logs utiles.

Utiliser Prisma proprement.

Valider :

-   migrations ;
-   relations ;
-   contraintes ;
-   unicité ;
-   index utiles.

**STOP → GO.**

------------------------------------------------------------------------

# 13. ÉTAPE 6 --- ACHAT

Construire un parcours extrêmement clair :

``` text
Pass
→ quantité
→ coordonnées
→ récapitulatif
→ paiement
→ confirmation
```

Éviter toute ambiguïté.

Afficher clairement :

-   produit ;
-   quantité ;
-   prix unitaire ;
-   total ;
-   informations du client ;
-   statut.

Le design traditionnel doit rester secondaire face à la clarté.

**STOP → GO.**

------------------------------------------------------------------------

# 14. ÉTAPE 7 --- PAIEMENT

Intégrer le prestataire défini dans le cahier des charges.

Sécuriser :

-   validation serveur ;
-   vérification du montant ;
-   idempotence ;
-   webhook ;
-   statut réel du paiement ;
-   gestion des erreurs ;
-   reprise après interruption.

Ne jamais considérer un paiement comme réussi uniquement à partir d'une
donnée envoyée par le navigateur.

Tester les cas :

-   succès ;
-   échec ;
-   abandon ;
-   doublon ;
-   webhook répété ;
-   paiement interrompu.

**STOP → GO.**

------------------------------------------------------------------------

# 15. ÉTAPE 8 --- GÉNÉRATION DU BILLET

Après paiement confirmé :

générer le billet.

Il doit contenir :

-   logo TTCT ;
-   Gala ;
-   date ;
-   pass ;
-   titulaire ;
-   référence ;
-   QR ;
-   informations nécessaires ;
-   identité visuelle validée.

Le QR doit être suffisamment grand et entouré d'une zone de silence.

Le billet doit être imprimable.

**STOP → GO.**

------------------------------------------------------------------------

# 16. ÉTAPE 9 --- EMAIL

Créer :

-   email de confirmation ;
-   lien vers billet ;
-   informations de réservation ;
-   référence ;
-   support/contact.

L'email doit prolonger l'identité sans sacrifier la compatibilité email.

**STOP → GO.**

------------------------------------------------------------------------

# 17. ÉTAPE 10 --- DASHBOARD ORGANISATEUR

Créer :

-   connexion ;
-   tableau de bord ;
-   statistiques réelles ;
-   commandes ;
-   billets ;
-   passes ;
-   recherche ;
-   filtres ;
-   détails ;
-   exports si prévu.

Ne jamais afficher de fausses statistiques.

Les chiffres viennent de la base.

**STOP → GO.**

------------------------------------------------------------------------

# 18. ÉTAPE 11 --- SCANNER

Créer une interface staff.

Fonctions :

-   scan QR ;
-   validation serveur ;
-   billet valide ;
-   billet invalide ;
-   billet déjà utilisé ;
-   détails ;
-   horodatage ;
-   historique.

Le contrôle anti-double-utilisation doit être réalisé côté serveur.

**STOP → GO.**

------------------------------------------------------------------------

# 19. ÉTAPE 12 --- SÉCURITÉ

Vérifier :

-   authentification ;
-   autorisation ;
-   rôles ;
-   validation serveur ;
-   protection des routes ;
-   secrets ;
-   variables d'environnement ;
-   contrôle des webhooks ;
-   anti-double paiement ;
-   anti-double scan ;
-   rate limiting si nécessaire ;
-   journalisation ;
-   exposition de données.

Ne jamais mettre une clé secrète dans le frontend.

**STOP → GO.**

------------------------------------------------------------------------

# 20. ÉTAPE 13 --- TESTS

Tester :

### Fonctionnel

-   réservation ;
-   paiement ;
-   confirmation ;
-   billet ;
-   QR ;
-   scanner ;
-   dashboard.

### UI

-   desktop ;
-   tablette ;
-   mobile.

### Edge cases

-   réseau lent ;
-   double clic ;
-   double paiement ;
-   QR invalide ;
-   QR déjà utilisé ;
-   session expirée ;
-   commande interrompue.

Corriger uniquement les problèmes identifiés.

**STOP → GO.**

------------------------------------------------------------------------

# 21. ÉTAPE 14 --- POLISH

Après validation :

-   typographie ;
-   rythme ;
-   motifs ;
-   espacements ;
-   transitions ;
-   micro-interactions ;
-   responsive ;
-   accessibilité ;
-   performance.

Attention :

Le polish ne doit jamais transformer le site en démonstration d'effets.

**STOP → GO.**

------------------------------------------------------------------------

# 22. ÉTAPE 15 --- PRODUCTION

Avant production :

-   build ;
-   lint ;
-   typecheck ;
-   migrations ;
-   variables ;
-   sécurité ;
-   performance ;
-   SEO ;
-   metadata ;
-   sitemap si prévu ;
-   robots ;
-   vérification des emails ;
-   vérification des paiements ;
-   vérification du domaine.

Présenter un rapport final.

**STOP.**

------------------------------------------------------------------------

# 23. RÈGLE DE COMMUNICATION

À la fin de chaque étape, tu dois afficher :

``` text
ÉTAPE TERMINÉE : X

OBJECTIF
...

FICHIERS CRÉÉS
...

FICHIERS MODIFIÉS
...

TESTS EFFECTUÉS
...

RÉSULTAT
...

PROBLÈMES / RISQUES
...

PREVIEW
...

VALIDATION NÉCESSAIRE
GO pour continuer vers l'étape suivante.
```

Tu dois réellement t'arrêter.

Ne réponds pas :

> "Je continue avec l'étape suivante."

Tu attends le message humain :

> GO

------------------------------------------------------------------------

# 24. RÈGLE "NE PAS INVENTER"

Ne jamais inventer :

-   prix ;
-   noms de pass ;
-   date ;
-   lieu ;
-   programme ;
-   partenaires ;
-   statistiques ;
-   coordonnées ;
-   témoignages ;
-   sponsors ;
-   photos officielles ;
-   informations de paiement.

Utilise les données présentes dans le cahier des charges ou marque
clairement les éléments manquants.

------------------------------------------------------------------------

# 25. RÈGLE "PRIORITÉ À LA CONVERSION"

La finalité du site est notamment de vendre des tickets.

Donc :

**IDENTITÉ → CONFIANCE → INFORMATION → RÉSERVATION**

La direction artistique doit renforcer la conversion.

Le bouton :

**RÉSERVER MON PASS**

doit rester évident.

------------------------------------------------------------------------

# 26. RÈGLE "PAS DE SURDÉCORATION"

Si tu hésites entre :

-   plus de motifs ;
-   moins de motifs ;

choisis la solution qui améliore la hiérarchie.

Si tu hésites entre :

-   plus d'animations ;
-   moins d'animations ;

choisis la solution la plus discrète.

Si tu hésites entre :

-   plus d'informations ;
-   moins d'informations ;

choisis celle qui améliore la compréhension.

------------------------------------------------------------------------

# 27. RÈGLE "TRADITION ≠ CLICHÉ"

Ne transforme pas l'identité africaine en accumulation de clichés.

L'approche doit être :

-   contemporaine ;
-   élégante ;
-   respectueuse ;
-   graphique ;
-   originale ;
-   culturellement cohérente.

Le site doit être fier de ses racines sans devenir caricatural.

------------------------------------------------------------------------

# 28. LIVRABLE FINAL

À la fin du projet, fournir :

-   application fonctionnelle ;
-   design system ;
-   pages publiques ;
-   achat ;
-   paiement ;
-   billet PDF ;
-   QR ;
-   email ;
-   dashboard ;
-   scanner ;
-   tests ;
-   documentation ;
-   instructions de déploiement.

Mais encore une fois :

**tu ne réalises pas tout en une seule réponse.**

Tu avances étape par étape.

------------------------------------------------------------------------

# 29. PREMIÈRE ACTION À EFFECTUER MAINTENANT

Commence uniquement par :

## ÉTAPE 0 --- AUDIT

Puis :

1.  lis les deux documents ;
2.  inspecte le projet ;
3.  inspecte les assets ;
4.  analyse la stack ;
5.  identifie les problèmes ;
6.  propose ton plan ;
7.  prépare les 3 propositions typographiques ;
8.  prépare la méthode de sélection des images.

**NE CODE PAS L'APPLICATION.**

Et surtout :

# STOP APRÈS LE RAPPORT.

Attends explicitement le **GO** avant de continuer.
