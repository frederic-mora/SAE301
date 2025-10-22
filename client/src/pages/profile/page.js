import { ProfileView } from "../../ui/profile/index.js";
import { LoginData } from "../../data/login.js";
import template from "./template.html?raw";
import { Router } from "../../lib/router.js";

let M = {
    profiles: []
};

let C = {};
C.handler_auth = async function() {
    if (Router.setAuth===true) {
        // user= LoginData.fetchCurrentUser();
        user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            console.log("Utilisateur connecté :", user);
            window.location.href = '/profile';
            return;
        }
    }
    // const auth = await LoginData.checkAuth();
    // if (auth.success===true) {
    //     const user = JSON.parse(sessionStorage.getItem('user'));
    //     if (user) {
    //         // L'utilisateur est connecté
    //         console.log("Utilisateur connecté :", user);
    //         window.location.href = '/profile';
    //     }
    // }
    window.location.href = '/login';
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



C.init = async function(){
    M.profiles = await LoginData.fetchAll(); 
    userInfo = sessionStorage.getItem('user');
    console.log("UserInfo dans ProfilePage init :", userInfo);
    return V.init( userInfo );
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
