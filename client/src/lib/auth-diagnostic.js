/**
 * Diagnostic de l'authentification et de la session
 * Utile pour déboguer les problèmes d'authentification
 */

let AuthDiagnostic = {};

/**
 * Vérifie l'état de la session client
 */
AuthDiagnostic.checkClientSession = function() {
    console.group('Diagnostic Client-Side Session');
    
    const isAuth = sessionStorage.getItem('isAuthenticated');
    const user = sessionStorage.getItem('user');
    
    console.log('isAuthenticated:', isAuth);
    console.log('user:', user ? JSON.parse(user) : 'null');
    console.log('router instance:', window.router ? 'Present' : 'Missing');
    
    console.groupEnd();
    
    return {
        isAuthenticated: isAuth === 'true',
        user: user ? JSON.parse(user) : null,
        hasRouter: !!window.router
    };
};

/**
 * Teste l'envoi d'une requête authentifiée simple
 */
AuthDiagnostic.testAuthRequest = async function() {
    console.group('Test Requête Authentifiée');
    
    const { getRequest } = await import('../lib/api-request.js');
    
    try {
        const response = await getRequest('users?checkAuth');
        console.log('Requête réussie:', response);
        return response;
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    } finally {
        console.groupEnd();
    }
};

/**
 * Affiche le contenu des cookies visible en JavaScript
 */
AuthDiagnostic.showCookies = function() {
    console.group('Cookies Disponibles');
    console.log('document.cookie:', document.cookie || '(aucun cookie accessible)');
    console.log('Note: Les cookies HttpOnly ne sont pas visibles ici');
    console.groupEnd();
};

/**
 * Test complet du système d'authentification
 */
AuthDiagnostic.runFullDiagnostic = async function() {
    console.clear();
    console.log('===========================================');
    console.log('DIAGNOSTIC AUTHENTIFICATION COMPLET');
    console.log('===========================================\n');
    
    this.checkClientSession();
    this.showCookies();
    
    console.log('\nTest de requête authentifiée...\n');
    const authTest = await this.testAuthRequest();
    
    console.log('\n===========================================');
    if (authTest && authTest.user) {
        console.log('AUTHENTIFICATION OK - Utilisateur connecté');
    } else {
        console.log('PROBLEME DETECTE - Utilisateur non authentifié côté serveur');
    }
    console.log('===========================================');
};

export { AuthDiagnostic };
