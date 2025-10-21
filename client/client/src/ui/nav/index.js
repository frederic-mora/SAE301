import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

// NavView est un composant statique
// on ne fait que charger le template HTML
// en donnant la possibilité de l'avoir sous forme html ou bien de dom
let NavView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);
    const menuBtn = fragment.querySelector('#menuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', C.handleMenuToggle);
    }
    return fragment;
  }
};

let M = {};
let C = {};
let V = {};

C.handleMenuToggle = function (ev) {
  console.log("Menu button clicked");
  let mobileMenu = document.getElementById("menuItems");
  let menuBtn = document.getElementById("menuBtn");
  const spans = menuBtn.getElementsByTagName('span');

  // Toggle menu visibility
  mobileMenu.classList.toggle("translate-x-[-100%]");
  mobileMenu.classList.toggle("translate-x-0");

  // Toggle burger animation
  if (mobileMenu.classList.contains("translate-x-0")) {
    spans[0].style.transform = 'rotate(45deg) translate(0.31rem, 0.31rem)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(0.31rem, -0.31rem)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
};


  navigation.addEventListener("click", C.attachEvents);


export { NavView };
