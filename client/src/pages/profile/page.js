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
C.handler_auth = async function() {
    if (Router.setAuth===true) {
        authStatus =sessionStorage.getItem('isAuthenticated');
        if (authStatus==='true') {
            console.log("Utilisateur déjà authentifié.");
            // let id = JSON.parse(sessionStorage.getItem('user'));
            // let user= M.getCurrentUser(id);

            window.location.href = '/profile';
            // return user;
        }
        
    }
 
}

// C.checkAuth = function() {
//     return LoginData.checkAuth();
//     const user = JSON.parse(sessionStorage.getItem('user'));
// if (user) {
//     // L'utilisateur est connecté
//     return true;
//     console.log("Utilisateur connecté :", user);
// }
// }

C.handler_logout = async function() {
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
C.handler_updateProfile = async function(ev) {
    console.log('Handler update profile called');
    if (ev.target.id !== 'updateButton') return; 
    ev.preventDefault();
    
    let form = ev.target.closest('form');
    if (!form) {
        console.error('Form not found');
        return;
    }
    
    let formData = new FormData(form);
    formData.append('action', 'updateProfile');
    
    try {
        const result = await LoginData.updateProfile(formData);
        if (result && result.id) {
            console.log('Profil mis à jour avec succès:', result);
            // Optionnel: afficher un message de succès
            alert('Profil mis à jour avec succès');
        } else {
            console.error('Erreur lors de la mise à jour:', result);
            alert('Erreur lors de la mise à jour du profil');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur s\'est produite');
    }
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
V.attachEvents = function(pageFragment) {
    let logoutBtn = pageFragment.querySelector('#logoutBtnProfile');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', C.handler_logout);
    }
    let updateBtn = pageFragment.querySelector('#updateButton');
    if (updateBtn) {
      updateBtn.addEventListener('click', C.handler_updateProfile);
    }

    // Note: le bouton profil se trouve dans la navbar (nav/index.js)
    // pas dans cette page, donc pas besoin de l'attacher ici

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
