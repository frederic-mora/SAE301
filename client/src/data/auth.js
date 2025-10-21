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
        throw new Error(text || "Erreur d'inscription");
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
    if (!res.ok) {
        const text = await res.text();
        console.error("[auth.js] login error response", text);
        throw new Error(text || "Erreur de connexion");
    }
    const data = await res.json();
    return data;
}

export async function logout() {
    const res = await fetch(api('profils/logout'), {
        method: 'POST',
        credentials: 'include'
    });
    if (!res.ok) {
        const text = await res.text();
        console.error("[auth.js] logout error response", text);
        throw new Error(text || "Erreur de déconnexion");
    }
    return true;
}

