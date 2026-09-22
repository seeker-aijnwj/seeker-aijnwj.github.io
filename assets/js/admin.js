/* =========================================================
   NYZ — admin.js
   Tableau de bord d'administration : articles du blog, produits
   de la boutique, commandes, réglages de paiement.

   ⚠️ Protection minimale uniquement (mot de passe côté client,
   visible dans ce fichier). Voir l'avertissement affiché sur la
   page admin.html — ne remplace pas une authentification serveur.
   Changez la valeur ci-dessous avant de mettre le site en ligne.
   ========================================================= */

const ADMIN_PASSWORD = "changez-ce-mot-de-passe";

const CATEGORY_OPTIONS = [
  { value: "numerique", label: "Numérique & bureautique" },
  { value: "applications", label: "Applications" },
  { value: "musique", label: "Musique" },
];
const COVER_OPTIONS = ["cover-blue", "cover-green", "cover-gold"];

document.addEventListener("DOMContentLoaded", async () => {
  if (window.BLOG_SEED_ARTICLES) await NyzDB.articles.seedIfEmpty(window.BLOG_SEED_ARTICLES);
  if (window.SHOP_SEED_PRODUCTS) await NyzDB.products.seedIfEmpty(window.SHOP_SEED_PRODUCTS);

  initAdminGate();
});

// ---------------------------------------------------------------
// Authentification minimale (session locale au navigateur)
// ---------------------------------------------------------------
function initAdminGate() {
  const gate = document.getElementById("admin-gate");
  const dashboard = document.getElementById("admin-dashboard");
  const form = document.getElementById("admin-login-form");
  const status = document.getElementById("admin-login-status");

  function unlock() {
    gate.hidden = true;
    dashboard.hidden = false;
    initAdminDashboard();
  }

  if (sessionStorage.getItem("nyz-admin-authed") === "true") {
    unlock();
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = document.getElementById("admin-password").value;
    if (value === ADMIN_PASSWORD) {
      sessionStorage.setItem("nyz-admin-authed", "true");
      unlock();
    } else {
      status.textContent = "Mot de passe incorrect.";
      status.className = "form-status form-status--error";
    }
  });
}

function initAdminDashboard() {
  initAdminTabs();
  initArticlesAdmin();
  initProductsAdmin();
  initOrdersAdmin();
  initSettingsAdmin();
}

function initAdminTabs() {
  const tabs = document.querySelectorAll(".admin-tabs .form-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      document.querySelectorAll(".admin-panel").forEach((panel) => {
        panel.hidden = panel.id !== tab.dataset.target;
      });
    });
  });
}

