import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// Modèle
let M = {
    orderId: null
};

// Contrôleur
let C = {};
C.init = async function() {
    try {
        const params = new URLSearchParams(window.location.search);
        M.orderId = params.get('order_id');
    } catch (e) {
        console.error("Erreur lecture URL params", e);
    }

    if (!M.orderId) {
        console.warn("Aucun order_id trouvé dans l'URL");
        M.orderId = "Inconnu";
    }

    return V.init(M.orderId);
};

// Vue
let V = {};
V.init = function(orderId) {
    let fragment = V.createPageFragment(orderId);
    V.attachEvents(fragment);
    return fragment;
};

V.createPageFragment = function(orderId) {
    let pageFragment = htmlToFragment(template);
    const orderEl = pageFragment.querySelector('#order-number');
    if (orderEl) {
        orderEl.textContent = orderId;
    }
    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    // Pas d'événements spécifiques pour cette page
    return pageFragment;
};

export function ConfirmationPage() {
    return C.init();
}