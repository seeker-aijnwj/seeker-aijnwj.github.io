# Site web — Nyz

Site personnel statique (HTML / CSS / JS, sans framework) prêt à être publié sur **GitHub Pages**.

## 📁 Structure

```
index.html          → Page d'accueil
apropos.html         → Page À propos (bio + CV)
portfolio.html        → Page Portfolio (projets réalisés / en cours)
blog.html             → Liste des articles du blog (filtres + recherche)
article.html          → Page d'un article (contenu chargé dynamiquement via ?slug=...)
boutique.html         → Liste des produits de la boutique (filtres + recherche)
produit.html          → Page d'un produit + formulaire de commande
contact.html          → Page Contact (coordonnées, devis, message)
admin.html            → Espace d'administration (articles, produits, commandes, réglages)
assets/css/main.css          → Toute la feuille de style
assets/js/main.js           → Menu mobile, page active dans le menu, filtre portfolio, formulaires
assets/js/db.js               → Stockage local hors-ligne (articles, produits, commandes, réglages)
assets/js/blog-data.js         → Articles d'exemple (amorce la base au premier chargement)
assets/js/blog.js              → Affichage du blog (liste, article, widget accueil)
assets/js/shop-data.js          → Produits d'exemple (amorce la boutique au premier chargement)
assets/js/shop.js               → Affichage de la boutique, formulaire de commande, paiement Mobile Money
assets/js/admin.js               → Logique de l'espace d'administration
assets/js/sync.js                → Pont optionnel vers Firebase / PostgreSQL / MySQL
assets/js/pwa.js                 → Enregistrement du Service Worker
sw.js                     → Service Worker (cache hors-ligne du site)
manifest.json              → Fichier d'installation PWA
sync-backend/               → Backends de synchronisation (voir plus bas)
assets/images/portrait.png            → Votre photo
favicon.svg               → Icône du site
img/icons/                    → Icônes PWA (192px, 512px)
sitemap.xml, robots.txt      → Fichiers pour le référencement
```

## 🛍️ La boutique — paiement Mobile Money

La boutique fonctionne comme le blog : produits stockés localement
(`assets/js/shop-data.js`), utilisables hors connexion. Le paiement se fait
**manuellement**, comme c'est l'usage avec le Mobile Money en Afrique de
l'Ouest :

1. Le client choisit un produit et remplit le formulaire de commande (nom, téléphone, quantité, moyen de paiement parmi Wave, Orange Money, MTN MoMo, Moov Flooz ou Lemfi).
2. Le site affiche le numéro à créditer (configurable, voir plus bas) et les instructions.
3. Le client envoie l'argent lui-même, puis confirme sa commande par **WhatsApp** ou **e-mail**.
4. Vous vérifiez la réception du paiement et validez la commande depuis l'espace **Admin → Commandes**.

Aucune donnée bancaire n'est demandée ou stockée sur le site : c'est vous
qui recevez l'argent directement sur votre compte Mobile Money.

### Définir votre numéro de paiement

