import { htmlToFragment, genericRenderer, assetPath } from "../../lib/utils.js";
import template from "./template.html?raw";

// HeaderView est un composant statique
// on injecte dynamiquement le chemin du logo
let HeaderView = {
  html: function () {
    return genericRenderer(template, { logoSrc: assetPath('Logo.png') });
  },

  dom: function () {
    return htmlToFragment(genericRenderer(template, { logoSrc: assetPath('Logo.png') }));
  }
};

export { HeaderView };
