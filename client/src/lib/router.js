// client/src/lib/router.js

import { HomePage, mountHomePage } from '../pages/home/page.js';
class Router {
  constructor(id, options = {}) {
    let root = document.getElementById(id);

    if (!root) {
      root = document.createElement('div');
      document.body.appendChild(root);
    }

    this.root = root;
    this.routes = [];
    this.layouts = {};
    this.currentRoute = null;
    this.currentPage = null;
    this.isAuthenticated = false;
    this.loginPath = options.loginPath || '/login';

    window.addEventListener('popstate', () => this.handleRoute());

    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('href'));
      }
    });
  }

  setAuth(isAuth) {
    this.isAuthenticated = isAuth;
  }

  addLayout(pathPrefix, layoutFn) {
    this.layouts[pathPrefix] = layoutFn;
    return this;
  }

  findLayout(path) {
    let matchedLayout = null;
    let longestMatch = 0;
    for (const [prefix, layout] of Object.entries(this.layouts)) {
      if (path.startsWith(prefix) && prefix.length > longestMatch) {
        matchedLayout = layout;
        longestMatch = prefix.length;
      }
    }
    return matchedLayout;
  }

  addRoute(path, handler, options = {}) {
    const regex = this.pathToRegex(path);
    const keys = this.extractParams(path);
    this.routes.push({
      path,
      regex,
      keys,
      handler,
      requireAuth: options.requireAuth || false,
      useLayout: options.useLayout !== false
    });
    return this;
  }

  pathToRegex(path) {
    if (path === '*') return /.*/;
    const pattern = path
        .replace(/\//g, '\\/')
        .replace(/:(\w+)/g, '([^\\/]+)')
        .replace(/\*/g, '.*');
    return new RegExp('^' + pattern + '$');
  }

  extractParams(path) {
    const params = [];
    const matches = path.matchAll(/:(\w+)/g);
    for (const match of matches) {
      params.push(match[1]);
    }
    return params;
  }

  getParams(route, path) {
    const matches = path.match(route.regex);
    if (!matches) return {};
    const params = {};
    route.keys.forEach((key, i) => {
      params[key] = matches[i + 1];
    });
    return params;
  }

  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    for (const route of this.routes) {
      if (route.regex.test(path)) {
        if (route.requireAuth && !this.isAuthenticated) {
          sessionStorage.setItem('redirectAfterLogin', path);
          this.navigate(this.loginPath);
          return;
        }
        this.currentRoute = path;
        const params = this.getParams(route, path);

        if (route.path === '/' && typeof HomePage === 'function' && typeof mountHomePage === 'function') {
          const content = HomePage(params);
          this.renderContent(content, route, path);
          setTimeout(() => {
            const container = document.getElementById('app');
            if (container) mountHomePage(container);
          }, 0);
          return;
        }

        const content = route.handler(params);
        if (content instanceof Promise) {
          content.then(res => {
            this.renderContent(res, route, path);
          });
        } else {
          this.renderContent(content, route, path);
        }
        return;
      }
    }
    const notFound = this.routes.find(r => r.path === '*');
    if (notFound) {
      const content = notFound.handler({});
      this.root.innerHTML = content;
    }
  }

  renderContent(content, route, path) {
    const isFragment = content instanceof DocumentFragment;
    if (content && typeof content === 'object' && typeof content.template === 'function') {
      if (this.currentPage && typeof this.currentPage.unmount === 'function') {
        try { this.currentPage.unmount(); } catch (e) {}
        this.currentPage = null;
      }
      const page = content;
      const templateResult = page.template();
      const doRender = (rendered) => {
        const renderedIsFragment = rendered instanceof DocumentFragment;
        if (route.useLayout) {
          const layoutFn = this.findLayout(path);
          if (layoutFn) {
            const layoutFragment = layoutFn();
            const contentSlot = layoutFragment.querySelector('slot');
            if (contentSlot) {
              if (renderedIsFragment) {
                contentSlot.replaceWith(rendered);
              } else {
                const tempFragment = document.createElement('template');
                tempFragment.innerHTML = rendered;
                contentSlot.replaceWith(tempFragment.content);
              }
            }
            this.root.innerHTML = '';
            this.root.appendChild(layoutFragment);
          } else {
            if (renderedIsFragment) {
              this.root.innerHTML = '';
              this.root.appendChild(rendered);
            } else {
              this.root.innerHTML = rendered;
            }
          }
        } else {
          if (renderedIsFragment) {
            this.root.innerHTML = '';
            this.root.appendChild(rendered);
          } else {
            this.root.innerHTML = rendered;
          }
        }
        this.attachEventListeners(path);
        if (page && typeof page.mount === 'function') {
          try { page.mount(); } catch (e) {}
          this.currentPage = page;
        }
      };
      if (templateResult instanceof Promise) {
        templateResult.then(doRender).catch(() => {});
      } else {
        doRender(templateResult);
      }
      return;
    }
    if (route.useLayout) {
      const layoutFn = this.findLayout(path);
      if (layoutFn) {
        const layoutFragment = layoutFn();
        const contentSlot = layoutFragment.querySelector('slot');
        if (contentSlot) {
          if (isFragment) {
            contentSlot.replaceWith(content);
          } else {
            const tempFragment = document.createElement('template');
            tempFragment.innerHTML = content;
            contentSlot.replaceWith(tempFragment.content);
          }
        }
        this.root.innerHTML = '';
        this.root.appendChild(layoutFragment);
      } else {
        if (isFragment) {
          this.root.innerHTML = '';
          this.root.appendChild(content);
        } else {
          this.root.innerHTML = content;
        }
      }
    } else {
      if (isFragment) {
        this.root.innerHTML = '';
        this.root.appendChild(content);
      } else {
        this.root.innerHTML = content;
      }
    }
    this.attachEventListeners(path);
  }

  attachEventListeners(path) {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        this.login();
      });
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.logout();
      });
    }
  }

  login() {
    this.setAuth(true);
    const redirect = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    this.navigate(redirect || '/dashboard');
  }



logout() {
  // Supprime les infos locales
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  this.setAuth(false);
  this.navigate(this.loginPath);
}


start() {
    this.handleRoute();
  }
}

export { Router };
