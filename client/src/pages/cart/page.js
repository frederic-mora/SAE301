// javascript
import { ProductData } from "../../data/product.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { cartModule } from "../../data/cart.js";

// Modèle
let M = {
    products: [],

    // Utiliser le module cart existant
    getCart() {
        const items = (cartModule.getCart().items) || [];
        console.log('[CartPage:M] getCart -> items count:', items.length);
        return items;
    },

    updateQuantity(productId, quantity) {
        return cartModule.updateQuantity(productId, quantity);
    },

    removeItem(productId) {
        return cartModule.removeItem(productId);
    },

    getCartTotal() {
        const total = cartModule.calculateTotal();
        return total;
    }
};

// Contrôleur
let C = {};

C.handler_quantityChange = function(ev) {
    const cartItemEl = ev.target.closest('.cart-item');
    if (!cartItemEl) {
        console.warn('[CartPage:C] handler_quantityChange -> no .cart-item found');
        return;
    }
    const productId = cartItemEl.dataset.productId;
    const action = ev.target.dataset.action;
    const quantityElement = ev.target.closest('.quantity-controls')?.querySelector('.quantity-value');
    const currentValue = parseInt(quantityElement?.textContent || '0', 10);

    let newQuantity = currentValue;
    if (action === 'increase') {
        newQuantity = currentValue + 1;
    } else if (action === 'decrease' && currentValue > 1) {
        newQuantity = currentValue - 1;
    }

    if (M.updateQuantity(productId, newQuantity)) {
        V.refreshCart();
    } else {
        console.warn('[CartPage:C] handler_quantityChange -> update failed for id:', productId);
    }
};

C.handler_removeItem = function(ev) {
    const cartItemEl = ev.target.closest('.cart-item');
    if (!cartItemEl) {
        console.warn('[CartPage:C] handler_removeItem -> no .cart-item found');
        return;
    }
    const productId = cartItemEl.dataset.productId;

    if (M.removeItem(productId)) {
        V.refreshCart();
    } else {
        console.warn('[CartPage:C] handler_removeItem -> remove failed for id:', productId);
    }
};

C.handler_checkout = function(ev) {
    const cart = M.getCart();
    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }
    window.location.href = "/checkout";
};

C.init = async function() {
    try {
        M.products = await ProductData.fetchAll();
        const fragment = V.init();
        cartModule.updateCartCounter();
        return fragment;
    } catch (error) {
        console.error("Erreur lors de l'initialisation du panier:", error);
        return V.renderError("Erreur lors du chargement du panier");
    }
};

// Vue
let V = {};

V.init = function() {
    const cart = M.getCart();
    let fragment = V.createPageFragment(cart);
    V.attachEvents(fragment);
    cartModule.updateCartCounter();
    return fragment;
};
V.createPageFragment = function(cartItems) {
    let pageFragment = htmlToFragment(template);

    const cartItemsContainer = pageFragment.querySelector('#cart-items');
    const cartEmptyMessage = pageFragment.querySelector('#cart-empty');
    const cartSummary = pageFragment.querySelector('#cart-summary');
    const totalElement = pageFragment.querySelector('#cart-total');

    if (!cartItems || cartItems.length === 0) {
        if (cartEmptyMessage) cartEmptyMessage.classList.remove('hidden');
        if (cartItemsContainer) cartItemsContainer.classList.add('hidden');
        if (cartSummary) cartSummary.classList.add('hidden');
    } else {
        if (cartEmptyMessage) cartEmptyMessage.classList.add('hidden');
        if (cartItemsContainer) cartItemsContainer.classList.remove('hidden');
        if (cartSummary) cartSummary.classList.remove('hidden');

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';

            cartItems.forEach(item => {
                // Normalisation et protections (utilise image normalisée depuis cartModule)
                const id = item.id ?? item.productId ?? '';
                const image = item.image || item.imageUrl || (item.images && item.images[0]?.url) || item.url || '';
                const name = item.name || item.title || 'Produit';
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 0;

                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item flex items-center justify-between border-b pb-4';
                cartItemElement.dataset.productId = String(id);

                cartItemElement.innerHTML = `
    <div class="cart-item-left">
        <div class="cart-item-image">
            <img src="${image}" alt="${name}" class="cart-item-img">
        </div>
        <div class="cart-item-details">
            <h3 class="cart-item-title">${name}</h3>
            <div class="cart-item-price">${price.toFixed(2)} €</div>
        </div>
    </div>
    <div class="cart-actions">
        <div class="quantity-controls">
            <button class="quantity-btn" data-action="decrease">-</button>
            <span class="quantity-value">${quantity}</span>
            <button class="quantity-btn" data-action="increase">+</button>
        </div>
        <div class="cart-item-total">
            ${(price * quantity).toFixed(2)} €
        </div>
        <button class="remove-item">X</button>
    </div>
                `;

                cartItemsContainer.appendChild(cartItemElement);
            });
        } else {
            console.error('[CartPage:V] createPageFragment -> #cart-items introuvable dans le template');
        }

        if (totalElement) {
            const total = M.getCartTotal();
            totalElement.textContent = (Number(total) || 0).toFixed(2);
        }
    }

    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    const decreaseBtns = pageFragment.querySelectorAll('[data-action="decrease"]');
    const increaseBtns = pageFragment.querySelectorAll('[data-action="increase"]');

    decreaseBtns.forEach(btn => btn.addEventListener('click', C.handler_quantityChange));
    increaseBtns.forEach(btn => btn.addEventListener('click', C.handler_quantityChange));

    const removeBtns = pageFragment.querySelectorAll('.remove-item');
    removeBtns.forEach(btn => btn.addEventListener('click', C.handler_removeItem));

    const checkoutBtn = pageFragment.querySelector('#checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', C.handler_checkout);
    } else {
        console.warn('[CartPage:V] attachEvents -> #checkout-btn introuvable');
    }

    return pageFragment;
};

V.refreshCart = function() {
    const container = document.querySelector('main');
    if (container) {
        const newCartFragment = V.init();
        container.innerHTML = '';
        container.appendChild(newCartFragment);
    } else {
        console.warn('[CartPage:V] refreshCart -> main container introuvable');
    }

    // Mettre à jour l'indicateur du panier dans la navbar
    cartModule.updateCartCounter();
};

export function CartPage() {
    return C.init();
}
