# DESIGN.md --- TTCT SOIRÉE DE GALA 2026

## Direction artistique, système visuel et règles d'interface

> **Document de référence visuelle obligatoire pour le développement.**
>
> Ce document remplace et précise la précédente version de `DESIGN.md`.
> Claude Code doit le lire intégralement avant toute implémentation
> visuelle.

------------------------------------------------------------------------

# 01 --- VISION CRÉATIVE

Le site de la **Soirée de Gala TTCT --- La Team Télé Contre Télé** doit
donner l'impression d'entrer dans une soirée de gala avant même
d'arriver sur le lieu.

L'univers recherché est :

**PRESTIGE · NUIT · OR · VELOURS · CÉRÉMONIE · ÉLÉGANCE · CHALEUR ·
EXCLUSIVITÉ**

L'objectif n'est pas de produire un simple "site événementiel sombre
avec du doré".

Le design doit évoquer :

-   une salle de gala ;
-   des rideaux de velours bleu nuit ;
-   des dorures ;
-   des chandeliers ;
-   une invitation haut de gamme ;
-   une identité cérémonielle ;
-   une expérience digitale contemporaine.

Le site doit être **luxueux sans être kitsch**, spectaculaire sans être
surchargé et moderne sans perdre le caractère classique du Gala.

------------------------------------------------------------------------

# 02 --- RÉFÉRENCES VISUELLES

Deux sources servent de références complémentaires.

## A. Identité TTCT --- référence principale

Les images fournies par le client constituent la référence principale
pour :

-   le logo ;
-   les couleurs ;
-   les dorures ;
-   le bleu nuit ;
-   les rideaux ;
-   les bordures décoratives ;
-   les motifs héraldiques ;
-   la typographie de l'affiche ;
-   le vocabulaire visuel du Gala.

### Éléments visuels à reprendre

On retrouve notamment :

-   fond bleu marine/noir ;
-   textile/velours ;
-   lignes et bordures dorées ;
-   emblème TTCT ;
-   fleur de lys ;
-   bouclier ;
-   ornements symétriques ;
-   chandelier ;
-   lumière chaude ;
-   typographie serif de luxe ;
-   script manuscrit pour "Soirée de".

**Le logo fourni est un asset officiel : il ne doit pas être redessiné
en HTML/CSS.**

------------------------------------------------------------------------

## B. Site de référence : Effuzion

Le site fourni par le client :

`https://effuzion.org/`

sert de référence pour la **qualité d'expérience web**, et non pour
copier son identité graphique.

La structure générale observée met notamment l'accent sur une expérience
éditoriale avec :

-   une navigation claire ;
-   un Hero fort ;
-   des blocs de contenu espacés ;
-   des chiffres/statistiques ;
-   une galerie ;
-   des blocs d'appel à l'action ;
-   une logique de contenu progressive ;
-   un footer structuré.

Cette logique peut inspirer le rythme du site TTCT, mais toutes les
couleurs, images, typographies et ornements doivent rester propres à
TTCT. citeturn0view0

------------------------------------------------------------------------

# 03 --- PRINCIPE DE DESIGN

Le site ne doit **PAS** être une reproduction verticale de l'affiche.

L'affiche est une source d'identité.

Le site doit transformer cette identité en interface.

### Affiche

``` text
IMPACT
    ↓
IDENTITÉ
    ↓
ÉMOTION
```

### Site

``` text
IDENTITÉ
    ↓
INFORMATION
    ↓
CONFIANCE
    ↓
ACHAT
    ↓
EXPÉRIENCE
```

Le design doit donc conserver le prestige de l'affiche tout en apportant
:

-   lisibilité ;
-   navigation ;
-   hiérarchie ;
-   interactions ;
-   responsive ;
-   accessibilité ;
-   conversion.

------------------------------------------------------------------------

# 04 --- PALETTE OFFICIELLE

La palette est directement inspirée des visuels TTCT fournis.

## 04.1 Bleu nuit --- couleur dominante

``` text
#06162D
```

Usage :

-   arrière-plan principal ;
-   Hero ;
-   sections immersives ;
-   cartes premium ;
-   navigation.

Le bleu doit rester très profond.

------------------------------------------------------------------------

## 04.2 Bleu nuit profond

``` text
#020B18
```

Usage :

