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

export { genericRenderer, htmlToFragment };

/**
 * Generates the path to an image in the assets folder.
 *
 * @param {string} filename - The name of the image file.
 * @returns {string} - The path to the image in the assets folder.
 */
export function assetPath(filename) {
    return `/src/assets/${filename}`;
}
