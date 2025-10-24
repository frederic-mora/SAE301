import { getRequest, JSONpostRequest } from '../lib/api-request.js';

let OrderData = {};

/**
 * Crée une nouvelle commande
 * @param {number} idUser - L'ID de l'utilisateur
 * @param {Array} items - Les articles du panier [{idProduct, quantity}, ...]
 * @returns {Promise<Object>} La commande créée avec son ID
 */
OrderData.createOrder = async function(idUser, items) {
    try {
        if (!idUser || !items || items.length === 0) {
            console.error('Données de commande invalides');
            return { success: false, error: 'Données invalides' };
        }

        const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        const orderData = {
            action: 'create',
            idUser: idUser,
            date: date,
            items: items
        };

        console.log('Création de commande avec données:', orderData);
        const response = await JSONpostRequest('orders', JSON.stringify(orderData));
        console.log('Réponse reçue:', response);

        if (response && response.success) {
            return {
                success: true,
                order: response.order
            };
        }

        return response || { success: false, error: 'Erreur serveur' };
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Ajoute un article à une commande existante
 * @param {number} idOrder - L'ID de la commande
 * @param {number} idProduct - L'ID du produit
 * @param {number} quantity - La quantité
 * @returns {Promise<Object>} Le résultat de l'ajout
 */
OrderData.addItem = async function(idOrder, idProduct, quantity) {
    try {
        if (!idOrder || !idProduct || !quantity || quantity <= 0) {
            console.error('Données d\'article invalides');
            return { success: false, error: 'Données invalides' };
        }

        const itemData = {
            action: 'addItem',
            idOrder: idOrder,
            idProduct: idProduct,
            quantity: quantity
        };

        console.log('Ajout d\'article avec données:', itemData);
        const response = await JSONpostRequest('orders', JSON.stringify(itemData));
        console.log('Réponse reçue:', response);

        if (response && response.success) {
            return {
                success: true,
                item: response.item
            };
        }

        return response || { success: false, error: 'Erreur serveur' };
    } catch (error) {
        console.error('Erreur lors de l\'ajout d\'article:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Récupère les commandes d'un utilisateur
 * @param {number} userId - L'ID de l'utilisateur
 * @returns {Promise<Array>} Liste des commandes
 */
OrderData.fetchUserOrders = async function(userId) {
    try {
        if (!userId) {
            console.error('ID utilisateur manquant');
            return [];
        }

        const data = await getRequest(`orders?user_id=${userId}`);
        console.log('Commandes reçues:', data);
        
        if (data && Array.isArray(data)) {
            return data.slice(0, 10); // Retourne les 10 premières commandes
        }
        
        return [];
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        return [];
    }
};

/**
 * Récupère une commande par son ID
 * @param {number} orderId - L'ID de la commande
 * @returns {Promise<Object>} La commande
 */
OrderData.fetch = async function(orderId) {
    try {
        if (!orderId) {
            console.error('ID commande manquant');
            return null;
        }

        const data = await getRequest(`orders/${orderId}`);
        console.log('Commande reçue:', data);
        
        return data || null;
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        return null;
    }
};

/**
 * Récupère tous les articles d'une commande
 * @param {number} orderId - L'ID de la commande
 * @returns {Promise<Array>} Liste des articles
 */
OrderData.fetchOrderItems = async function(orderId) {
    try {
        if (!orderId) {
            console.error('ID commande manquant');
            return [];
        }

        const data = await getRequest(`orders/${orderId}/items`);
        console.log('Articles reçus:', data);
        
        if (data && Array.isArray(data)) {
            return data;
        }
        
        return [];
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        return [];
    }
};

/**
 * Récupère toutes les commandes
 * @returns {Promise<Array>} Liste de toutes les commandes
 */
OrderData.fetchAll = async function() {
    try {
        const response = await getRequest('orders');
        if (response && Array.isArray(response)) {
            return response;
        }
        return [];
    } catch (error) {
        console.error('Erreur lors de la récupération de toutes les commandes:', error);
        return [];
    }
};

/**
 * Crée une commande directement depuis le panier
 * @param {number} idUser - L'ID de l'utilisateur
 * @param {Array} basketItems - Les articles du panier
 * @returns {Promise<Object>} La commande créée
 */
OrderData.createOrderFromBasket = async function(idUser, basketItems) {
    try {
        if (!idUser || !basketItems || basketItems.length === 0) {
            console.error('Données de panier invalides');
            return { success: false, error: 'Le panier est vide' };
        }

        // Transformer les articles du panier au format attendu par l'API
        const items = basketItems.map(item => ({
            idProduct: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price) || 0
        }));

        // Créer la commande
        const result = await OrderData.createOrder(idUser, items);

        if (result && result.success) {
            console.log('Commande créée avec succès:', result.order);
            return result;
        }

        return result || { success: false, error: 'Erreur lors de la création de la commande' };
    } catch (error) {
        console.error('Erreur lors de la création de la commande depuis le panier:', error);
        return { success: false, error: error.message };
    }
};

export { OrderData };
