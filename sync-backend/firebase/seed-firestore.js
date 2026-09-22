/* =========================================================
   NYZ — sync-backend/firebase/seed-firestore.js

   Script Node.js (à exécuter depuis votre ordinateur, pas dans
   le navigateur) pour envoyer les articles d'exemple vers
   Firestore en une seule fois — pratique pour démarrer.

   Installation :
     npm install firebase-admin

   Utilisation :
     1) Dans la Console Firebase → Paramètres du projet →
        Comptes de service → "Générer une nouvelle clé privée"
        Téléchargez le fichier JSON et enregistrez-le ici sous
        le nom "service-account.json" (ne le publiez JAMAIS sur
        un dépôt public).
     2) node seed-firestore.js
   ========================================================= */

const admin = require("firebase-admin");
const articles = require("../../js/blog-data-export.json"); // voir note en bas de fichier

admin.initializeApp({
  credential: admin.credential.cert(require("./service-account.json")),
});

const db = admin.firestore();

async function run() {
  const batch = db.batch();
  articles.forEach((article) => {
    const ref = db.collection("articles").doc(article.slug);
    batch.set(ref, { ...article, syncStatus: "synced" });
  });
  await batch.commit();
  console.log(`${articles.length} article(s) envoyé(s) vers Firestore.`);
}

run().catch((err) => {
  console.error("Erreur lors de l'envoi vers Firestore :", err);
  process.exit(1);
});

/*
  Note : ce script attend un fichier JSON simple (tableau d'articles).
  Le plus rapide est de copier le contenu du tableau BLOG_SEED_ARTICLES
  de /js/blog-data.js dans un fichier /js/blog-data-export.json
  (juste le tableau, en JSON valide, sans le code JavaScript autour).
*/
