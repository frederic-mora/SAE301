import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { cartModule } from "../../data/cart.js";
import { createOrder } from "../../data/order.js";

// --- Fonction pour vérifier l'utilisateur ---
// (Conservée ici, mais son appel sera commenté plus bas)
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
        // Pas de fallback JWT ici, on se fie à localStorage
    } catch (e) { }
    return null;
}
// --- Fin Fonction ---

// Modèle
let M = {
    getCart() {
        return cartModule.getCart().items || [];
    },
    getCartTotal() {
        return cartModule.calculateTotal();
    }
};

// Contrôleur
let C = {};

C.handler_confirmCheckout = async function(ev) {
    const btn = ev.target;
    const errorEl = document.querySelector('#checkout-error');

    btn.disabled = true;
    btn.textContent = 'Validation en cours...';
    if (errorEl) errorEl.classList.add('hidden');

    try {
        const cartItems = M.getCart();
        const total = M.getCartTotal();

        if (cartItems.length === 0) {
            throw new Error("Votre panier est vide.");
        }

        // 1. Appeler l'API pour créer la commande
        const savedOrder = await createOrder({ items: cartItems, total: total });

        // 2. Vérifier si la sauvegarde a réussi
        // (Note: Ceci échouera si le backend a encore la vérification de session)
        if (!savedOrder || !savedOrder.numero_commande) {
            // Essayons d'obtenir un message d'erreur plus précis de l'API
            let errorMessage = "La sauvegarde de la commande a échoué.";
            if (savedOrder && savedOrder.error) {
                errorMessage = savedOrder.error;
            }
            throw new Error(errorMessage);
        }

        // 3. Vider le panier
        cartModule.saveCart({ items: [] });

        // 4. Rediriger vers la confirmation
        window.location.href = `/confirmation?order_id=${savedOrder.numero_commande}`;

    } catch (err) {
        console.error('[CheckoutPage] C.handler_confirmCheckout error', err);
        if (errorEl) {
            errorEl.textContent = err.message || 'Une erreur est survenue lors de la tentative de commande.';
            errorEl.classList.remove('hidden');
        }
        btn.disabled = false;
        btn.textContent = 'Confirmer et Payer';
    }
};

C.init = async function() {
    // 1. Vérifier l'authentification (Critère 1)
    // --- MODIFICATION : Vérification commentée ---
    /*
    if (!getCurrentUser()) {
        sessionStorage.setItem('redirectAfterLogin', '/checkout');
        window.location.href = '/auth/login';
        return htmlToFragment("<div>Redirection...</div>");
    }
    */
    // --- FIN MODIFICATION ---

    // 2. Vérifier que le panier n'est pas vide
    const cartItems = M.getCart();
    if (cartItems.length === 0) {
        window.location.href = '/cart'; // Redirige vers le panier
        return htmlToFragment("<div>Panier vide...</div>");
    }

    return V.init(cartItems, M.getCartTotal());
};

// Vue
let V = {};

V.init = function(cartItems, total) {
    let fragment = V.createPageFragment(cartItems, total);
    V.attachEvents(fragment);
    return fragment;
};

V.createPageFragment = function(cartItems, total) {
    let pageFragment = htmlToFragment(template);

    const itemsContainer = pageFragment.querySelector('#summary-items');
    const totalElement = pageFragment.querySelector('#summary-total');

    cartItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center py-2';
        itemEl.innerHTML = `
            <div>
                <span class="font-semibold">${item.name}</span>
                <span class="text-sm text-gray-600"> (x${item.quantity})</span>
            </div>
            <div class="text-gray-800">${(item.price * item.quantity).toFixed(2)} €</div>
        `;
        itemsContainer.appendChild(itemEl);
    });

    totalElement.textContent = `${total.toFixed(2)} €`;

    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    const confirmBtn = pageFragment.querySelector('#confirm-checkout-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', C.handler_confirmCheckout);
    }
    return pageFragment;
};

export function CheckoutPage() {
    return C.init();
}