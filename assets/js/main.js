/* =========================================================
   NYZ — script.js
   Aucune dépendance externe. Compatible GitHub Pages (site statique).
   ========================================================= */

// -------------------------------------------------------
// CONFIGURATION — à modifier avec vos vraies informations
// -------------------------------------------------------
const CONFIG = {
    // Adresse Gmail qui recevra les messages et demandes de devis.
    // Espace réservé (Lorem ipsum) : remplacez par votre vraie adresse Gmail.
    contactEmail: "wilfriedyoro68@gmail.com",
};

document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initActiveLink();
    initPortfolioFilter();
    initContactForms();
});

// ---------------------------------------------------------------
// Menu mobile
// ---------------------------------------------------------------
function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const list = document.querySelector(".nav-list");
    if (!toggle || !list) return;

    toggle.addEventListener("click", () => {
        const isOpen = list.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Ferme le menu quand on choisit un lien (mobile)
    list.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            list.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        });
    });
}

// ---------------------------------------------------------------
// Marque le lien de navigation correspondant à la page actuelle
// (menu du haut ET pied de page). Recalculé au chargement de
// chaque page : aucun réglage manuel à faire par page.
// ---------------------------------------------------------------
function initActiveLink() {
    let current = window.location.pathname.split("/").pop();
    if (!current) current = "index.html"; // racine du site ( / )

    // Une page "détail" reste rattachée à la rubrique dont elle dépend,
    // même si son propre fichier ne figure pas dans le menu.
    const parentPage = {
        "article.html": "blog.html",
        "produit.html": "boutique.html",
    };
    const target = parentPage[current] || current;

    document.querySelectorAll(".nav-list a, .footer-grid nav a").forEach((link) => {
        link.removeAttribute("aria-current");
        const href = (link.getAttribute("href") || "").split("?")[0];
        if (href === target) {
            link.setAttribute("aria-current", "page");
        }
    });
}

// ---------------------------------------------------------------
// Filtre du portfolio (Tous / Réalisés / En cours)
// ---------------------------------------------------------------
function initPortfolioFilter() {
    const buttons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".project-card");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            buttons.forEach((b) => b.setAttribute("aria-pressed", "false"));
            btn.setAttribute("aria-pressed", "true");

            const filter = btn.dataset.filter;
            cards.forEach((card) => {
                const status = card.dataset.status;
                const show = filter === "all" || filter === status;
                card.style.display = show ? "" : "none";
            });
        });
    });
}

// ---------------------------------------------------------------
// Formulaires de contact (devis + message)
// Site statique : les messages sont envoyés via une ouverture
// de votre client mail (mailto:), pré-rempli avec les infos saisies.
//
// Pour un envoi direct sans ouvrir de client mail, vous pouvez
// remplacer cette logique par un service comme Formspree ou EmailJS :
// il suffit de faire pointer le <form> vers leur endpoint.
// ---------------------------------------------------------------
function initContactForms() {
    initFormTabs();

    const quoteForm = document.querySelector("#quote-form");
    const messageForm = document.querySelector("#message-form");

    if (quoteForm) {
        quoteForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!validateForm(quoteForm)) return;

            const data = new FormData(quoteForm);
            const subject = `Demande de devis — ${data.get("project-type")}`;
            const body = [
                `Nom : ${data.get("name")}`,
                `E-mail : ${data.get("email")}`,
                `Téléphone : ${data.get("phone") || "Non renseigné"}`,
                `Type de projet : ${data.get("project-type")}`,
                `Budget estimé : ${data.get("budget") || "Non renseigné"}`,
                "",
                "Description du projet :",
                data.get("description"),
            ].join("\n");

            openMailClient(subject, body);
            showStatus(quoteForm, "Votre client mail va s'ouvrir avec votre demande pré-remplie. Il ne vous reste qu'à l'envoyer.", "ok");
            quoteForm.reset();
        });
    }

    if (messageForm) {
        messageForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!validateForm(messageForm)) return;

            const data = new FormData(messageForm);
            const subject = `Message depuis le site — ${data.get("name")}`;
            const body = [
                `Nom : ${data.get("name")}`,
                `E-mail : ${data.get("email")}`,
                "",
                data.get("message"),
            ].join("\n");

            openMailClient(subject, body);
            showStatus(messageForm, "Votre client mail va s'ouvrir avec votre message pré-rempli. Il ne vous reste qu'à l'envoyer.", "ok");
            messageForm.reset();
        });
    }
}

function initFormTabs() {
    const tabs = document.querySelectorAll(".form-tab");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
            tab.setAttribute("aria-selected", "true");

            document.querySelectorAll(".form-panel").forEach((panel) => {
                panel.hidden = panel.id !== tab.dataset.target;
            });
        });
    });
}

function openMailClient(subject, body) {
    const url = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
}

function validateForm(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
        field.classList.remove("field-invalid");
        if (!field.value.trim()) {
            valid = false;
            field.classList.add("field-invalid");
        }
        if (field.type === "email" && field.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value)) {
                valid = false;
                field.classList.add("field-invalid");
            }
        }
    });

    if (!valid) {
        showStatus(form, "Merci de vérifier les champs surlignés avant d'envoyer.", "error");
    }
    return valid;
}

function showStatus(form, message, type) {
    let status = form.querySelector(".form-status");
    if (!status) {
        status = document.createElement("p");
        status.className = "form-status";
        form.appendChild(status);
    }
    status.textContent = message;
    status.className = `form-status form-status--${type}`;
    status.setAttribute("role", "status");
}