-   footer ;
-   overlays ;
-   sections très sombres ;
-   arrière-plans secondaires.

------------------------------------------------------------------------

## 04.3 Noir bleuté

``` text
#01050B
```

Usage :

-   contrastes ;
-   transitions ;
-   éléments de profondeur.

------------------------------------------------------------------------

## 04.4 Or principal

``` text
#D9A441
```

Usage :

-   CTA ;
-   bordures ;
-   icônes ;
-   séparateurs ;
-   accents ;
-   éléments interactifs.

------------------------------------------------------------------------

## 04.5 Or clair / champagne

``` text
#F3D27A
```

Usage :

-   titres ;
-   chiffres ;
-   éléments lumineux ;
-   highlights.

------------------------------------------------------------------------

## 04.6 Or clair lumineux

``` text
#FFE5A3
```

Usage limité :

-   détails ;
-   hover ;
-   reflets ;
-   éléments premium.

------------------------------------------------------------------------

## 04.7 Blanc chaud

``` text
#FFF8E8
```

Usage :

-   textes principaux ;
-   informations ;
-   labels.

------------------------------------------------------------------------

## 04.8 Blanc neutre

``` text
#F5F5F2
```

Usage :

-   textes secondaires ;
-   descriptions ;
-   interface.

------------------------------------------------------------------------

# 05 --- GRADIENTS MÉTALLIQUES

L'or doit donner l'impression d'être métallique.

Ne pas utiliser une seule couleur dorée pour tous les éléments.

### Gradient or principal

``` css
linear-gradient(
  120deg,
  #8F5B20 0%,
  #D9A441 28%,
  #FFE5A3 50%,
  #D9A441 72%,
  #8F5B20 100%
)
```

### Règle

Les gradients dorés sont réservés aux :

-   CTA principaux ;
-   grands titres premium ;
-   bordures spéciales ;
-   éléments de marque.

Ne pas appliquer le gradient à tous les textes.

------------------------------------------------------------------------

# 06 --- TYPOGRAPHIE

La typographie doit reproduire le contraste visible sur les affiches.

Les sites événementiels doivent conserver une hiérarchie très claire et
privilégier la lisibilité du texte courant.
citeturn0search0turn0search3

## 06.1 Titres principaux --- Cormorant Garamond

``` text
Cormorant Garamond
```

Utilisation :

-   GALA ;
-   grands titres ;
-   chiffres importants ;
-   titres de sections premium ;
-   dates.

Pourquoi :

-   contraste serif élégant ;
-   caractère éditorial ;
-   proximité avec le registre typographique visible sur l'affiche ;
-   meilleur caractère cérémoniel qu'une police géométrique moderne.

Poids recommandés :

``` text
500
600
700
```

------------------------------------------------------------------------

## 06.2 Accent calligraphique --- Great Vibes

``` text
Great Vibes
```

Utilisation :

-   "Soirée de" ;
-   quelques mots décoratifs ;
-   accroches très courtes.

### Règle stricte

Great Vibes ne doit jamais être utilisée pour :

-   paragraphes ;
-   boutons ;
-   menus ;
-   informations pratiques ;
-   prix ;
-   formulaires.

La police script est un accent, pas la police fonctionnelle du site.

------------------------------------------------------------------------

## 06.3 Interface --- Inter

``` text
Inter
```

Utilisation :

-   navigation ;
-   boutons ;
-   formulaires ;
-   descriptions ;
-   informations ;
-   dashboard ;
-   scanner ;
-   messages système.

------------------------------------------------------------------------

# 07 --- HIÉRARCHIE TYPOGRAPHIQUE

## Hero

``` text
Great Vibes
Soirée de

Cormorant Garamond
GALA

Inter / Cormorant
LA TEAM TÉLÉ CONTRE TÉLÉ

Cormorant Garamond
19

Inter
DÉCEMBRE 2026
```

## Sections

``` text
petit label
INTER / uppercase / letter-spacing

titre
CORMORANT GARAMOND

texte
INTER
```

------------------------------------------------------------------------

# 08 --- LOGO TTCT

Le logo fourni par le client est la référence officielle.

Il contient notamment :

-   bouclier ;
-   monogramme ;
-   fleur de lys ;
-   épées ;
-   ornements ;
-   cartouche TTCT.

### Interdictions

Ne jamais :

