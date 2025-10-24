import { htmlToFragment } from "../../lib/utils.js";
import { BasketData } from "../../data/basket.js";
import { OrderData } from "../../data/order.js";
import { LoginData } from "../../data/login.js";
import { ToastManager } from "../../lib/toast.js";

export const BasketOverlay = {
  /**
   * Crée l'overlay du panier
   */
  html() {
    return `
      <div id="basketOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden" onclick="if(event.target.id === 'basketOverlay') window.BasketOverlay.hide()">
        <div class="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl" onclick="event.stopPropagation()">
          <!-- Header -->
          <div class="flex justify-between items-center border-b border-gray-200 p-4">
            <h2 class="text-lg font-black uppercase tracking-widest">PANIER</h2>
            <button type="button" class="text-xl font-black text-gray-600 hover:text-black" onclick="window.BasketOverlay.hide()">
              ✕
            </button>
          </div>

          <!-- Items Container -->
          <div class="flex-1 overflow-y-auto p-4" data-overlay-items>
            <!-- Items rendered here -->
          </div>

          <!-- Summary -->
          <div class="border-t border-gray-200 p-4 space-y-3">
            <!-- Subtotal -->
            <div class="flex justify-between text-sm">
              <span class="uppercase tracking-widest">Sous-total</span>
              <span class="font-medium" id="overlaySubtotal">0,00 €</span>
            </div>

            <!-- Shipping -->
            <div class="flex justify-between text-sm pb-3 border-b border-gray-200">
              <span class="uppercase tracking-widest">Livraison</span>
              <span class="font-medium">Gratuite</span>
            </div>

            <!-- Total -->
            <div class="flex justify-between text-lg pb-4 border-b border-gray-200">
              <span class="font-black uppercase tracking-widest">Total</span>
              <span class="font-black" id="overlayTotal">0,00 €</span>
            </div>

            <!-- Buttons -->
            <button id="overlayCheckoutBtn" type="button" class="w-full bg-black text-white py-3 px-4 uppercase tracking-widest font-black text-sm hover:bg-gray-800 transition-colors">
              Passer la commande
            </button>

            <button id="overlayViewFullBtn" type="button" class="w-full border border-black text-black py-3 px-4 uppercase tracking-widest font-black text-sm hover:bg-gray-50 transition-colors">
              Voir le panier complet
            </button>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Retourne le fragment avec événements attachés
   */
  dom() {
    const fragment = htmlToFragment(this.html());
    this.attachEvents(fragment);
    this.render(fragment);
    
    // Exposer BasketOverlay globalement pour l'accès depuis les onclick HTML
    window.BasketOverlay = this;
    
    // S'inscrire comme observateur pour mettre à jour le badge et le total
    BasketData.subscribe(() => {
      this.updateBadge();
      this.updateTotal(fragment);
    });
    
    return fragment;
  },

  /**
   * Affiche le panier dans l'overlay
   */
  render(container) {
    const basket = BasketData.getBasket();
    const itemsContainer = container.querySelector('[data-overlay-items]');
    
    if (!itemsContainer) return;

    if (basket.length === 0) {
      itemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 px-6 min-h-80 text-center">
          <h3 class="text-2xl font-black uppercase tracking-wider mb-6">Le panier est vide</h3>
          <button type="button" class="bg-black text-white px-6 py-3 uppercase tracking-widest font-black text-sm hover:bg-gray-800 transition-colors" id="continueShoppingBtn">
            Continuer mes achats
          </button>
        </div>
      `;
      
      // Attacher l'événement au bouton
      const continueBtn = itemsContainer.querySelector('#continueShoppingBtn');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          this.hide();
          if (window.router) {
            window.router.navigate('/products');
          } else {
            window.location.href = '/products';
          }
        });
      }
    } else {
      itemsContainer.innerHTML = basket.map((item) => `
        <div class="border-b border-gray-200 pb-4 mb-4" data-overlay-item="${item.id}">
          <div class="flex gap-3">
            <!-- Image -->
            <div class="flex-shrink-0">
              <div class="w-16 h-16 bg-gray-200 rounded">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e5e5' width='100' height='100'/%3E%3C/svg%3E" alt="${item.name}" class="w-full h-full object-cover rounded" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              </div>
            </div>

            <!-- Infos -->
            <div class="flex-1">
              <p class="font-black text-sm mb-1">${item.name}</p>
              <p class="text-xs text-gray-600 mb-2">${(parseFloat(item.price) || 0).toFixed(2)} € × <span data-qty>${item.quantity}</span></p>
              
              <!-- Quantité -->
              <div class="flex items-center gap-2 mb-2">
                <button type="button" class="w-6 h-6 border border-gray-300 text-xs overlayDecreaseQty flex items-center justify-center hover:bg-gray-100" data-product-id="${item.id}">−</button>
                <span class="w-6 text-center text-xs font-medium" data-quantity>${item.quantity}</span>
                <button type="button" class="w-6 h-6 border border-gray-300 text-xs overlayIncreaseQty flex items-center justify-center hover:bg-gray-100" data-product-id="${item.id}">+</button>
              </div>

              <!-- Remove -->
              <button type="button" class="text-xs text-red-600 uppercase tracking-widest font-medium removeOverlayItem hover:underline" data-product-id="${item.id}">
                Supprimer
              </button>
            </div>

            <!-- Subtotal -->
            <div class="text-right flex-shrink-0">
              <p class="text-xs font-black" data-item-total>${(parseFloat(item.price) * item.quantity).toFixed(2)} €</p>
            </div>
          </div>
        </div>
      `).join('');
    }

    this.updateTotal(container);
    this.attachItemEvents(container);
  },

  /**
   * Attache les événements aux articles de l'overlay
   */
  attachItemEvents(container) {
    const itemsContainer = container.querySelector('[data-overlay-items]');
    if (!itemsContainer) return;

    const self = this;
    const basket = BasketData.getBasket();

    // Boutons +
    const increaseButtons = itemsContainer.querySelectorAll('.overlayIncreaseQty');
    increaseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        const item = basket.find(i => i.id === productId);
        if (item) {
          item.quantity = Math.max(1, parseInt(item.quantity) || 1) + 1;
          BasketData.saveBasket(basket);
          
          // Mettre à jour visuellement
          const itemElement = container.querySelector(`[data-overlay-item="${productId}"]`);
          if (itemElement) {
            itemElement.querySelector('[data-quantity]').textContent = item.quantity;
            itemElement.querySelector('[data-qty]').textContent = item.quantity;
            const itemPrice = parseFloat(item.price);
            itemElement.querySelector('[data-item-total]').textContent = (itemPrice * item.quantity).toFixed(2) + ' €';
          }
          
          self.updateTotal(container);
          self.updateBadge();
        }
      });
    });

    // Boutons -
    const decreaseButtons = itemsContainer.querySelectorAll('.overlayDecreaseQty');
    decreaseButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        const item = basket.find(i => i.id === productId);
        if (item) {
          const newQuantity = Math.max(1, parseInt(item.quantity) || 1) - 1;
          if (newQuantity > 0) {
            item.quantity = newQuantity;
            BasketData.saveBasket(basket);
            
            // Mettre à jour visuellement
            const itemElement = container.querySelector(`[data-overlay-item="${productId}"]`);
            if (itemElement) {
              itemElement.querySelector('[data-quantity]').textContent = item.quantity;
              itemElement.querySelector('[data-qty]').textContent = item.quantity;
              const itemPrice = parseFloat(item.price);
              itemElement.querySelector('[data-item-total]').textContent = (itemPrice * item.quantity).toFixed(2) + ' €';
            }
            
            self.updateTotal(container);
            self.updateBadge();
          } else {
            BasketData.removeItem(productId);
            self.render(container);
            self.updateBadge();
          }
        }
      });
    });

    // Boutons supprimer
    const removeButtons = itemsContainer.querySelectorAll('.removeOverlayItem');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = parseInt(btn.dataset.productId);
        BasketData.removeItem(productId);
        self.render(container);
        self.updateBadge();
      });
    });
  },

  /**
   * Met à jour le total et sous-total
   */
  updateTotal(container) {
    const subtotalEl = container.querySelector('#overlaySubtotal');
    const totalEl = container.querySelector('#overlayTotal');
    
    const total = BasketData.getTotal();
    const totalFormatted = total.toFixed(2).replace('.', ',') + ' €';
    
    if (subtotalEl) {
      subtotalEl.textContent = totalFormatted;
    }
    if (totalEl) {
      totalEl.textContent = totalFormatted;
    }
  },

  /**
   * Met à jour le badge du panier
   */
  updateBadge() {
    const badge = document.querySelector('[data-basket-count]');
    if (badge) {
      const count = BasketData.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  /**
   * Attache les événements généraux
   */
  attachEvents(fragment) {
    const checkoutBtn = fragment.querySelector('#overlayCheckoutBtn');
    const viewFullBtn = fragment.querySelector('#overlayViewFullBtn');
    
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.handleCheckout(fragment));
    }
    
    if (viewFullBtn) {
      viewFullBtn.addEventListener('click', () => {
        if (window.router) {
          window.router.navigate('/basket');
        } else {
          window.location.href = '/basket';
        }
        this.hide();
      });
    }
  },

  /**
   * Gère le checkout depuis l'overlay
   */
  handleCheckout: async function(container) {
    const basket = BasketData.getBasket();
    
    if (basket.length === 0) {
      ToastManager.warning('Le panier est vide');
      return;
    }

    const user = LoginData.getCurrentUser();
    if (!user) {
      ToastManager.error('Vous devez être connecté pour commander');
      if (window.router) {
        window.router.navigate('/login');
      } else {
        window.location.href = '/login';
      }
      this.hide();
      return;
    }

    // Chercher le bouton dans le DOM réel (pas dans le fragment)
    const checkoutBtn = document.querySelector('#overlayCheckoutBtn');
    const originalText = checkoutBtn ? checkoutBtn.textContent : 'Passer la commande';
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Traitement...';
    }

    try {
      const result = await OrderData.createOrderFromBasket(user.id, basket);
      
      if (result && result.success) {
        console.log('Commande créée avec succès:', result.order);
        
        BasketData.clearBasket();
        this.updateBadge();
        ToastManager.success('Commande créée avec succès!');
        
        if (window.router) {
          window.router.navigate('/profile');
        } else {
          window.location.href = '/profile';
        }
        this.hide();
      } else {
        ToastManager.error('Erreur: ' + (result?.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur checkout:', error);
      ToastManager.error('Une erreur s\'est produite');
    } finally {
      if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = originalText;
      }
    }
  },

  /**
   * Affiche l'overlay
   */
  show() {
    let overlay = document.getElementById('basketOverlay');
    if (!overlay) {
      // Si l'overlay n'existe pas, le créer
      overlay = htmlToFragment(this.html()).querySelector('#basketOverlay');
      document.body.appendChild(overlay);
    }
    overlay.classList.remove('hidden');
    this.render(overlay);
  },

  /**
   * Masque l'overlay
   */
  hide() {
    const overlay = document.getElementById('basketOverlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  },

  /**
   * Alterne la visibilité
   */
  toggle() {
    const overlay = document.getElementById('basketOverlay');
    if (overlay && overlay.classList.contains('hidden')) {
      this.show();
    } else {
      this.hide();
    }
  }
};
