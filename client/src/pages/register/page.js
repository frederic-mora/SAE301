// javascript
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { register } from "../../data/auth.js";

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


        await register({ email, password });


        window.location.href = '/auth?registered=1';
    } catch (err) {
        console.error('[RegisterPage] register error', err);
        if (errorEl) {
            errorEl.textContent = err.message || 'Erreur lors de l\'inscription';
            errorEl.classList.remove('hidden');
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-60');
        }
    }
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
            console.warn('[RegisterPage] form not found in document after retries');
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

export function RegisterPage(params) {
    return C.init(params);
}
