// import { LoginData } from "../../data/login.js";
import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let LoginView = {
  html: function (data) {
    return genericRenderer(template, data);
  },

  dom: function (data) {
    let fragment = htmlToFragment(LoginView.html(data));
    // this.attachEvents(fragment);
    return fragment;
  },

  // attachEvents: function(fragment) {
  //   const form = fragment.querySelector('form');
  //   if (form) {
  //     form.addEventListener('submit', this.handleSubmit.bind(this));
  //   }
  // },

  // handleSubmit: async function(event) {
  //   event.preventDefault();
  //   const form = event.target;
  //   const errorDiv = form.querySelector('#error-message');
  //     const formData = new FormData(form);
  //     const result = await LoginData.login(formData);
  //    if(result) {
  //     console.log('Résultat de la connexion :', result);
  //     console.log("Connexion réussie - Redirection...");
  //     Router.setAuth(true);
  //     // Mettre à jour les informations de l'utilisateur
  //     // Rediriger vers la page d'accueil
  //     // window.location.href = '/profile';
     
       
      
  //   }
  //   else {
  //   errorDiv.textContent = 'Une erreur est survenue lors de la connexion.';
  //     errorDiv.classList.remove('hidden');
  //   }
  // }
};

export { LoginView };
