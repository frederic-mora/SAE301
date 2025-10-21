import { LoginData } from "../../data/login.js";
import { SignupView } from "../../ui/signup/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { HeaderView } from "../../ui/header/index.js";


let M = {
    logins: []
};
let V = {};
M.logins = async function(){
    M.logins = await LoginData.fetchAll();
}

M.filterUser = function(email) {
    const filteredUsers = M.logins.filter(user => user.email == email);
    // Retourner le premier élément trouvé ou null
    return filteredUsers.length > 0 ? filteredUsers[0] : null;
}

M.addUser = async function(name,surname, email, password){
    await SignupData.addUser(name,surname, email, password);
}
M.startSession = async function(email, password){
    let result = await LoginData.fetchSession(email, password);
    M.startSession = result;
}

// C.handler_SignUpLogin = function(name, surname, email, password){
//     if (M.filterUser(email)){
//         M.addUser(name, surname, email, password);
//     }
// }
let C = {};

C.handler_submit = async function(ev){
    if (!ev.target.matches('form')){
        return;
    }
    if (ev.target.action == "/login"){
    ev.preventDefault();
    let email = ev.target.querySelector('input[name="email"]').value;
    let password = ev.target.querySelector('input[name="password"]').value;

    if (M.filterUser(email)){
        M.startSession(email, password);
    }
    else {
        
    }
}
     
}









// C.handler_clickOnCategory = async function(ev){
//     console.log("Category ID:", id);
//     if (ev.target.dataset.category !== undefined){
//         let id = ev.target.dataset.id;
        
//         const signups = await M.signupsByCategory(id);
//         const root = document.querySelector('#app');
//         const newContent = await V.renderCat(signups);
//         root.replaceChildren(newContent);
//     }
// }

C.init = async function(){
    M.signups = await SignupData.fetchAll(); 
    return V.init( M.signups );
}




V.init = function(data){
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    V.renderAmount(data);
    return fragment;
}
// V.renderCat = async function(data){
    
    
//     let newFragment = V.createPageFragment(data);
//     V.attachEvents(newFragment);
//     return newFragment;

// }

V.createPageFragment = function( data ){
   // Créer le fragment depuis le template
   let pageFragment = htmlToFragment(template);
   
   // Générer les produits
   let signupsDOM = SignupView.dom(data);
   
   // Remplacer le slot par les produits
   pageFragment.querySelector('slot[name="signups"]').replaceWith(signupsDOM);
   
   return pageFragment;
}

V.attachEvents = function(pageFragment) {
    let root = pageFragment.firstElementChild;
    root.addEventListener("click", C.handler_clickOnSignup);
    root.addEventListener("click", C.handler_clickOnCategory);
    let header = HeaderView.dom();
    header.addEventListener("click", C.handler_clickOnCategory);
    return pageFragment;
}

export function LoginPage(params) {
    console.log("SignupsPage", params);
    return C.init(params);
}


