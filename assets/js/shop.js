/* =========================================================
   NYZ — shop.js
   Boutique : liste de produits, page produit, et flux de
   commande avec paiement Mobile Money (Wave, Orange Money,
   MTN MoMo, Moov Flooz, Lemfi).

   Fonctionne hors connexion : les produits viennent de NyzDB
   (amorcés avec shop-data.js). Une commande créée hors connexion
   est marquée "local-only" et sera envoyée au serveur choisi
   (voir sync.js) dès que la synchronisation sera activée.

   IMPORTANT — aucun de ces opérateurs (Wave, Orange Money, MTN
   MoMo, Moov Flooz, Lemfi) n'est débité ou contacté automatiquement
   par ce site : il s'agit d'un site statique, sans serveur de
   paiement. Le client envoie lui-même l'argent au numéro indiqué,
   puis confirme sa commande (WhatsApp ou e-mail) pour que vous
   puissiez vérifier la réception et valider la commande depuis
   l'espace Administration.
   ========================================================= */

const PAYMENT_METHODS = [
  { id: "wave", label: "Wave", instructions: (n) => `Envoyez le montant via Wave au ${n}, puis confirmez ci-dessous.` },
  { id: "orange-money", label: "Orange Money", instructions: (n) => `Envoyez le montant via Orange Money au ${n}, puis confirmez ci-dessous.` },
  { id: "momo", label: "MTN MoMo", instructions: (n) => `Envoyez le montant via MTN Mobile Money au ${n}, puis confirmez ci-dessous.` },
  { id: "flooz", label: "Moov Flooz", instructions: (n) => `Envoyez le montant via Moov Flooz au ${n}, puis confirmez ci-dessous.` },
  { id: "lemfi", label: "Lemfi", instructions: (n) => `Envoyez le montant via Lemfi vers le compte/numéro ${n}, puis confirmez ci-dessous.` },
];

const SHOP_CATEGORY_META = {
  numerique: { label: "Numérique & bureautique", className: "cat-numerique" },
  applications: { label: "Applications", className: "cat-applications" },
  musique: { label: "Musique", className: "cat-musique" },
};

document.addEventListener("DOMContentLoaded", async () => {
  if (window.SHOP_SEED_PRODUCTS) {
    await NyzDB.products.seedIfEmpty(window.SHOP_SEED_PRODUCTS);
  }

  if (document.getElementById("shop-list")) {
    await initShopListPage();
  }
  if (document.getElementById("product-content")) {
    await initProductPage();
  }
});

function formatPrice(amount, currency) {
  return `${amount.toLocaleString("fr-FR")} ${currency || "XOF"}`;
}

function productCardHTML(product) {
  const meta = SHOP_CATEGORY_META[product.category] || { label: product.category, className: "" };
  const soldOutBadge = product.available === false
    ? `<span class="product-status product-status--soon">Bientôt disponible</span>`
    : "";
  return `
    <article class="product-card">
      <a class="product-cover ${product.cover}" href="produit.html?slug=${encodeURIComponent(product.slug)}" aria-hidden="true" tabindex="-1"></a>
      <div class="product-body">
        <span class="post-category ${meta.className}">${meta.label}</span>
        ${soldOutBadge}
        <h3><a href="produit.html?slug=${encodeURIComponent(product.slug)}">${product.title}</a></h3>
        <p>${product.excerpt}</p>
        <div class="product-footer">
          <strong class="product-price">${formatPrice(product.price, product.currency)}</strong>
          <a class="btn btn-secondary" href="produit.html?slug=${encodeURIComponent(product.slug)}">Voir le produit</a>
        </div>
      </div>
    </article>
  `;
}

