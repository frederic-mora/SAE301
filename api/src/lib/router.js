// Classe Router avec paramètres dynamiques et guards d'authentification
class Router {
  constructor(options = {}) {
    this.routes = [];
    this.currentRoute = null;
    this.isAuthenticated = false;
    this.loginPath = options.loginPath || '/login';
    
    // Écouter les changements d'URL
    window.addEventListener('popstate', () => this.handleRoute());
    
    // Intercepter les clics sur les liens
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }
  
  // Définir l'état d'authentification
  setAuth(isAuth) {
    this.isAuthenticated = isAuth;
  }
  
  // Ajouter une route
  addRoute(path, handler, options = {}) {
    const regex = this.pathToRegex(path);
    const keys = this.extractParams(path);
    this.routes.push({ 
      path, 
      regex, 
      keys, 
      handler,
      requireAuth: options.requireAuth || false
    });
    return this;
  }
  
  // Convertir un chemin en regex
  pathToRegex(path) {
    if (path === '*') return /.*/;
    
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '([^\\/]+)')
      .replace(/\*/g, '.*');
    
    return new RegExp('^' + pattern + '$');
  }
  
  // Extraire les noms des paramètres
  extractParams(path) {
    const params = [];
    const matches = path.matchAll(/:(\w+)/g);
    for (const match of matches) {
      params.push(match[1]);
    }
    return params;
  }
  
  // Extraire les valeurs des paramètres
  getParams(route, path) {
    const matches = path.match(route.regex);
    if (!matches) return {};
    
    const params = {};
    route.keys.forEach((key, i) => {
      params[key] = matches[i + 1];
    });
    return params;
  }
  
  // Naviguer vers une route
  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }
  
  // Gérer la route actuelle
  handleRoute() {
    const path = window.location.pathname;
    
    // Trouver la route correspondante
    for (const route of this.routes) {
      if (route.regex.test(path)) {
        // Vérifier l'authentification si nécessaire
        if (route.requireAuth && !this.isAuthenticated) {
          // Sauvegarder la route demandée pour redirection après login
          sessionStorage.setItem('redirectAfterLogin', path);
          this.navigate(this.loginPath);
          return;
        }
        
        this.currentRoute = path;
        const params = this.getParams(route, path);
        route.handler(params);
        return;
      }
    }
    
    // Route 404 si aucune correspondance
    const notFound = this.routes.find(r => r.path === '*');
    if (notFound) {
      notFound.handler({});
    }
  }
  
  // Se connecter et rediriger vers la page demandée
  login() {
    this.setAuth(true);
    const redirect = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    this.navigate(redirect || '/');
  }
  
  // Se déconnecter
  logout() {
    this.setAuth(false);
    this.navigate(this.loginPath);
  }
  
  // Démarrer le routeur
  start() {
    this.handleRoute();
  }
}
export { Router };