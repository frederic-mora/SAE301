import { LoginData } from "../../data/login.js";
import { LoginView } from "../../ui/login/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { Router } from "../../lib/router.js";


let M = {
    user: null
};
let V = {};
let C = {};

// M.loginUser = async function(email, password){
//     return await LoginData.login(email, password);
// }

M.checkSession = async function() {
    const user = await LoginData.fetchCurrentUser();
    M.user = user;
    return user;
}

M.getCurrentUser = function() {
    return M.user;
}

C.handler_submit = async function(ev){
    console.log('Handler submit called');
    
    if (!ev.target.matches('form')){
        console.log('Target is not a form:', ev.target);
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    
    // Récupérer le formulaire
    let formdata = new FormData(ev.target);
    
    // Ajouter l'action au FormData
    formdata.append('action', 'login');
    formdata.append('email', ev.target.querySelector('input[name="email"]').value);
    formdata.append('password', ev.target.querySelector('input[name="password"]').value);

    console.log("Données du formulaire:", Object.fromEntries(formdata));

    try {
        const result = await LoginData.login(Object.fromEntries(formdata));
        console.log("Résultat de la connexion:", result);
        if (result.success==true) {
            console.log("Connexion réussie - Redirection...");
            // Store user info in sessionStorage
            sessionStorage.setItem('user', JSON.stringify(result));
            Router.setAuth=true;
            // Redirect to home
            window.location.href = '/'; 
            // Mettre à jour les informations de l'utilisateur
            M.user = result;
            // Rediriger vers la page d'accueil
            // window.location.href = '/profile';
        } else {
            console.log("Connexion échouée:", result?.error || "Erreur inconnue");
            // alert(result?.error || "La connexion a échoué. Veuillez réessayer.");
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        // alert("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
    }
} 

C.handler_profileClick = async function(ev){
    console.log("Profile click detected");
    ev.preventDefault();
    ev.stopPropagation();
    UserInfo = sessionStorage.getItem('user');

    const user = LoginData.getCurrentUser();
    if (user) {
        console.log("Utilisateur connecté :", user);
        window.location.href = '/profile';
    } else {
        console.log("Utilisateur non connecté");
        window.location.href = '/login';
    }
}
let UserInfo = sessionStorage.getItem('user');
console.log("UserInfo au chargement de la page :", UserInfo);

// // Connexion
// if (UserInfo) {
//     console.log("Utilisateur déjà connecté :", UserInfo);
//     // Rediriger vers la page de profil
//     window.location.href = '/profile';
// }

//     console.log("Category ID:", id);
//     if (ev.target.dataset.category !== undefined){
//         let id = ev.target.dataset.id;
//
//         const signups = await M.signupsByCategory(id);
//         const root = document.querySelector('#app');
//         const newContent = await V.renderCat(signups);
//         root.replaceChildren(newContent);
//     }
// }

C.init = async function(){
    
        return V.init();
    
}



V.init = function(){
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
}
// V.renderCat = async function(data){
    
    
//     let newFragment = V.createPageFragment(data);
//     V.attachEvents(newFragment);
//     return newFragment;

// }

V.createPageFragment = function(){
   // Créer le fragment depuis le template de login directement
   let loginDOM = LoginView.dom();
   
   // Debug
   console.log('Fragment créé avec formulaire:', loginDOM.querySelector('form'));
   
   return loginDOM;
}

V.attachEvents = function(pageFragment) {
    // Ajouter l'écouteur d'événement pour le formulaire
    const form = pageFragment.querySelector('form');
    console.log('Form trouvé:', form);
    
    if (form) {
        console.log('Ajout du listener submit');
        form.addEventListener('submit', function(ev) {
            console.log('Form submitted!');
            return C.handler_submit(ev);
        });
    } else {
        console.error('Formulaire non trouvé dans le fragment');
    }
    return pageFragment;
}

export function LoginPage() {
    console.log("LoginPage");
    return C.init();
}


