import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { cartModule } from "../../data/cart.js";
import { createOrder } from "../../data/order.js";

// --- Fonctions utilitaires (peuvent être déplacées si utilisées ailleurs) ---
function decodeJwtPayload(token) { /* ... (votre code) ... */ return null; } // Simplifié, car on se base sur localStorage/session
function getCurrentUser() {
    try {
        const userJson = localStorage.getItem("user"); // Vérifie localStorage d'abord
        if (userJson) {
            const parsed = JSON.parse(userJson);
            return parsed && typeof parsed === 'object' ? parsed : null;
        }
        // Fallback session si besoin (mais normalement ProfilController met à jour localStorage au login)
        // Vous pourriez ajouter ici un appel API à /profils/account si localStorage est vide
    } catch (e) {
        console.error("Erreur lecture user depuis localStorage", e);
    }
    return null;
}
// --- Fin Fonctions ---

// --- Modèle ---
let M = {
    getCart() {
        return cartModule.getCart().items || [];
    },
    getCartTotal() {
        return cartModule.calculateTotal();
    }
};

// --- Contrôleur ---
let C = {};

/**
 * Gère le clic sur le bouton "Confirmer et Payer".
 */
C.handler_confirmCheckout = async function(ev) {
    const btn = ev.target;
    const errorEl = document.querySelector('#checkout-error');

    // Désactive le bouton et cache l'erreur précédente
    btn.disabled = true;
    btn.textContent = 'Validation en cours...';
    if (errorEl) errorEl.classList.add('hidden');

    try {
        const cartItems = M.getCart();
        const total = M.getCartTotal();

        if (cartItems.length === 0) {
            // Sécurité, normalement on n'arrive pas ici si le panier est vide
            throw new Error("Votre panier est vide.");
        }

        // Prépare les données pour l'API (items + total)
        const cartData = { items: cartItems, total: total };

        // 1. Appelle l'API pour créer la commande (peut lancer une erreur)
        const savedOrder = await createOrder(cartData); //

        // Si createOrder réussit, savedOrder contient la réponse de l'API

        // 2. Vider le panier localement
        cartModule.saveCart({ items: [] }); // Vide le localStorage
        cartModule.updateCartCounter(); // Met à jour l'icône header

        // 3. Rediriger vers la page de confirmation avec le numéro de commande
        window.location.href = `/confirmation?order_id=${savedOrder.numero_commande}`;

    } catch (err) {
        // Si createOrder a lancé une erreur (API fail, BDD fail, etc.)
        console.error('[CheckoutPage] C.handler_confirmCheckout error', err);
        if (errorEl) {
            // Affiche le message d'erreur renvoyé par createOrder (qui vient de l'API)
            errorEl.textContent = err.message || 'Une erreur est survenue lors de la tentative de commande.';
            errorEl.classList.remove('hidden');
        }
        // Réactive le bouton pour permettre une nouvelle tentative
        btn.disabled = false;
        btn.textContent = 'Confirmer et Payer';
    }
    // Pas besoin de finally ici car soit on redirige, soit on réactive dans le catch
};

/**
 * Initialise la page de checkout.
 */
C.init = async function() {
    // 1. Vérifier si l'utilisateur est connecté (côté client)
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Si non connecté, sauvegarde l'URL actuelle et redirige vers login
        sessionStorage.setItem('redirectAfterLogin', '/checkout');
        window.location.href = '/auth/login'; // Ou '/auth' selon votre route de login
        // Retourne un fragment vide pour éviter d'afficher le checkout pendant la redirection
        return htmlToFragment("<div>Redirection vers la connexion...</div>");
    }

    // 2. Vérifier si le panier n'est pas vide
    const cartItems = M.getCart();
    if (cartItems.length === 0) {
        // Si panier vide, redirige vers la page panier
        window.location.href = '/cart';
        return htmlToFragment("<div>Votre panier est vide. Redirection...</div>");
    }

    // Si tout est OK, initialise la vue avec les données du panier
    return V.init(cartItems, M.getCartTotal());
};

// --- Vue ---
let V = {};

/**
 * Point d'entrée de la vue. Crée le fragment et attache les événements.
 */
V.init = function(cartItems, total) {
    let fragment = V.createPageFragment(cartItems, total);
    V.attachEvents(fragment);
    return fragment;
};

/**
 * Crée le fragment DOM de la page de récapitulatif.
 */
V.createPageFragment = function(cartItems, total) {
    let pageFragment = htmlToFragment(template); // Charge le template HTML

    const itemsContainer = pageFragment.querySelector('#summary-items');
    const totalElement = pageFragment.querySelector('#summary-total');
    const errorElement = pageFragment.querySelector('#checkout-error'); // Pour référence future si besoin

    // Vérifie si les conteneurs existent
    if (!itemsContainer || !totalElement || !errorElement) {
        console.error("[CheckoutPage:V] Erreur: #summary-items ou #summary-total ou #checkout-error manquant dans checkout/template.html");
        return htmlToFragment("<div class='text-red-500'>Erreur d'affichage du récapitulatif.</div>");
    }

    // Vide le conteneur des items pour le remplir
    itemsContainer.innerHTML = '';

    // Boucle sur les items du panier pour créer les lignes du récapitulatif
    cartItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center py-2 border-b last:border-b-0'; // Ajout bordure pour séparation

        // Description des options (si présentes)
        const optionsText = (Array.isArray(item.options) && item.options.length > 0) ?
            `(${item.options.map(opt => opt.value).join(', ')})` : '';

        itemEl.innerHTML = `
            <div>
                <span class="font-semibold">${item.name || 'Produit'}</span>
                <span class="text-sm text-gray-600"> ${optionsText} (x${item.quantity || 1})</span>
            </div>
            <div class="text-gray-800 font-medium">${((item.price || 0) * (item.quantity || 1)).toFixed(2)} €</div>
        `;
        itemsContainer.appendChild(itemEl);
    });

    // Met à jour le total affiché
    totalElement.textContent = `${(total || 0).toFixed(2)} €`;

    return pageFragment;
};

/**
 * Attache les écouteurs d'événements (ici, juste le bouton confirmer).
 */
V.attachEvents = function(pageFragment) {
    const confirmBtn = pageFragment.querySelector('#confirm-checkout-btn');
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', C.handler_confirmCheckout); // Evite doublons
        confirmBtn.addEventListener('click', C.handler_confirmCheckout);
    } else {
        console.error("[CheckoutPage:V] Bouton #confirm-checkout-btn introuvable dans le template.");
    }
    return pageFragment;
};

// --- Export ---
export function CheckoutPage() {
    return C.init();
}