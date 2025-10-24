import { LoginData } from "../../data/login.js";
import { SignupView } from "../../ui/signup/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import { ToastManager } from "../../lib/toast.js";
import template from "./template.html?raw";

let M = {
    user: null
};
let V = {};
let C = {};

C.handler_submit = async function(ev) {
    console.log('Handler submit called');
    
    if (!ev.target.matches('form')) {
        console.log('Target is not a form:', ev.target);
        return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    
    let formdata = new FormData(ev.target);
    formdata.append('action', 'register');
    console.log("Données du formulaire:", Object.fromEntries(formdata));

    try {
        const result = await LoginData.create(formdata);
        console.log("Résultat de l'inscription:", result);
        if (result && result.success) {
            console.log("Inscription réussie - Redirection...");
            ToastManager.success("Inscription réussie ! Redirection...");
            window.location.href = '/login';
        } else {
            console.log("Inscription échouée:", result?.error || "Erreur inconnue");
            ToastManager.error(result?.error || "L'inscription a échoué. Veuillez réessayer.");
        }
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        ToastManager.error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    }
}

C.init = async function() {
    return V.init();
}

V.init = function() {
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
}

V.createPageFragment = function() {
    let pageFragment = htmlToFragment(template);
    let signupDOM = SignupView.dom();
    pageFragment.replaceChildren(signupDOM);
    return pageFragment;
}

V.attachEvents = function(pageFragment) {
    const form = pageFragment.querySelector('form');
    console.log('Form trouvé:', form);
     form.addEventListener('submit', C.handler_submit) ;
     
    return pageFragment;
}

export function SignupsPage() {
    console.log("SignupsPage");
    return C.init();
}
