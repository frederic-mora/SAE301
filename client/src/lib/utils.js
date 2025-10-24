/**
 * Renders a template string by replacing placeholders with corresponding data values.
 *
 * @param {string} template - The template string containing placeholders in the format {{key}}.
 * @param {Object} data - An object containing key-value pairs where the key corresponds to the placeholder in the template.
 * @returns {string} - The rendered HTML string with placeholders replaced by data values.
 */
let genericRenderer = function(template, data){
    let html = template;
    for(let key in data){
        html = html.replaceAll(new RegExp("{{"+key+"}}", "g"), data[key]);
    }
    return html;
}

/**
 * Converts an HTML string into a DocumentFragment.
 *
 * @param {string} htmlString - The HTML string to convert.
 * @returns {DocumentFragment} - A DocumentFragment containing the parsed HTML elements.
 */
function htmlToFragment(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim(); // trim supprime les espaces inutiles
    return template.content;
}

/**
 * Génère le chemin vers une image dans le dossier assets.
 *
 * @param {string} filename - Le nom du fichier image.
 * @returns {string} - Le chemin de l'image.
 */
export function assetPath(filename) {
    return `/src/assets/${filename}`;
}

/**
 * Parse une réponse HTTP en JSON de façon sûre.
 * ... (description)
 *
 * @param {Response} res - objet Response obtenu via fetch
 * @returns {Promise<any|null>} - JSON parsé, ou objet contenant le texte, ou null
 */
export async function parseJsonSafe(res) {
    if (!res) return null;
    let text = '';
    try {
        text = await res.text();
    } catch (e) {
        return null;
    }
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch (e) {
        return { text };
    }
}

/**
 * Retourne un objet décrivant l'état du stock.
 * Seuil configurable (AC #2)
 *
 * @param {number | null | undefined} stock - La quantité en stock.
 * @returns {{text: string, class: string}} - Le texte et la classe CSS (Tailwind).
 */
export function getStockStatus(stock) {
    // Seuil d'alerte (configurable par l'admin, ici hardcodé)
    const LOW_STOCK_THRESHOLD = 10;
    const stockNum = Number(stock);

    if (isNaN(stockNum) || stock === null || stock === undefined) {
        // Cas où le stock n'est pas défini (ex: anciens produits)
        return { text: 'Disponibilité non spécifiée', class: 'text-gray-500' };
    }

    if (stockNum > LOW_STOCK_THRESHOLD) {
        return { text: 'En stock', class: 'text-green-700' }; // Vert
    }

    if (stockNum > 0 && stockNum <= LOW_STOCK_THRESHOLD) {
        return { text: 'Bientôt épuisé', class: 'text-orange-600' }; // Orange
    }

    // stockNum <= 0
    return { text: 'Épuisé', class: 'text-red-600' }; // Rouge
}

// Exporter la nouvelle fonction avec les anciennes
export { genericRenderer, htmlToFragment };