function categoryLabelFor(value) {
  const found = CATEGORY_OPTIONS.find((c) => c.value === value);
  return found ? found.label : value;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------
// Articles
// ---------------------------------------------------------------
function initArticlesAdmin() {
  const zone = document.getElementById("article-form-zone");
  const table = document.querySelector("#articles-table tbody");
  const newBtn = document.getElementById("new-article-btn");

  async function refresh() {
    const articles = (await NyzDB.articles.getAll()).sort((a, b) => (a.date < b.date ? 1 : -1));
    table.innerHTML = articles.map((a) => `
      <tr>
        <td>${a.title}</td>
        <td>${categoryLabelFor(a.category)}</td>
        <td>${a.date}</td>
        <td><span class="tag">${a.syncStatus === "synced" ? "Synchronisé" : "Local uniquement"}</span></td>
        <td class="admin-actions">
          <button class="btn btn-ghost" data-edit="${a.slug}">Modifier</button>
          <button class="btn btn-ghost" data-delete="${a.slug}">Supprimer</button>
        </td>
      </tr>
    `).join("") || `<tr><td colspan="5">Aucun article pour l'instant.</td></tr>`;

    table.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const article = await NyzDB.articles.getByKey(btn.dataset.edit);
        showForm(article);
      });
    });
    table.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (confirm("Supprimer cet article ? Cette action est locale à cet appareil.")) {
          await NyzDB.articles.remove(btn.dataset.delete);
          refresh();
        }
      });
    });
  }

  function showForm(article) {
    const isEdit = Boolean(article);
    const a = article || { title: "", category: "numerique", excerpt: "", date: new Date().toISOString().slice(0, 10), readTime: 5, tags: [], cover: "cover-blue", content: [] };

    zone.hidden = false;
    zone.innerHTML = `
      <form id="article-form" class="admin-form">
        <h3>${isEdit ? "Modifier l'article" : "Nouvel article"}</h3>
        <div class="field">
          <label for="a-title">Titre</label>
          <input type="text" id="a-title" required value="${a.title}">
        </div>
        <div class="field-row">
          <div class="field">
            <label for="a-category">Catégorie</label>
            <select id="a-category">
              ${CATEGORY_OPTIONS.map((c) => `<option value="${c.value}" ${c.value === a.category ? "selected" : ""}>${c.label}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="a-date">Date</label>
            <input type="date" id="a-date" value="${a.date}" required>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="a-readtime">Temps de lecture (minutes)</label>
            <input type="number" id="a-readtime" min="1" value="${a.readTime}">
          </div>
          <div class="field">
            <label for="a-cover">Bandeau visuel</label>
            <select id="a-cover">
              ${COVER_OPTIONS.map((c) => `<option value="${c}" ${c === a.cover ? "selected" : ""}>${c.replace("cover-", "")}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field">
          <label for="a-excerpt">Résumé (affiché dans la liste)</label>
          <textarea id="a-excerpt" rows="2" required>${a.excerpt}</textarea>
        </div>
        <div class="field">
          <label for="a-tags">Mots-clés (séparés par une virgule)</label>
          <input type="text" id="a-tags" value="${(a.tags || []).join(", ")}">
        </div>
        <div class="field">
          <label for="a-content">Contenu (un paragraphe par ligne)</label>
          <textarea id="a-content" rows="8" required>${(a.content || []).join("\n")}</textarea>
        </div>
        <div class="hero-actions">
          <button type="submit" class="btn btn-primary">Enregistrer</button>
          <button type="button" class="btn btn-ghost" id="article-cancel">Annuler</button>
        </div>
      </form>
    `;

    document.getElementById("article-cancel").addEventListener("click", () => {
      zone.hidden = true;
      zone.innerHTML = "";
    });

    document.getElementById("article-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("a-title").value.trim();
      const slug = isEdit ? a.slug : slugify(title);
      const category = document.getElementById("a-category").value;

      const updated = {
        slug,
        title,
        category,
        categoryLabel: categoryLabelFor(category),
        excerpt: document.getElementById("a-excerpt").value.trim(),
        date: document.getElementById("a-date").value,
        readTime: parseInt(document.getElementById("a-readtime").value, 10) || 5,
        tags: document.getElementById("a-tags").value.split(",").map((t) => t.trim()).filter(Boolean),
        cover: document.getElementById("a-cover").value,
        content: document.getElementById("a-content").value.split("\n").map((p) => p.trim()).filter(Boolean),
        syncStatus: "local-only",
      };

      await NyzDB.articles.put(updated);
      zone.hidden = true;
      zone.innerHTML = "";
      refresh();
    });
  }

  newBtn.addEventListener("click", () => showForm(null));
  refresh();
}

