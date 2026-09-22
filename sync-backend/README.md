# Synchronisation du blog — Firebase, PostgreSQL, MySQL

Le blog **et la boutique** fonctionnent **hors connexion dès aujourd'hui**
(IndexedDB + Service Worker, voir `/js/db.js` et `/sw.js`). Ce dossier
contient les briques pour brancher, plus tard, une vraie base distante —
**une seule à la fois**. Trois collections/tables sont synchronisées :
`articles` (blog), `products` (boutique) et `orders` (commandes).

## Comment ça s'articule

```
Navigateur (site statique)
   ├─ js/db.js      → stockage local hors-ligne (IndexedDB)
   ├─ js/blog.js     → affiche les articles depuis le stockage local
   └─ js/sync.js     → si activé, synchronise avec l'option choisie ci-dessous
```

Tant que `SYNC_CONFIG.provider` (dans `/js/sync.js`) vaut `"none"`, rien n'est
appelé côté réseau : le site reste 100 % local. Le jour où vous activez une
option, la synchronisation se déclenche automatiquement (au chargement, et à
chaque retour de connexion).

---

## Option A — Firebase (Firestore)

La plus simple à démarrer, sans serveur à héberger vous-même.

1. Créez un projet sur [console.firebase.google.com](https://console.firebase.google.com), activez **Firestore Database**.
2. Copiez la configuration SDK de votre application web dans `js/sync.js`, section `SYNC_CONFIG.firebase`.
3. Déployez les règles de sécurité fournies dans `firebase/firestore.rules`.
4. (Optionnel) Utilisez `firebase/seed-firestore.js` pour envoyer en une fois les articles d'exemple vers Firestore.
5. Dans `js/sync.js`, passez `SYNC_CONFIG.provider` à `"firebase"`.

## Option B — PostgreSQL (votre propre serveur Node.js)

1. Créez une base PostgreSQL et exécutez `postgres/schema.sql`.
2. Dans `postgres/`, copiez `.env.example` en `.env` et complétez vos identifiants.
3. `npm install` puis `npm start` (le serveur écoute par défaut sur `http://localhost:3000`).
4. Dans `js/sync.js`, mettez `SYNC_CONFIG.provider = "api"` et `SYNC_CONFIG.api.baseUrl` sur l'adresse de votre serveur (ex. votre domaine une fois déployé).

## Option C — MySQL (votre propre serveur Node.js)

Identique à l'option PostgreSQL, dans le dossier `mysql/` (port par défaut `3001`).

1. Créez une base MySQL et exécutez `mysql/schema.sql`.
2. Copiez `.env.example` en `.env`, complétez vos identifiants.
3. `npm install` puis `npm start`.
4. Dans `js/sync.js`, `SYNC_CONFIG.provider = "api"` et `SYNC_CONFIG.api.baseUrl` sur l'adresse de ce serveur.

---

## À propos des commandes (boutique) et du paiement

Ce site ne traite aucun paiement lui-même : Wave, Orange Money, MTN MoMo,
Moov Flooz et Lemfi ne sont pas connectés par API. Le client envoie
lui-même l'argent au numéro configuré dans l'espace **Admin → Réglages**,
puis confirme sa commande par WhatsApp ou e-mail. La commande est
enregistrée avec le statut `en-attente`, que vous confirmez manuellement
dans l'espace Admin après avoir vérifié la réception du paiement.

Si vous voulez un jour un vrai paiement automatisé (avec confirmation
instantanée), il faudra intégrer les API marchandes de ces opérateurs
(chacune nécessite un compte professionnel et des identifiants
spécifiques) — cela s'ajoutera dans le backend (`sync-backend/`), sans
changer la façon dont le reste du site fonctionne.

Notez aussi que les commandes contiennent des coordonnées clients (nom,
téléphone) : gardez leur lecture réservée à un accès authentifié côté
serveur/Firestore, comme indiqué dans les règles et schémas fournis.

## Où héberger le serveur Node.js (Postgres / MySQL) ?

GitHub Pages n'héberge que des fichiers statiques (HTML/CSS/JS) : il ne peut
pas exécuter `server.js`. Pour les options B et C, il faut héberger ce petit
serveur ailleurs — par exemple Render, Railway, Fly.io ou un VPS classique —
puis pointer `SYNC_CONFIG.api.baseUrl` vers son adresse publique.

## Et PHP / Python plus tard ?

Le contrat d'API est volontairement simple et indépendant du langage :

- `GET /api/articles` → liste des articles (JSON)
- `GET /api/articles/:slug` → un article
- `POST /api/articles` → créer/mettre à jour un article

Le jour où vous voudrez réécrire ce petit serveur en PHP ou en Python (Flask/FastAPI),
il suffira de respecter ce même contrat : `js/sync.js` n'a besoin d'aucune
modification côté site.