-   recréer le logo en texte ;
-   modifier ses proportions ;
-   l'étirer ;
-   changer arbitrairement ses couleurs ;
-   ajouter une ombre excessive ;
-   le convertir en simple icône générique.

### Assets recommandés

``` text
/public/images/brand/ttct-logo.png
/public/images/brand/ttct-logo.webp
/public/images/brand/ttct-logo.svg
```

Si une version SVG propre est fournie, la privilégier.

------------------------------------------------------------------------

# 09 --- DIRECTION PHOTO / IMAGE

Les images doivent avoir une esthétique cohérente avec :

-   bleu nuit ;
-   or ;
-   lumière chaude ;
-   ambiance de gala ;
-   profondeur ;
-   velours ;
-   architecture élégante.

## Priorité

1.  vraies photos de l'événement ;
2.  photos du lieu ;
3.  photos fournies par l'organisateur ;
4.  visuels spécialement créés pour le Gala.

Éviter les photos de stock génériques de "soirée VIP" qui ne
correspondent pas au Gala.

------------------------------------------------------------------------

# 10 --- HERO

Le Hero doit être la section la plus spectaculaire du site.

## Composition

``` text
┌─────────────────────────────────────────┐
│ NAVIGATION                              │
│                                         │
│              [ LOGO TTCT ]              │
│                                         │
│             Soirée de                   │
│                GALA                     │
│                                         │
│       LA TEAM TÉLÉ CONTRE TÉLÉ          │
│                                         │
│          19 DÉCEMBRE 2026               │
│                                         │
│             COUNTDOWN                   │
│                                         │
│        [ RÉSERVER MON PASS ]            │
│                                         │
└─────────────────────────────────────────┘
```

## Background

Créer une composition inspirée des images fournies :

-   bleu nuit ;
-   rideaux de velours ;
-   bordures dorées ;
-   lumière chaude ;
-   profondeur centrale ;
-   étoiles/particules très discrètes ;
-   halo derrière le logo.

### Important

Le background doit donner une impression de matière.

Éviter le simple :

``` css
background: linear-gradient(...)
```

sans texture.

------------------------------------------------------------------------

# 11 --- RIDEAUX ET VELOURS

Les rideaux sont un élément important de l'identité.

Ils peuvent être utilisés :

-   en Hero ;
-   sur les transitions ;
-   autour de certaines sections ;
-   comme éléments décoratifs latéraux.

Mais ils doivent rester subtils.

### Objectif

Donner l'impression :

> "les rideaux d'une grande salle de Gala s'ouvrent."

Ne pas transformer chaque section en rideau.

------------------------------------------------------------------------

# 12 --- NAVBAR

La navigation doit être discrète.

Desktop :

``` text
[ LOGO ]     L'ÉVÉNEMENT   PROGRAMME   PASS   FAQ     [ RÉSERVER ]
```

Elle doit être transparente ou très légèrement sombre au début.

Au scroll :

``` text
background: rgba(2, 11, 24, 0.90)
backdrop-filter: blur(...)
border-bottom: 1px solid rgba(...)
```

La bordure doit être très fine.

------------------------------------------------------------------------

# 13 --- CTA PRINCIPAL

Texte recommandé :

``` text
RÉSERVER MON PASS
```

ou

``` text
ACHETER MON PASS
```

## Style

-   fond doré ;
-   texte bleu nuit/noir ;
-   bordure fine ;
-   légère profondeur ;
-   transition douce.

### Hover

Le bouton peut :

-   augmenter légèrement sa luminosité ;
-   faire apparaître un reflet métallique ;
-   monter de 1 à 2 px.

Éviter les animations agressives.

------------------------------------------------------------------------

# 14 --- COMPTE À REBOURS

Le countdown est un élément important du Hero.

Exemple :

``` text
  77        04        32        18
 JOURS    HEURES    MINUTES   SECONDES
```

### Design

Chiffres :

-   Cormorant Garamond ;
-   grande taille ;
-   or/champagne.

Labels :

-   Inter ;
-   uppercase ;
-   letter-spacing.

Séparateurs :

-   petits ornements dorés.

------------------------------------------------------------------------

# 15 --- SECTION INTRODUCTION

Après le Hero, créer une section éditoriale avec beaucoup d'espace.

Exemple de rythme :

