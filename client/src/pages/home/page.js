// client/src/pages/home/page.js
import template from "./template.html?raw";

export function HomePage() {
    return template;
}

function escapeHtml(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function decodeJwtPayload(token) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(payload);
    } catch (e) {
        return null;
    }
}

function getCurrentUser() {
    try {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            const parsed = JSON.parse(userJson);
            return parsed && typeof parsed === "object" ? parsed : null;
        }
        const token = localStorage.getItem("token");
        if (token) {
            const payload = decodeJwtPayload(token);
            if (payload && payload.email) {
                return { email: payload.email, ...payload };
            }
        }
    } catch (e) {
        // ignore parse errors
    }
    return null;
}

// Appeler après insertion du template dans le DOM:
// container.innerHTML = HomePage();
// mountHomePage(container);
export function mountHomePage(container) {
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr || "null");
    const emailEl = container.querySelector("#user-email");
    if (emailEl) {
        if (user && user.email) {
            emailEl.textContent = `Connecté en tant que : ${user.email}`;
        } else {
            emailEl.textContent = "Vous n'êtes pas connecté.";
        }
    } else {
        console.warn("[mountHomePage] Élément #user-email non trouvé dans le container");
    }
}

