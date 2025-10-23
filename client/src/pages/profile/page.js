import { ProfileView } from "../../ui/profile/index.js";
import { LoginData } from "../../data/login.js";
import template from "./template.html?raw";
// import { Router } from "../../lib/router.js";
import { htmlToFragment } from "../../lib/utils.js";
import { Router } from "../../lib/router.js";

let M = {
    profiles: []
};
M.getCurrentUser = async function(id) {
    user = await LoginData.fetch(id);
    return user;
}

let C = {};
// C.handler_auth = async function() {
//     if (Router.setAuth===true) {
//         authStatus =sessionStorage.getItem('auth');
//         if (authStatus==='true') {
//             console.log("Utilisateur déjà authentifié.");
//             let id = JSON.parse(sessionStorage.getItem('user'));
//             let user= M.getCurrentUser(id);

//             window.location.href = '/profile';
//             return user;
//         }
//         // user= LoginData.fetchCurrentUser();
//         // user = JSON.parse(sessionStorage.getItem('user'));
//         // if (user) {
//         //     console.log("Utilisateur connecté :", user);
//         //     window.location.href = '/profile';
//         //     return;
//         // }
//     }
    
// }

// C.checkAuth = function() {
//     return LoginData.checkAuth();
//     const user = JSON.parse(sessionStorage.getItem('user'));
// if (user) {
//     // L'utilisateur est connecté
//     return true;
//     console.log("Utilisateur connecté :", user);
// }
// }

C.handler_logout = async function(ev) {
  // Trouve le bouton logout qui englobe l'élément cliqué
  console.log('Handler logout called');
  const logoutBtn = ev.target.closest('button#logoutButton');
  if (!logoutBtn) return; // ce clic n'est pas sur le bouton logout

  ev.preventDefault();
LoginData.logout();
  // Si tu veux appeler l'API de logout côté serveur :
  // await LoginData.logout();

  // Nettoyage local
  sessionStorage.removeItem('user');
  sessionStorage.setItem('isAuthenticated', 'false');

  // Mettre à jour le router si l'instance est exposée
  if (window.router && typeof window.router.setAuth === 'function') {
    window.router.setAuth(false);
    Router.setAuth(false);
  }

  // Redirection
  window.location.href = '/login';
}
C.handler_updateProfile = async function(ev) {
    if (ev.tagName !== 'BUTTON' && !ev.target.matches('button[id="updateButton"]')) return; 
    ev.preventDefault();
    let form = ev.target.closest('form');
    let formData = new FormData(form);
    formData.append('action', 'updateProfile');
    await LoginData.updateProfile(formData);
    console.log('Handler update profile called');
}

C.init = async function(){
    
        let authStatus =sessionStorage.getItem('isAuthenticated');
        console.log("Auth Status:", authStatus);
        if (authStatus==='true') {
            console.log("Utilisateur déjà authentifié.");
            let user = JSON.parse(sessionStorage.getItem('user'));
            return V.init( user );
            
    }
    window.location.href = '/login';
    
}
let V = {};
V.createPageFragment = function( data ){
   // Créer le fragment depuis le template
   let pageFragment = htmlToFragment(template);
   
   // Générer les produits
   let profilesDOM = ProfileView.dom(data);
   
   // Remplacer le slot par les produits
   pageFragment.querySelector('slot[name="profiles"]').replaceWith(profilesDOM);
   
   return pageFragment;
}
V.attachEvents = function( pageFragment ){

    pageFragment.addEventListener('submit', C.handler_logout);
    pageFragment.addEventListener('submit', C.handler_updateProfile);
    // const profileIcon = fragment.querySelector('#profileBtn');
    // profileIcon.addEventListener('click', C.handler_auth);
    return pageFragment;
}

V.init = function(data){
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    // V.renderAmount(data);
    return fragment;
}
export function ProfilePage() {
    console.log("ProfilePage");
    return C.init();
}