``` text
LA PROMESSE DU GALA

Une soirée d'exception...

[ contenu ]                 [ image ]
```

Le texte ne doit pas être enfermé dans une carte générique.

Utiliser l'espace comme élément de design.

------------------------------------------------------------------------

# 16 --- STATISTIQUES / CHIFFRES

La référence Effuzion montre l'intérêt d'une section de chiffres forte
dans le rythme d'une expérience événementielle. citeturn0view0

Pour TTCT, cette section ne doit apparaître que si les chiffres sont
réellement disponibles.

Exemple :

``` text
19
DÉCEMBRE

3
FORMULES

1
SOIRÉE EXCEPTIONNELLE
```

Ne jamais inventer de statistiques.

------------------------------------------------------------------------

# 17 --- PROGRAMME

Le programme doit être éditorial et élégant.

Éviter une simple grille de cartes.

Préférer :

``` text
19:00
Accueil

20:00
Ouverture

21:00
...

23:00
...
```

Avec :

-   lignes fines ;
-   séparateurs dorés ;
-   typographie serif pour les horaires importants ;
-   Inter pour les descriptions.

------------------------------------------------------------------------

# 18 --- SECTION BILLETTERIE

C'est l'une des sections les plus importantes.

Les trois formules doivent être immédiatement compréhensibles.

## PASS DUO V.V.I.P

``` text
50 000 FCFA
```

## PASS DUO V.I.P

``` text
25 000 FCFA
```

## PASS SOLO

``` text
15 000 FCFA
```

### Attention

Le visuel fourni comporte une ambiguïté typographique sur certaines
appellations. Le nom définitif des formules doit être confirmé avant la
mise en production.

Ne pas corriger arbitrairement le nom métier.

------------------------------------------------------------------------

# 19 --- CARTE DE PASS

La carte doit rappeler un billet d'invitation premium.

Structure :

``` text
┌───────────────────────────┐
│ TTCT                       │
│                            │
│ PASS DUO V.I.P             │
│                            │
│ 25 000 FCFA                │
│                            │
│ Description                │
│                            │
│ [ — ] 1 [ + ]              │
│                            │
│ [ RÉSERVER ]               │
└───────────────────────────┘
```

### Design

-   fond bleu nuit ;
-   bordure dorée ;
-   petits ornements ;
-   très léger relief ;
-   typographie serif pour le nom/prix.

------------------------------------------------------------------------

# 20 --- PAS DE "CARDS EVERYWHERE"

Le site ne doit pas être composé de :

``` text
[ CARD ]
[ CARD ]
[ CARD ]
[ CARD ]
[ CARD ]
```

Le design doit alterner :

-   contenu éditorial ;
-   image ;
-   chiffres ;
-   typographie ;
-   séparateurs ;
-   espaces ;
-   cartes uniquement lorsqu'elles sont fonctionnelles.

C'est essentiel pour éviter un rendu générique.

------------------------------------------------------------------------

# 21 --- ORNEMENTS

Utiliser des motifs inspirés du logo :

-   fleur de lys ;
-   lignes dorées ;
-   petits losanges ;
-   séparateurs ;
-   arabesques ;
-   cadres fins.

### Règle

Les ornements doivent être :

**fins + symétriques + subtils.**

Ils ne doivent jamais prendre le dessus sur le contenu.

------------------------------------------------------------------------

# 22 --- ANIMATIONS

Le mouvement doit être cinématographique et lent.

## Entrée Hero

Ordre :

``` text
Background
↓
Logo
↓
Soirée de
↓
GALA
↓
Date
↓
Countdown
↓
CTA
```

Chaque élément peut apparaître avec un léger fade + translate.

------------------------------------------------------------------------

## Scroll

Utiliser avec modération :

-   fade-in ;
-   reveal ;
-   parallax très léger ;
-   déplacement vertical ;
-   apparition des ornements.

------------------------------------------------------------------------

## Dorure

Possibilité d'un reflet très lent sur certains éléments dorés.

Jamais de glow excessif.

------------------------------------------------------------------------

# 23 --- EFFETS INTERDITS

Ne pas utiliser :

-   néons ;
-   violet ;
-   cyan ;
-   gradients arc-en-ciel ;
-   glassmorphism généralisé ;
-   blobs abstraits ;
-   animations permanentes ;
-   particules en quantité excessive ;
-   3D gadget ;
-   effets gaming ;
-   ombres énormes ;
-   bordures épaisses partout.