Pas besoin de toucher au code : ouvrez `admin.html` → onglet **Réglages**,
saisissez votre numéro (ou identifiant Lemfi), et enregistrez. Il sera
utilisé instantanément pour toutes les commandes suivantes, sur cet
appareil. (Ce réglage est stocké localement tant que la synchronisation
n'est pas activée — voir `sync-backend/`.)

## 🔐 L'espace Administration

Accessible via `admin.html` (lien discret en pied de page). Il permet de :

- Ajouter, modifier ou supprimer des **articles** de blog et des **produits** de la boutique, sans toucher au code.
- Suivre les **commandes** et faire évoluer leur statut (en attente / confirmée / annulée).
- Régler le **numéro de paiement Mobile Money**.

**Important — sécurité :** cette page utilise un simple mot de passe
vérifié côté navigateur (défini dans `assets/js/admin.js`, variable
`ADMIN_PASSWORD`). Ce n'est **pas** une vraie authentification : le mot de
passe reste visible dans le code source. Cela suffit à décourager une
visite accidentelle, mais pas à protéger des données sensibles. Avant de
publier le site :

1. Changez `ADMIN_PASSWORD` dans `assets/js/admin.js`.
2. Ne partagez le lien `admin.html` à personne d'autre que vous.
3. Si vous stockez des informations vraiment sensibles, prévoyez une authentification côté serveur une fois `sync-backend/` activé (Firebase Auth, ou une vérification de session côté API Node.js).

## 📝 Le blog — fonctionnement hors connexion (offline-first)

Le blog est **utilisable sans connexion internet dès la première visite** :

- Les articles d'exemple (`assets/js/blog-data.js`) sont automatiquement copiés dans une base locale du navigateur (IndexedDB) au premier chargement.
- Le **Service Worker** (`sw.js`) met en cache les pages, le CSS et le JS : le site reste consultable même hors ligne, une fois visité une première fois.
- Le site est **installable** comme une application (PWA) grâce à `manifest.json` — sur mobile, le navigateur proposera "Ajouter à l'écran d'accueil" ; sur ordinateur, une icône d'installation apparaît dans la barre d'adresse (Chrome/Edge).

### Ajouter un article

Ouvrez `assets/js/blog-data.js` et dupliquez un des objets du tableau `BLOG_SEED_ARTICLES` : changez `slug` (unique), `title`, `category` (`numerique`, `applications` ou `musique`), `excerpt`, `date`, `readTime`, `tags` et `content` (un tableau de paragraphes). Il apparaîtra automatiquement sur la page Blog **pour les nouveaux visiteurs** (ceux qui ont déjà visité le site gardent leur base locale déjà amorcée — voir plus bas pour la synchronisation si vous voulez pousser des mises à jour à tout le monde).

### Brancher une vraie base de données plus tard

Tout est prêt dans le dossier **`sync-backend/`** : un guide pas à pas pour activer **Firebase**, **PostgreSQL** ou **MySQL**, avec un petit serveur Node.js (Express) fourni pour les deux options SQL. Tant que rien n'est activé (réglage par défaut dans `js/sync.js`), le blog reste 100 % local — aucun risque de casser quoi que ce soit en testant plus tard.

## 🔴 Éléments "Lorem ipsum" à remplacer avant publication

Tous les espaces réservés sont visuellement identifiables (encadré en pointillés vert, texte en italique) et contiennent le texte **"Lorem ipsum..."**. Passez la souris dessus : une infobulle précise ce qu'il faut y mettre. À remplacer :

- **apropos.html** : paragraphe de présentation, formation, expériences, compétences, lien de téléchargement du CV.
- **portfolio.html** : titres, descriptions, mots-clés et liens des 4 projets d'exemple.
- **contact.html** : adresse e-mail Gmail, téléphone, ville/pays, liens réseaux sociaux.
- **assets/js/main.js** : la constante `CONFIG.contactEmail` en haut du fichier (adresse qui recevra les messages).
- **admin.html → onglet Réglages** : votre numéro Mobile Money / compte Lemfi (tant qu'il n'est pas défini, le site affiche « numéro à définir dans l'espace Admin » aux clients).
- **assets/js/admin.js** : la constante `ADMIN_PASSWORD` — changez-la avant de publier le site (voir l'avertissement de sécurité plus haut).
- Dans le `<head>` de chaque page HTML : remplacez `VOTRE-NOM-UTILISATEUR` par votre identifiant GitHub dans les balises `canonical` et `og:url`, ainsi que dans `sitemap.xml` et `robots.txt`.

## 🚀 Publier sur GitHub Pages

1. Créez un dépôt GitHub, par exemple `mon-site` (ou `votre-nom-utilisateur.github.io` pour un site à la racine).
2. Déposez tout le contenu de ce dossier à la racine du dépôt (pas dans un sous-dossier).
3. Sur GitHub : **Settings → Pages → Source**, choisissez la branche `main` et le dossier `/root`.
4. Après quelques minutes, votre site sera visible à l'adresse indiquée par GitHub (ex. `https://votre-nom-utilisateur.github.io/` ou `https://votre-nom-utilisateur.github.io/mon-site/`).
5. Mettez à jour les URL `VOTRE-NOM-UTILISATEUR` mentionnées ci-dessus avec votre vraie adresse.

## ✉️ À propos des formulaires (page Contact)

Ce site est **statique** (aucun serveur), donc les formulaires « Devis » et « Message » ouvrent le client de messagerie du visiteur (Gmail, Outlook, Mail...) avec un e-mail pré-rempli à envoyer vers votre adresse.

Si vous préférez un envoi silencieux, sans ouvrir de logiciel de messagerie, vous pouvez brancher un service gratuit comme **Formspree** (formspree.io) ou **EmailJS** (emailjs.com) : il suffit de suivre leur documentation pour remplacer l'action du formulaire dans `contact.html` / `js/script.js`.

## ✅ Bonnes pratiques déjà en place

- HTML5 sémantique (`header`, `nav`, `main`, `section`, `footer`), balises `lang="fr"`.
- Meta description, Open Graph et Twitter Card sur chaque page, données structurées (`schema.org/Person`) sur l'accueil.
- `sitemap.xml` et `robots.txt` pour le référencement.
- Design responsive (mobile / tablette / ordinateur), menu mobile accessible.
- Contrastes de couleurs, focus visibles au clavier, lien d'évitement ("Aller au contenu principal"), attributs `alt` sur les images.
- `prefers-reduced-motion` respecté pour les animations.
- Aucune dépendance externe autre que Google Fonts (facultatif, peut être retiré si besoin).
