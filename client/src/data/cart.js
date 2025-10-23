export const cartModule = {
    key: 'shopping-cart',

    getCart() {
        const raw = localStorage.getItem(this.key);
        const parsed = raw ? JSON.parse(raw) : { items: [], totalItems: 0 };
        const items = Array.isArray(parsed.items) ? parsed.items.map(it => {
            const image = it.image || it.imageUrl || it.url || (it.images && it.images[0]?.url) || '';
            return {
                id: it.id,
                name: it.name || it.title || '',
                price: Number(it.price) || 0,
                image,
                quantity: Number(it.quantity) || 0
            };
        }) : [];
        const cart = { items, totalItems: this.calculateTotalItems({ items }) };
        return cart;
    },

    saveCart(cart) {
        const items = Array.isArray(cart.items) ? cart.items.map(it => ({
            id: it.id,
            name: it.name || '',
            price: Number(it.price) || 0,
            image: it.image || it.imageUrl || (it.images && it.images[0]?.url) || it.url || '',
            quantity: Number(it.quantity) || 0
        })) : [];

        const normalized = {
            items,
            totalItems: items.reduce((s, i) => s + (Number(i.quantity) || 0), 0)
        };

        localStorage.setItem(this.key, JSON.stringify(normalized));
        this.updateCartCounter();
        return normalized;
    },

    addItem(product, quantity = 1) {
        const cart = this.getCart();
        const pid = product.id ?? product.productId ?? String(productId);
        const existingItem = cart.items.find(item => String(item.id) === String(pid));

        const image = product.image || product.imageUrl || product.image_url || product.url || (product.images && product.images[0]?.url) || '';

        if (existingItem) {
            existingItem.quantity = (Number(existingItem.quantity) || 0) + Number(quantity || 1);
        } else {
            const newItem = {
                id: pid,
                name: product.name || product.title || '',
                price: Number(product.price) || 0,
                image,
                quantity: Number(quantity) || 1
            };
            cart.items.push(newItem);
        }

        cart.totalItems = this.calculateTotalItems(cart);
        return this.saveCart(cart);
    },

    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.items.find(item => String(item.id) === String(productId));

        if (item) {
            item.quantity = parseInt(quantity, 10) || 0;
            if (item.quantity <= 0) {
                return this.removeItem(productId);
            }
        } else {
            console.warn('[cartModule] updateQuantity -> item not found for id:', productId);
        }

        cart.totalItems = this.calculateTotalItems(cart);
        return this.saveCart(cart);
    },

    removeItem(productId) {
        const cart = this.getCart();
        cart.items = cart.items.filter(item => String(item.id) !== String(productId));
        cart.totalItems = this.calculateTotalItems(cart);
        return this.saveCart(cart);
    },

    calculateTotalItems(cart = null) {
        const c = cart || this.getCart();
        const items = Array.isArray(c.items) ? c.items : [];
        return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    },

    calculateTotal(cart = null) {
        const c = cart || this.getCart();
        const items = Array.isArray(c.items) ? c.items : [];
        return items.reduce((t, item) => t + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
    },

    updateCartCounter() {
        const applyUpdate = (cartCounterEl) => {
            const cart = this.getCart();
            cartCounterEl.textContent = String(cart.totalItems || 0);
            if (cart.totalItems > 0) cartCounterEl.classList.remove('hidden');
            else cartCounterEl.classList.add('hidden');
        };

        const el = document.getElementById('cart-counter');
        if (el) {
            applyUpdate(el);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const found = document.getElementById('cart-counter');
            if (found) {
                applyUpdate(found);
                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            try { observer.disconnect(); } catch (e) { /* noop */ }
            if (!document.getElementById('cart-counter')) {
                console.warn('[cartModule] updateCartCounter -> #cart-counter introuvable après attente');
            }
        }, 5000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    cartModule.updateCartCounter();
});