------------------------------------------------------------------------

# 24 --- CHECKOUT

Le checkout doit être beaucoup plus sobre.

Objectif :

**CONFIANCE + CLARTÉ + RAPIDITÉ**

La décoration doit être présente mais secondaire.

Structure :

``` text
Votre réservation

PASS
Quantité
Sous-total

Informations
Nom
Prénom
E-mail
Téléphone

Paiement

[ PAYER ]
```

Le client doit toujours savoir :

-   ce qu'il achète ;
-   combien il paie ;
-   où il en est.

------------------------------------------------------------------------

# 25 --- PAGE DE CONFIRMATION

Après paiement confirmé :

``` text
✓

RÉSERVATION CONFIRMÉE

Votre billet vous a été envoyé par e-mail.

[ TÉLÉCHARGER MON BILLET ]

[ RETOUR À L'ÉVÉNEMENT ]
```

Utiliser une animation courte et élégante.

------------------------------------------------------------------------

# 26 --- BILLET PDF

Le billet PDF doit reprendre le langage visuel du site.

Structure :

``` text
LOGO TTCT

SOIRÉE DE GALA

19 DÉCEMBRE 2026

PASS DUO V.I.P

NOM DU TITULAIRE

RÉFÉRENCE

             [ QR CODE ]

CONDITIONS / INFORMATIONS
```

Le QR Code doit avoir suffisamment d'espace libre autour de lui.

------------------------------------------------------------------------

# 27 --- E-MAIL

Le mail de confirmation doit être cohérent avec le site.

### Header

Logo TTCT.

### Contenu

``` text
Votre réservation est confirmée.

Merci pour votre réservation.

[ Télécharger mon billet ]
```

### Footer

Informations utiles + contact.

L'e-mail doit rester lisible même sans effets graphiques.

------------------------------------------------------------------------

# 28 --- DASHBOARD ORGANISATEUR

Le dashboard doit reprendre les couleurs TTCT mais ne doit pas être une
page marketing.

Priorités :

``` text
LISIBILITÉ
DONNÉES
ACTIONS
RAPIDITÉ
```

Prévoir :

-   statistiques ;
-   commandes ;
-   billets ;
-   pass ;
-   utilisateurs ;
-   scans.

------------------------------------------------------------------------

# 29 --- SCANNER

Le scanner est une interface opérationnelle.

Design :

``` text
TTCT

Scanner un billet

┌─────────────────────┐
│                     │
│     CAMÉRA          │
│                     │
│                     │
└─────────────────────┘

Placez le QR Code
dans le cadre
```

Après validation :

``` text
✓
BILLET VALIDE

PASS DUO V.I.P

ACCÈS AUTORISÉ
```

Après refus :

``` text
×
BILLET INVALIDE

ACCÈS REFUSÉ
```

------------------------------------------------------------------------

# 30 --- RESPONSIVE

La version mobile est prioritaire.

## Mobile

Le Hero doit rester spectaculaire.

Mais :

-   le logo doit rester lisible ;
-   GALA doit rester dominant ;
-   le countdown ne doit pas déborder ;
-   le CTA doit être facilement accessible ;
-   les pass doivent être lisibles ;
-   les boutons doivent être tactiles.

## Desktop

Utiliser :

-   espace négatif ;
-   compositions asymétriques maîtrisées ;
-   grandes images ;
-   profondeur ;
-   typographie monumentale.

------------------------------------------------------------------------

# 31 --- ACCESSIBILITÉ

Le luxe ne doit jamais sacrifier la lisibilité.

Prévoir :

-   contraste suffisant ;
-   taille de texte correcte ;
-   navigation clavier ;
-   focus visible ;
-   labels explicites ;
-   états d'erreur lisibles ;
-   couleur jamais utilisée comme unique information.

Le contraste du CTA et du texte doit être vérifié sur les fonds sombres
; les recommandations de design événementiel soulignent l'importance
d'un contraste suffisant pour les éléments d'inscription/action.
citeturn0search7

------------------------------------------------------------------------

# 32 --- PERFORMANCE

Les grands visuels du Gala peuvent être lourds.

Prévoir :

-   WebP/AVIF lorsque pertinent ;
-   `next/image` ;
-   tailles responsives ;
-   lazy loading hors Hero ;
-   optimisation des images ;
-   éviter les vidéos lourdes en autoplay.

