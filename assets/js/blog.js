/* =========================================================
   NYZ — blog.js
   Affichage du blog : liste, filtres, recherche, article seul,
   et petit widget "Derniers articles" pour la page d'accueil.

   Fonctionne entièrement hors connexion : les données viennent
   de NyzDB (IndexedDB / localStorage), amorcée avec les
   articles d'exemple de blog-data.js.
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
  if (window.BLOG_SEED_ARTICLES) {
    await NyzDB.articles.seedIfEmpty(window.BLOG_SEED_ARTICLES);
  }

  // Si un module de synchronisation est configuré et actif, on tente
  // une synchronisation silencieuse en arrière-plan (voir js/sync.js).
  if (window.NyzSync && typeof window.NyzSync.trySync === "function") {
    window.NyzSync.trySync().catch(() => {
      /* échec silencieux : le site reste utilisable hors connexion */
    });
  }

  if (document.getElementById("blog-list")) {
    await initBlogListPage();
  }
  if (document.getElementById("article-content")) {
    await initArticlePage();
  }
  if (document.getElementById("home-articles")) {
    await initHomeWidget();
  }
});

const CATEGORY_META = {
  numerique: { label: "Numérique & bureautique", className: "cat-numerique" },
  applications: { label: "Applications", className: "cat-applications" },
  musique: { label: "Musique", className: "cat-musique" },
};

function formatDate(iso) {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function articleCardHTML(article) {
  const meta = CATEGORY_META[article.category] || { label: article.category, className: "" };
  return `
    <article class="post-card">
      <a class="post-cover ${article.cover}" href="article.html?slug=${encodeURIComponent(article.slug)}" aria-hidden="true" tabindex="-1"></a>
      <div class="post-body">
        <span class="post-category ${meta.className}">${meta.label}</span>
        <h3><a href="article.html?slug=${encodeURIComponent(article.slug)}">${article.title}</a></h3>
        <p>${article.excerpt}</p>
        <div class="post-meta">
          <time datetime="${article.date}">${formatDate(article.date)}</time>
          <span aria-hidden="true">·</span>
          <span>${article.readTime} min de lecture</span>
        </div>
      </div>
    </article>
  `;
}

// ---------------------------------------------------------------
// Page Blog (liste + filtres + recherche)
// ---------------------------------------------------------------
async function initBlogListPage() {
  const listEl = document.getElementById("blog-list");
  const emptyEl = document.getElementById("blog-empty");
  const searchInput = document.getElementById("blog-search");
  const filterButtons = document.querySelectorAll(".filter-btn[data-category]");

  const allArticles = (await NyzDB.articles.getAll()).sort((a, b) => (a.date < b.date ? 1 : -1));

  let currentCategory = "all";
  let currentQuery = "";

  function render() {
    const filtered = allArticles.filter((a) => {
      const matchesCategory = currentCategory === "all" || a.category === currentCategory;
      const haystack = `${a.title} ${a.excerpt} ${(a.tags || []).join(" ")}`.toLowerCase();
      const matchesQuery = !currentQuery || haystack.includes(currentQuery);
      return matchesCategory && matchesQuery;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
    } else {
      emptyEl.hidden = true;
      listEl.innerHTML = filtered.map(articleCardHTML).join("");
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      currentCategory = btn.dataset.category;
      render();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentQuery = e.target.value.trim().toLowerCase();
      render();
    });
  }

  render();
}

// ---------------------------------------------------------------
// Page Article (contenu d'un article seul, via ?slug=...)
// ---------------------------------------------------------------
async function initArticlePage() {
  const container = document.getElementById("article-content");
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const article = slug ? await NyzDB.articles.getByKey(slug) : null;

  if (!article) {
    container.innerHTML = `
      <p>Cet article est introuvable — il n'existe peut-être plus, ou l'adresse est incorrecte.</p>
      <p><a class="btn btn-secondary" href="blog.html">Retour au blog</a></p>
    `;
    return;
  }

  const meta = CATEGORY_META[article.category] || { label: article.category, className: "" };

  document.title = `${article.title} — Blog Nyz`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute("content", article.excerpt);

  container.innerHTML = `
    <span class="post-category ${meta.className}">${meta.label}</span>
    <h1>${article.title}</h1>
    <div class="post-meta">
      <time datetime="${article.date}">${formatDate(article.date)}</time>
      <span aria-hidden="true">·</span>
      <span>${article.readTime} min de lecture</span>
    </div>
    <div class="article-cover ${article.cover}" aria-hidden="true"></div>
    <div class="article-body">
      ${article.content.map((p) => `<p>${p}</p>`).join("")}
    </div>
    <div class="tag-list" style="margin-top:2rem;">
      ${(article.tags || []).map((t) => `<span class="tag">${t}</span>`).join("")}
    </div>
  `;

  // Suggestions : deux autres articles de la même catégorie
  const suggestionsEl = document.getElementById("article-suggestions");
  if (suggestionsEl) {
    const all = await NyzDB.articles.getAll();
    const suggestions = all
      .filter((a) => a.slug !== article.slug && a.category === article.category)
      .slice(0, 2);
    if (suggestions.length) {
      suggestionsEl.innerHTML = `
        <h2>À lire aussi</h2>
        <div class="post-grid post-grid--compact">
          ${suggestions.map(articleCardHTML).join("")}
        </div>
      `;
    }
  }
}

// ---------------------------------------------------------------
// Widget "Derniers articles" (page d'accueil)
// ---------------------------------------------------------------
async function initHomeWidget() {
  const container = document.getElementById("home-articles");
  const all = (await NyzDB.articles.getAll()).sort((a, b) => (a.date < b.date ? 1 : -1));
  const latest = all.slice(0, 3);
  container.innerHTML = latest.map(articleCardHTML).join("");
}
