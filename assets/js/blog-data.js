/* =========================================================
   NYZ — blog-data.js
   Articles d'exemple, utilisés pour amorcer la base locale
   (IndexedDB) au tout premier chargement du site, sans
   connexion internet nécessaire (offline-first).

   Pour ajouter un article : dupliquez un objet ci-dessous,
   changez le "slug" (unique, sans espace) et le reste des
   champs. Il sera automatiquement proposé sur la page Blog.
   ========================================================= */

const BLOG_SEED_ARTICLES = [
  {
    slug: "pwa-vs-application-native",
    title: "PWA vs application native : que choisir pour votre projet ?",
    category: "applications",
    categoryLabel: "Applications",
    excerpt: "SaaS, startup, produit interne : voici comment trancher entre une Progressive Web App et une application native selon votre budget, vos délais et votre audience.",
    date: "2026-06-02",
    readTime: 6,
    tags: ["PWA", "Applications natives", "SaaS"],
    cover: "cover-blue",
    content: [
      "Avant de lancer un développement, la question revient presque à chaque projet : faut-il construire une application native (iOS/Android) ou une PWA, cette application web qui s'installe et fonctionne hors connexion comme une app classique ?",
      "Une PWA (Progressive Web App) a l'avantage d'être développée une seule fois et de fonctionner partout : ordinateur, mobile, tablette, sans passer par les stores. C'est souvent le choix le plus rapide et le plus économique pour valider une idée ou lancer un SaaS.",
      "L'application native reste pertinente quand le projet dépend fortement de fonctionnalités matérielles poussées (Bluetooth avancé, capteurs spécifiques, performances graphiques 3D) ou quand la présence dans les stores fait partie de la stratégie marketing.",
      "Dans la majorité des projets que je rencontre — outils internes, SaaS métier, sites vitrines interactifs — la PWA couvre le besoin à moindre coût, avec un vrai mode hors-ligne grâce aux Service Workers, une installation en un clic, et des mises à jour instantanées sans validation d'un store.",
      "Mon conseil : commencez par une PWA solide et bien pensée. Si des besoins natifs spécifiques apparaissent plus tard, il est tout à fait possible d'envelopper la PWA dans un conteneur natif (Capacitor, Trusted Web Activity) plutôt que de tout réécrire."
    ]
  },
  {
    slug: "comprendre-le-saas-en-5-minutes",
    title: "Comprendre le modèle SaaS en 5 minutes",
    category: "applications",
    categoryLabel: "Applications",
    excerpt: "Abonnement, hébergement, mises à jour continues : ce qui différencie un logiciel SaaS d'un logiciel classique, et pourquoi ce modèle séduit autant les petites structures.",
    date: "2026-05-18",
    readTime: 5,
    tags: ["SaaS", "Business model"],
    cover: "cover-gold",
    content: [
      "SaaS signifie « Software as a Service » : au lieu d'acheter un logiciel une fois pour toutes et de l'installer sur votre ordinateur, vous y accédez via un navigateur, généralement moyennant un abonnement mensuel ou annuel.",
      "L'éditeur héberge, maintient et met à jour l'application pour tous ses clients en même temps. Vous n'avez rien à installer, rien à sauvegarder manuellement, et vous bénéficiez toujours de la dernière version.",
      "Pour une petite structure ou un indépendant, l'intérêt est double : un coût de démarrage réduit (pas de gros achat de licence) et une charge technique quasi nulle, puisque la maintenance est du ressort de l'éditeur.",
      "Le revers de la médaille : vous dépendez du service pour continuer à travailler (nécessite une connexion, dans la plupart des cas), et vos données sont hébergées chez un tiers — d'où l'importance de choisir un éditeur sérieux et de vérifier les conditions d'export de vos données.",
      "C'est justement ce que je cherche à améliorer avec les projets que je développe : proposer des SaaS pensés « offline-first », capables de continuer à fonctionner même en cas de coupure réseau, avec une synchronisation automatique dès que la connexion revient."
    ]
  },
  {
    slug: "offline-first-pourquoi",
    title: "Offline-first : pourquoi votre application doit fonctionner sans connexion",
    category: "applications",
    categoryLabel: "Applications",
    excerpt: "Une connexion instable ne devrait jamais bloquer votre travail. Explication du principe « offline-first », illustré par ce blog lui-même.",
    date: "2026-07-04",
    readTime: 5,
    tags: ["Offline-first", "PWA", "Expérience utilisateur"],
    cover: "cover-blue",
    content: [
      "La plupart des applications web sont conçues « online-first » : elles supposent une connexion internet stable et affichent une erreur dès que ce n'est pas le cas. Le principe offline-first inverse cette logique : l'application fonctionne d'abord localement, et la synchronisation avec un serveur devient un bonus, pas une condition.",
      "Concrètement, les données sont stockées directement dans le navigateur (via IndexedDB) et l'application elle-même — HTML, CSS, JavaScript — est mise en cache par un Service Worker. Résultat : le site reste utilisable même sans réseau, ou avec une connexion très instable.",
      "Ce blog en est un exemple concret : les articles que vous lisez sont stockés localement dans votre navigateur dès la première visite. Vous pouvez les consulter hors connexion, et lorsque la synchronisation avec une base distante (Firebase, PostgreSQL ou MySQL) sera activée, les nouveaux contenus se mettront à jour automatiquement dès que vous serez reconnecté.",
      "Cette approche est particulièrement utile dans des contextes de connexion internet irrégulière — ce qui est souvent le cas en situation de mobilité ou dans certaines régions — et elle améliore aussi simplement la réactivité perçue : tout s'affiche instantanément, sans attendre une réponse serveur."
    ]
  },
  {
    slug: "5-raccourcis-clavier-windows",
    title: "5 raccourcis clavier qui vous feront gagner du temps sous Windows",
    category: "numerique",
    categoryLabel: "Numérique & bureautique",
    excerpt: "De petits gestes qui, répétés chaque jour, représentent des heures gagnées sur l'année. Une sélection simple à adopter dès aujourd'hui.",
    date: "2026-04-22",
    readTime: 4,
    tags: ["Windows", "Productivité"],
    cover: "cover-green",
    content: [
      "Win + V ouvre l'historique du presse-papiers : vous pouvez ainsi coller un élément copié il y a plusieurs actions, et pas seulement le dernier. Très utile pour jongler entre plusieurs informations à recopier.",
      "Ctrl + Shift + Échap ouvre directement le Gestionnaire des tâches, sans passer par le menu contextuel de la barre des tâches. Pratique quand une application ne répond plus.",
      "Win + . (point) ouvre le sélecteur d'émojis et de symboles spéciaux, utilisable dans n'importe quel champ de texte, y compris dans vos e-mails ou vos documents.",
      "Alt + Tab maintenu permet de naviguer entre toutes les fenêtres ouvertes ; ajoutez Ctrl pour verrouiller l'affichage et choisir tranquillement, sans avoir à maintenir les touches enfoncées.",
      "Win + Shift + S lance l'outil Capture d'écran, avec sélection libre, rectangulaire ou plein écran — bien plus rapide que d'ouvrir une application dédiée.",
      "Adoptez-en un seul cette semaine, puis un autre la semaine suivante : la clé n'est pas de tout retenir d'un coup, mais d'en faire un réflexe durable."
    ]
  },
  {
    slug: "automatiser-google-sheets",
    title: "Automatiser des tâches répétitives avec Google Sheets",
    category: "numerique",
    categoryLabel: "Numérique & bureautique",
    excerpt: "Pas besoin de savoir coder pour gagner du temps : tour d'horizon des fonctions et automatisations simples disponibles dans Google Sheets.",
    date: "2026-03-10",
    readTime: 6,
    tags: ["Google Sheets", "Automatisation", "Bureautique"],
    cover: "cover-green",
    content: [
      "Beaucoup de tâches répétitives — recopier des données, calculer des totaux, envoyer un rappel — peuvent être automatisées directement dans Google Sheets, sans installer quoi que ce soit.",
      "La fonction RECHERCHEV (ou sa version plus moderne RECHERCHEX) permet de croiser automatiquement des informations entre deux feuilles, par exemple retrouver le prix d'un produit à partir de sa référence.",
      "Les règles de mise en forme conditionnelle permettent de faire ressortir visuellement une information importante — une échéance dépassée, un stock faible — sans avoir à relire toute la feuille.",
      "Pour aller plus loin, les Google Apps Script (un langage proche de JavaScript, intégré directement à Sheets) permettent de programmer des automatisations sur mesure : envoi d'un e-mail automatique quand une case change, génération d'un rapport chaque lundi matin, etc.",
      "C'est justement le type d'accompagnement que je propose : identifier les tâches répétitives de votre quotidien professionnel et construire, avec vous, l'automatisation la plus simple et la plus fiable pour vous en libérer."
    ]
  },
  {
    slug: "structurer-sa-pratique-musicale",
    title: "Comment structurer sa pratique musicale quand on débute",
    category: "musique",
    categoryLabel: "Musique",
    excerpt: "Progresser en musique n'est pas qu'une question de talent : c'est surtout une question de méthode et de régularité. Quelques repères pour bien commencer.",
    date: "2026-02-14",
    readTime: 5,
    tags: ["Apprentissage", "Méthode"],
    cover: "cover-green",
    content: [
      "La première erreur des débutants est de vouloir tout travailler en même temps : technique, théorie, morceaux, improvisation. Mieux vaut consacrer chaque séance à un objectif clair, même court.",
      "20 minutes de pratique quotidienne, régulières, produisent generalement de bien meilleurs résultats que 3 heures une seule fois par semaine. Le cerveau a besoin de répétition espacée pour ancrer un geste ou une notion.",
      "Enregistrez-vous régulièrement, même sommairement avec votre téléphone. C'est souvent le meilleur moyen de percevoir vos progrès réels, et de repérer des détails qu'on ne remarque pas en jouant.",
      "Alternez un temps consacré à la technique pure (gammes, exercices, précision) et un temps consacré au plaisir musical (morceaux que vous aimez, improvisation libre) : les deux sont nécessaires, et l'un entretient la motivation pour l'autre.",
      "Enfin, un accompagnement extérieur — professeur ou mentor — permet souvent de gagner un temps précieux, en évitant de consolider de mauvaises habitudes qui deviendraient plus difficiles à corriger plus tard."
    ]
  }
];

// Rendu disponible pour les autres scripts du site
if (typeof window !== "undefined") {
  window.BLOG_SEED_ARTICLES = BLOG_SEED_ARTICLES;
}
