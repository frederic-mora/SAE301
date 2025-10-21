import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { NavView } from "../../ui/nav/index.js";

let html = NavView.html();
// let dom = NavView.dom();

// HeaderView est un composant statique
// on ne fait que charger le template HTML
// en donnant la possibilité de l'avoir sous forme html ou bien de dom
let HeaderView = {
  html: function () {
    template = template.replace("{{nav}}", html);
    console.log(template);
    return template;
  },

  dom: function () {
    let temp =htmlToFragment(template);
    temp.querySelector("template#nav").replaceWith(NavView.dom());
  
    return temp;
    
    // return htmlToFragment(template);
  }
};

export { HeaderView };
