import { htmlToFragment } from "../../lib/utils.js";
import { LoginData } from "../../data/login.js";
import { BasketView } from "../basket/index.js";
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
    
    // Gestion du menu mobile
    const menuBtn = fragment.querySelector('#menuBtn');
    if (menuBtn) {
      menuBtn.addEventListener('click', C.handleMenuToggle);
    }

    // Vérifier l'état d'authentification
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const authState = fragment.querySelector('#authState');
    const loginLink = fragment.querySelector('#loginLink');

    // Afficher le bon état selon l'authentification
    if (isAuthenticated && authState && loginLink) {
      authState.classList.remove('hidden');
      loginLink.classList.add('hidden');
    } else if (!isAuthenticated && authState && loginLink) {
      authState.classList.add('hidden');
      loginLink.classList.remove('hidden');
    }

    // Gestion du dropdown profil (seulement si authentifié)
    const profileBtn = fragment.querySelector('#profileBtn');
    const profileDropdown = fragment.querySelector('#profileDropdown');
    const logoutBtn = fragment.querySelector('#logoutDropdownBtn');

    if (profileBtn && isAuthenticated) {
      profileBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        profileDropdown.classList.toggle('hidden');
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        await C.handleLogout();
      });
    }

    // Gestion du bouton panier
    const basketBtn = fragment.querySelector('#basketBtn');
    if (basketBtn) {
      basketBtn.addEventListener('click', () => {
        BasketView.show();
      });
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

C.handleLogout = async function() {
  console.log('Logout handler called');
  
  try {
    // Appeler le logout serveur si tu veux invalider la session
    await LoginData.logout();
  } catch (error) {
    console.error('Erreur lors de la déconnexion serveur:', error);
  }

  // Nettoyage local
  sessionStorage.removeItem('user');
  sessionStorage.setItem('isAuthenticated', 'false');

  // Mettre à jour le router si l'instance est exposée
  if (window.router && typeof window.router.setAuth === 'function') {
    window.router.setAuth(false);
  }

  // Redirection vers login
  window.location.href = '/login';
};

export { NavView };