Le Hero doit rester impressionnant sans transformer le chargement mobile
en expérience lente.

------------------------------------------------------------------------

# 33 --- SYSTÈME D'ESPACEMENT

Utiliser une échelle cohérente.

Base :

``` text
4
8
12
16
24
32
48
64
80
96
128
```

Les sections principales doivent respirer.

Éviter les blocs collés les uns aux autres.

------------------------------------------------------------------------

# 34 --- BORDURES

Les bordures dorées doivent être fines.

Valeurs recommandées :

``` text
1px
```

Exception :

``` text
2px
```

pour certains cadres premium.

Éviter les gros contours dorés.

------------------------------------------------------------------------

# 35 --- ICONOGRAPHIE

Privilégier :

-   icônes fines ;
-   style linéaire ;
-   couleur or/champagne ;
-   taille modérée.

Éviter les icônes emoji dans l'interface professionnelle.

------------------------------------------------------------------------

# 36 --- PRINCIPES DE CONVERSION

Le visiteur doit comprendre rapidement :

``` text
QUOI ?
Gala TTCT

QUAND ?
19 décembre 2026

POURQUOI ?
Une soirée d'exception

COMBIEN ?
À partir de 15 000 FCFA

COMMENT ?
Réserver mon pass
```

Les informations essentielles doivent être accessibles rapidement.

Le design ne doit jamais cacher l'information derrière une animation.

------------------------------------------------------------------------

# 37 --- STRUCTURE VISUELLE RECOMMANDÉE DE LA HOMEPAGE

``` text
01 — NAVBAR
       ↓
02 — HERO IMMERSIF
       ↓
03 — INTRODUCTION DU GALA
       ↓
04 — DATE / COMPTE À REBOURS
       ↓
05 — L'EXPÉRIENCE DU GALA
       ↓
06 — PROGRAMME
       ↓
07 — BILLETTERIE
       ↓
08 — INFORMATIONS PRATIQUES
       ↓
09 — FAQ
       ↓
10 — CTA FINAL
       ↓
11 — FOOTER
```

Cette structure conserve une logique éditoriale claire, avec une
progression vers l'achat plutôt qu'une accumulation de composants. Les
sites événementiels efficaces mettent généralement les informations
essentielles et l'action principale au premier plan.
citeturn0search0turn0search6

------------------------------------------------------------------------

# 38 --- RÈGLE "NO GENERIC AI DESIGN"

Si une section semble pouvoir appartenir à :

-   une startup SaaS ;
-   une agence digitale générique ;
-   un template Tailwind ;
-   un dashboard quelconque ;

elle doit être retravaillée.

Le résultat doit être identifiable comme :

> **LE SITE OFFICIEL D'UNE SOIRÉE DE GALA TTCT.**

------------------------------------------------------------------------

# 39 --- RÈGLE "LUXE CONTRÔLÉ"

Le luxe vient de :

``` text
TYPOGRAPHIE
+
ESPACE
+
MATIÈRE
+
LUMIÈRE
+
DÉTAIL
```

et non de :

``` text
OR + OMBRE + GLOW + ANIMATION
```

partout.

------------------------------------------------------------------------

# 40 --- RÈGLE FINALE POUR CLAUDE CODE

Avant chaque implémentation visuelle, vérifier :

### Identité

-   Est-ce clairement TTCT ?
-   Le bleu nuit est-il dominant ?
-   L'or est-il utilisé comme accent ?
-   Le logo est-il correctement utilisé ?

### Typographie

-   Cormorant Garamond pour les titres premium ?
-   Great Vibes uniquement comme accent ?
-   Inter pour l'interface ?

### Composition

-   La section respire-t-elle ?
-   Y a-t-il trop de cartes ?
-   L'information est-elle immédiatement compréhensible ?

### Expérience

-   Le CTA est-il évident ?
-   Le mobile est-il propre ?
-   L'animation sert-elle réellement l'expérience ?

### Qualité

-   Est-ce premium ?
-   Est-ce élégant ?
-   Est-ce cohérent avec les affiches ?
-   Est-ce suffisamment différent d'un template générique ?

**Si la réponse est non à plusieurs de ces questions, retravailler la
section avant de la considérer terminée.**
