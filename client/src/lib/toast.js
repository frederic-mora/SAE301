/**
 * Gestionnaire de toasts (notifications pop-up)
 * Affiche des notifications temporaires en haut à droite de l'écran
 */
export const ToastManager = {
  /**
   * Crée et affiche un toast
   * @param {string} message - Le message à afficher
   * @param {string} type - Type de toast: 'success', 'error', 'info', 'warning'
   * @param {number} duration - Durée en ms avant disparition (0 = manuel)
   */
  show(message, type = 'info', duration = 3000) {
    const toastContainer = this.getContainer();
    
    // Créer le toast
    const toast = document.createElement('div');
    const toastId = `toast-${Date.now()}`;
    toast.id = toastId;
    
    // Classes de base
    const baseClasses = 'fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 animate-slideIn flex items-center gap-3 max-w-sm';
    
    // Classes par type
    const typeClasses = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white',
      warning: 'bg-yellow-500 text-white'
    };
    
    // Icônes par type
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    
    const selectedType = typeClasses[type] || typeClasses.info;
    const icon = icons[type] || icons.info;
    
    toast.className = `${baseClasses} ${selectedType}`;
    toast.innerHTML = `
      <span class="text-xl font-bold">${icon}</span>
      <span class="flex-1 text-sm font-medium">${message}</span>
      <button class="text-lg leading-none opacity-75 hover:opacity-100 transition-opacity" onclick="document.getElementById('${toastId}').remove()">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animation d'entrée
    requestAnimationFrame(() => {
      toast.style.animation = 'slideIn 0.3s ease-out';
    });
    
    // Disparition automatique
    if (duration > 0) {
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
          toast.remove();
        }, 300);
      }, duration);
    }
    
    return toast;
  },

  /**
   * Affiche un toast de succès
   */
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  },

  /**
   * Affiche un toast d'erreur
   */
  error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  },

  /**
   * Affiche un toast d'information
   */
  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  },

  /**
   * Affiche un toast d'avertissement
   */
  warning(message, duration = 3500) {
    return this.show(message, 'warning', duration);
  },

  /**
   * Récupère ou crée le conteneur des toasts
   */
  getContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'fixed top-0 right-0 pointer-events-none z-50';
      document.body.appendChild(container);
      
      // Ajouter les styles d'animation au head
      this.injectStyles();
    }
    return container;
  },

  /**
   * Injecte les styles CSS nécessaires
   */
  injectStyles() {
    if (document.getElementById('toastStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'toastStyles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      
      #toastContainer {
        pointer-events: none;
      }
      
      #toastContainer > div {
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);
  }
};

export default ToastManager;
