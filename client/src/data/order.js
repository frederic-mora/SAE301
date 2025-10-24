import { api } from "../lib/api-request.js";

/**
 * Envoie le panier au backend pour créer une commande.
 * @param {object} cartData - L'objet contenant { items: [], total: 0 }
 * @returns {Promise<object>} - La commande sauvegardée (avec ID et numero_commande)
 */
export async function createOrder(cartData) {
    const res = await fetch(api('commandes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important pour envoyer le cookie de session
        body: JSON.stringify(cartData)
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("[order.js] createOrder error response", text);
        throw new Error(text || "Erreur lors de la création de la commande");
    }

    const data = await res.json();
    return data;
}