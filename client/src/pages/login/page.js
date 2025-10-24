// javascript
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { login } from "../../data/auth.js";

let M = {};
let C = {};
let _attachedForm = null;
let _handlerRef = null;
let _retryTimer = null;

C.handler_submit = async function(ev, formNode) {
    ev.preventDefault();
    const emailEl = formNode.querySelector('#email');
    const passEl = formNode.querySelector('#password');
    const submitBtn = formNode.querySelector('#submit-btn');
    const errorEl = formNode.querySelector('#form-error');

    if (errorEl) errorEl.classList.add('hidden');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-60');
    }

    try {
        const email = (emailEl && emailEl.value || '').trim();
        const password = (passEl && passEl.value) || '';

        const data = await login({ email, password });
        if (data && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log("LocalStorage 'user' mis à jour :", localStorage.getItem('user')); // Pour vérifier
        } else {
            // Si data.user n'existe pas, c'est une erreur inattendue
            throw new Error("Réponse de connexion invalide reçue du serveur.");
        }

        // --- MODIFICATION : Ajouter un petit délai avant la redirection ---
        // On utilise setTimeout pour attendre 50 millisecondes
        setTimeout(() => {
            const redirectUrl = sessionStorage.getItem('redirectAfterLogin');

            if (redirectUrl) {
                sessionStorage.removeItem('redirectAfterLogin');
                console.log("Redirection vers (avec délai):", redirectUrl);
                window.location.href = redirectUrl;
            } else {
                console.log("Redirection vers / (avec délai)");
                window.location.href = '/';
            }
        }, 50); // Attendre 50ms
        // --- FIN MODIFICATION ---

    } catch (err) {
        console.error('[LoginPage] login error', err);
        if (errorEl) {
            errorEl.textContent = err.message || 'Erreur lors de la connexion';
            errorEl.classList.remove('hidden');
        }
        // Assurez-vous que le bouton est réactivé même en cas d'erreur
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-60');
        }
    }
    // On enlève le finally ici car la redirection se fait dans le setTimeout
    // finally {
    //     if (submitBtn) {
    //         submitBtn.disabled = false;
    //         submitBtn.classList.remove('opacity-60');
    //     }
    // }
};


function attachToForm(formNode) {
    if (!formNode) return;
    if (_attachedForm === formNode) {
        return;
    }
    if (_attachedForm && _handlerRef) {
        _attachedForm.removeEventListener('submit', _handlerRef);
    }

    _handlerRef = (ev) => C.handler_submit(ev, formNode);
    formNode.addEventListener('submit', _handlerRef);
    _attachedForm = formNode;
}

function startRetryAttach() {
    let attempts = 0;
    const maxAttempts = 20;
    const interval = 150;

    if (_retryTimer) clearInterval(_retryTimer);
    _retryTimer = setInterval(() => {
        attempts++;
        const liveForm = document.getElementById('auth-form');
        if (liveForm) {
            clearInterval(_retryTimer);
            _retryTimer = null;
            attachToForm(liveForm);
            return;
        }
        if (attempts >= maxAttempts) {
            clearInterval(_retryTimer);
            _retryTimer = null;
            console.warn('[LoginPage] form not found in document after retries');
        }
    }, interval);
}

C.init = async function(params) {
    return V.init(params);
};

let V = {};

V.init = function(params) {
    const fragment = V.createPageFragment(params);
    V.attachEvents(fragment);
    return fragment;
};

V.createPageFragment = function() {
    const pageFragment = htmlToFragment(template);
    return pageFragment;
};

V.attachEvents = function(pageFragment) {
    const fragForm = pageFragment.querySelector('#auth-form');
    if (fragForm) {
        attachToForm(fragForm);
    }

    startRetryAttach();
    return pageFragment;
};

export function LoginPage(params) {
    return C.init(params);
}