// ---------------------------------------------------------------
// Page Boutique (liste + filtres + recherche)
// ---------------------------------------------------------------
async function initShopListPage() {
  const listEl = document.getElementById("shop-list");
  const emptyEl = document.getElementById("shop-empty");
  const searchInput = document.getElementById("shop-search");
  const filterButtons = document.querySelectorAll(".filter-btn[data-category]");

  const allProducts = await NyzDB.products.getAll();

  let currentCategory = "all";
  let currentQuery = "";

  function render() {
    const filtered = allProducts.filter((p) => {
      const matchesCategory = currentCategory === "all" || p.category === currentCategory;
      const haystack = `${p.title} ${p.excerpt}`.toLowerCase();
      const matchesQuery = !currentQuery || haystack.includes(currentQuery);
      return matchesCategory && matchesQuery;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = "";
      emptyEl.hidden = false;
    } else {
      emptyEl.hidden = true;
      listEl.innerHTML = filtered.map(productCardHTML).join("");
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
// Page Produit (détail + formulaire de commande)
// ---------------------------------------------------------------
async function initProductPage() {
  const container = document.getElementById("product-content");
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const product = slug ? await NyzDB.products.getByKey(slug) : null;

  if (!product) {
    container.innerHTML = `
      <p>Ce produit est introuvable — il n'existe peut-être plus, ou l'adresse est incorrecte.</p>
      <p><a class="btn btn-secondary" href="boutique.html">Retour à la boutique</a></p>
    `;
    return;
  }

  const meta = SHOP_CATEGORY_META[product.category] || { label: product.category, className: "" };
  document.title = `${product.title} — Boutique Nyz`;

  const availabilityNote = product.available === false
    ? `<p class="form-status form-status--error" role="status">Ce produit n'est pas encore disponible à la commande. Revenez bientôt !</p>`
    : "";

  container.innerHTML = `
    <span class="post-category ${meta.className}">${meta.label}</span>
    <h1>${product.title}</h1>
    <p class="product-price product-price--big">${formatPrice(product.price, product.currency)}</p>
    <div class="article-cover ${product.cover}" aria-hidden="true"></div>
    <div class="article-body">
      ${product.description.map((p) => `<p>${p}</p>`).join("")}
    </div>

    ${availabilityNote}
    <div id="order-zone"></div>
  `;

  if (product.available !== false) {
    await renderOrderForm(product, document.getElementById("order-zone"));
  }
}

async function renderOrderForm(product, zone) {
  const paymentPhone = await NyzDB.getSetting("paymentPhoneNumber", "lorem.ipsum (numéro à définir dans l'espace Admin)");

  zone.innerHTML = `
    <h2>Commander</h2>
    <form id="order-form" novalidate>
      <div class="field-row">
        <div class="field">
          <label for="o-name">Nom complet</label>
          <input type="text" id="o-name" name="name" required>
        </div>
        <div class="field">
          <label for="o-phone">Téléphone</label>
          <input type="tel" id="o-phone" name="phone" required>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label for="o-qty">Quantité</label>
          <input type="number" id="o-qty" name="qty" min="1" value="1" required>
        </div>
        <div class="field">
          <label for="o-payment">Moyen de paiement</label>
          <select id="o-payment" name="payment" required>
            ${PAYMENT_METHODS.map((m) => `<option value="${m.id}">${m.label}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="field">
        <label for="o-note">Message (facultatif)</label>
        <textarea id="o-note" name="note" rows="3" placeholder="Précisions sur votre commande…"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Valider la commande</button>
    </form>
    <div id="order-result"></div>
  `;

  const form = document.getElementById("order-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const qty = Math.max(1, parseInt(data.get("qty"), 10) || 1);
    const methodId = data.get("payment");
    const method = PAYMENT_METHODS.find((m) => m.id === methodId);
    const total = product.price * qty;

    const order = {
      ref: generateOrderRef(),
      items: [{ slug: product.slug, title: product.title, price: product.price, qty }],
      total,
      currency: product.currency || "XOF",
      customerName: data.get("name"),
      phone: data.get("phone"),
      paymentMethod: methodId,
      note: data.get("note") || "",
      status: "en-attente",
      syncStatus: "local-only",
      createdAt: new Date().toISOString(),
    };

    await NyzDB.orders.put(order);
    renderOrderConfirmation(order, method, paymentPhone);
    form.hidden = true;
  });
}

function generateOrderRef() {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CMD-${stamp}-${rand}`;
}

function renderOrderConfirmation(order, method, paymentPhone) {
  const resultZone = document.getElementById("order-result");
  const instructions = method.instructions(paymentPhone);
  const total = formatPrice(order.total, order.currency);

  const whatsappNumber = paymentPhone.replace(/[^\d+]/g, "");
  const waMessage = encodeURIComponent(
    `Bonjour, je viens d'effectuer le paiement pour ma commande ${order.ref} (${order.items[0].title}, ${total}) via ${method.label}. Merci de confirmer.`
  );
  const waLink = `https://wa.me/${whatsappNumber}?text=${waMessage}`;

  resultZone.innerHTML = `
    <div class="order-confirm">
      <h3>Commande enregistrée — ${order.ref}</h3>
      <p>Montant à régler : <strong>${total}</strong> via <strong>${method.label}</strong>.</p>
      <p>${instructions}</p>
      <p class="form-note">Votre commande est enregistrée sur cet appareil avec le statut « en attente de paiement ». Elle sera confirmée dès réception du paiement.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${waLink}" target="_blank" rel="noopener">Confirmer par WhatsApp</a>
        <a class="btn btn-secondary" href="contact.html">Confirmer par e-mail</a>
      </div>
    </div>
  `;
}
