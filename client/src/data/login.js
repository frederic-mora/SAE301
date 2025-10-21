import { getRequest, postRequest } from '../lib/api-request.js';

let LoginData = {};

// Données de test (optionnel)
let fakeLogins = [
    {
        id: 1,
        name: "User",
        surname: "Test",
        email: "test@example.com"
    }
];

// Connexion (Login)
LoginData.login = async function(email, password) {
    const data = {
        action: 'login',
        email: email,
        password: password
    };
    
    try {
        const response = await postRequest('users', data);
        if (response && response.success) {
            // Stockage de l'état de connexion
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('user', JSON.stringify(response.user));
            return response.user;
        }
        throw new Error(response.error || 'Échec de la connexion');
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return false;
    }
};

// Inscription (Register)
LoginData.register = async function(name, surname, email, password) {
    const data = {
        action: 'register',
        name: name,
        surname: surname,
        email: email,
        password: password
    };
    
    try {
        const response = await postRequest('users', data);
        if (response && response.success) {
            return response.user;
        }
        throw new Error(response.error || 'Échec de l\'inscription');
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        return false;
    }
};

// Déconnexion
LoginData.logout = async function() {
    const data = {
        action: 'logout'
    };
    
    try {
        const response = await postRequest('users', data);
        if (response && response.success) {
            // Nettoyage du stockage de session
            sessionStorage.removeItem('isAuthenticated');
            sessionStorage.removeItem('user');
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return false;
    }
};

// Régénération de session
LoginData.regenerateSession = async function() {
    try {
        const data = await getRequest('users?regenerateAuth');
        if (data && data.session) {
            if (data.user) {
                sessionStorage.setItem('user', JSON.stringify(data.user));
            }
            return data;
        }
        return false;
    } catch (error) {
        console.error('Erreur lors de la régénération de session:', error);
        return false;
    }
};

// Récupération des informations de l'utilisateur connecté
LoginData.fetchCurrentUser = async function() {
    try {
        const data = await getRequest('users?currentUser');
        return data?.user || false;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return false;
    }
};

// Récupération d'un utilisateur par ID
LoginData.fetch = async function(id) {
    try {
        const data = await getRequest('users/' + id);
        return data || false;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return fakeLogins.pop(); // Fallback sur les données de test
    }
};

// Vérification de l'état de connexion
LoginData.checkAuth = async function() {
    try {
        const data = await getRequest('users?checkAuth');
        return data || false;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        return false;
    }
};

export { LoginData };