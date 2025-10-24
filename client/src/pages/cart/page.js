// client/src/pages/cart/page.js
import { ProductData } from "../../data/product.js"; // Gardé pour référence potentielle
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { cartModule } from "../../data/cart.js";

// --- Modèle ---
let M = {
    products: [],

    // Utilise cartModule pour obtenir les items (variantes) du panier
    getCart() {
        const items = (cartModule.getCart().items) || [];
        return items;
    },

    // Met à jour la quantité via cartModule (utilise l'ID de la variante)
    updateQuantity(variantId, quantity) {
        return cartModule.updateQuantity(variantId, quantity); //
    },

    // Supprime via cartModule (utilise l'ID de la variante)
    removeItem(variantId) {
        return cartModule.removeItem(variantId); //
    },

    // Calcule le total via cartModule
    getCartTotal() {
        const total = cartModule.calculateTotal(); //
        return total;
    }
};

// --- Contrôleur ---
let C = {};

/**
 * Gère le clic sur les boutons '+' et '-' pour changer la quantité.
 */
C.handler_quantityChange = function(ev) {
    const cartItemEl = ev.target.closest('.cart-item');
    if (!cartItemEl) {
        console.warn('[CartPage:C] handler_quantityChange -> no .cart-item found');
        return;
    }
    const variantId = cartItemEl.dataset.variantId;
    if (!variantId) {
        console.warn('[CartPage:C] handler_quantityChange -> no data-variant-id found');
        return;
    }

    const action = ev.target.dataset.action;
    const quantityElement = ev.target.closest('.quantity-controls')?.querySelector('.quantity-value');
    const currentValue = parseInt(quantityElement?.textContent || '0', 10);

    let newQuantity = currentValue;
    if (action === 'increase') {
        newQuantity = currentValue + 1;
    } else if (action === 'decrease') {
        newQuantity = currentValue - 1;
    }

    if (M.updateQuantity(variantId, newQuantity)) {
        V.refreshCart();
    } else {
        console.warn('[CartPage:C] handler_quantityChange -> update failed for variantId:', variantId);
    }
};

/**
 * Gère le clic sur le bouton de suppression (X).
 */
C.handler_removeItem = function(ev) {
    const cartItemEl = ev.target.closest('.cart-item');
    if (!cartItemEl) {
        console.warn('[CartPage:C] handler_removeItem -> no .cart-item found');
        return;
    }
    const variantId = cartItemEl.dataset.variantId;
    if (!variantId) {
        console.warn('[CartPage:C] handler_removeItem -> no data-variant-id found');
        return;
    }

    if (M.removeItem(variantId)) {
        V.refreshCart();
    } else {
        console.warn('[CartPage:C] handler_removeItem -> remove failed for variantId:', variantId);
    }
};

/**
 * Gère le clic sur le bouton "Passer commande".
 */
C.handler_checkout = function(ev) {
    const cart = M.getCart();
    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }
    window.location.href = "/checkout"; //
};

/**
 * Initialise la page du panier.
 */
C.init = async function() {
    try {
        const fragment = V.init();
        cartModule.updateCartCounter();
        return fragment;
    } catch (error) {
        console.error("Erreur lors de l'initialisation du panier:", error);
        return V.renderError("Erreur lors du chargement du panier");
    }
};

// --- Vue ---
let V = {};

/**
 * Point d'entrée pour la création de la vue.
 */
V.init = function() {
    const cartItems = M.getCart();
    let fragment = V.createPageFragment(cartItems);
    V.attachEvents(fragment); // Attache les écouteurs ('+', '-', 'X', 'Passer commande')
    return fragment;
};

/**
 * Crée le fragment DOM complet de la page panier.
 * @param {Array} cartItems - Le tableau des items (variantes) du panier.
 * @returns {DocumentFragment} Le fragment DOM prêt à être inséré dans la page.
 */
