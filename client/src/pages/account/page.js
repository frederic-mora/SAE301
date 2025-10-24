
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { logout } from "../../data/auth.js";


function getCurrentUser() {
    try {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            const parsed = JSON.parse(userJson);
            // S'assurer que c'est bien un objet et non null ou autre chose
            return parsed && typeof parsed === "object" ? parsed : null;
        }
    } catch (e) {
        console.error("Erreur lecture localStorage user", e);
    }
    return null;
}

export function AccountPage() {
    const user = getCurrentUser();


    if (!user) {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = "/auth/login";
        return htmlToFragment("<div>Redirection...</div>");
    }

    // 2. Créer le fragment DOM à partir du template
    const fragment = htmlToFragment(template);

    // 3. Trouver les éléments input DANS LE FRAGMENT
    const nomInput = fragment.querySelector("#nom");
    const prenomInput = fragment.querySelector("#prenom");
    const emailInput = fragment.querySelector("#email");
    const passwordInput = fragment.querySelector("#password");
    const logoutBtn = fragment.querySelector("#logoutBtn");
    const accountForm = fragment.querySelector("#accountForm");


    if (nomInput) {
        nomInput.value = user.nom || '';
    }
    if (prenomInput) {
        prenomInput.value = user.prenom || '';
    }
    if (emailInput) {
        emailInput.value = user.email || '';
    }
    if (passwordInput) {
        passwordInput.value = ''; // Toujours vider le champ mot de passe
        passwordInput.placeholder = "Laisser vide pour ne pas changer";
    }


    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (ev) => {
            ev.preventDefault();
            try {
                await logout();
                localStorage.removeItem("user");
                window.location.href = "/"; // Redirige vers l'accueil
            } catch (err) {
                console.error("Erreur lors de la déconnexion:", err);
                alert("Erreur lors de la déconnexion."); // Informe l'utilisateur
            }
        });
    }


    if (accountForm) {
        accountForm.addEventListener("submit", async (ev) => {
            ev.preventDefault();
            console.log("Soumission du formulaire de mise à jour (logique à implémenter)");

            alert("Fonctionnalité de mise à jour non implémentée.");
        });
    }

    // 7. Retourner le fragment DOM rempli et avec les événements attachés
    return fragment;
}