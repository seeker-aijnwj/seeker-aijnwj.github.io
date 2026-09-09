# EF2I SARL — Maquette de démonstration

Ce dossier contient la maquette statique du site EF2I SARL, organisée en
trois fichiers pour faciliter la reprise en thème WordPress personnalisé.

## Fichiers

- `index.html` — structure HTML5 sémantique + balises SEO (meta description,
  Open Graph, Twitter Card, données structurées Schema.org).
- `main.css` — feuille de style unique, organisée en 14 sections commentées
  (variables de charte graphique, header, hero, sections, responsive...).
- `main.js` — comportements interactifs : menu mobile, filtres produits,
  soumission du formulaire de contact (démo), année dynamique du footer.

## Comment tester en local

Ouvrez simplement `index.html` dans un navigateur, ou lancez un petit
serveur local (recommandé pour éviter les soucis de chemins relatifs) :

```
python3 -m http.server 8000
```

puis ouvrez http://localhost:8000

## Points d'ancrage pour la conversion en thème WordPress

| Bloc HTML source              | Fichier du thème WordPress cible          |
|--------------------------------|--------------------------------------------|
| `<head>` (meta, SEO)           | géré par un plugin SEO (Yoast / RankMath)  |
| `.topbar` + `<header class="main">` | `header.php`                          |
| `<nav class="primary">`        | `wp_nav_menu()` dans `header.php`          |
| `<section class="hero">`       | template `front-page.php` (champs ACF)     |
| `<section class="presentation">` | `front-page.php` (champs ACF)            |
| `<section class="missions">`   | Custom Post Type "mission" (3 items)       |
| `<section class="products">`   | Custom Post Type "produit" + taxonomie     |
|                                 | "categorie_produit" pour les filtres       |
| `<section class="contact">` formulaire | Contact Form 7 / WPForms shortcode  |
| `<section class="documents">`  | Custom Post Type "document" (champ fichier ACF) ou espace client protégé par mot de passe |
| `<footer>`                     | `footer.php`                               |
| `main.css`                     | `style.css` du thème (garder l'en-tête WP) |
| `main.js`                      | enregistré via `wp_enqueue_script()`       |

## Charte graphique (variables CSS dans `main.css`)

```
--navy:       #0A2540   Bleu marine principal
--navy-deep:  #071B30   Bleu marine foncé
--blue:       #1565D8   Bleu électrique (accents)
--blue-light: #4B8CE8   Bleu clair (illustrations)
--amber:      #F4A300   Ambre sécurité (CTA)
--bg:         #F5F7FA   Fond clair
--ink:        #12202E   Texte principal
--grey:       #5B6B7A   Texte secondaire
--line:       #DCE3EA   Bordures
```

## À faire avant mise en production

- Remplacer les coordonnées factices (téléphone, email, adresse complète).
- Remplacer le logo texte (`.logo-mark`) par le vrai logo EF2I en SVG/PNG.
- Remplacer l'illustration SVG de la section Présentation par de vraies
  photos d'ateliers/chantiers EF2I.
- Ajouter les vrais logos partenaires dans `.partner-row`.
- Connecter le formulaire de contact à un système d'envoi réel.
- Créer un fichier `sitemap.xml` et `robots.txt` définitifs une fois le
  nom de domaine final choisi.
- Tenir à jour `assets/docs/EF2I-Cahier-des-charges.docx` : remplacer par
  la version la plus récente à chaque évolution du cahier des charges
  (numéro de version à incrémenter dans le document lui-même).
- À terme, envisager de protéger l'espace "Documents" par une simple
  authentification si des documents plus sensibles (devis, factures) y
  sont ajoutés.
