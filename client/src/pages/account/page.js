// javascript
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { logout } from "../../data/auth.js";

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



export function AccountPage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "/auth";
        return "";
    }

    const html = template
        .replace('value="vivienpain@gmail.com"', `value="${user.email}"`)
        .replace('value="********"', `value=""`);

    const fragment = htmlToFragment(html);

    const logoutBtn = fragment.querySelector("#logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (ev) => {
            ev.preventDefault();
            await logout();
            localStorage.removeItem("user");
            window.location.href = "/";
        });
    }

    return fragment;
}
