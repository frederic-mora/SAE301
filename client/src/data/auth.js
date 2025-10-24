import { api } from "../lib/api-request.js";

export async function register({ email, password }) {
    const res = await fetch(api('profils'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const text = await res.text();
        console.error("[auth.js] register error response", text);
        // On essaie de lire l'erreur JSON envoyée par le serveur
        try {
            const errJson = JSON.parse(text);
            throw new Error(errJson.error || "Erreur d'inscription");
        } catch (e) {
            throw new Error(text || "Erreur d'inscription");
        }
    }
    const data = await res.json();
    return data;
}

export async function login({ email, password }) {
    const res = await fetch(api('profils/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });

    // --- MODIFICATION : Gérer le cas où res.ok est faux MAIS on a les données ---
    if (!res.ok) {
        const text = await res.text();
        console.warn("[auth.js] login received non-ok response, attempting to parse anyway:", text);
        try {
            // On essaie quand même de parser le JSON
            const data = JSON.parse(text);
            // Si le JSON contient bien les informations utilisateur, on le retourne comme un succès !
            if (data && data.user && data.user.email) {
                console.log("[auth.js] Parsed user data despite non-ok status, proceeding as success.");
                return data; // <- On retourne les données, pas d'erreur !
            }
            // Sinon, c'est une vraie erreur, on la renvoie
            throw new Error(data.error || text || "Erreur de connexion (parsing)");
        } catch (e) {
            // Si le parsing échoue ou si data.user n'existe pas, c'est une vraie erreur
            console.error("[auth.js] login error response", text, e);
            throw new Error(e.message || text || "Erreur de connexion");
        }
    }
    // --- FIN MODIFICATION ---

    // Si res.ok est vrai, on continue comme avant
    const data = await res.json();
    return data;
}

export async function logout() {
    // Utiliser DELETE pour la déconnexion
    const res = await fetch(api('profils/logout'), {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) {
        const text = await res.text();
        console.error("[auth.js] logout error response", text);
        throw new Error(text || "Erreur de déconnexion");
    }
    return true;
}