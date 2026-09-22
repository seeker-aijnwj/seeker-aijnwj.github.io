/* =========================================================
   NYZ — pwa.js
   Enregistre le Service Worker pour le mode hors connexion.
   Ne bloque jamais l'affichage du site si ce n'est pas supporté.
   ========================================================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      /* échec silencieux : le site reste utilisable normalement, simplement sans cache hors-ligne */
    });
  });
}
