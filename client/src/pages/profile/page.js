import { ProfileView } from "../../ui/profile/index.js";
import { LoginData } from "../../data/login.js";
import template from "./template.html?raw";

let M = {
    profiles: []
};



let C = {};


C.init = async function(){
    M.profiles = await LoginData.fetchAll(); 
    return V.init( M.profiles );
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
    V.renderAmount(data);
    return fragment;
}
export function ProfilePage(params) {
    console.log("ProfilePage", params);
    return C.init(params);
}
