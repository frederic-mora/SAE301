import { getRequest, postRequest,JSONpostRequest,patchRequest } from '../lib/api-request.js';

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

// Inscription (Create)
LoginData.create = async function(formData) {
    // Convertir FormData en objet JSON
    const data = {
        action: 'register',
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    // Envoyer les données
    const response = await JSONpostRequest('users', JSON.stringify(data));
    return response;
};

LoginData.login = async function(data) {
    try {
        console.log('Login avec données:', data);
        
        // Les données sont déjà un objet, pas besoin de FormData.get
        const loginData = {
            action: 'login',
            email: data.email,
            password: data.password
        };

        
        console.log('Envoi des données:', loginData);
        const response = await postRequest('users', JSON.stringify(loginData));
        console.log('Réponse reçue:', response);
        
        if (response && response.success) {
            // Stockage de l'état de connexion
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('user', JSON.stringify(response.user));
            return response.user;
        }
        return response;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return { success: false, error: error.message };
    }
};



// Déconnexion
LoginData.logout = async function() {
    try {
        const data = {
            action: 'logout'
        };
        const response = await JSONpostRequest('users', JSON.stringify(data));
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
LoginData.getCurrentUser = function() {
  const raw = sessionStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
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

// Mise à jour du profil utilisateur
LoginData.updateProfile = async function(formData) {
    try {
        console.log('UpdateProfile avec données:', formData);
        
        // Convertir FormData en objet
        const updateData = {
            action: 'updateProfile',
            id: LoginData.getCurrentUser()?.id,
            email: formData.get('email'),
            name: formData.get('name'),
            surname: formData.get('surname'),
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword')
        };

        

        console.log('Envoi des données:', updateData);
        const response = await patchRequest('users', JSON.stringify(updateData));
        console.log('Réponse reçue:', response);
        
        if (response && response.success) {
            // Stockage de l'état de connexion mis à jour
            sessionStorage.setItem('user', JSON.stringify(response.user));
            return response.user;
        }
        return response;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return { success: false, error: error.message };
    }
};

export { LoginData };