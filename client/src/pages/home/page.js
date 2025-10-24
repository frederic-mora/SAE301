// client/src/pages/home/page.js
import template from "./template.html?raw";
import { fetchCategory } from "../../data/categories.js";
import { ProductView } from "../../ui/product/index.js";
// Importer assetPath depuis utils.js
import { assetPath } from "../../lib/utils.js";

/**
 * Retourne le template HTML brut.
 * Le routeur l'insère dans le DOM.
 */
export function HomePage() {
    return template;
}

// --- Fonctions utilitaires pour le statut utilisateur (inchangées) ---

function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function decodeJwtPayload(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(payload);
    } catch (e) {
        return null;
    }
}

function getCurrentUser() {
    try {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            const parsed = JSON.parse(userJson);
            return parsed && typeof parsed === "object" ? parsed : null;
        }
        const token = localStorage.getItem("token");
        if (token) {
            const payload = decodeJwtPayload(token);
            if (payload && payload.email) {
                return { email: payload.email, ...payload };
            }
        }
    } catch (e) {
        // ignore parse errors
    }
    return null;
}

// --- FIN Fonctions utilitaires ---


/**
 * Fonction "mount" appelée par le routeur APRES l'insertion du template.
 * C'est ici que nous chargeons les données dynamiques.
 * @param {HTMLElement} container - L'élément racine de l'application (généralement #app).
 */
export async function mountHomePage(container) {

    /**
     * Charge les produits pour une catégorie et les injecte dans un placeholder.
     * @param {string} categoryName - Le nom de la catégorie (ex: 'horlogerie').
     * @param {string} placeholderId - L'ID du conteneur où injecter les produits.
     */
    async function loadCategoryProducts(categoryName, placeholderId) {
        const placeholder = container.querySelector(`#${placeholderId}`);
        if (!placeholder) {
            console.warn(`[mountHomePage] Placeholder #${placeholderId} not found.`);
            return;
        }

        try {
            let productsData = await fetchCategory(categoryName);

            let productsArray = [];
            if (Array.isArray(productsData)) {
                productsArray = productsData;
            } else if (productsData && Array.isArray(productsData.products)) {
                productsArray = productsData.products;
            } else if (productsData && Array.isArray(productsData.data)) {
                productsArray = productsData.data;
            }

            if (productsArray.length === 0) {
                placeholder.innerHTML = `<p class="text-gray-500 text-center col-span-4">Aucun produit à afficher pour cette catégorie.</p>`;
                return;
            }

            const productsToShow = productsArray.slice(0, 4);
            const productFragment = ProductView.dom(productsToShow);

            placeholder.innerHTML = '';
            placeholder.appendChild(productFragment);

        } catch (error) {
            console.error(`[mountHomePage] Failed to load category ${categoryName}:`, error);
            placeholder.innerHTML = `<p class="text-red-500 text-center col-span-4">Erreur de chargement des produits.</p>`;
        }
    }

    // --- 1. Mettre à jour le statut de l'utilisateur (logique existante) ---
    const user = getCurrentUser();
    const emailEl = container.querySelector("#user-email");
    if (emailEl) {
        if (user && user.email) {
            emailEl.textContent = `Connecté en tant que : ${escapeHtml(user.email)}`;
        } else {
            emailEl.textContent = "Vous n'êtes pas connecté.";
        }
    } else {
        console.warn("[mountHomePage] Élément #user-email non trouvé dans le container");
    }

    // --- 2. Définir les grandes images ---
    // (Placez vos images dans 'client/src/assets/')

    // Bannière principale (Hero)
    const heroBanner = container.querySelector("#hero-banner-image");
    if (heroBanner) {
        // Remplacez 'votre-image-hero.jpg' par le nom de votre fichier
        heroBanner.src = assetPath('nav.png');
    }

    // Bannière secondaire
    const secondaryBanner = container.querySelector("#secondary-banner-image");
    if (secondaryBanner) {
        // Remplacez 'votre-image-secondaire.jpg' par le nom de votre fichier
        secondaryBanner.src = assetPath('nav.png');
    }

    // Image catégorie 1
    const category1Img = container.querySelector("#category-1-image");
    if (category1Img) {
        // Remplacez 'votre-image-horlogerie.jpg' par le nom de votre fichier
        category1Img.src = assetPath('home_horlogerie.png');
    }

    // Image catégorie 2
    const category2Img = container.querySelector("#category-2-image");
    if (category2Img) {
        // Remplacez 'votre-image-maroquinerie.jpg' par le nom de votre fichier
        category2Img.src = assetPath('home_maroquinerie.png');
    }


    // --- 3. Charger les produits pour les 2 catégories en parallèle ---
    await Promise.all([
        loadCategoryProducts('horlogerie', 'home-category-1-products'),
        loadCategoryProducts('Maroquinerie', 'home-category-2-products')
    ]);
}