// ---------------------------------------------------------------
// Produits
// ---------------------------------------------------------------
function initProductsAdmin() {
  const zone = document.getElementById("product-form-zone");
  const table = document.querySelector("#products-table tbody");
  const newBtn = document.getElementById("new-product-btn");

  async function refresh() {
    const products = await NyzDB.products.getAll();
    table.innerHTML = products.map((p) => `
      <tr>
        <td>${p.title}</td>
        <td>${categoryLabelFor(p.category)}</td>
        <td>${p.price.toLocaleString("fr-FR")} ${p.currency || "XOF"}</td>
        <td>${p.available === false ? "Non" : "Oui"}</td>
        <td class="admin-actions">
          <button class="btn btn-ghost" data-edit="${p.slug}">Modifier</button>
          <button class="btn btn-ghost" data-delete="${p.slug}">Supprimer</button>
        </td>
      </tr>
    `).join("") || `<tr><td colspan="5">Aucun produit pour l'instant.</td></tr>`;

    table.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const product = await NyzDB.products.getByKey(btn.dataset.edit);
        showForm(product);
      });
    });
    table.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (confirm("Supprimer ce produit ? Cette action est locale à cet appareil.")) {
          await NyzDB.products.remove(btn.dataset.delete);
          refresh();
        }
      });
    });
  }

  function showForm(product) {
    const isEdit = Boolean(product);
    const p = product || { title: "", category: "numerique", price: 0, currency: "XOF", excerpt: "", cover: "cover-blue", available: true, description: [] };

    zone.hidden = false;
    zone.innerHTML = `
      <form id="product-form" class="admin-form">
        <h3>${isEdit ? "Modifier le produit" : "Nouveau produit"}</h3>
        <div class="field">
          <label for="p-title">Titre</label>
          <input type="text" id="p-title" required value="${p.title}">
        </div>
        <div class="field-row">
          <div class="field">
            <label for="p-category">Catégorie</label>
            <select id="p-category">
              ${CATEGORY_OPTIONS.map((c) => `<option value="${c.value}" ${c.value === p.category ? "selected" : ""}>${c.label}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="p-price">Prix (XOF)</label>
            <input type="number" id="p-price" min="0" value="${p.price}" required>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="p-cover">Bandeau visuel</label>
            <select id="p-cover">
              ${COVER_OPTIONS.map((c) => `<option value="${c}" ${c === p.cover ? "selected" : ""}>${c.replace("cover-", "")}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="p-available">Disponible à la commande</label>
            <select id="p-available">
              <option value="true" ${p.available !== false ? "selected" : ""}>Oui</option>
              <option value="false" ${p.available === false ? "selected" : ""}>Non (bientôt disponible)</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="p-excerpt">Résumé (affiché dans la liste)</label>
          <textarea id="p-excerpt" rows="2" required>${p.excerpt}</textarea>
        </div>
        <div class="field">
          <label for="p-description">Description complète (un paragraphe par ligne)</label>
          <textarea id="p-description" rows="6" required>${(p.description || []).join("\n")}</textarea>
        </div>
        <div class="hero-actions">
          <button type="submit" class="btn btn-primary">Enregistrer</button>
          <button type="button" class="btn btn-ghost" id="product-cancel">Annuler</button>
        </div>
      </form>
    `;

    document.getElementById("product-cancel").addEventListener("click", () => {
      zone.hidden = true;
      zone.innerHTML = "";
    });

    document.getElementById("product-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("p-title").value.trim();
      const slug = isEdit ? p.slug : slugify(title);
      const category = document.getElementById("p-category").value;

      const updated = {
        slug,
        title,
        category,
        categoryLabel: categoryLabelFor(category),
        price: parseInt(document.getElementById("p-price").value, 10) || 0,
        currency: "XOF",
        excerpt: document.getElementById("p-excerpt").value.trim(),
        cover: document.getElementById("p-cover").value,
        available: document.getElementById("p-available").value === "true",
        description: document.getElementById("p-description").value.split("\n").map((line) => line.trim()).filter(Boolean),
        syncStatus: "local-only",
      };

      await NyzDB.products.put(updated);
      zone.hidden = true;
      zone.innerHTML = "";
      refresh();
    });
  }

  newBtn.addEventListener("click", () => showForm(null));
  refresh();
}

// ---------------------------------------------------------------
// Commandes
// ---------------------------------------------------------------
function initOrdersAdmin() {
  const table = document.querySelector("#orders-table tbody");

  async function refresh() {
    const orders = (await NyzDB.orders.getAll()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    table.innerHTML = orders.map((o) => `
      <tr>
        <td>${o.ref}</td>
        <td>${o.customerName}</td>
        <td>${o.phone}</td>
        <td>${o.total.toLocaleString("fr-FR")} ${o.currency}</td>
        <td>${o.paymentMethod}</td>
        <td>
          <select data-order="${o.ref}">
            <option value="en-attente" ${o.status === "en-attente" ? "selected" : ""}>En attente</option>
            <option value="confirmee" ${o.status === "confirmee" ? "selected" : ""}>Confirmée</option>
            <option value="annulee" ${o.status === "annulee" ? "selected" : ""}>Annulée</option>
          </select>
        </td>
      </tr>
    `).join("") || `<tr><td colspan="6">Aucune commande pour l'instant.</td></tr>`;

    table.querySelectorAll("[data-order]").forEach((select) => {
      select.addEventListener("change", async () => {
        const order = await NyzDB.orders.getByKey(select.dataset.order);
        if (!order) return;
        order.status = select.value;
        order.syncStatus = "local-only";
        await NyzDB.orders.put(order);
      });
    });
  }

  refresh();
}

// ---------------------------------------------------------------
// Réglages
// ---------------------------------------------------------------
function initSettingsAdmin() {
  const form = document.getElementById("settings-form");
  const phoneField = document.getElementById("s-phone");
  const status = document.getElementById("settings-status");

  NyzDB.getSetting("paymentPhoneNumber", "").then((value) => {
    phoneField.value = value || "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await NyzDB.setSetting("paymentPhoneNumber", phoneField.value.trim());
    status.textContent = "Réglages enregistrés sur cet appareil.";
    status.className = "form-status form-status--ok";
  });
}
