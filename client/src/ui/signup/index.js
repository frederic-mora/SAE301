import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let SignupView = {
  html: function (data) {
    return genericRenderer(template, data);
  },

  dom: function (data) {
    let fragment = htmlToFragment(SignupView.html(data));
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
    
  //   try {
  //     const formData = new FormData(form);
  //     const data = {
  //       action: 'register',
  //       name: formData.get('name'),
  //       surname: formData.get('surname'),
  //       email: formData.get('email'),
  //       password: formData.get('password')
  //     };

  //     const response = await fetch('http://localhost/api/users', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     });
  //     const result = await response.json();

  //     if (result.success) {
  //       // Redirection vers la page de connexion
  //       window.location.href = '/login';
  //     } else {
  //       errorDiv.textContent = result.error || 'Une erreur est survenue lors de l\'inscription.';
  //       errorDiv.classList.remove('hidden');
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de l\'inscription:', error);
  //     errorDiv.textContent = 'Une erreur est survenue lors de l\'inscription.';
  //     errorDiv.classList.remove('hidden');
  //   }
  // }
};

export { SignupView };
