/* =========================================================
   NYZ — sw.js (Service Worker)
   Rend le site utilisable hors connexion en mettant en cache
   les pages, le CSS, le JS et les images dès la première visite.

   Changez CACHE_VERSION à chaque mise à jour importante du site
   pour forcer le rafraîchissement du cache chez les visiteurs.
   ========================================================= */

const CACHE_VERSION = "nyz-v2";

const PRECACHE_URLS = [
  "./",
  "index.html",
  "apropos.html",
  "portfolio.html",
  "contact.html",
  "blog.html",
  "article.html",
  "boutique.html",
  "produit.html",
  "admin.html",
  "assets/css/main.css",
  "assets/js/main.js",
  "assets/js/db.js",
  "assets/js/blog-data.js",
  "assets/js/blog.js",
  "assets/js/shop-data.js",
  "assets/js/shop.js",
  "assets/js/admin.js",
  "assets/js/sync.js",
  "assets/js/pwa.js",
  "assets/img/portrait.png",
  "favicon.svg",
  "assets/img/icons/icon-192.png",
  "asstes/img/icons/icon-512.png",
  "manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {
      /* si une ressource manque, on n'empêche pas l'installation du reste */
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // On ne gère que les requêtes de même origine (pas les polices Google,
  // ni les appels vers Firebase ou votre API, qui gèrent leur propre logique réseau).
  if (new URL(request.url).origin !== self.location.origin) return;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // Hors connexion et pas encore en cache : on retombe sur l'accueil
          // pour les pages, afin d'éviter un écran d'erreur du navigateur.
          if (request.mode === "navigate") {
            return caches.match("index.html");
          }
          return undefined;
        });
    })
  );
});
