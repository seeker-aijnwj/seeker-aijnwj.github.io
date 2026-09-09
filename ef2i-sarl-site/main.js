/* ================================================================
   EF2I SARL — Script principal
   ----------------------------------------------------------------
   Fichier : main.js
   Contenu :
     1. Menu mobile (ouverture/fermeture)
     2. Filtres de la grille produits
     3. Formulaire de contact (démo — à remplacer par un vrai
        traitement WordPress / Contact Form 7 / API)
     4. Année dynamique dans le footer
   ----------------------------------------------------------------
   Note WordPress : ce fichier sera enregistré via
   wp_enqueue_script() dans functions.php, avec defer.
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. MENU MOBILE
     Ouvre/ferme la navigation principale sur petit écran.
  ============================================================ */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Ferme le menu automatiquement après un clic sur un lien
    // (utile en une seule page avec ancres #section)
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     2. FILTRES PRODUITS
     Affiche/masque les cartes produits selon la catégorie
     sélectionnée. Les catégories correspondent aux data-cat
     définies dans index.html (à terme : taxonomie WordPress
     "categorie_produit").
  ============================================================ */
  var filterButtons = document.querySelectorAll('.filter-tabs button');
  var productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var selectedFilter = btn.getAttribute('data-f');

      // Met à jour l'état visuel des boutons de filtre
      filterButtons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Affiche uniquement les produits correspondant au filtre
      productCards.forEach(function (card) {
        var cardCategory = card.getAttribute('data-cat');
        var shouldHide = selectedFilter !== 'all' && cardCategory !== selectedFilter;
        card.classList.toggle('is-hidden', shouldHide);
      });
    });
  });

  /* ============================================================
     3. FORMULAIRE DE CONTACT (démo)
     En production WordPress : remplacer ce bloc par un shortcode
     Contact Form 7 / WPForms, ou brancher un endpoint REST API.
  ============================================================ */
  var contactForm = document.getElementById('contactForm');
  var formNote = document.getElementById('formNote');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Emplacement pour un futur appel fetch() vers l'API WordPress
      // ou un plugin de formulaire. Pour la démo, on affiche un message.
      if (formNote) {
        formNote.textContent = 'Ceci est une démonstration — le formulaire n\'est pas encore connecté à un serveur.';
      }
    });
  }

  /* ============================================================
     4. ANNÉE DYNAMIQUE DANS LE FOOTER
  ============================================================ */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
