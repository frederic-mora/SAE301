import { api } from "../lib/api-request.js";

/**
 * Envoie le panier au backend pour créer une commande.
 * @param {object} cartData - L'objet contenant { items: [], total: 0 }
 * @returns {Promise<object>} - La commande sauvegardée (avec ID et numero_commande) ou lève une erreur.
 */
export async function createOrder(cartData) {
    // Log des données envoyées pour débogage
    console.log("[order.js] Données envoyées à /api/commandes:", JSON.stringify(cartData, null, 2));

    const res = await fetch(api('commandes'), { // Assure que api() retourne la bonne URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important pour envoyer le cookie de session PHP
        body: JSON.stringify(cartData) // Convertit l'objet JS en chaîne JSON
    });

    // Gestion améliorée des erreurs : lit la réponse même si res.ok est faux
    if (!res.ok) {
        let errorBody = null;
        try {
            // Essaye de lire le corps de la réponse comme JSON (peut contenir un message d'erreur du backend)
            errorBody = await res.json();
        } catch (e) {
            // Si ce n'est pas du JSON, essaye de lire comme texte
            try {
                errorBody = await res.text();
            } catch (textError) {
                // Si la lecture échoue complètement
                errorBody = `Erreur ${res.status} ${res.statusText} (Impossible de lire la réponse)`;
            }
        }

        // Log de l'erreur détaillée
        console.error("[order.js] createOrder error response:", res.status, res.statusText, errorBody);

        // Crée un message d'erreur plus informatif
        let errorMessage = "Erreur lors de la création de la commande.";
        if (typeof errorBody === 'string' && errorBody.length > 0) {
            errorMessage = errorBody;
        } else if (errorBody && errorBody.error) {
            errorMessage = errorBody.error; // Si le backend renvoie { "error": "message" }
        } else {
            errorMessage = `Erreur ${res.status} ${res.statusText}`; // Fallback
        }
        // Lance une exception pour que le `catch` dans checkout/page.js la récupère
        throw new Error(errorMessage);
    }

    // Si res.ok est vrai, tente de parser la réponse JSON
    try {
        const data = await res.json();
        // Vérifie si la réponse contient bien les informations attendues
        if (!data || !data.numero_commande) {
            console.warn("[order.js] Réponse succès mais données invalides:", data);
            throw new Error("Réponse invalide reçue du serveur après création de commande.");
        }
        return data; // Retourne la commande sauvegardée
    } catch (jsonError) {
        console.error("[order.js] Erreur lors du parsing JSON de la réponse succès:", jsonError);
        throw new Error("Erreur de lecture de la confirmation de commande.");
    }
}