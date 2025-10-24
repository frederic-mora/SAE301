import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import { HeaderView } from "../../ui/header/index.js";
import { FooterView } from "../../ui/footer/index.js";
import { BasketView } from "../../ui/basket/index.js";
import { LoginData } from "../../data/login.js";    



/**
 * Construit et retourne le layout principal de l'application.
 *
 * @function
 * @returns {DocumentFragment} Le fragment DOM représentant le layout complet.
 *
 * @description
 * - Crée un fragment DOM à partir du template HTML.
 * - Génère le DOM de l'en-tête via HeaderView.dom().
 * - Génère le DOM du pied de page via FooterView.dom().
 * - Remplace le slot nommé "header" par le DOM de l'en-tête.
 * - Remplace le slot nommé "footer" par le DOM du pied de page.
 * - Retourne le fragment DOM finalisé.
 */
let handlerProfile = function() {
    if (LoginData.checkAuth()!=false) {
        
        window.location.href = '/profile';
    }
    else {
        window.location.href = '/login';
    }
};
export function RootLayout() {

    let layout = htmlToFragment(template);
    let header = HeaderView.dom();
    let footer = FooterView.dom();
    let basket = BasketView.dom();

    layout.querySelector('slot[name="header"]').replaceWith(header);
    layout.querySelector('slot[name="footer"]').replaceWith(footer);
    layout.querySelector('slot[name="basket"]').replaceWith(basket);
    
    return layout;
}