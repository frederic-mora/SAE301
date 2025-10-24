import { ProfileView } from "../../ui/profile/index.js";
import { LoginData } from "../../data/login.js";
import { OrderData } from "../../data/order.js";
import template from "./template.html?raw";
// import { Router } from "../../lib/router.js";
import { htmlToFragment } from "../../lib/utils.js";
import { Router } from "../../lib/router.js";
import { ToastManager } from "../../lib/toast.js";

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
    ev.preventDefault();
    
    let form = ev.target;
    if (!form || form.tagName !== 'FORM') {
        console.error('Form not found');
        return;
    }
    
    let formData = new FormData(form);
    console.log('FormData collected:', Array.from(formData.entries()));
    
    try {
        const result = await LoginData.updateProfile(formData);
        if (result && result.success) {
            console.log('Profil mis à jour avec succès:', result.user);
            ToastManager.success('Profil mis à jour avec succès');
            // Optionnel: recharger la page ou rafraîchir les données
            // window.location.reload();
        } else {
            console.error('Erreur lors de la mise à jour:', result?.error);
            ToastManager.error('Erreur lors de la mise à jour du profil: ' + (result?.error || 'Erreur inconnue'));
        }
    } catch (error) {
        console.error('Erreur:', error);
        // ToastManager.error('Une erreur s\'est produite: ' + error.message);
    }
}


C.init = async function(){
    
        let authStatus =sessionStorage.getItem('isAuthenticated');
        console.log("Auth Status:", authStatus);
        if (authStatus==='true') {
            console.log("Utilisateur déjà authentifié.");
            let user = JSON.parse(sessionStorage.getItem('user'));
            let orders = await OrderData.fetchUserOrders(user.id);
            return V.init( user, orders );
            
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
V.renderOrders = function(pageFragment, orders) {
    let ordersContainer = pageFragment.querySelector('[data-orders-container]');
    if (!ordersContainer) return;
    
    if (!orders || orders.length === 0) {
        ordersContainer.innerHTML = '<p class="text-sm text-gray-500">Vous n\'avez pas de commandes récentes.</p>';
        return;
    }
    
    // Créer le HTML des commandes
    let ordersHTML = orders.map(order => `
        <div class="border border-gray-200 p-4">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-[#0F172A]">Commande #${order.id || 'N/A'}</p>
                    <p class="text-xs text-gray-500 mt-1">Date: ${order.date ? new Date(order.date).toLocaleDateString('fr-FR') : 'N/A'}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm font-medium text-[#0F172A]">${order.total ? order.total.toFixed(2) : '0.00'} €</p>
                    <p class="text-xs uppercase tracking-widest ${order.status === 'completed' ? 'text-green-600' : order.status === 'pending' ? 'text-yellow-600' : 'text-gray-500'} mt-1">
                        ${order.status || 'En attente'}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
    
    ordersContainer.innerHTML = ordersHTML;
}
V.attachEvents = function(pageFragment) {
    let logoutBtn = pageFragment.querySelector('#logoutBtnProfile');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', C.handler_logout);
    }
    let form = pageFragment.querySelector('form');
    if (form) {
      form.addEventListener('submit', C.handler_updateProfile);
    }

    // Note: le bouton profil se trouve dans la navbar (nav/index.js)
    // pas dans cette page, donc pas besoin de l'attacher ici

    return pageFragment;
}

V.init = function(data, orders = []){
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    V.renderOrders(fragment, orders);
    // V.renderAmount(data);
    return fragment;
}
export function ProfilePage() {
    console.log("ProfilePage");
    return C.init();
}