V.createPageFragment = function(cartItems) {
    let pageFragment = htmlToFragment(template); // Charge le squelette HTML

    const cartItemsContainer = pageFragment.querySelector('#cart-items');
    const cartEmptyMessage = pageFragment.querySelector('#cart-empty');
    const cartSummary = pageFragment.querySelector('#cart-summary');
    const totalElement = pageFragment.querySelector('#cart-total');

    if (!cartItemsContainer || !cartEmptyMessage || !cartSummary || !totalElement) {
        console.error("[CartPage:V] Erreur critique: Un ou plusieurs éléments (#cart-items, #cart-empty, #cart-summary, #cart-total) sont manquants dans cart/template.html");
        return V.renderError("Erreur d'affichage du panier."); // Utilise V.renderError
    }

    const isEmpty = !cartItems || cartItems.length === 0;

    cartEmptyMessage.classList.toggle('hidden', !isEmpty);
    cartItemsContainer.classList.toggle('hidden', isEmpty);
    cartSummary.classList.toggle('hidden', isEmpty);

    if (!isEmpty) {
        cartItemsContainer.innerHTML = '';

        cartItems.forEach(item => {
            const variantId = item.id;
            const image = item.image || 'path/to/default/image.jpg'; // Image par défaut si manquante
            const name = item.name || 'Produit sans nom';
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;


            let optionsText = '';
            if (Array.isArray(item.options) && item.options.length > 0) {
                optionsText = item.options
                    .map(opt => `${opt.type || 'Option'}: ${opt.value || '?'}`)
                    .join(', ');
            } else if (item.optionsDescription) {
                optionsText = item.optionsDescription;
            }


            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item flex items-center justify-between border-b pb-4'; // Styles
            cartItemElement.dataset.variantId = String(variantId); // Stocke l'ID variante

            cartItemElement.innerHTML = `
                <div class="cart-item-left flex items-center">
                    <div class="cart-item-image w-20 h-20 mr-4 flex-shrink-0">
                        <img src="${image}" alt="${name}" class="cart-item-img w-full h-full object-cover rounded">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title font-semibold">${name}</h3>
                        <div class="cart-item-options text-sm text-gray-600 mt-1">
                            ${optionsText}  </div>
                        <div class="cart-item-price text-gray-800">${price.toFixed(2)} €</div>
                    </div>
                </div>
                <div class="cart-actions flex items-center gap-4">
                    <div class="quantity-controls flex items-center border rounded overflow-hidden">
                        <button class="quantity-btn px-2 py-1 bg-gray-100 hover:bg-gray-200" data-action="decrease">-</button>
                        <span class="quantity-value px-3 text-center min-w-[2ch]">${quantity}</span>
                        <button class="quantity-btn px-2 py-1 bg-gray-100 hover:bg-gray-200" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-total font-semibold w-24 text-right">
                        ${(price * quantity).toFixed(2)} €
                    </div>
                    <button class="remove-item ml-2 text-black font-bold bg-transparent border-none cursor-pointer">X</button>
                </div>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        const total = M.getCartTotal();
        totalElement.textContent = (Number(total) || 0).toFixed(2);
    }

    return pageFragment;
};

/**
 * Attache les écouteurs d'événements aux boutons du panier.
 * @param {DocumentFragment|Element} parentElement - L'élément contenant les boutons.
 */
V.attachEvents = function(parentElement) {
    // Boutons Quantité
    parentElement.querySelectorAll('[data-action="decrease"], [data-action="increase"]').forEach(btn => {
        btn.removeEventListener('click', C.handler_quantityChange); // Évite doublons
        btn.addEventListener('click', C.handler_quantityChange);
    });

    // Boutons Supprimer
    parentElement.querySelectorAll('.remove-item').forEach(btn => {
        btn.removeEventListener('click', C.handler_removeItem);
        btn.addEventListener('click', C.handler_removeItem);
    });

    // Bouton Passer commande
    const checkoutBtn = parentElement.querySelector('#checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.removeEventListener('click', C.handler_checkout);
        checkoutBtn.addEventListener('click', C.handler_checkout);
    } else if (M.getCart().length > 0) {
        console.warn('[CartPage:V] attachEvents -> #checkout-btn introuvable alors que panier non vide');
    }

    return parentElement;
};


/**
 * Rafraîchit complètement l'affichage du panier en le reconstruisant.
 */
V.refreshCart = function() {
    const mainContainer = document.querySelector('main'); // Ajustez si votre conteneur principal a un autre sélecteur
    if (mainContainer) {
        const newCartFragment = V.init(); // Recrée tout le DOM de la page panier
        mainContainer.innerHTML = ''; // Vide l'ancien
        mainContainer.appendChild(newCartFragment); // Insère le nouveau
    } else {
        console.warn('[CartPage:V] refreshCart -> conteneur principal introuvable pour rafraîchir');
    }
    cartModule.updateCartCounter(); // Met à jour l'icône du header
};

/**
 * Génère un fragment simple pour afficher un message d'erreur.
 */
V.renderError = function(message) {
    console.error("[CartPage:V] renderError:", message);
    return htmlToFragment(`<div class="text-center text-red-600 p-8">${message || 'Une erreur est survenue.'}</div>`);
}

// --- Export ---
export function CartPage() {
    return C.init();
}