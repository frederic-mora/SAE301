/**
 * Gestion du panier persistant
 */
const BasketData = {
    STORAGE_KEY: 'basket',
    observers: [], // Liste des observateurs

    /**
     * Ajoute un observateur pour les changements du panier
     * @param {Function} callback - Fonction appelée lors de changements
     */
    subscribe: function(callback) {
        this.observers.push(callback);
    },

    /**
     * Notifie tous les observateurs
     */
    notifyObservers: function() {
        this.observers.forEach(callback => {
            try {
                callback(this.getBasket());
            } catch (error) {
                console.error('Erreur dans observateur:', error);
            }
        });
    },

    /**
     * Récupère le panier du localStorage
     * @returns {Array} Les articles du panier
     */
    getBasket: function() {
        try {
            const basket = localStorage.getItem(this.STORAGE_KEY);
            return basket ? JSON.parse(basket) : [];
        } catch (error) {
            console.error('Erreur lors de la récupération du panier:', error);
            return [];
        }
    },

    /**
     * Sauvegarde le panier dans le localStorage
     * @param {Array} items - Les articles du panier
     */
    saveBasket: function(items) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
            this.notifyObservers(); // Notifier les observateurs
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier:', error);
        }
    },

    /**
     * Ajoute un produit au panier
     * @param {Object} product - Le produit à ajouter
     * @param {number} quantity - La quantité
     */
    addItem: function(product, quantity = 1) {
        const basket = this.getBasket();
        const existingItem = basket.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            basket.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price) || 0,
                image: product.image,
                collection: product.collection || 'Collection',
                statut: product.statut || product.status || 'Produit',
                quantity: Math.max(1, parseInt(quantity) || 1)
            });
        }

        this.saveBasket(basket);
        return basket;
    },

    /**
     * Supprime un produit du panier
     * @param {number} productId - L'ID du produit
     */
    removeItem: function(productId) {
        let basket = this.getBasket();
        basket = basket.filter(item => item.id !== productId);
        this.saveBasket(basket);
        return basket;
    },

    /**
     * Modifie la quantité d'un produit
     * @param {number} productId - L'ID du produit
     * @param {number} quantity - La nouvelle quantité
     */
    updateQuantity: function(productId, quantity) {
        const basket = this.getBasket();
        const item = basket.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                return this.removeItem(productId);
            }
            item.quantity = quantity;
        }

        this.saveBasket(basket);
        return basket;
    },

    /**
     * Vide le panier
     */
    clearBasket: function() {
        this.saveBasket([]);
        return [];
    },

    /**
     * Récupère le nombre d'articles dans le panier
     * @returns {number} Le nombre total de quantités
     */
    getItemCount: function() {
        const basket = this.getBasket();
        return basket.reduce((total, item) => total + item.quantity, 0);
    },

    /**
     * Alias de getItemCount pour compatibilité
     * @returns {number} Le nombre total de quantités
     */
    getCount: function() {
        return this.getItemCount();
    },

    /**
     * Récupère le total du panier
     * @returns {number} Le total
     */
    getTotal: function() {
        const basket = this.getBasket();
        return basket.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
};

export { BasketData };
