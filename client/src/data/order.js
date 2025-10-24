import { getRequest } from '../lib/api-request.js';

const OrderData = {
    /**
     * Récupère les commandes récentes de l'utilisateur
     * @param {number} userId - L'ID de l'utilisateur
     * @returns {Promise<Array>} Liste des commandes
     */
    fetchUserOrders: async function(userId) {
        try {
            const response = await getRequest(`orders?user_id=${userId}`);
            if (response && Array.isArray(response)) {
                return response.slice(0, 10); // Retourne les 10 premières commandes
            }
            return [];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            return [];
        }
    },

    /**
     * Récupère une commande par son ID
     * @param {number} orderId - L'ID de la commande
     * @returns {Promise<Object>} La commande
     */
    fetch: async function(orderId) {
        try {
            const response = await getRequest(`orders/${orderId}`);
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération de la commande:', error);
            return null;
        }
    },

    /**
     * Récupère toutes les commandes
     * @returns {Promise<Array>} Liste de toutes les commandes
     */
    fetchAll: async function() {
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
    }
};

export { OrderData };
