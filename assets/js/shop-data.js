/* =========================================================
   NYZ — shop-data.js
   Produits d'exemple, utilisés pour amorcer la boutique locale
   (IndexedDB) au tout premier chargement du site, sans connexion
   internet nécessaire (offline-first).

   Prix en francs CFA (XOF). Pour ajouter un produit : dupliquez
   un objet ci-dessous, changez le "slug" (unique, sans espace)
   et le reste des champs.
   ========================================================= */

const SHOP_SEED_PRODUCTS = [
  {
    slug: "guide-raccourcis-bureautique",
    title: "Guide PDF — 30 raccourcis bureautiques essentiels",
    category: "numerique",
    categoryLabel: "Numérique & bureautique",
    price: 3000,
    currency: "XOF",
    excerpt: "Un guide condensé et illustré pour gagner du temps chaque jour sur Windows, Word, Excel et Google Sheets.",
    description: [
      "Ce guide au format PDF rassemble 30 raccourcis et astuces sélectionnés pour leur impact réel sur votre productivité quotidienne, classés par logiciel.",
      "Chaque astuce est expliquée en une phrase claire, avec le raccourci clavier correspondant, sans jargon technique inutile.",
      "Livré immédiatement après confirmation du paiement, par e-mail ou WhatsApp selon votre préférence."
    ],
    cover: "cover-green",
    available: true,
  },
  {
    slug: "pack-audit-numerique",
    title: "Audit numérique — 1h de consultation personnalisée",
    category: "numerique",
    categoryLabel: "Numérique & bureautique",
    price: 15000,
    currency: "XOF",
    excerpt: "Une heure en visio ou en présentiel pour identifier les outils numériques qui vous feraient gagner le plus de temps.",
    description: [
      "Cette consultation d'une heure part de votre façon de travailler actuelle pour identifier 3 à 5 automatisations ou outils numériques à fort impact.",
      "Vous repartez avec une liste d'actions concrètes, classées par facilité de mise en place, que vous pouvez appliquer immédiatement.",
      "Séance réalisable en visioconférence ou en présentiel selon votre localisation."
    ],
    cover: "cover-blue",
    available: true,
  },
  {
    slug: "template-pwa-demarrage",
    title: "Template PWA prêt à l'emploi (HTML/CSS/JS)",
    category: "applications",
    categoryLabel: "Applications",
    price: 25000,
    currency: "XOF",
    excerpt: "Une base de Progressive Web App déjà configurée (Service Worker, manifeste, offline-first) pour démarrer votre projet en une journée au lieu d'une semaine.",
    description: [
      "Ce template fournit toute la structure technique d'une PWA fonctionnelle : Service Worker configuré, manifeste d'installation, stockage local hors-ligne et design responsive de base.",
      "Vous n'avez plus qu'à y greffer le contenu et les fonctionnalités propres à votre projet, sans repartir de zéro sur la partie technique.",
      "Livré avec un court guide de prise en main et 30 minutes d'accompagnement offertes pour le démarrage."
    ],
    cover: "cover-gold",
    available: true,
  },
  {
    slug: "pack-5-seances-formation-musicale",
    title: "Pack de 5 séances d'accompagnement musical",
    category: "musique",
    categoryLabel: "Musique",
    price: 40000,
    currency: "XOF",
    excerpt: "Cinq séances individuelles pour structurer votre pratique, quel que soit votre instrument ou votre niveau de départ.",
    description: [
      "Ce pack comprend 5 séances individuelles d'une heure, organisées selon votre disponibilité, en présentiel ou à distance.",
      "La première séance sert à évaluer votre niveau et vos objectifs afin de construire un parcours réaliste sur les 4 séances suivantes.",
      "Un support de suivi (exercices, enregistrements de référence) vous est transmis après chaque séance."
    ],
    cover: "cover-green",
    available: true,
  },
  {
    slug: "audit-application-existante",
    title: "Audit d'une application ou d'un site existant",
    category: "applications",
    categoryLabel: "Applications",
    price: 20000,
    currency: "XOF",
    excerpt: "Une analyse détaillée de votre site ou application actuelle : performance, expérience utilisateur, pistes d'amélioration technique.",
    description: [
      "Cet audit couvre les points essentiels : vitesse de chargement, compatibilité mobile, accessibilité de base et pistes d'évolution technique (par exemple vers une PWA).",
      "Vous recevez un rapport écrit, clair et priorisé, sans jargon superflu.",
      "Idéal avant de lancer une refonte ou une nouvelle version de votre produit."
    ],
    cover: "cover-blue",
    available: false,
  },
];

if (typeof window !== "undefined") {
  window.SHOP_SEED_PRODUCTS = SHOP_SEED_PRODUCTS;
}
