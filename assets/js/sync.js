/* =========================================================
   NYZ — sync.js
   Pont entre le stockage local (offline-first, voir db.js) et
   une base distante, une fois que vous serez prêt à l'activer.

   Synchronise trois collections : articles (blog), products
   (boutique) et orders (commandes).

   Trois options possibles, une seule active à la fois :
     - "none"      : aucune synchronisation (comportement par défaut)
     - "api"       : votre propre backend Node.js (PostgreSQL ou MySQL,
                     voir le dossier /sync-backend)
     - "firebase"  : Firestore (voir /sync-backend/firebase)

   Pour activer la synchronisation : changez SYNC_CONFIG.provider
   ci-dessous et complétez les identifiants correspondants.
   Tant que provider === "none", le site reste 100% local et
   fonctionne intégralement hors connexion.
   ========================================================= */

const SYNC_CONFIG = {
  // "none" | "api" | "firebase"
  provider: "none",

  // Utilisé si provider === "api" (votre backend Node.js + PostgreSQL ou MySQL)
  api: {
    baseUrl: "http://localhost:3000", // À COMPLÉTER en production (ex. https://api.votredomaine.com)
  },

  // Utilisé si provider === "firebase"
  // Espace réservé (Lorem ipsum) : remplacez par la config de votre projet Firebase
  // (Console Firebase → Paramètres du projet → Vos applications → SDK config).
  firebase: {
    apiKey: "lorem-ipsum-api-key",
    authDomain: "lorem-ipsum.firebaseapp.com",
    projectId: "lorem-ipsum",
    storageBucket: "lorem-ipsum.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:lorem0ipsum0dolor0sit",
  },
};

// Collections synchronisées, avec leur clé primaire respective.
const SYNC_RESOURCES = [
  { name: "articles", store: "articles", key: "slug" },
  { name: "products", store: "products", key: "slug" },
  { name: "orders", store: "orders", key: "ref" },
];

const NyzSync = (() => {
  let syncing = false;

  async function trySync() {
    if (SYNC_CONFIG.provider === "none") return;
    if (!navigator.onLine) return;
    if (syncing) return;

    syncing = true;
    try {
      if (SYNC_CONFIG.provider === "api") {
        for (const resource of SYNC_RESOURCES) {
          await syncResourceWithApi(resource, SYNC_CONFIG.api.baseUrl);
        }
      } else if (SYNC_CONFIG.provider === "firebase") {
        for (const resource of SYNC_RESOURCES) {
          await syncResourceWithFirebase(resource, SYNC_CONFIG.firebase);
        }
      }
    } finally {
      syncing = false;
    }
  }

  // ---------------------------------------------------------------
  // Option A — Backend Node.js personnel (PostgreSQL ou MySQL)
  // Voir /sync-backend/postgres ou /sync-backend/mysql pour le serveur.
  // Convention d'API : GET/POST /api/<resource>  (ex. /api/articles,
  // /api/products, /api/orders)
  // ---------------------------------------------------------------
  async function syncResourceWithApi(resource, baseUrl) {
    const store = NyzDB[resource.store];

    // 1) Récupère les éléments distants et les fusionne localement
    const response = await fetch(`${baseUrl}/api/${resource.name}`);
    if (response.ok) {
      const remoteItems = await response.json();
      const withStatus = remoteItems.map((item) => ({ ...item, syncStatus: "synced" }));
      if (withStatus.length) await store.putMany(withStatus);
    }

    // 2) Envoie les éléments créés hors connexion ("local-only") vers le serveur
    const localItems = await store.getAll();
    const pending = localItems.filter((item) => item.syncStatus === "local-only");

    for (const item of pending) {
      const res = await fetch(`${baseUrl}/api/${resource.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await store.put({ ...item, syncStatus: "synced" });
      }
    }
  }

  // ---------------------------------------------------------------
  // Option B — Firebase / Firestore
  // Charge le SDK Firebase uniquement si ce mode est activé, pour
  // ne jamais faire de requête réseau inutile en mode "none".
  // Une collection Firestore par ressource (articles, products, orders).
  // ---------------------------------------------------------------
  async function syncResourceWithFirebase(resource, config) {
    const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const { getFirestore, collection, getDocs, doc, setDoc } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );

    const app = getApps().length ? getApps()[0] : initializeApp(config);
    const db = getFirestore(app);
    const colRef = collection(db, resource.name);
    const store = NyzDB[resource.store];

    // 1) Récupère les éléments distants et les fusionne localement
    const snapshot = await getDocs(colRef);
    const remoteItems = snapshot.docs.map((d) => ({ ...d.data(), syncStatus: "synced" }));
    if (remoteItems.length) await store.putMany(remoteItems);

    // 2) Envoie les éléments créés hors connexion vers Firestore
    const localItems = await store.getAll();
    const pending = localItems.filter((item) => item.syncStatus === "local-only");

    for (const item of pending) {
      await setDoc(doc(colRef, item[resource.key]), item);
      await store.put({ ...item, syncStatus: "synced" });
    }
  }

  return { trySync };
})();

if (typeof window !== "undefined") {
  window.NyzSync = NyzSync;
  // Relance une tentative de synchronisation dès que la connexion revient.
  window.addEventListener("online", () => {
    NyzSync.trySync().catch(() => {});
  });
}
