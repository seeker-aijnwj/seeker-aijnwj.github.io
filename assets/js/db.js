/* =========================================================
   NYZ — db.js
   Couche de stockage local "offline-first" du site entier
   (blog, boutique, commandes, réglages).

   - Utilise IndexedDB (persistant, fonctionne hors connexion).
   - Se rabat automatiquement sur localStorage si IndexedDB
     n'est pas disponible (navigateurs très anciens, mode privé
     restrictif, etc.).
   - Expose un espace par domaine :
       NyzDB.articles   → articles du blog (clé : slug)
       NyzDB.products   → produits de la boutique (clé : slug)
       NyzDB.orders     → commandes passées par les clients (clé : ref)
       NyzDB.settings   → réglages modifiables depuis l'admin (clé : key)
                          ex. numéro de paiement mobile money

   Chaque espace propose les mêmes méthodes :
       getAll(), getByKey(key), put(item), putMany(items),
       remove(key), seedIfEmpty(items)  (le seed n'a de sens que
       pour "articles" et "products").
   ========================================================= */

const NyzDB = (() => {
  const DB_NAME = "nyz-site";
  const DB_VERSION = 2; // v1 = "articles" seul ; v2 = ajout products / orders / settings
  const LS_PREFIX = "nyz-db-fallback:";

  const STORES = {
    articles: "slug",
    products: "slug",
    orders: "ref",
    settings: "key",
  };

  let dbPromise = null;
  let useFallback = !("indexedDB" in window);

  function openDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve) => {
      if (useFallback) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        Object.entries(STORES).forEach(([storeName, keyPath]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath });
            if (storeName === "articles" || storeName === "products") {
              store.createIndex("category", "category", { unique: false });
            }
            if (storeName === "orders") {
              store.createIndex("status", "status", { unique: false });
            }
          }
        });
      };

      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = () => {
        useFallback = true; // ex. mode privé strict, quota dépassé…
        resolve(null);
      };
    });

    return dbPromise;
  }

  // ---------- Fallback localStorage (un tableau JSON par store) ----------
  function lsGetAll(storeName) {
    try {
      const raw = localStorage.getItem(LS_PREFIX + storeName);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  function lsSetAll(storeName, items) {
    try {
      localStorage.setItem(LS_PREFIX + storeName, JSON.stringify(items));
    } catch {
      /* stockage désactivé ou plein : on ignore silencieusement */
    }
  }

  /**
   * Construit l'API pour un store donné (articles, products, orders, settings).
   */
  function createStoreAPI(storeName, keyField) {
    async function getAll() {
      if (useFallback) return lsGetAll(storeName);
      const db = await openDB();
      if (!db) return lsGetAll(storeName);

      return new Promise((resolve) => {
        const tx = db.transaction(storeName, "readonly");
        const req = tx.objectStore(storeName).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
    }

    async function getByKey(key) {
      const all = await getAll();
      return all.find((item) => item[keyField] === key) || null;
    }

    async function put(item) {
      if (useFallback) {
        const all = lsGetAll(storeName).filter((i) => i[keyField] !== item[keyField]);
        all.push(item);
        lsSetAll(storeName, all);
        return;
      }
      const db = await openDB();
      if (!db) {
        const all = lsGetAll(storeName).filter((i) => i[keyField] !== item[keyField]);
        all.push(item);
        lsSetAll(storeName, all);
        return;
      }
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        tx.objectStore(storeName).put(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }

    async function putMany(items) {
      for (const item of items) {
        await put(item);
      }
    }

    async function remove(key) {
      if (useFallback) {
        lsSetAll(storeName, lsGetAll(storeName).filter((i) => i[keyField] !== key));
        return;
      }
      const db = await openDB();
      if (!db) {
        lsSetAll(storeName, lsGetAll(storeName).filter((i) => i[keyField] !== key));
        return;
      }
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        tx.objectStore(storeName).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }

    /**
     * Amorce le store avec des données d'exemple s'il est vide.
     * N'écrase jamais des données déjà présentes.
     */
    async function seedIfEmpty(seedItems) {
      const existing = await getAll();
      if (existing.length > 0) return;
      const seeded = seedItems.map((item) => ({
        ...item,
        syncStatus: item.syncStatus || "local-only",
      }));
      await putMany(seeded);
    }

    return { getAll, getByKey, put, putMany, remove, seedIfEmpty };
  }

  const api = {};
  Object.entries(STORES).forEach(([storeName, keyField]) => {
    api[storeName] = createStoreAPI(storeName, keyField);
  });

  // ---------- Raccourcis pratiques pour les réglages (NyzDB.settings) ----------
  api.getSetting = async (key, fallback = null) => {
    const row = await api.settings.getByKey(key);
    return row ? row.value : fallback;
  };
  api.setSetting = async (key, value) => {
    await api.settings.put({ key, value });
  };

  return api;
})();
